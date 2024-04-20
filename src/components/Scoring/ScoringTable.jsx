import * as React from "react";
import { useState, useContext } from "react";
import { DataAcrossPages } from "../../assets/DataAcrossPages.jsx";
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
  const { data } = useContext(DataAcrossPages);
  const [emptyArray, setEmptyArray] = useState([]);
  const [scoreDetail, setScoreDetail] = useState([]);
  const [afterUpload, setAfterUpload] = useState(0);

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
      setAfterUpload(afterUpload + 1);

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
    console.log("scoreDetail in handleSaveButtonClick", scoreDetail);

    const dataToSend = {
      moduleObjectID: data._id,
      assignments: scoreDetail
        .map((item) => {
          return item.assignments.map((informations) => {
            // เพิ่ม return ที่นี่
            return {
              accessorKey: informations.accessorKey,
              headerName: informations.headerName,
              nType: informations.nType,
              fullScore: informations.fullScore,
            };
          });
        })
        .flat(), // เพิ่ม flat() ที่นี่
      students: excelData.map((row) => ({
        // แปลงข้อมูลนิสิตให้อยู่ในรูปแบบที่ API ต้องการ
        sID: row.ID,
        sName: row["ชื่อ-นามสกุล"],
        scores: Object.keys(row)
          .filter(
            (key) =>
              key !== "number" &&
              key !== "ID" &&
              key !== "ชื่อ-นามสกุล" &&
              key !== "totalScore"
          ) // กรองเอาเฉพาะชื่อคอลัมน์ที่ไม่ใช่ ID, ชื่อ-นามสกุล และ totalScore
          .reduce((acc, key) => {
            acc[key] = row[key]; // เก็บค่าคะแนนแต่ละส่วนในอ็อบเจ็กต์ scores
            return acc;
          }, {}),
        totalScore: row.totalScore, // เก็บคะแนนรวม
      })),
    };

    console.log("ข้อมูลที่จะส่งไป DB", dataToSend);

    axios
      .post(`http://localhost:8000/api/scores/`, dataToSend)
      .then((response) => {
        // ดำเนินการเมื่อส่งข้อมูลสำเร็จ
        console.log("Response from server:", response.data);
      })
      .catch((error) => {
        // ดำเนินการเมื่อเกิดข้อผิดพลาดในการส่งข้อมูล
        console.error("Error sending data to server:", error);
      });
  };

  function getOldScore() {
    axios
      .get(`http://localhost:8000/api/scores/${data._id}`)
      .then((response) => {
        console.log("testAPI", response.data.scores.assignments);

        // Process oldScoreData to match the structure of excelData
        const processedData = response.data.scores.students.map((student) => {
          const row = {
            ID: student.sID,
            "ชื่อ-นามสกุล": student.sName,
            totalScore: student.totalScore.toString(),
          };

          response.data.scores.assignments.map((assignment) => {
            row[assignment.accessorKey] =
              student.scores[assignment.accessorKey] || "";
          });

          return row;
        });

        // Update excelData state with the processed data
        setExcelData(processedData);
        // Create new columns from API data
        const newColumns = response.data.scores.assignments.map(
          (assignment) => ({
            accessorKey: assignment.accessorKey,
            header: assignment.headerName,
            size: 70,
            enableColumnActions: true,
            renderColumnActionsMenuItems: ({ closeMenu }) => [
              <MenuItem
                key={1}
                onClick={() => beforeDelete(closeMenu, assignment.accessorKey)}
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
          })
        );
        setColumns((prevColumns) => [...prevColumns, ...newColumns]);
      })
      .catch((error) => {
        console.error("Error fetching old score:", error);
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
      fullScore: parseInt(newColumnName.score), // เพิ่ม property fullScore เข้าไปในข้อมูลของคอลัมน์ใหม่
    };
    setColumns((prevColumns) => [...prevColumns, newColumn]);
    const newData = excelData.map((row) => ({
      ...row,
      [newAccessorKey]: "", // สร้างคอลัมน์ใหม่ในแต่ละแถว
    }));

    doingData(newAccessorKey);
    setExcelData(newData);
    collectedDataFromAddColumn([...emptyArray, newColumn]); // ส่งอาร์เรย์ของหัวตารางที่เพิ่มเข้ามา
    setIsModalOpen(false);
    setNewColumnName({ name: "", score: "" });
    setScoreType("");
    // collectedDataFromAddColumn(newColumnName, scoreType);
  };

  const doingData = (newAccessorKey) => {
    setColumnNameToCalculateScore((prevState) => {
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

  // const collectedDataFromAddColumn = (nameScore, scoreType) => {
  //   console.log("newData", nameScore, scoreType);
  //   const scoreData = {
  //     assignments: [
  //       {
  //         accessorKey: nameScore.name,
  //         headerName: nameScore.name,
  //         nType: scoreType,
  //         fullScore: nameScore.score,
  //       },
  //     ],
  //   };
  //   setScoreDetail(scoreData);
  // };

  const collectedDataFromAddColumn = (columnsToAdd) => {
    const scoreData = {
      assignments: columnsToAdd.map((column) => ({
        accessorKey: column.accessorKey,
        headerName: column.header,
        nType: scoreType, // ใส่ประเภทคะแนนที่เลือกเข้าไป
        fullScore: column.fullScore, // ใส่คะแนนเต็มของแต่ละส่วนการให้คะแนน
      })),
    };
    console.log("scoreData", scoreData);
    console.log("scoreDetail", scoreDetail);
    setEmptyArray([]);
    setScoreDetail((prevScoreDetail) => {
      const newDataSet = [...prevScoreDetail, scoreData];
      return newDataSet;
    });
  };

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
    setCheck(accessorKey);
    handleDeleteColumnModalOpen();
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
        left: ["number", "ID", "ชื่อ-นามสกุล", "Section"],
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

  let semester = "";
  switch (data.semester) {
    case "1":
      semester = "ภาคต้น";
      break;
    case "2":
      semester = "ภาคปลาย";
      break;
    case "3":
      semester = "ภาคฤดูร้อน";
      break;
    default:
      break;
  }

  React.useEffect(() => {
    if (afterUpload > 0) {
      // คำนวณ totalScore โดยใช้ columnNameToCalulateScore
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
    }
  }, [columnNameToCalulateScore, excelData]);

  return (
    <div>
      <ResponsiveAppBar />
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
            รายวิชา {data.moduleName} {semester} ปีการศึกษา {data.year}
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
                  <MenuItem value={1}>การบ้าน</MenuItem>
                  <MenuItem value={2}>กลางภาค</MenuItem>
                  <MenuItem value={3}>ปลายภาค</MenuItem>
                  <MenuItem value={4}>ควิซ</MenuItem>
                  <MenuItem value={5}>ความประพฤติ</MenuItem>
                  <MenuItem value={6}>ความมีส่วนร่วม</MenuItem>
                  <MenuItem value={7}>การนำเสนอ</MenuItem>
                  <MenuItem value={8}>โปรเจค</MenuItem>
                  <MenuItem value={9}>skill</MenuItem>
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
