// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useContext } from "react";
import "./SelectSubject2Grading.css";
import ResponsiveAppBar from "../../AppBar/ButtonAppBar";
import {
  Button,
  IconButton,
  Tooltip,
  Divider,
  Typography,
  Paper,
  TextField,
  Autocomplete,
  Grid,
} from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { styled } from "@mui/material/styles";
import SubjectIcon from "@mui/icons-material/Subject";
import Delete from "@mui/icons-material/Delete";
import VibrationIcon from "@mui/icons-material/Vibration";
import { PinkPallette } from "../../../assets/pallettes";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useNavigate } from "react-router";
import * as XLSX from "xlsx";
import axios from "axios";
// import { DataAcrossPages } from "./asset/";
export default function SelectSubject2Grading() {
  const navigate = useNavigate();
  const [CR58, setCR58] = React.useState("");
  const [course, setCourse] = React.useState("");
  const [excelData, setExcelData] = useState([]);
  const [moduleDetail, setModuleDetail] = useState([]);
  const [moduleList, setModuleList] = useState([{}]);
  const [courseName, setCourseName] = useState([]);

  // const { setData } = useContext(DataAcrossPages);

  const handleClick = () => {
    // setData("Some data");
    navigate("/gradeAdjustment");
  };
  const handleDeleteModule = (indexToDelete) => {
    setModuleList(
      moduleList?.filter((item, index) => index != indexToDelete - 1)
    );
    // console.log("moduleList", indexToDelete);
  };

  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });

  const [fileName, setFileName] = useState(""); // เก็บชื่อไฟล์ที่เลือก

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
    }
  };

  const [count, setCount] = useState(1); // เก็บจำนวน Component

  const handleAddComponent = () => {
    setModuleList((prevState) => {
      return [...prevState, {}];
    });
    setCount(count + 1); // เพิ่มจำนวน Component ที่ต้องการแสดง
  };

  function getCourse() {
    axios.get(`http://localhost:8000/api/courses/`).then((response) => {
      // console.log(response.data);
      let nameOfCourse = [];
      response.data.courses.map((item) => {
        let name = item.crsName;
        nameOfCourse.push(name);
        // console.log(nameOfCourse);
      });
      setCourseName(nameOfCourse);
    });
  }

  useEffect(() => {
    getCourse();
  }, []);

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
  return (
    <div>
      <ResponsiveAppBar />
      <div className="select-subject-container">
        <Button
          variant="contained"
          sx={{ backgroundColor: "white", color: "black" }}
          startIcon={<ArrowBackIosIcon />}
          onClick={() => {
            navigate("/");
          }}
        >
          กลับ
        </Button>
        <Typography sx={{ marginTop: "20px" }}>
          การประเมิมผลการศึกษาภาคปลาย ปีการศึกษา 2566
        </Typography>
        <div
          style={{ display: "flex", flexDirection: "row", marginTop: "50px" }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <SubjectIcon sx={{ width: "35px", height: "31px" }} />
          </div>
          <div style={{ marginLeft: "20px" }}>
            <Grid container spacing={2}>
              <Grid item xs={6} md={8}>
                <Typography sx={{ marginTop: "3px" }}>รายวิชา</Typography>
                <Typography
                  sx={{
                    marginTop: "10px",
                    marginBottom: "10px",
                    color: "#018ADA",
                  }}
                >
                  เลือกวิชาที่ต้องการตัดเกรด
                </Typography>
                {/* <ComboBox sx={{ marginTop: "15px" }} /> */}
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={courseName}
                  sx={{ width: 510 }}
                  renderInput={(params) => (
                    <TextField {...params} placeholder="ค้นหารหัส/ชื่อวิชา" />
                  )}
                />
                <Typography
                  sx={{
                    marginTop: "15px",
                    marginBottom: "10px",
                    color: "#018ADA",
                  }}
                >
                  อัปโหลดไฟล์ CR58
                </Typography>
                {/* <input type="file" accept=".xlsx, .xls" style={{ backgroundColor: PinkPallette.main }}/> */}
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
                  <VisuallyHiddenInput
                    type="file"
                    className="form-control custom-form-control"
                    onChange={(event) => {
                      handleFileChange(event);
                      handleFileUpload(event);
                      setCR58(event.target.file);
                    }}
                  />
                </Button>
                <TextField
                  id="outlined-basic"
                  placeholder="ชื่อไฟล์"
                  variant="outlined"
                  value={fileName}
                  sx={{ width: "360px", marginLeft: "20px" }}
                />
                <Divider
                  sx={{
                    width: "1024px",
                    marginTop: "30px",
                    backgroundColor: "black",
                  }}
                />
              </Grid>
            </Grid>
          </div>
        </div>
        <div
          style={{ display: "flex", flexDirection: "row", marginTop: "30px" }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <VibrationIcon sx={{ width: "35px", height: "31px" }} />
          </div>
          <div style={{ marginLeft: "20px" }}>
            <Typography sx={{ marginTop: "3px" }}>รูปแบบการให้คะแนน</Typography>
            <Typography
              sx={{ marginTop: "10px", marginBottom: "10px", color: "#018ADA" }}
            >
              กำหนดสัดส่วนน้ำหนักมอดูล
            </Typography>
            {/* {Array.from({ length: count }, (_, index) => (
              <AddMoreModule
                key={index}
                index={index + 1}
                onDelete={() => handleDeleteModule(index - 1)}
              /> // กำหนด key เพื่อให้ React รู้จักแต่ละ Component และส่งตัวเลขกำกับไปให้ Component
            ))} */}

            {moduleList.map((item, index) => (
              <>
                <AddMoreModule
                  key={index}
                  index={index + 1}
                  onDelete={handleDeleteModule}
                />
              </>
            ))}
            <Button
              onClick={handleAddComponent}
              sx={{
                fontSize: 16,
                color: PinkPallette.main,
                padding: "0px",
                marginTop: "20px",
              }}
            >
              เพิ่มมอดูล
            </Button>
            <Divider
              sx={{
                width: "1024px",
                marginTop: "30px",
                backgroundColor: "black",
              }}
            />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ display: "flex" }}>
                <Typography sx={{ marginTop: "30px", marginBottom: "30px" }}>
                  การประเมินผลการศึกษาในรายวิชานี้จำเป็นต้องใช้คะแนนอย่างน้อย
                </Typography>
                <TextField
                  placeholder="00.00"
                  sx={{
                    width: "85px",
                    marginTop: "15px",
                    marginBottom: "30px",
                    marginInline: "10px",
                  }}
                />
                <Typography sx={{ marginTop: "30px", marginBottom: "30px" }}>
                  ส่วน
                </Typography>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Button
                  variant="contained"
                  color="success"
                  endIcon={<ArrowForwardIosIcon />}
                  sx={{
                    // backgroundColor: "#BCBCBC",
                    marginTop: "22.5px",
                    marginBottom: "60px",
                  }}
                  onClick={() => {
                    // setCookie("CR58", CR58);
                    handleClick();
                  }}
                >
                  ต่อไป
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// eslint-disable-next-line react/prop-types
function AddMoreModule({ index, onDelete }) {
  const [moduleName, setModuleName] = useState([]);
  const [selectedMouleName, setSelectedModuleName] = useState("");
  const [portion, setPortion] = useState("");

  function getModules() {
    axios
      .get(
        `http://localhost:8000/api/modules/?year=2566&semester=2&page=1&perPage=10`
      )
      .then((response) => {
        // console.log("data in module", response.data.modules);
        let nameOfModule = [];
        response.data.modules.map((item) => {
          let name = item.moduleName;
          nameOfModule.push(name);
          // console.log(nameOfModule);
        });
        setModuleName(nameOfModule);
        // console.log(moduleName);
      });
  }

  useEffect(() => {
    getModules();
  }, []);

  const Item = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    width: 1024,
  }));

  const handleDeleteButtonClick = () => {
    onDelete(index); // เรียกใช้ฟังก์ชัน handleDeleteModule ที่ถูกส่งมาจาก SelectSubject2Grading
  };

  return (
    <div style={{ display: "flex", flexDirection: "row", marginTop: "10px" }}>
      <Grid container spacing={1}>
        <Item
          style={{
            display: "flex",
            flexDirection: "row",
            textAlign: "center",
            alignContent: "center",
            marginTop: "10px",
            flexGrow: 1,
            maxWidth: 1024,
          }}
        >
          <Grid
            item
            lg={8}
            xs={12}
            sx={{ display: "flex", flexDirection: "row" }}
          >
            <Typography sx={{ width: 90, alignContent: "center" }}>
              มอดูลที่ {index}
            </Typography>
            <Autocomplete
              disablePortal
              id="moduleName"
              value={selectedMouleName}
              options={moduleName}
              sx={{ width: 600 }}
              renderInput={(params) => (
                <TextField {...params} placeholder="ชื่อมอดูล" />
              )}
              onChange={(event, newValue) => {
                setSelectedModuleName(newValue);
              }}
            />
          </Grid>

          <Grid item sx={{ display: "flex", flexDirection: "row" }}>
            <Grid
              item
              md
              container
              direction="row"
              sx={{ alignContent: "center" }}
            >
              <Typography sx={{ width: 90, alignContent: "center" }}>
                คิดเป็น
              </Typography>
              <TextField
                placeholder="00.00"
                value={portion}
                onChange={(event) => {
                  setPortion(event.target.value);
                }}
                sx={{
                  width: "85px",
                  display: "flex",
                  justifyContent: "center",
                }}
              />
              <Typography sx={{ width: 70, alignContent: "center" }}>
                ส่วน
              </Typography>
              <Tooltip title="delete">
                <IconButton
                  color="error"
                  onClick={() => {
                    handleDeleteButtonClick();
                  }}
                >
                  <Delete />
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
        </Item>
      </Grid>
    </div>
  );
}
