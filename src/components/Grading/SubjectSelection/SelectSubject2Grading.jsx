import { useState, useEffect, useContext } from "react";
import { DataAcrossPages } from "../../../assets/DataAcrossPages";
import "./SelectSubject2Grading.css";
import toast, { Toaster } from "react-hot-toast";
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
import { axios } from "../../../utils/customAxios";
import { useCookies } from "react-cookie";

export default function SelectSubject2Grading() {
  const navigate = useNavigate();
  const [excelData, setExcelData] = useState([]);
  const [moduleList, setModuleList] = useState([{}]);
  const [courseNameAndID, setCourseNameAndID] = useState([]);
  const [minimumPortion, setMinimumPortion] = useState("");
  const [idFromSelectedSubject, setIdFromSelectedSubject] = useState("");
  const [packedDataList, setPackedDataList] = useState([]);
  const [cookies, setCookie] = useCookies([]);
  const [fileName, setFileName] = useState(""); // เก็บชื่อไฟล์ที่เลือก
  const crsIDToConfirm = cookies["crsIDToConfirm"];
  const year = cookies["year"];
  const semester = cookies["semester"];
  const staffIDFromHomepage = cookies["staffIDFromHomepage"];

  const { setData } = useContext(DataAcrossPages);
  const { data } = useContext(DataAcrossPages);

  const notComplete = () =>
    toast.error("กรุณากรอกข้อมูลให้ครบ", {
      style: {
        borderRadius: "10px",
        background: "red",
        color: "#fff",
      },
    });

  const repeatedlySelection = () =>
    toast.error("กรุณาเลือกมอดูลให้ไม่ซ้ำกัน", {
      style: {
        borderRadius: "10px",
        background: "red",
        color: "#fff",
      },
    });

  const handleClick = (excelData) => {
    if (!isModuleDataComplete()) {
      notComplete(); // Display toast notification
      return; // Exit function if data is incomplete
    } else {
      const mergedPackedData = [...packedDataList, excelData, minimumPortion];
      setData(mergedPackedData);
      // setCookie("mergedPackedData", mergedPackedData);
      setCookie("year", year);
      setCookie("semester", semester);
      console.log("mergedPackedData", mergedPackedData);

      navigate("/gradeAdjustment");
    }
  };
  const handleDeleteModule = (indexToDelete) => {
    // อัปเดต moduleList โดยลบข้อมูลใน index ที่ต้องการลบ
    const updatedModuleList = moduleList.filter(
      (item, index) => index !== indexToDelete - 1
    );
    setModuleList(updatedModuleList);

    // อัปเดต packedDataList โดยลบข้อมูลที่เกี่ยวข้องออกไปด้วย
    const updatedPackedDataList = packedDataList.filter(
      (item, index) => index !== indexToDelete - 1
    );
    setPackedDataList(updatedPackedDataList);
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

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
    }
  };

  const [count, setCount] = useState(0); // เก็บจำนวน Component

  const handleAddComponent = () => {
    setModuleList((prevState) => {
      return [...prevState, {}];
    });
    console.log("moduleList", moduleList);
    setCount(count + 1); // เพิ่มจำนวน Component ที่ต้องการแสดง
    // เพิ่มข้อมูลเปล่าๆ เพื่อรอการกรอกจากผู้ใช้
    setPackedDataList((prevState) => [...prevState, ["", "", "", ""]]);
  };

  const isModuleDataComplete = () => {
    console.log("ข้อมูลหลังจากเลือกมอดูลแล้ว", moduleList);
    return packedDataList.every((item, index) => {
      if (
        item.moduleName === "" ||
        item.portion === "" ||
        minimumPortion === "" ||
        idFromSelectedSubject === "" ||
        excelData.length === 0
      ) {
        return false;
      }

      // Check for duplicate moduleID
      const currentModuleID = item.moduleID;
      const isDuplicate =
        packedDataList.findIndex(
          (module, idx) => idx !== index && module.moduleID === currentModuleID
        ) !== -1;

      if (isDuplicate) {
        repeatedlySelection(); // Display toast notification for duplicate moduleID
        return false;
      }

      return true;
    });
  };

  const handlePackedDataChange = (index, newData) => {
    console.log("newData", newData);
    console.log("index", index);
    setPackedDataList((prevState) => {
      const updatedDataList = [...prevState];
      updatedDataList[index] = newData;
      return updatedDataList;
    });
  };

  function getCourse() {
    let semesterValue = "";
    switch (semester) {
      case "ภาคต้น":
        semesterValue = "1";
        break;
      case "ภาคปลาย":
        semesterValue = "2";
        break;
      case "ภาคฤดูร้อน":
        semesterValue = "3";
        break;
      default:
        semesterValue = "0";
    }

    axios
      .get(`/courses?year=${year}&semester=${semesterValue}`)
      .then((response) => {
        let courseNameAndID = [];
        let crsIDToConfirm = [];
        // console.log(semesterValue);
        response.data.courses.map((item) => {
          let cID = "";
          item.coordinators.map((id) => {
            // console.log(id);
            cID = id._id;
          });
          // console.log(staffIDFromHomepage);
          // console.log(cID);
          if (staffIDFromHomepage === cID) {
            let name = item.crsName;
            let ID = item._id;
            let crsID = item.crsID;
            courseNameAndID.push({ crsName: name, crsID: ID, id: crsID });
            crsIDToConfirm.push(crsID);
          }
        });
        setCourseNameAndID(courseNameAndID);
        // console.log(crsIDToConfirm);
        setCookie("crsIDToConfirm", crsIDToConfirm);
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
      console.log("อัปโหลดไฟล์แล้ว : ", excelData);
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
            navigate("/homepage");
          }}
        >
          กลับ
        </Button>
        <Typography sx={{ marginTop: "20px" }}>
          การประเมิมผลการศึกษา{semester} ปีการศึกษา {year}
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
                  options={courseNameAndID.map((names) => {
                    return names.id + " " + names.crsName;
                  })}
                  sx={{ width: 510 }}
                  renderInput={(params) => (
                    <TextField {...params} placeholder="ค้นหารหัส/ชื่อวิชา" />
                  )}
                  onChange={(event, newValue) => {
                    const choice = newValue;
                    console.log(newValue);
                    if (choice) {
                      const selectedCourse = courseNameAndID.find(
                        (course) => course.id === choice.split(" ")[0]
                      );
                      console.log(selectedCourse);
                      const selectedCrsID = selectedCourse
                        ? selectedCourse.crsID
                        : "";
                      console.log(selectedCrsID);
                      setIdFromSelectedSubject(selectedCrsID);
                    }
                    // const selectedCourse = courseNameAndID.find(
                    //   (course) => course.id === choice.split(" ")[0]
                    // );
                    // console.log(selectedCourse);
                    // const selectedCrsID = selectedCourse
                    //   ? selectedCourse.crsID
                    //   : "";
                    // setIdFromSelectedSubject(selectedCrsID); // ตั้งค่า crsID ให้กับ state ใน SelectSubject2Grading
                  }}
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
            {moduleList.map((item, index) => (
              <AddMoreModule
                key={index}
                index={index + 1}
                onDelete={handleDeleteModule}
                crsID={idFromSelectedSubject} // ส่งค่า crsID ไปยัง AddMoreModule
                year={year}
                semester={semester}
                onPackedDataChange={(newData) =>
                  handlePackedDataChange(index, newData)
                }
              />
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
                  value={minimumPortion}
                  onChange={(event) => {
                    setMinimumPortion(event.target.value);
                  }}
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
                    handleClick(excelData);
                  }}
                >
                  ต่อไป
                </Button>
                <Toaster />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AddMoreModule({
  index,
  onDelete,
  crsID,
  year,
  semester,
  onPackedDataChange,
}) {
  const [moduleNameAndID, setModuleNameAndID] = useState([]);
  const [selectedModuleName, setSelectedModuleName] = useState("");
  // const [packedPortionData, setPackedPortionData] = useState("");
  const [selectedModulePortion, setSelectedModulePortion] = useState("");
  const [selectedModuleID, setSelectedModuleID] = useState("");
  const [moduleData, setModuleData] = useState({}); // เก็บข้อมูลโมดูลทั้งหมด

  function getModules() {
    axios.get(`/modules/allModules`).then((response) => {
      console.log(response.data);
      let moduleNameAndID = [];
      response.data.modules.map((item) => {
        let name = item.moduleName;
        let id = item._id;

        moduleNameAndID.push({ moduleName: name, moduleID: id });
      });
      setModuleNameAndID(moduleNameAndID);
    });
  }

  useEffect(() => {
    getModules();
  }, []);

  // อัพเดทข้อมูลโมดูลทั้งหมดเมื่อมีการเปลี่ยนแปลงใน TextField
  useEffect(() => {
    setModuleData({
      crsID: crsID,
      moduleName: selectedModuleName,
      moduleID: selectedModuleID,
      portion: selectedModulePortion,
    });
  }, [crsID, selectedModuleName, selectedModuleID, selectedModulePortion]);

  // ตรวจสอบว่าข้อมูลโมดูลทั้งหมดครบถ้วนหรือไม่
  const isModuleDataComplete = () => {
    return (
      selectedModuleName !== "" &&
      selectedModuleID !== "" &&
      selectedModulePortion !== ""
    );
  };
  // กำหนดฟังก์ชัน handlePackedDataChangeLocal เพื่อส่งข้อมูลไปยัง onPackedDataChange เมื่อข้อมูลครบถ้วน
  const handlePackedDataChangeLocal = () => {
    if (isModuleDataComplete()) {
      onPackedDataChange(moduleData);
    }
  };
  useEffect(() => {
    if (isModuleDataComplete()) {
      handlePackedDataChangeLocal();
    }
  }, [selectedModuleName, selectedModuleID, selectedModulePortion]);

  const handleDeleteButtonClick = () => {
    onDelete(index);
  };

  // ในฟังก์ชัน handleChange
  const handleChange = (event) => {
    setSelectedModulePortion(event.target.value);
    const newValue = event.target.value;
    setModuleData((prevData) => ({
      ...prevData,
      portion: newValue,
    }));
    handlePackedDataChangeLocal(); // เรียกใช้ handlePackedDataChangeLocal เมื่อมีการเปลี่ยนแปลงในข้อมูล portion
  };

  const Item = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    width: 1024,
  }));

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
              value={selectedModuleName === "" ? null : selectedModuleName}
              options={moduleNameAndID.map((name) => {
                let semesterValue = "";
                switch (semester) {
                  case "ภาคต้น":
                    semesterValue = "1";
                    break;
                  case "ภาคปลาย":
                    semesterValue = "2";
                    break;
                  case "ภาคฤดูร้อน":
                    semesterValue = "3";
                    break;
                  default:
                    semesterValue = "0";
                }
                return name.moduleName + "_" + year + "/" + semesterValue;
              })}
              sx={{ width: 600 }}
              renderInput={(params) => (
                <TextField {...params} placeholder="ชื่อมอดูล" />
              )}
              onChange={(event, newValue) => {
                const valueToShow = newValue;
                const value = newValue.split("_");
                setSelectedModuleName(valueToShow);
                const selectedModule = moduleNameAndID.find((module) => {
                  if (value.length > 2) {
                    return (
                      module.moduleName ===
                      value.slice(0, value.length - 1).join("_")
                    );
                  } else if (value.length === 2) {
                    return module.moduleName === value[0];
                  }
                });
                console.log(selectedModule);
                setSelectedModuleID(
                  selectedModule ? selectedModule.moduleID : ""
                );
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
                value={selectedModulePortion}
                onChange={(event) => {
                  const newValue = selectedModulePortion;
                  setModuleData((prevData) => ({
                    ...prevData,
                    portion: newValue,
                  }));
                  handleChange(event);
                }}
                // onBlur={handleBlur}
                sx={{
                  width: "85px",
                  display: "flex",
                  justifyContent: "center",
                }}
              />{" "}
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
