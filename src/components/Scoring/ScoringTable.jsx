import * as React from "react";
import { useState, useContext } from "react";
import { useCookies } from "react-cookie";
import { DataAcrossPages } from "../../assets/DataAcrossPages.jsx";
import toast, { Toaster } from "react-hot-toast";
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
import FileDownloadIcon from "@mui/icons-material/FileDownload";
// import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
// import OfflinePinIcon from "@mui/icons-material/OfflinePin";
import { mkConfig, generateCsv, download } from "export-to-csv";

import { PinkPallette } from "../../assets/pallettes";
import ReCheckModal from "../utility/Recheck";
import axios from "axios";
import { useNavigate } from "react-router";

const csvConfig = mkConfig({
  fieldSeparator: ",",
  decimalSeparator: ".",
  useKeysAsHeaders: true,
  filename: "confirm_score",
});

const ScoringTable = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newColumnName, setNewColumnName] = useState({ name: "", score: "" }); // เพิ่ม state สำหรับเก็บชื่อ column ใหม่
  const [columnNameToCalulateScore, setColumnNameToCalculateScore] = useState(
    []
  );
  const [
    columnNameToCalulateScoreExistCase,
    setColumnNameToCalculateScoreExistCase,
  ] = useState([]);

  const [scoreType, setScoreType] = React.useState("");
  const [excelData, setExcelData] = useState([]);
  const [deleteColumnModalOpen, setDeleteModuleModalOpen] = useState(false);
  const [check, setCheck] = useState();
  const navigate = useNavigate();
  const { setData } = useContext(DataAcrossPages);
  const { data } = useContext(DataAcrossPages);
  const [cookies] = useCookies([]);
  const rows = cookies["row"];
  const [emptyArray, setEmptyArray] = useState([]);
  const [scoreDetail, setScoreDetail] = useState([]);
  const [afterUpload, setAfterUpload] = useState(0);
  const [afterDelete, setAfterDelete] = useState(0);
  const [afterUploadExist, setAfterUploadExist] = useState(0);
  const [rowScores, setRowScores] = useState([]); // เพิ่ม state เพื่อเก็บคะแนนรวมในแต่ละแถว
  // const [rowScoresExistCase, setRowScoresExistCase] = useState([]); // เพิ่ม state เพื่อเก็บคะแนนรวมในแต่ละแถว

  // const handleExportData = () => {
  //   console.log("exceldata", excelData);

  //   const csv = generateCsv(csvConfig)(excelData);
  //   download(csvConfig)(csv);
  // };

  // Function to generate CSV data from accessor keys
  const generateAccessorKeysCSV = (columns) => {
    const csvConfig = mkConfig({
      fieldSeparator: ",",
      decimalSeparator: ".",
      useKeysAsHeaders: true,
      filename: "table_accessor_keys",
    });

    // Filter out the index column
    const filteredColumns = columns.filter(
      (column) =>
        column.accessorKey !== "number" && column.accessorKey !== "totalScore"
    );

    // Generate CSV from accessor keys
    const accessorKeysCSV = generateCsv(csvConfig)([
      filteredColumns.map((column) => column.accessorKey),
    ]);

    return accessorKeysCSV;
  };

  // Function to handle exporting of accessor keys
  const handleExportAccessorKeys = (columns) => {
    // Generate CSV data from accessor keys

    if (excelData.length > 0) {
      const csv = generateCsv(csvConfig)(excelData);
      download(csvConfig)(csv);
    } else {
      const accessorKeysCSV = generateAccessorKeysCSV(columns);
      console.log(accessorKeysCSV);
      // Download the CSV file
      download({ filename: "table_accessor_keys.csv" })(accessorKeysCSV);
    }
  };

  const handleFileUpload = (event) => {
    console.log(scoreDetail);
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
      setAfterUploadExist(afterUploadExist + 1);
      // calTotScore();
      console.log("check", columnNameToCalulateScore);
    };

    reader.readAsArrayBuffer(file);
  };

  const numOnly = () =>
    toast.error("กรุณากรอกเป็นตัวเลขเท่านั้น", {
      style: {
        borderRadius: "10px",
        background: "red",
        color: "#fff",
      },
    });

  const handleChange = (event) => {
    setScoreType(event.target.value);
  };

  const handleModalInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "name") {
      // ตรวจสอบว่าชื่อส่วนคะแนนถูกกรอกเป็นตัวอักษรหรือไม่
      setNewColumnName((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    } else if (!isNaN(value)) {
      // ตรวจสอบว่าคะแนนเต็มถูกกรอกเป็นตัวเลขหรือไม่
      setNewColumnName((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    } else {
      numOnly(); // เรียกใช้ฟังก์ชัน numOnly เมื่อผู้ใช้กรอกข้อมูลที่ไม่ถูกต้อง
    }
  };

  const handleSaveButtonClick = () => {
    // console.log("scoreDetail in handleSaveButtonClick", scoreDetail);
    // ตรวจสอบว่ามี totalScore ที่ไม่ได้กำหนดค่าหรือไม่
    console.log("excelData", excelData);
    if (excelData.some((row) => row.totalScore === undefined)) {
      console.log("มีค่า totalScore ที่ไม่ได้กำหนดค่าในข้อมูล");
      // แสดงข้อความหรือแจ้งเตือนให้ผู้ใช้ทราบว่ามีข้อมูลที่ไม่สมบูรณ์
      return;
    }
    console.log(scoreDetail);
    const dataToSend = {
      // แก่้จาก context --> cookies --> data เป็น row
      moduleObjectID: rows._id,
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
        totalScore: row.totalScore, // เก็บคะแนนรวม
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
      })),
    };

    // const studentsData = excelData.map((row) => {
    //   console.log("totalScore in log", row.totalScore); // ล็อกค่าของ row ที่ถูกแปลง
    //   return "test ระบบ";
    // });

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

  let flag = 0;

  function getOldScore() {
    console.log(rows._id);
    axios
      .get(`http://localhost:8000/api/scores/${rows._id}`)
      .then((response) => {
        console.log("scores.assignments", response.data.scores.assignments);
        console.log("scores.students", response.data.scores.students);
        // Process oldScoreData to match the structure of excelData
        const processedData = response.data.scores.students.map((student) => {
          const row = {
            ID: student.sID,
            "ชื่อ-นามสกุล": student.sName,
            totalScore: student.totalScore,
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
            ],
          })
        );

        const accessorKeyInAPI = newColumns.map((item) => {
          return item.accessorKey;
        });
        console.log("accessorKey", accessorKeyInAPI);
        setColumnNameToCalculateScoreExistCase((prevState) => [
          ...prevState,
          ...accessorKeyInAPI,
        ]);
        setColumns((prevColumns) => [...prevColumns, ...newColumns]);
        setColumnNameToCalculateScore(accessorKeyInAPI);
        setScoreDetail((prevData) => {
          const newData = response.data.scores.assignments.map((item) => {
            return { assignments: [item] };
          });
          const newDataSet = [...prevData, ...newData];
          return newDataSet;
        });
        flag = 1;
      })
      .catch((error) => {
        console.error("Error fetching old score:", error);
      });
  }

  React.useEffect(() => {
    console.log("flag", flag);
    if (flag === 0) {
      getOldScore();
    }
    // console.log("exceldata", excelData);
    // console.log(columnNameToCalulateScore);
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
    // console.log(columnNameToCalulateScore);
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
    console.log("excelData", excelData);
    setColumns((prevColumns) =>
      prevColumns.filter((column) => column.accessorKey !== check)
    );
    var newData = excelData.map(({ [check]: removedKey, ...rest }) => rest);
    // console.log(columns);

    columns.map((item) => {
      if (
        item.accessorKey !== "number" &&
        item.accessorKey !== "ID" &&
        item.accessorKey !== "ชื่อ-นามสกุล" &&
        item.accessorKey !== "totalScore"
      ) {
        columnNameToCalulateScore.push(item.accessorKey);
      }
    });

    console.log(columnNameToCalulateScore);

    console.log(newData);
    setExcelData(newData);
    setAfterDelete(afterDelete + 1);
    handleDeleteColumnModalClose();
  };

  const beforeDelete = (closeMenu, accessorKey) => {
    setColumnNameToCalculateScore([]);
    setCheck(accessorKey);
    handleDeleteColumnModalOpen();
    closeMenu();
  };

  const table = useMaterialReactTable({
    columns,
    data: excelData,
    // enablePagination: false,
    createDisplayMode: "row",
    editDisplayMode: "cell",
    // enableCellActions: true,
    enableClickToCopy: "context-menu",
    enableColumnPinning: true,
    enableColumnFilterModes: true,
    // enableEditing: true,
    // enableFacetedValues: true,
    getRowId: (row) => row.id,
    initialState: {
      // showColumnFilters: true,
      // showGlobalFilter: true,
      columnPinning: {
        left: ["number", "ID", "ชื่อ-นามสกุล", "Section"],
        right: ["totalScore"],
      },
    },
    paginationDisplayMode: "pages",
    // positionToolbarAlertBanner: "bottom",
    // muiPaginationProps: {
    //   color: "primary",
    //   rowsPerPageOptions: [10, 20, 30],
    //   shape: "rounded",
    //   variant: "outlined",
    // },
    renderTopToolbarCustomActions: () => (
      <>
        {/* <div style={{ position: "relative", display: "inline-block" }}> */}
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

        <Button
          variant="contained"
          sx={{
            backgroundColor: PinkPallette.main,
            "&:hover": {
              backgroundColor: PinkPallette.light,
            },
          }}
          // onClick={handleExportData}
          onClick={() => handleExportAccessorKeys(columns)}
          startIcon={<FileDownloadIcon />}
        >
          ดาวน์โหลด
        </Button>

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
  switch (rows.semester) {
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
    if (afterUpload > 0 || afterDelete > 0) {
      let scores = []; // เก็บคะแนนรวมในแต่ละแถว
      excelData.forEach((rowData) => {
        let fullScore = 0;
        let isInvalid = false; // ตัวแปรเพื่อตรวจสอบว่าค่าที่ไม่สามารถคำนวณได้
        let letter = "";
        columnNameToCalulateScore.forEach((columnName) => {
          const score = parseFloat(rowData[columnName] || 0); // แปลงค่าเป็นตัวเลข หรือถ้าไม่ได้ให้เป็น 0
          if (!isNaN(score)) {
            // ตรวจสอบว่าค่านั้นเป็นตัวเลขหรือไม่
            fullScore += score; // ถ้าเป็นตัวเลขให้เพิ่มเข้าไปใน fullScore
          } else {
            letter = rowData[columnName];
            isInvalid = true; // ถ้าไม่ใช่ตัวเลขกำหนดให้ isInvalid เป็น true
          }
        });
        if (isInvalid) {
          // ถ้าค่าไม่ถูกต้อง
          if (letter !== "w") {
            scores.push(letter);
          } // เพิ่มค่า "NaN" เข้าไปใน scores แทน
          else if (letter === "W") {
            scores.push("W");
          }
        } else {
          scores.push(fullScore.toFixed(2)); // เพิ่มคะแนนรวมในแต่ละแถวเข้าไปใน scores
        }
      });
      setRowScores(scores); // อัปเดตคะแนนรวมในแต่ละแถว
      if (columnNameToCalulateScore.length > 0) {
        setAfterUpload((prev) => prev + 1); // เรียกใช้ useEffect ที่คำนวณคะแนนรวมใหม่
      }
    }
  }, [afterUpload, columnNameToCalulateScore, excelData]);

  // React.useEffect(() => {
  //   // เมื่อ columnNameToCalulateScore มีการเปลี่ยนแปลง
  //   // ให้ทำการคำนวณคะแนนรวมใหม่
  //   if (columnNameToCalulateScore.length > 0) {
  //     setAfterUpload((prev) => prev + 1); // เรียกใช้ useEffect ที่คำนวณคะแนนรวมใหม่
  //   }
  // }, [columnNameToCalulateScore]);

  React.useEffect(() => {
    if (
      (afterUpload > 0 && rowScores.length > 0) ||
      (afterDelete > 0 && rowScores.length > 0)
    ) {
      // หลังจากทำการคำนวณคะแนนในแต่ละแถวเสร็จสิ้น
      // ก็สามารถอัปเดตค่า totalScore ที่ excelData ได้
      setExcelData((prevExcelData) =>
        prevExcelData.map((rowData, index) => ({
          ...rowData,
          totalScore: rowScores[index], // กำหนดค่า totalScore ของแถวนี้
        }))
      );
    }
  }, [afterUpload, afterDelete, rowScores]);

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
            รายวิชา {rows.moduleName} {semester} ปีการศึกษา {rows.year}
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
            setData("65f90efa4ef7a70f80525051");
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
        <Toaster />
      </div>
    </div>
  );
};

export default ScoringTable;
