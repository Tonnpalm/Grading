import * as React from "react";
import { useState } from "react";
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
import { useCookies } from "react-cookie";

const ScoringTable = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newColumnName, setNewColumnName] = useState({ name: "", score: "" }); // เพิ่ม state สำหรับเก็บชื่อ column ใหม่
  const [scoreType, setScoreType] = React.useState("");
  const [excelData, setExcelData] = useState([]);
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

  const handleFileFilteredUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];

      // เลือกเฉพาะคอลัมน์ที่ต้องการนำเข้า
      const columnsToImport = [handleAddColumn.newAccessorKey];

      // แปลงข้อมูลในไฟล์ Excel เป็น JSON
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      // หาคอลัมน์ที่ต้องการนำเข้า
      const headerRow = jsonData[0];
      const columnIndexMap = {};

      headerRow.forEach((header, index) => {
        if (columnsToImport.includes(header)) {
          columnIndexMap[header] = index;
        }
      });

      // เก็บข้อมูลที่ต้องการนำเข้า
      const importedData = jsonData.map((row) => {
        const importedRow = {};
        columnsToImport.forEach((columnName) => {
          const columnIndex = columnIndexMap[columnName];
          importedRow[columnName] = row[columnIndex];
        });
        return importedRow;
      });

      // ตั้งค่าข้อมูลในตาราง
      setExcelData(importedData);
    };

    reader.readAsArrayBuffer(file);
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
      Cell: ({ row }) => {
        let fullScore = 0;
        columns.forEach((column) => {
          // เช็คว่า accessorKey ของคอลัมน์นั้นๆ เริ่มต้นด้วยชื่อที่เพิ่มเข้ามาใหม่หรือไม่
          if (column.accessorKey.startsWith(newColumnName.name)) {
            fullScore += parseFloat(row[column.accessorKey] || 0);
          }
        });
        return fullScore;
      },
      enableEditing: false,
    },
  ]);

  //   console.log(columns.map((item) => item.accessorKey));

  const handleAddColumn = () => {
    if (!newColumnName.name.trim() || !newColumnName.score.trim()) return;

    const newAccessorKey = `${newColumnName.name}`;

    const newColumn = {
      accessorKey: newAccessorKey, // ใช้ชื่อ Name เป็นส่วนหลักของ accessorKey
      header: `${newColumnName.name} (${newColumnName.score})`,
      size: 70,
    };

    setColumns((prevColumns) => [...prevColumns, newColumn]);

    const newData = excelData.map((row) => ({
      ...row,
      [newAccessorKey]: "", // สร้างคอลัมน์ใหม่ในแต่ละแถว
    }));

    setExcelData(newData);
    setIsModalOpen(false);
    setNewColumnName({ name: "", score: "" }); // ล้างข้อมูลที่กรอกเข้ามาหลังจากเพิ่มเสร็จ
    setScoreType(""); // ล้างข้อมูลประเภทคะแนนหลังจากเพิ่มเสร็จแล้ว
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
            sx={{ backgroundColor: PinkPallette.main }}
            startIcon={<CloudUploadIcon />}
          >
            อัพโหลดไฟล์
            <input
              type="file"
              className="form-control custom-form-control"
              style={{ position: "absolute", top: 0, left: 0, opacity: 0 }}
              onChange={handleFileUpload}
            />
          </Button>
          {/* <Button
            component="label"
            variant="contained"
            className="import-style"
            sx={{ backgroundColor: PinkPallette.main }}
            startIcon={<CloudUploadIcon />}
          >
            Upload column
            <input
              type="file"
              className="form-control custom-form-control"
              style={{ position: "absolute", top: 0, left: 0, opacity: 0 }}
              onChange={handleFileFilteredUpload}
            />
          </Button> */}
        </div>
        <Button
          variant="contained"
          onClick={() => setIsModalOpen(true)}
          sx={{ ml: "auto" }} // ใช้ margin-left: auto เพื่อให้ปุ่มอยู่ทางขวา
        >
          เพิ่มคอลัมน์
        </Button>
      </>
    ),
  });

  return (
    <div>
      <ResponsiveAppBar></ResponsiveAppBar>
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
        <div>
          <Typography>
            {/* {name} ภาค{semester} ปีการศึกษา {year} */}
          </Typography>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            paddingTop: "50px",
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
              <Typography fontSize={20}>เพิ่มส่วนการให้คะแนน</Typography>
              <TextField
                id="name"
                name="name"
                label="Name"
                variant="outlined"
                value={newColumnName.name}
                onChange={handleModalInputChange}
                fullWidth
                mb={2}
              />
              <TextField
                id="score"
                name="score"
                label="Score"
                variant="outlined"
                value={newColumnName.score}
                onChange={handleModalInputChange}
                fullWidth
                mb={2}
              />
              <FormControl fullWidth>
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
              <Button variant="contained" onClick={handleAddColumn}>
                บันทึก
              </Button>
            </Box>
          </Modal>
        </div>
        <div style={{ paddingLeft: "10%", paddingRight: "10%" }}>
          <MaterialReactTable table={table} />
        </div>
      </div>
    </div>
  );
};

export default ScoringTable;
