import { useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import {
  Box,
  Button,
  // IconButton,
  // Tooltip,
  Typography,
} from "@mui/material";
import "./ModuleTable.css";
import { Edit } from "@mui/icons-material";
import { MenuItem } from "@mui/material";
import ChecklistIcon from "@mui/icons-material/Checklist";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { PinkPallette } from "../../assets/pallettes";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ModuleModal from "./ModuleModal";
import ReCheckModal from "../utility/Recheck";

const Example = () => {
  const navigate = useNavigate();
  const [moduleDetail, setModuleDetail] = useState([]);
  const [addModuleModalOpen, setAddModuleModalOpen] = useState(false);
  const [editModuleModalOpen, setEditModuleModalOpen] = useState(false);
  const [deleteModuleModalOpen, setDeleteModuleModalOpen] = useState(false);
  const [duplicateModuleModalOpen, setDuplicateModuleModalOpen] =
    useState(false);
  const [rowDataToDuplicate, setRowDataToDuplicate] = useState();
  const [rowData, setRowData] = useState({});

  const handleAddModuleModalOpen = () => {
    setAddModuleModalOpen(true);
  };

  const handleAddModuleModalClose = () => {
    setAddModuleModalOpen(false);
  };

  const handleAddModuleModalSubmit = async (data) => {
    await setModuleDetail((prevState) => {
      const newDataSet = [...prevState, data];
      return newDataSet;
    });
    handleAddSubmitSendingToServer(data);
  };

  // const formatDataFromAddModule = (data) => {
  //   const year = data.yearAndSemester.split("/")[0];
  //   const semester = data.yearAndSemester.split("/")[1];
  //   const startDate = data.selectedDate.split("/")[0];
  //   const endDate = data.selectedDate.split("/")[1];
  //   const hours = data.duration
  //   const
  // };
  const handleAddSubmitSendingToServer = async (data) => {
    console.log("data in handleSaveButtonClick", data);
    const formattedDataFromAddModule = {
      moduleName: data.moduleName,
      startPeriod: data.selectedDate.split(" - ")[0],
      endPeriod: data.selectedDate.split(" - ")[1],
      hours: data.duration,
      year: data.yearAndSemester.split("/")[0],
      semester: data.yearAndSemester.split("/")[1],
      crsID: "6601138a5a0240478a1e078d",
      instructorID: "65f90efa4ef7a70f80525050",
    };
    console.log("formattedDataFromAddModule", formattedDataFromAddModule);
    // const res = axios
    //   .post(`http://localhost:8000/api/modules/`, formattedDataFromAddModule)
    //   .then((res) => {
    //     console.log("error", res);
    //   });
    const res = axios
      .post(`http://localhost:8000/api/modules/`, formattedDataFromAddModule, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      .then((res) => {
        console.log("error", res);
      });
  };

  const handleCheckRowData = () => {
    if (rowData) handleEditModuleModalOpen();
  };

  const handleEditModuleModalOpen = () => {
    setEditModuleModalOpen(true);
  };

  const handleEditModuleModalClose = () => {
    setEditModuleModalOpen(false);
  };

  const handleEditModuleModalSubmit = (data) => {
    setModuleDetail((prevState) => {
      const newDataSet = [...prevState];
      // ค้นหา index ของแถวที่ต้องการแก้ไข
      const rowIndex = newDataSet.findIndex((row) => row.crsID === data.crsID);
      // หากพบแถวที่ต้องการแก้ไข
      if (rowIndex !== -1) {
        // ลบแถวเก่าออกจากข้อมูล
        newDataSet[rowIndex] = data;
      }
      // ส่งข้อมูลใหม่กลับ
      return newDataSet;
    });

    console.log(moduleDetail);
  };

  const handleDeleteModuleModalOpen = () => {
    setDeleteModuleModalOpen(true);
  };

  const handleDeleteModuleModalClose = () => {
    setDeleteModuleModalOpen(false);
  };

  const handleDeleteModuleModalSubmit = (row) => {
    moduleDetail.splice(row.index, 1); //assuming simple data table
    setModuleDetail([...moduleDetail]);
    handleDeleteModuleModalClose();
  };

  const handleDuplicateModuleModalOpen = (row) => {
    // console.log("data", row);
    setDuplicateModuleModalOpen(true);
  };

  const handleDuplicateModuleModalClose = () => {
    setDuplicateModuleModalOpen(false);
  };

  const handleDuplicateModuleModalSubmit = () => {
    const newRow = { ...rowDataToDuplicate }; // คัดลอกข้อมูลของแถวที่ต้องการ duplicate
    console.log("row", rowDataToDuplicate);
    setModuleDetail((prevState) => [...prevState, newRow]); // เพิ่มแถวใหม่เข้าไปใน state
    handleDuplicateModuleModalClose();

    // axios.get();
    // const sendToServer = {
    //   moduleName: name,
    //   startPeriod: startDate.format("DD/MM/YYYY"),
    //   endPeriod: endDate.format("DD/MM/YYYY"),
    //   hours: duration,
    //   year: year,
    //   semester: semester.toString(),
    //   crsID: "null",
    //   instructorID: "null",
    // };
    // axios.put(
    //   `http://localhost:8000/api/modules/6607cc77c87865aed0171adb`,
    //   sendToServer
    // );
  };

  const handleCheckRowDataToDuplicate = (row) => {
    handleDuplicateModuleModalOpen(row);
    setRowDataToDuplicate(row);
    console.log("row.orginal", row);
  };

  const columns = useMemo(
    //column definitions...
    () => [
      {
        accessorKey: "moduleName",
        header: "ชื่อมอดูล",
      },
      {
        accessorKey: "yearAndSemester",
        header: "ปีการศึกษา/ภาค",
      },
      {
        accessorKey: "selectedDate",
        header: "ระยะเวลาที่สอน",
      },
      {
        accessorKey: "duration",
        header: "จำนวนชั่วโมงเรียน",
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data: moduleDetail,
    createDisplayMode: "row", // ('modal', and 'custom' are also available)
    editDisplayMode: "table", // ('modal', 'row', 'cell', and 'custom' are also
    enableRowActions: true,
    positionActionsColumn: "last",
    getRowId: (row) => row.id,
    displayColumnDefOptions: {
      "mrt-row-actions": {
        header: "", //change header text
        paddingLeft: "1rem",
        grow: false,
      },
    },
    renderRowActionMenuItems: ({ row }) => (
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <MenuItem
          key="edit"
          onClick={() => {
            setRowData(row.original);
            console.log("rowData", row.original);
            console.log("checkRowData", rowData);
            handleCheckRowData();
          }}
          sx={{ display: "flex", flexDirection: "row", gap: "1rem" }}
        >
          <Edit />
          <Typography>แก้ไข</Typography>
        </MenuItem>

        <MenuItem
          key="delete"
          onClick={handleDeleteModuleModalOpen}
          sx={{ display: "flex", flexDirection: "row", gap: "1rem" }}
        >
          <DeleteIcon />
          <Typography>ลบ</Typography>
        </MenuItem>

        <MenuItem
          key="duplicate"
          onClick={() => {
            // setRowData(row.original);
            handleCheckRowDataToDuplicate(row.original);
          }}
          sx={{ display: "flex", flexDirection: "row", gap: "1rem" }}
        >
          <ContentCopyIcon />
          <Typography>คัดลอก</Typography>
        </MenuItem>

        <MenuItem
          key="scoring"
          onClick={() => navigate("/scoringTable")}
          sx={{ display: "flex", flexDirection: "row", gap: "1rem" }}
        >
          <ChecklistIcon />
          <Typography>ให้คะแนน</Typography>
        </MenuItem>
      </Box>
    ),
    renderTopToolbarCustomActions: ({ table }) => (
      <Button
        variant="contained"
        sx={{
          backgroundColor: PinkPallette.main,
          "&:hover": {
            backgroundColor: PinkPallette.light,
          },
        }}
        startIcon={<AddCircleOutlineIcon />}
        onClick={handleAddModuleModalOpen}
      >
        เพิ่มมอดูล
      </Button>
    ),
  });
  return (
    <div>
      <ModuleModal
        open={addModuleModalOpen}
        onClose={handleAddModuleModalClose}
        onSubmit={handleAddModuleModalSubmit}
        mode={"add"}
      />
      {editModuleModalOpen && (
        <ModuleModal
          open={editModuleModalOpen}
          onClose={handleEditModuleModalClose}
          onSubmit={handleEditModuleModalSubmit}
          data={rowData}
          mode={"edit"}
        />
      )}
      <ReCheckModal
        open={deleteModuleModalOpen}
        title={"ลบรายวิชา"}
        detail={"คุณยืนยันที่จะลบวิชานี้ใช่หรือไม่"}
        onClose={handleDeleteModuleModalClose}
        onSubmit={handleDeleteModuleModalSubmit}
      />
      <ReCheckModal
        open={duplicateModuleModalOpen}
        title={"คัดลอกรายวิชา"}
        detail={"คุณยืนยันที่จะคัดลอกวิชานี้ใช่หรือไม่"}
        onClose={handleDuplicateModuleModalClose}
        onSubmit={handleDuplicateModuleModalSubmit}
      />
      <MaterialReactTable table={table} />
    </div>
  );
};

export default Example;
