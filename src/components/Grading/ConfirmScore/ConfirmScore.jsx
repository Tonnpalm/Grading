import { useEffect, useContext, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import ResponsiveAppBar from "../../AppBar/ButtonAppBar";
import { MenuItem } from "@mui/material";
import Modal from "../Histogram/Modal.jsx";
import { Box, Button, Typography } from "@mui/material";
import { mkConfig, generateCsv, download } from "export-to-csv";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import OfflinePinIcon from "@mui/icons-material/OfflinePin";
import { PinkPallette } from "../../../assets/pallettes";
import { useNavigate } from "react-router-dom";
// import { useHistory } from "react-router-dom";
import { DataAcrossPages } from "../../../assets/DataAcrossPages";
import axios from "axios";

const csvConfig = mkConfig({
  fieldSeparator: ",",
  decimalSeparator: ".",
  useKeysAsHeaders: true,
  filename: "confirm_score",
});

const ConfirmScore = () => {
  const navigate = useNavigate();
  const { data } = useContext(DataAcrossPages);
  const { setData } = useContext(DataAcrossPages);

  const handleExportData = () => {
    const csv = generateCsv(csvConfig)(data.scoreInTable);
    download(csvConfig)(csv);
  };
  const [columns, setColumns] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!data) return;
    console.log("data.shapedata", data.shapedData);
    // สร้าง columns ที่มีหัวตารางเป็นชื่อ moduleName
    let countLoop = 0;
    let uniqueModuleNames = [];
    data.scoreInTable.map((item) => {
      Object.keys(item).forEach((key) => {
        if (
          key !== "SID" &&
          key !== "studentName" &&
          key !== "studentGrade" &&
          key !== "calculatedTotalScore" &&
          key !== "roundedTotalScore" &&
          key !== "sumPortion"
        ) {
          if (countLoop <= data.scoreInTable.length) {
            uniqueModuleNames.push(key);
          }
        }
      });
    });
    const uniqueData = Array.from(new Set(uniqueModuleNames));
    console.log(uniqueData);
    const moduleNameColumns = uniqueData.map((moduleName) => ({
      accessorKey: moduleName,
      header: moduleName,
      enableSorting: false,
      enableColumnActions: true,
      renderColumnActionsMenuItems: ({ closeMenu }) => (
        <MenuItem
          key={1}
          onClick={() => {
            handleHeaderClick();
            closeMenu();
          }}
        >
          ดูคะแนน
        </MenuItem>
      ),
    }));
    const handleHeaderClick = () => {
      setIsModalOpen(true);
    };
    setColumns([
      {
        accessorKey: "rowNumbers",
        header: "ลำดับ",
        size: 70,
        Cell: ({ row }) => row.index + 1,
        enableColumnPinning: true,
        enableSorting: false,
        enableColumnActions: false,
      },
      {
        accessorKey: "studentName",
        header: "ชื่อ-นามสกุล",
        enableSorting: true,
        enableColumnActions: false,
      },
      {
        accessorKey: "SID",
        header: "รหัสนิสิต",
        size: 120,
        disableSortBy: true,
        enableColumnActions: false,
      },
      ...moduleNameColumns, // เพิ่ม columns ที่สร้างจาก moduleName ที่ได้จาก data
      {
        accessorKey: "calculatedTotalScore",
        header: "คะแนนรวม",
        size: 120,
        enableColumnActions: false,
        muiTableBodyCellProps: {
          align: "center",
        },
      },
      {
        accessorKey: "roundedTotalScore",
        header: "ปรับคะแนน",
        size: 120,
        enableColumnActions: false,
        muiTableBodyCellProps: {
          align: "center",
        },
      },
      {
        accessorKey: "studentGrade",
        header: "เกรด",
        size: 120,
        enableColumnActions: false,
        muiTableBodyCellProps: {
          align: "center",
        },
      },
    ]);
  }, [data.scoreInTable]);

  const table = useMaterialReactTable({
    columns,
    data: data.scoreInTable,
    renderTopToolbarCustomActions: ({ table }) => (
      <Box
        sx={{
          display: "flex",
          gap: "16px",
          padding: "8px",
          flexWrap: "wrap",
        }}
      >
        <Button
          variant="contained"
          sx={{
            backgroundColor: PinkPallette.main,
            "&:hover": {
              backgroundColor: PinkPallette.light,
            },
          }}
          onClick={handleExportData}
          startIcon={<FileDownloadIcon />}
        >
          ดาวน์โหลด
        </Button>
      </Box>
    ),
    initialState: {
      columnPinning: {
        left: ["rowNumbers", "SID", "studentName"],
        right: ["calculatedTotalScore", "roundedTotalScore", "studentGrade"],
      },
    },
  });

  const handleConfirmButton = () => {
    console.log(data.shapedData);
    let dataToBack = data.shapedData;
    let used = true;
    let yearAndSemester = [
      data.shapedData.year,
      data.shapedData.semester,
      data.crsID,
    ];
    Object.keys(data.shapedData).forEach((key) => {
      if (key === "isused") {
        dataToBack = { ...dataToBack, [key]: used };
      }
    });

    axios
      .post(`http://localhost:8000/api/grades/`, dataToBack)
      .then((response) => {
        console.log("success", response.data);
        setData(yearAndSemester);
        navigate("/gradingResult");
      });
  };

  return (
    <div>
      <div>
        <ResponsiveAppBar />
        {isModalOpen && <Modal onClose={() => setIsModalOpen(false)} />}
      </div>
      <div>
        <Typography
          sx={{
            fontSize: "30px",
            display: "flex",
            justifyContent: "center",
            paddingTop: "20px",
            paddingBottom: "20px",
          }}
        >
          ผลการตัดเกรด
        </Typography>
        <div style={{ paddingInline: "10%" }}>
          <MaterialReactTable table={table} />
        </div>
        <div
          style={{
            paddingTop: "20px",
            paddingLeft: "10%",
            paddingRight: "10%",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Button
            variant="contained"
            startIcon={<ArrowBackIosIcon />}
            sx={{
              backgroundColor: PinkPallette.main,
              "&:hover": {
                backgroundColor: PinkPallette.light,
              },
            }}
            onClick={() => {
              // setData(data.scoreInTable);
              navigate("/gradeAdjustment");
            }}
          >
            กลับ
          </Button>
          <Button
            variant="contained"
            endIcon={<OfflinePinIcon />}
            onClick={() => {
              handleConfirmButton();
            }}
            sx={{
              backgroundColor: PinkPallette.main,
              "&:hover": {
                backgroundColor: PinkPallette.light,
              },
            }}
          >
            ยืนยัน
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmScore;
