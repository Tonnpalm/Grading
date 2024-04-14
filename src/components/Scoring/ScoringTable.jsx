import * as React from "react";
import { useState, useContext } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import * as XLSX from "xlsx";
import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import ResponsiveAppBar from "../AppBar/ButtonAppBar";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { PinkPallette } from "../../assets/pallettes";
import ReCheckModal from "../utility/Recheck";
import { useCookies } from "react-cookie";
import axios from "axios";
import { useNavigate } from "react-router";

const ScoringTable = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newColumnName, setNewColumnName] = useState({ name: "", score: "" }); // เพิ่ม state สำหรับเก็บชื่อ column ใหม่
  const [columnNameToCalulateScore, setColumnNameToCalculateScore] = useState(
    []
  );
  const [scoreType, setScoreType] = React.useState("");
  const [excelData, setExcelData] = useState([]);
  const [deleteColumnModalOpen, setDeleteModuleModalOpen] = useState(false);
  const [check, setCheck] = useState();
  const navigate = useNavigate();
  //   const year = cookies["year"];
  //   const semester = cookies["semester"];
  //   const name = cookies["name"];
  // eslint-disable-next-line no-unused-vars
  const [cookies, setCookie] = useCookies([]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const excelData = XLSX.utils.sheet_to_json(worksheet, { header: 2 });
      console.log(excelData);
      setExcelData(excelData);

      console.log("check", columnNameToCalulateScore);
    };

    reader.readAsArrayBuffer(file);
  };

  const handleChange = (event) => {
    setScoreType(event.target.value);
  };

  const handleModalInputChange = (e) => {
    const { name, value } = e.target;
    setNewColumnName((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSaveButtonClick = () => {
    navigate("/");
  };

  function getOldScore() {
    axios
      .get(`http://localhost:8000/api/scores/:moduleObjectID`)
      .then((response) => {
        console.log(response.data);
      });
  }

  React.useEffect(() => {
    getOldScore();
  }, []);

  const handleAddColumn = () => {
    if (!newColumnName.name.trim() || !newColumnName.score.trim()) return;

    const newAccessorKey = `${newColumnName.name}`;

    const newColumn = {
      accessorKey: newAccessorKey,
      header: `${newColumnName.name} (${newColumnName.score})`,
      size: 70,
      renderColumnActionsMenuItems: ({ closeMenu }) => [
        <MenuItem
          key={1}
          onClick={() => beforeDelete(closeMenu, newAccessorKey)}
        >
          ลบส่วนคะแนน
        </MenuItem>,
        <MenuItem
          key={2}
          onClick={() => {
            console.log("Item 2 clicked");
            closeMenu();
          }}
        >
          แก้ไข
        </MenuItem>,
      ],
    };
    setColumns((prevColumns) => [...prevColumns, newColumn]);
    const newData = excelData.map((row) => ({
      ...row,
      [newAccessorKey]: "", // สร้างคอลัมน์ใหม่ในแต่ละแถว
    }));

    console.log(columnNameToCalulateScore);

    doingData(newAccessorKey);
    setExcelData(newData);
    setIsModalOpen(false);
    setNewColumnName({ name: "", score: "" });
    setScoreType("");
    // collectedDataFromAddColumn(newColumnName, scoreType);
  };

  const doingData = (newAccessorKey) => {
    setColumnNameToCalculateScore((prevState) => {
      console.log("new column name:", newAccessorKey);
      return [...prevState, newAccessorKey]; // เพิ่มชื่อคอลัมน์ใหม่ลงในรายการ columnNameToCalculateScore
    });
  };

  const [columns, setColumns] = useState([
    {
      accessorKey: "number",
      header: "ลำดับ",
      size: 70,
      Cell: ({ row }) => row.index + 1,
      enableColumnPinning: true,
      enableSorting: false,
      enableColumnActions: false,
      enableEditing: false,
    },
    {
      accessorKey: "ID",
      header: "รหัสนิสิต",
      enableEditing: false,
      enableColumnActions: false,
      size: 140,
    },
    {
      accessorKey: "ชื่อ-นามสกุล",
      header: "ชื่อ-นามสกุล",
      enableEditing: false,
      enableColumnActions: false,
      size: 200,
    },
    {
      accessorKey: "totalScore",
      header: "คะแนนรวม",
      enableColumnActions: false,
      size: 70,
      enableEditing: false,
    },
  ]);

  //   console.log(columns.map((item) => item.accessorKey));

  // const collectedDataFromAddColumn = (nameScore, scoreType) => {
  //   console.log("newData", nameScore, scoreType);
  //   const scoreData = {
  //     moduleID: "65d2fbb9a1a6c3f234868427",
  //     assignments: [
  //       {
  //         accessorKey: nameScore.name,
  //         headerName: nameScore.name,
  //         nType: scoreType,
  //         fullScore: nameScore.score,
  //       },
  //     ],
  //     student: [
  //       {
  //         sID: "6334458523",
  //         sName: "ลภัสรดา สิริโชคสวัสดิ์",
  //         scores: {
  //           12344: 16,
  //         },
  //       },
  //     ],
  //   };
  //   axios.post(`http://localhost:8000/api/scores/`, scoreData).then((res) => {
  //     console.log("res", res);
  //   });
  // };

  const handleDeleteColumnModalOpen = () => {
    setDeleteModuleModalOpen(true);
  };

  const handleDeleteColumnModalClose = () => {
    setDeleteModuleModalOpen(false);
  };

  const handleDeleteColumnModalSubmit = () => {
    console.log("ยังไงเนี่ยย", check);
    setColumns((prevColumns) =>
      prevColumns.filter((column) => column.accessorKey !== check)
    );
    handleDeleteColumnModalClose();
  };

  const beforeDelete = (closeMenu, accessorKey) => {
    console.log("check", accessorKey);
    // เปิด Modal สำหรับการยืนยันการลบคอลัมน์
    setCheck(accessorKey);
    handleDeleteColumnModalOpen();
    // ปิดเมนู
    closeMenu();
  };

  const table = useMaterialReactTable({
    columns,
    data: excelData,
    createDisplayMode: "row",
    editDisplayMode: "cell",
    enableCellActions: true,
    enableClickToCopy: "context-menu",
    enableColumnPinning: true,
    enableEditing: true,
    getRowId: (row) => row.id,
    initialState: {
      columnPinning: {
        left: ["number", "ID", "Name", "Section"],
        right: ["totalScore"],
      },
    },
    renderTopToolbarCustomActions: () => (
      <>
        <div style={{ position: "relative", display: "inline-block" }}>
          <Button
            component="label"
            variant="contained"
            className="import-style"
            sx={{
              backgroundColor: PinkPallette.main,
              "&:hover": {
                backgroundColor: PinkPallette.light,
              },
            }}
            startIcon={<CloudUploadIcon />}
          >
            อัปโหลดไฟล์
            <input
              type="file"
              className="form-control custom-form-control"
              style={{ position: "absolute", top: 0, left: 0, opacity: 0 }}
              onChange={handleFileUpload}
            />
          </Button>
        </div>
        <Button
          variant="contained"
          onClick={() => setIsModalOpen(true)}
          sx={{
            ml: "auto",
            backgroundColor: PinkPallette.main,
            "&:hover": {
              backgroundColor: PinkPallette.light,
            },
          }}
        >
          เพิ่มคอลัมน์
        </Button>
      </>
    ),
  });

  React.useEffect(() => {
    setColumns((prevColumns) => {
      const updatedColumns = [...prevColumns];
      const totalScoreColumnIndex = updatedColumns.findIndex(
        (column) => column.accessorKey === "totalScore"
      );
      if (totalScoreColumnIndex !== -1) {
        updatedColumns[totalScoreColumnIndex] = {
          ...updatedColumns[totalScoreColumnIndex],
          Cell: ({ row }) => {
            let fullScore = 0;
            columnNameToCalulateScore.forEach((columnName) => {
              fullScore += parseFloat(row.original[columnName] || 0);
            });
            return fullScore.toString();
          },
        };
      }
      return updatedColumns;
    });
  }, [columnNameToCalulateScore]);

  return (
    <div>
      <ResponsiveAppBar></ResponsiveAppBar>
      <ReCheckModal
        open={deleteColumnModalOpen}
        title={"ลบส่วนคะแนน"}
        detail={"คุณยืนยันที่จะลบส่วนคะแนนนี้ใช่หรือไม่"}
        onClose={handleDeleteColumnModalClose}
        onSubmit={() => {
          handleDeleteColumnModalSubmit();
        }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Typography fontSize={30} sx={{ paddingTop: "50px" }}>
            นำเข้าคะแนน
          </Typography>
        </div>
        <div
          style={{ paddingLeft: "10%", paddingRight: "10%", marginTop: "30px" }}
        >
          <Typography>
            รายวิชา Chem Porous Mat ภาคปลาย ปีการศึกษา 2566
          </Typography>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            paddingTop: "20px",
          }}
        >
          <Modal
            open={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
          >
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 400,
                bgcolor: "background.paper",
                boxShadow: 24,
                p: 4,
              }}
            >
              {/* <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyItems: "center",
                }}
              > */}
              <Typography
                fontSize={20}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                เพิ่มส่วนการให้คะแนน
              </Typography>
              {/* </Box> */}
              <TextField
                id="name"
                name="name"
                label="ชื่อส่วนคะแนน"
                variant="outlined"
                value={newColumnName.name}
                onChange={handleModalInputChange}
                fullWidth
                sx={{ marginTop: 1 }}
              />
              <TextField
                id="score"
                name="score"
                label="คะแนนเต็ม"
                variant="outlined"
                value={newColumnName.score}
                onChange={handleModalInputChange}
                fullWidth
                sx={{ marginTop: 2 }}
              />
              <FormControl fullWidth sx={{ marginTop: 2 }}>
                <InputLabel id="demo-simple-select-label">ประเภท</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={scoreType}
                  label="ประเภท"
                  onChange={handleChange}
                >
                  <MenuItem value={"hw"}>การบ้าน</MenuItem>
                  <MenuItem value={"mid"}>กลางภาค</MenuItem>
                  <MenuItem value={"fi"}>ปลายภาค</MenuItem>
                  <MenuItem value={"quiz"}>ควิซ</MenuItem>
                  <MenuItem value={"behavior"}>ความประพฤติ</MenuItem>
                  <MenuItem value={"attendance"}>ความมีส่วนร่วม</MenuItem>
                  <MenuItem value={"presentation"}>การนำเสนอ</MenuItem>
                  <MenuItem value={"project"}>โปรเจค</MenuItem>
                  <MenuItem value={"skill"}>skill</MenuItem>
                </Select>
              </FormControl>
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Button
                  variant="contained"
                  onClick={() => {
                    setIsModalOpen(false);
                  }}
                  sx={{
                    marginTop: 2,
                    marginRight: 1,
                    backgroundColor: PinkPallette.main,
                    "&:hover": {
                      backgroundColor: PinkPallette.light,
                    },
                  }}
                >
                  ยกเลิก
                </Button>
                <Button
                  variant="contained"
                  onClick={handleAddColumn}
                  sx={{
                    marginTop: 2,
                    marginLeft: 1,
                    backgroundColor: PinkPallette.main,
                    "&:hover": {
                      backgroundColor: PinkPallette.light,
                    },
                  }}
                >
                  บันทึก
                </Button>
              </Box>
            </Box>
          </Modal>
        </div>
        <div style={{ paddingLeft: "10%", paddingRight: "10%" }}>
          <MaterialReactTable table={table} />
        </div>
      </div>
      <div
        style={{
          paddingRight: "10%",
          paddingLeft: "10%",
          marginTop: "30px",
          display: "flex",
          justifyContent: "space-between",
          paddingBottom: 80,
        }}
      >
        <Button
          variant="contained"
          color="inherit"
          onClick={() => {
            navigate("/scoring");
          }}
        >
          กลับ
        </Button>
        <Button
          variant="contained"
          color="success"
          onClick={() => {
            handleSaveButtonClick();
          }}
        >
          บันทึก
        </Button>
      </div>
    </div>
  );
};

export default ScoringTable;
