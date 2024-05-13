import * as React from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import {
  Grid,
  Paper,
  TextField,
  Typography,
  Button,
  Box,
  IconButton,
} from "@mui/material";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { styled } from "@mui/material/styles";
import { MenuItem } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useNavigate } from "react-router-dom";

import SaveIcon from "@mui/icons-material/Save";
import { DataAcrossPages } from "../../../assets/DataAcrossPages";
import {
  ResponsiveChartContainer,
  LinePlot,
  useDrawingArea,
  useYScale,
  useXScale,
} from "@mui/x-charts";
import Modal from "./Modal";
import HistoryModal from "./HistoryModal";
import axios from "axios";
import {
  GreenPallette,
  GreyPallette,
  PinkPallette,
} from "../../../assets/pallettes";
import { useCookies } from "react-cookie";

const lineData = [
  { x: 0, y: 0 },
  { x: 0, y: 100 },
];

const OverlayContainer = styled("div")({
  position: "absolute",
  top: 198,
  left: 0,
  width: "100%",
  height: "100%",
});

const y = Array.from({ length: 21 }, (_, index) => {
  if (index === 3) return 0;
  return -2 + 0.5 * index;
});

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  alignContent: "center",
  color: theme.palette.text.secondary,
}));

function CartesianAxis({ cutoff }) {
  const { left, top, width, height } = useDrawingArea();

  const yAxisScale = useYScale();
  const xAxisScale = useXScale();

  // const yOrigin = yAxisScale(0);
  const xOrigin = xAxisScale(0);

  const cutOffGradeA = cutoff.cutOffGradeA;
  const cutOffGradeBPlus = cutoff.cutOffGradeBPlus;
  const cutOffGradeB = cutoff.cutOffGradeB;
  const cutOffGradeCPlus = cutoff.cutOffGradeCPlus;
  const cutOffGradeC = cutoff.cutOffGradeC;
  const cutOffGradeDPlus = cutoff.cutOffGradeDPlus;
  const cutOffGradeD = cutoff.cutOffGradeD;

  return (
    <React.Fragment>
      <line
        x1={xOrigin + cutOffGradeA * 10}
        y1={top + 40}
        x2={xOrigin + cutOffGradeA * 10}
        y2={top + height}
        stroke={PinkPallette.main}
      />
      {/* cut off Grade B+ */}
      <line
        x1={xOrigin + cutOffGradeBPlus * 10}
        y1={top + 40}
        x2={xOrigin + cutOffGradeBPlus * 10}
        y2={top + height}
        stroke="blue"
      />
      {/* cut off Grade B */}
      <line
        x1={xOrigin + cutOffGradeB * 10}
        y1={top + 40}
        x2={xOrigin + cutOffGradeB * 10}
        y2={top + height}
        stroke="navy"
      />
      {/* cut off Grade C+ */}
      <line
        x1={xOrigin + cutOffGradeCPlus * 10}
        y1={top + 40}
        x2={xOrigin + cutOffGradeCPlus * 10}
        y2={top + height}
        stroke="green"
      />
      {/* cut off Grade C */}
      <line
        x1={xOrigin + cutOffGradeC * 10}
        y1={top + 40}
        x2={xOrigin + cutOffGradeC * 10}
        y2={top + height}
        stroke="yellow"
      />
      {/* cut off Grade D+ */}
      <line
        x1={xOrigin + cutOffGradeDPlus * 10}
        y1={top + 40}
        x2={xOrigin + cutOffGradeDPlus * 10}
        y2={top + height}
        stroke="orange"
      />
      {/* cut off Grade D */}
      <line
        x1={xOrigin + cutOffGradeD * 10}
        y1={top + 40}
        x2={xOrigin + cutOffGradeD * 10}
        y2={top + height}
        stroke="red"
      />
      {/* cut off Grade F */}
      {/* <line
        x1={xOrigin + cutOffGradeF}
        y1={top + 40}
        x2={xOrigin + cutOffGradeF}
        y2={top + height}
        stroke="red"
      /> */}
    </React.Fragment>
  );
}

export default function Grading() {
  const [cutOffGradeA, setCutOffGradeA] = React.useState(80); // ค่าเริ่มต้นของ cut-off grade A
  const [cutOffGradeBPlus, setCutOffGradeBPlus] = React.useState(75); // ค่าเริ่มต้นของ cut-off grade B+
  const [cutOffGradeB, setCutOffGradeB] = React.useState(70); // ค่าเริ่มต้นของ cut-off grade B
  const [cutOffGradeCPlus, setCutOffGradeCPlus] = React.useState(65); // ค่าเริ่มต้นของ cut-off grade C+
  const [cutOffGradeC, setCutOffGradeC] = React.useState(60); // ค่าเริ่มต้นของ cut-off grade C
  const [cutOffGradeDPlus, setCutOffGradeDPlus] = React.useState(55); // ค่าเริ่มต้นของ cut-off grade D+
  const [cutOffGradeD, setCutOffGradeD] = React.useState(50); // ค่าเริ่มต้นของ cut-off grade D

  const { setData } = React.useContext(DataAcrossPages);
  const { data } = React.useContext(DataAcrossPages);

  const [cookies, setCookie] = useCookies();
  const year = cookies["year"];
  const semester = cookies["semester"];
  const crsIDToConfirm = cookies["crsIDToConfirm"];
  const [columns, setColumns] = React.useState([]);
  const [histogramScore, setHistogramScore] = React.useState([]);
  const [scoreInTable, setScoreInTable] = React.useState([]);
  const [secondStorage, setSecondStorage] = React.useState([]);
  const [headerDetail, setHeaderDetail] = React.useState("");

  const [countAmount, setCountAmount] = React.useState({}); // เปลี่ยนการประกาศ countAmount เป็น useState
  const [countAmountMore, setCountAmountMore] = React.useState({}); // เพิ่มการประกาศ useState สำหรับ countAmountMore
  const [dataToCal, setDataToCal] = React.useState([]); // เพิ่มการประกาศ useState สำหรับ dataToCa

  const [moduleScoreModalOpen, setModuleScoreModalOpen] = React.useState(false);
  const [historyCriteriaOpen, setHistoryCriteriaOpen] = React.useState(false);
  const [dataToHistoryModal, setDataToHistoryModal] = React.useState();
  const [version1, setVersion1] = React.useState([]);
  const [version2, setVersion2] = React.useState([]);
  const [version3, setVersion3] = React.useState([]);
  const [focusVersion, setFocusVersion] = React.useState();
  const [versionSendToDB, setVersionSendToDB] = React.useState("1");

  const [historyData, setHistoryData] = React.useState([]);

  const navigate = useNavigate();

  const [storedData, setStoredData] = React.useState([]);

  // React.useEffect(() => {
  //   const storedData = localStorage.getItem("data")
  //   if (storedData) {
  //     setStoredData(JSON.parse(storedData));
  //   }
  // }, []);

  const getHistory = () => {
    axios
      .get(`http://localhost:8000/api/grades/crsID/${crsIDToConfirm}`)
      .then((res) => {
        const yearHistory = res.data.grades.map((item) => item.year);
        const semesterHistory = res.data.grades.map((item) => item.semester);
        const gradeAll = res.data.grades.map((item) => item.gradeAll);
        const isused = res.data.grades.map((item) => item.isused);
        const combinedHistory = yearHistory
          .map((year, index) => {
            if (isused[index] === true) {
              return {
                year,
                semester: semesterHistory[index],
                criteria: gradeAll[index],
              };
            }
            return null; // ถ้า isused เป็น false ให้ return null
          })
          .filter((item) => item !== null); // กรองข้อมูลที่เป็น null ออกไป

        setHistoryData(combinedHistory);
      });
  };

  const getVersion = () => {
    let crsIDtoCheck = [];
    data.slice(0, data.length - 2).find((item) => {
      crsIDtoCheck.push(item.crsID);
    });

    axios
      .get(`http://localhost:8000/api/grades/courses/${crsIDtoCheck[0]}`)
      .then((res) => {
        const grade = res.data.grades;

        grade.map((item) => {
          if (item.version === "1") {
            setVersion1(item.gradeAll);
            setVersionSendToDB("1");
            setFocusVersion(item.gradeAll);
            item.gradeAll.map((grade) => {
              if (grade.cName === "A") {
                setCutOffGradeA(grade.cScore);
              }
              if (grade.cName === "B+") {
                setCutOffGradeBPlus(grade.cScore);
              }
              if (grade.cName === "B") {
                setCutOffGradeB(grade.cScore);
              }
              if (grade.cName === "C+") {
                setCutOffGradeCPlus(grade.cScore);
              }
              if (grade.cName === "C") {
                setCutOffGradeC(grade.cScore);
              }
              if (grade.cName === "D+") {
                setCutOffGradeDPlus(grade.cScore);
              }
              if (grade.cName === "D") {
                setCutOffGradeD(grade.cScore);
              }
            });
            calculateGrade();
          }
          if (item.version === "2") {
            setVersion2(item.gradeAll);
          }
          if (item.version === "3") {
            setVersion3(item.gradeAll);
          }
        });
      });
  };

  React.useEffect(() => {
    getHistory();
    getVersion();
  }, []);

  const sxVersion1 = () => {
    if (version1.length !== 0) {
      if (versionSendToDB === "1") {
        return {
          marginBottom: "11px",
          color: "#FFFFFF",
          backgroundColor: PinkPallette.main,
          "&:hover": { backgroundColor: PinkPallette.light },
        };
      } else {
        return {
          marginBottom: "11px",
          color: "#FFFFFF",
          backgroundColor: GreenPallette.main,
          "&:hover": { backgroundColor: GreenPallette.light },
        };
      }
    } else if (version1.length === 0) {
      if (versionSendToDB === "1") {
        return {
          marginBottom: "11px",
          color: "#FFFFFF",
          backgroundColor: PinkPallette.main,
          "&:hover": { backgroundColor: PinkPallette.light },
        };
      } else {
        return {
          marginBottom: "11px",
          color: "#FFFFFF",
          backgroundColor: GreyPallette.main,
          "&:hover": { backgroundColor: GreyPallette.light },
        };
      }
    }
  };

  const sxVersion2 = () => {
    if (version2.length !== 0) {
      if (versionSendToDB === "2") {
        return {
          marginBottom: "11px",
          color: "#FFFFFF",
          backgroundColor: PinkPallette.main,
          "&:hover": { backgroundColor: PinkPallette.light },
        };
      } else {
        return {
          marginBottom: "11px",
          color: "#FFFFFF",
          backgroundColor: GreenPallette.main,
          "&:hover": { backgroundColor: GreenPallette.light },
        };
      }
    } else if (version2.length === 0) {
      if (versionSendToDB === "2") {
        return {
          marginBottom: "11px",
          color: "#FFFFFF",
          backgroundColor: PinkPallette.main,
          "&:hover": { backgroundColor: PinkPallette.light },
        };
      } else {
        return {
          marginBottom: "11px",
          color: "#FFFFFF",
          backgroundColor: GreyPallette.main,
          "&:hover": { backgroundColor: GreyPallette.light },
        };
      }
    }
  };

  const sxVersion3 = () => {
    if (version3.length !== 0) {
      if (versionSendToDB === "3") {
        return {
          marginBottom: "11px",
          color: "#FFFFFF",
          backgroundColor: PinkPallette.main,
          "&:hover": { backgroundColor: PinkPallette.light },
        };
      } else {
        return {
          marginBottom: "11px",
          color: "#FFFFFF",
          backgroundColor: GreenPallette.main,
          "&:hover": { backgroundColor: GreenPallette.light },
        };
      }
    } else if (version3.length === 0) {
      if (versionSendToDB === "3") {
        return {
          marginBottom: "11px",
          color: "#FFFFFF",
          backgroundColor: PinkPallette.main,
          "&:hover": { backgroundColor: PinkPallette.light },
        };
      } else {
        return {
          marginBottom: "11px",
          color: "#FFFFFF",
          backgroundColor: GreyPallette.main,
          "&:hover": { backgroundColor: GreyPallette.light },
        };
      }
    }
  };

  // historyCriteriaOpen

  const handleModuleScoreModalOpen = () => {
    setModuleScoreModalOpen(true);
  };

  const handleModuleScoreModalClose = () => {
    setModuleScoreModalOpen(false);
  };

  const handleModuleScoreModalSubmit = () => {
    setModuleScoreModalOpen(false);
  };

  const handleHistoryCriteriaOpen = () => {
    setHistoryCriteriaOpen(true);
  };

  const handleHistoryCriteriaClose = () => {
    setHistoryCriteriaOpen(false);
  };

  const handleHistoryCriteriaSubmit = () => {
    setHistoryCriteriaOpen(false);
  };

  const handleHistoryCriteriaClick = (index) => {
    setDataToHistoryModal(historyData[index]);
    handleHistoryCriteriaOpen();
  };

  function getAllScores() {
    axios.get(`http://localhost:8000/api/scores/`).then((res) => {
      const apiScores = res.data.scores;
      // console.log("getAllScores", apiScores);
      const apiData = res.data.scores;

      // รวมคะแนนเต็มของส่วนการให้คะแนนของมอดูลนั้น ๆ
      let marks = {};

      apiData.forEach((item) => {
        const moduleIDs = item.moduleObjectID;
        let fullScoresss = 0;
        data.slice(0, data.length - 2).filter((temp) => {
          if (temp.moduleID === moduleIDs) {
            item.assignments.map((full) => {
              fullScoresss += parseFloat(full.fullScore || 0);
            });
          }
        });
        data.slice(0, data.length - 2).filter((temp) => {
          if (temp.moduleID === moduleIDs) {
            marks[item.moduleObjectID] = fullScoresss.toString();
          }
        });
      });

      // เก็บสัดส่วนคะแนน
      let portionStorage = [];
      apiData.map((item) => {
        const moduleID = item.moduleObjectID;
        const sIDToStore = item.students.map((id) => id.sID);
        let scores_portion = [];
        data.slice(0, data.length - 2).forEach((item) => {
          if (item.moduleID === moduleID) {
            let count = 0;
            if (count < data.length - 1) {
              scores_portion.push({
                moduleID: item.moduleID,
                portion: item.portion,
                sIDs: sIDToStore,
              });
              count++;
            }
          }
        });
        portionStorage.push(scores_portion);
      });

      // เก็บสัดส่วนคะแนนรวมของนิสิตแต่ละคน
      let studentWithSumPortion = [];
      portionStorage.forEach((item) => {
        item.forEach((temp) => {
          temp.sIDs.forEach((id) => {
            const existingStudent = studentWithSumPortion.find(
              (studentItem) => {
                studentItem.SID === id;
              }
            );
            if (existingStudent) {
              existingStudent.sumPortion += parseFloat(temp.portion);
            } else {
              studentWithSumPortion.push({
                SID: id,
                sumPortion: parseFloat(temp.portion),
              });
            }
          });
        });
      });

      // เอาสัดส่วนคะแนนรวมของนิสิตแต่ละคนไว้กับแต่ละมอดูล
      let mergedStudentPortion = [];
      studentWithSumPortion.forEach((student) => {
        // ตรวจสอบว่า SID ของนักเรียนนี้มีอยู่ใน mergedStudentPortion หรือไม่
        const existingStudentIndex = mergedStudentPortion.findIndex(
          (item) => item.SID === student.SID
        );
        if (existingStudentIndex !== -1) {
          // ถ้ามี SID เหมือนกันอยู่แล้วให้เพิ่ม sumPortion เข้าไปในตำแหน่งที่พบ
          mergedStudentPortion[existingStudentIndex].sumPortion +=
            student.sumPortion;
        } else {
          // ถ้าไม่มี SID เหมือนกันใน mergedStudentPortion ให้เพิ่ม object ใหม่เก็บข้อมูลของนักเรียนนั้นๆ
          mergedStudentPortion.push({
            SID: student.SID,
            sumPortion: student.sumPortion,
          });
        }
      });

      // Shaped ข้อมูลเพื่อแสดงผลบนตาราง
      const formattedData = [];
      let calTotScore = 0;

      apiScores.forEach((apiScore) => {
        // หา moduleID จาก API
        const moduleIDs = apiScore.moduleObjectID;
        // ค้นหาข้อมูลที่มี moduleID เหมือนกับข้อมูลใน API ใน
        const relevantData = [];
        data.slice(0, data.length - 2).filter((item) => {
          item.moduleID === moduleIDs;
          relevantData.push(item);
        });
        if (relevantData) {
          apiScore.students.forEach((student) => {
            const studentData = data[data.length - 2].find(
              (item) => item.SID === student.sID
            ); // ค้นหาข้อมูลนักเรียนที่เกี่ยวข้องกับ SID ในตัวแปร data
            const modulePortion = data[data.length - 1];
            if (studentData) {
              const mergedStudent = mergedStudentPortion.find(
                (item) => item.SID === studentData.SID
              );
              if (mergedStudent) {
                const checking = student.totalScore;
                relevantData.map((item) => {
                  if (moduleIDs === item.moduleID) {
                    if (!isNaN(checking)) {
                      calTotScore =
                        ((student.totalScore / parseFloat(marks[moduleIDs])) *
                          100 *
                          item.portion) /
                        parseFloat(mergedStudent.sumPortion);
                    } else if (isNaN(checking)) {
                      calTotScore = student.totalScore;
                    }
                  }
                });
              }
              if (mergedStudent.sumPortion === parseFloat(modulePortion)) {
                relevantData.map((item) => {
                  if (moduleIDs === item.moduleID) {
                    if (!isNaN(calTotScore)) {
                      const rowData = {
                        SID: studentData.SID,
                        studentName: studentData.studentName,
                        [item.moduleName]: calTotScore.toFixed(2) || 0,
                        // sumPortion: parseFloat(modulePortion),
                      };
                      // เช็คว่า formattedData มีข้อมูลของนักเรียนนี้อยู่แล้วหรือไม่
                      const existingStudentIndex = formattedData.findIndex(
                        (item) => item.SID === rowData.SID
                      );
                      if (existingStudentIndex !== -1) {
                        formattedData[existingStudentIndex][item.moduleName] =
                          calTotScore.toFixed(2) || 0;
                      } else {
                        formattedData.push(rowData);
                      }
                    } else {
                      const rowData = {
                        SID: studentData.SID,
                        studentName: studentData.studentName,
                        [item.moduleName]: calTotScore || 0, // ใช้ชื่อโมดูลเป็น key ในการเก็บคะแนน
                      };
                      // เช็คว่า formattedData มีข้อมูลของนักเรียนนี้อยู่แล้วหรือไม่
                      const existingStudentIndex = formattedData.findIndex(
                        (item) => item.SID === rowData.SID
                      );
                      if (existingStudentIndex !== -1) {
                        formattedData[existingStudentIndex][item.moduleName] =
                          calTotScore || 0;
                      } else {
                        formattedData.push(rowData);
                      }
                    }
                  }
                });
              } else if (mergedStudent.sumPortion > parseFloat(modulePortion)) {
                relevantData.map((item) => {
                  if (moduleIDs === item.moduleID) {
                    if (!isNaN(calTotScore)) {
                      const rowData = {
                        SID: studentData.SID,
                        studentName: studentData.studentName,
                        [item.moduleName]: calTotScore.toFixed(2) || 0,
                        // sumPortion: parseFloat(modulePortion),
                      };
                      // เช็คว่า formattedData มีข้อมูลของนักเรียนนี้อยู่แล้วหรือไม่
                      const existingStudentIndex = formattedData.findIndex(
                        (item) => item.SID === rowData.SID
                      );
                      if (existingStudentIndex !== -1) {
                        formattedData[existingStudentIndex][item.moduleName] =
                          calTotScore.toFixed(2) || 0;
                      } else {
                        formattedData.push(rowData);
                      }
                    } else {
                      const rowData = {
                        SID: studentData.SID,
                        studentName: studentData.studentName,
                        [item.moduleName]: calTotScore || 0, // ใช้ชื่อโมดูลเป็น key ในการเก็บคะแนน
                      };
                      // เช็คว่า formattedData มีข้อมูลของนักเรียนนี้อยู่แล้วหรือไม่
                      const existingStudentIndex = formattedData.findIndex(
                        (item) => item.SID === rowData.SID
                      );
                      if (existingStudentIndex !== -1) {
                        formattedData[existingStudentIndex][item.moduleName] =
                          calTotScore || 0;
                      } else {
                        formattedData.push(rowData);
                      }
                    }
                  }
                });
              } else if (mergedStudent.sumPortion < parseFloat(modulePortion)) {
                relevantData.map((item) => {
                  if (moduleIDs === item.moduleID) {
                    const rowData = {
                      SID: studentData.SID,
                      studentName: studentData.studentName,
                      [item.moduleName]: "X", // ใช้ชื่อโมดูลเป็น key ในการเก็บคะแนน
                      // sumPortion: parseFloat(modulePortion),
                    };

                    // เช็คว่า formattedData มีข้อมูลของนักเรียนนี้อยู่แล้วหรือไม่
                    const existingStudentIndex = formattedData.findIndex(
                      (item) => item.SID === rowData.SID
                    );
                    if (existingStudentIndex !== -1) {
                      formattedData[existingStudentIndex][item.moduleName] =
                        calTotScore || 0;
                    } else {
                      formattedData.push(rowData);
                    }
                  }
                });
              }
            } else {
              return;
            }
          });
        } else {
          console.log("No relevant data found for moduleID:");
        }
      });
      console.log("formattedData", formattedData);
      setScoreInTable(formattedData);
      setSecondStorage(formattedData);
      // });
    });
  }

  React.useEffect(() => {
    // if (data.length !== 0) {
    //   console.log("มี", localStorage.getItem("data"));
    //   const storedDataBefore = localStorage.getItem("data");
    //   if (storedDataBefore) {
    //     // console.log("เข้าจ้า", storedData);
    //     setStoredData(JSON.parse(storedDataBefore));
    //   }
    //   if (storedData.length > 0) {
    //     console.log("ทำได้", storedData);
    getAllScores();
    // } else console.log("เออเร่อ");
    // }
  }, []);

  // let moduleIDByName = {};
  // data.slice(0, data.length - 2).forEach((item) => {
  //   moduleIDByName[item.moduleName] = item.moduleID;
  // });

  const [moduleIDByName, setModuleIDByName] = React.useState({});
  React.useEffect(() => {
    const updatedModuleIDByName = {};
    data.slice(0, data.length - 2).forEach((item) => {
      updatedModuleIDByName[item.moduleName] = item.moduleID;
    });
    setModuleIDByName(updatedModuleIDByName);
  }, [data]);

  const dataMap = new Map();
  histogramScore.map((value) => {
    dataMap.set(value, (dataMap.get(value) || 0) + 1);
  });

  const newAmount = () => {
    const dataMap = new Map();
    histogramScore.map((value) => {
      dataMap.set(value, (dataMap.get(value) || 0) + 1);
    });

    const newCountAmount = {};
    const newCountAmountMore = {};

    histogramScore.forEach((value) => {
      const grade = calculateGradeFromScore(value);
      if (["I", "M", "W", "S", "U", "V"].includes(grade)) {
        newCountAmountMore[grade] = (newCountAmountMore[grade] || 0) + 1 || 0;
      } else {
        newCountAmount[grade] = (newCountAmount[grade] || 0) + 1 || 0;
      }
    });

    // อัพเดต state ของ countAmount และ countAmountMore
    setCountAmount(newCountAmount);
    // setCountAmountMore(newCountAmountMore);

    // อัพเดต state ของ dataToCal
  };

  React.useEffect(() => {
    // ใช้ useEffect เพื่อคำนวณ countAmount และ countAmountMore เมื่อ histogramScore มีการเปลี่ยนแปลง
    const calculateCounts = () => {
      const newCountAmount = {};
      const newCountAmountMore = {};

      histogramScore.forEach((value) => {
        const grade = calculateGradeFromScore(value);

        if (["I", "M", "W", "S", "U", "V"].includes(grade)) {
          newCountAmountMore[grade] = (newCountAmountMore[grade] || 0) + 1 || 0;
        } else {
          newCountAmount[grade] = (newCountAmount[grade] || 0) + 1 || 0;
        }
      });

      // อัพเดต state ของ countAmount และ countAmountMore
      setCountAmount(newCountAmount);
      setCountAmountMore(newCountAmountMore);

      // อัพเดต state ของ dataToCal
      setDataToCal(histogramScore.filter((value) => typeof value === "number"));
    };

    calculateCounts();
  }, [histogramScore]); // useEffect จะทำงานเมื่อ histogramScore เปลี่ยนแปลง

  // ต่อด้วยโค้ดอื่น ๆ ที่ใช้ countAmount, countAmountMore และ dataToCal ในโค้ดอื่น ๆ ตามปกติ

  let sumCountAmount = 0;
  let sumCountAmountMore = 0;
  for (let key in countAmount) {
    sumCountAmount += countAmount[key];
  }
  for (let key in countAmountMore) {
    sumCountAmountMore += countAmountMore[key];
  }

  const totalAmount = sumCountAmount + sumCountAmountMore;

  const percentAmount = {};
  const percentAmountMore = {};

  for (let key in countAmount) {
    percentAmount[key] = ((countAmount[key] / totalAmount) * 100).toFixed(2);
  }
  for (let key in countAmountMore) {
    percentAmountMore[key] = (
      (countAmountMore[key] / totalAmount) *
      100
    ).toFixed(2);
  }

  const sumPercentAmount = Object.values(percentAmount).reduce(
    (acc, curr) => acc + parseFloat(curr),
    0
  );

  const sumPercentAmountMore = Object.values(percentAmountMore).reduce(
    (acc, curr) => acc + parseFloat(curr),
    0
  );

  const totalPercentAmount = sumPercentAmount + sumPercentAmountMore;

  let meanGrade = 0;
  for (let key in countAmount) {
    if (key === "A") {
      meanGrade += countAmount[key] * 4;
    } else if (key === "B+") {
      meanGrade += countAmount[key] * 3.5;
    } else if (key === "B") {
      meanGrade += countAmount[key] * 3;
    } else if (key === "C+") {
      meanGrade += countAmount[key] * 2.5;
    } else if (key === "C") {
      meanGrade += countAmount[key] * 2;
    } else if (key === "D+") {
      meanGrade += countAmount[key] * 1.5;
    } else if (key === "D") {
      meanGrade += countAmount[key] * 1;
    }
  }

  let totalAmountWithLetterGrade = 0;
  for (let key in countAmount) {
    if (
      key === "A" ||
      key === "B+" ||
      key === "B" ||
      key === "C+" ||
      key === "C" ||
      key === "D+" ||
      key === "D" ||
      key === "F"
    ) {
      totalAmountWithLetterGrade += countAmount[key];
    }
  }
  // กรองค่าที่ไม่ใช่ตัวเลขออกไป
  const numericScores = dataToCal.filter((value) => typeof value === "number");

  // หาค่า Max (ค่าสูงสุด)
  const maxScore = Math.max(...numericScores);

  // หาค่า Min (ค่าต่ำสุด)
  const minScore = Math.min(...numericScores);

  // หาค่า Mean (ค่าเฉลี่ย)
  const meanScore =
    numericScores.reduce((acc, curr) => acc + curr, 0) / numericScores.length;

  // หาค่า Standard Deviation (SD - ค่าเบี่ยงเบนมาตรฐาน)
  const mean =
    numericScores.reduce((acc, curr) => acc + curr, 0) / numericScores.length;
  const sd = Math.sqrt(
    numericScores.reduce((acc, curr) => acc + (curr - mean) ** 2, 0) /
      numericScores.length
  );

  function calculateGradeFromScore(score) {
    if (score >= cutOffGradeA) return "A";
    else if (score >= cutOffGradeBPlus) return "B+";
    else if (score >= cutOffGradeB) return "B";
    else if (score >= cutOffGradeCPlus) return "C+";
    else if (score >= cutOffGradeC) return "C";
    else if (score >= cutOffGradeDPlus) return "D+";
    else if (score >= cutOffGradeD) return "D";
    else if (score === "I") return "I";
    else if (score === "M") return "M";
    else if (score === "W") return "W";
    else if (score === "S") return "S";
    else if (score === "U") return "U";
    else if (score === "V") return "V";
    else if (score === "X") return "X";
    else return "F";
  }
  // สร้างแกน X ที่แสดงคะแนน 1 ถึง 100
  const xAxisData = Array.from({ length: 100 }, (_, i) => (i + 1).toString()); // สร้างเลขคะแนน 1 ถึง 100
  // แมปข้อมูลจำนวนที่ซ้ำตามคะแนนในแกน X
  const histogramData = xAxisData.map(
    (score) => dataMap.get(parseInt(score)) || 0
  ); // ใช้ Math.floor() เพื่อแปลงเป็นจำนวนนับ

  React.useEffect(() => {
    if (!data) return;
    // สร้าง columns ที่มีหัวตารางเป็นชื่อ moduleName
    const uniqueModuleNames = data
      .slice(0, data.length - 2)
      .map((item) => item.moduleName);
    const moduleNameColumns = uniqueModuleNames.map((moduleName) => ({
      accessorKey: moduleName,
      header: moduleName,
      size: 100,
      enableSorting: false,
      enableColumnActions: true,
      renderColumnActionsMenuItems: ({ closeMenu }) => (
        <MenuItem
          key={1}
          onClick={() => {
            handleHeaderClick(moduleName);
            closeMenu();
          }}
        >
          ดูคะแนน
        </MenuItem>
      ),
    }));

    setColumns([
      {
        accessorKey: "rowNumbers",
        size: 10,
        Cell: ({ row }) => row.index + 1,
        enableColumnPinning: true,
        enableSorting: false,
        enableColumnActions: false,
      },
      {
        accessorKey: "studentName",
        header: "ชื่อ-นามสกุล",
        size: 50,
        enableSorting: true,
        enableColumnActions: false,
      },
      {
        accessorKey: "SID",
        header: "รหัสนิสิต",
        size: 80,
        disableSortBy: true,
        enableColumnActions: false,
      },
      ...moduleNameColumns, // เพิ่ม columns ที่สร้างจาก moduleName ที่ได้จาก dat
      {
        accessorKey: "calculatedTotalScore",
        header: "total",
        size: 100,
        enableColumnActions: false,
        muiTableBodyCellProps: {
          align: "center",
        },
      },
      {
        accessorKey: "roundedTotalScore",
        header: "rounded",
        size: 100,
        enableColumnActions: false,
        muiTableBodyCellProps: {
          align: "center",
        },
      },
      {
        accessorKey: "studentGrade",
        header: "grade",
        size: 80,
        enableColumnActions: false,
        muiTableBodyCellProps: {
          align: "center",
        },
        Cell: ({ renderedCellValue }) => (
          <Box
            component="span"
            sx={{
              backgroundColor: ["I", "M", "W", "S", "U", "V", "X"].includes(
                renderedCellValue
              )
                ? "red"
                : "transparent",
            }}
          >
            <span>{renderedCellValue}</span>
          </Box>
        ),
      },
    ]);
  }, [data]);

  // ฟังก์ชันคำนวณเกรด
  function calculateGrade() {
    const newData = []; // เก็บข้อมูลใหม่ที่จะเปลี่ยนแปล
    let scoreUseInHistogram = [];
    let countLoop = 0;

    secondStorage.forEach((studentData) => {
      const newRow = { ...studentData }; // สำเนาข้อมูลนักเรียน
      let totalCalScore = 0;
      let totalRoundScore = 0;
      let totalScoreHistogram = 0;
      let histogramScoreStorage = [];
      let totScoreStorage = [];
      let roundScoreStorage = [];
      // หาคะแนนรวมและคะแนนเต็มของนักเรียน
      Object.keys(studentData).forEach((key) => {
        if (
          key !== "SID" &&
          key !== "studentName" &&
          key !== "studentGrade" &&
          key !== "sumPortion"
        ) {
          if (countLoop <= secondStorage.length) {
            const score = parseFloat(studentData[key]);
            if (!isNaN(score)) {
              totalCalScore += parseFloat(studentData[key]);
              totalRoundScore += parseFloat(studentData[key]);
              totalScoreHistogram += parseFloat(studentData[key]);
            } else {
              totScoreStorage.push(studentData[key]);
              roundScoreStorage.push(studentData[key]);
            }
          }
        }
      });
      histogramScoreStorage.push(Math.round(totalScoreHistogram));
      totScoreStorage.push(totalCalScore.toFixed(2));
      roundScoreStorage.push(Math.round(totalRoundScore));
      if (!isNaN(totScoreStorage[0])) {
        scoreUseInHistogram.push(Math.round(totScoreStorage[0]));
      } else {
        scoreUseInHistogram.push(totScoreStorage[0]);
      }
      // คำนวณเกรด
      let grade = ""; // เกรด
      if (Math.round(totalCalScore) >= cutOffGradeA) grade = "A";
      else if (Math.round(totalCalScore) >= cutOffGradeBPlus) grade = "B+";
      else if (Math.round(totalCalScore) >= cutOffGradeB) grade = "B";
      else if (Math.round(totalCalScore) >= cutOffGradeCPlus) grade = "C+";
      else if (Math.round(totalCalScore) >= cutOffGradeC) grade = "C";
      else if (Math.round(totalCalScore) >= cutOffGradeDPlus) grade = "D+";
      else if (Math.round(totalCalScore) >= cutOffGradeD) grade = "D";
      else {
        // เพิ่มเงื่อนไขสำหรับคะแนนที่เป็น I, W, M, S, U, V
        if (totScoreStorage[0] === "I") grade = "I";
        else if (totScoreStorage[0] === "W") grade = "W";
        else if (totScoreStorage[0] === "M") grade = "M";
        else if (totScoreStorage[0] === "S") grade = "S";
        else if (totScoreStorage[0] === "U") grade = "U";
        else if (totScoreStorage[0] === "V") grade = "V";
        else grade = "F";
      }
      newRow["studentGrade"] = grade; // เซ็ตเกรดให้กับข้อมูลใหม่
      newRow["roundedTotalScore"] = roundScoreStorage[0];
      newRow["calculatedTotalScore"] = totScoreStorage[0];

      newData.push(newRow); // เพิ่มข้อมูลใหม่เข้าไปใน newData

      countLoop++;
    });
    setHistogramScore(scoreUseInHistogram);
    setScoreInTable(newData); // เซ็ตข้อมูลใหม่ให้กับ state
  }
  React.useEffect(() => {
    calculateGrade();
  }, [secondStorage]);

  const handleHeaderClick = (moduleName) => {
    let id = "";
    const splitModuleName = moduleName.split("_");
    if (moduleName !== "") {
      Object.keys(moduleIDByName).forEach((key) => {
        const value = key.split("_");
        console.log(moduleIDByName);

        if (value.length > 2) {
          if (
            value.slice(0, value.length - 1).join("_") ===
            splitModuleName.slice(0, value.length - 1).join("_")
          ) {
            id = moduleIDByName[value.slice(0, value.length - 1).join("_")];
          }
        }
        if (value.length === 2) {
          if (value[0] === splitModuleName[0]) {
            id = moduleIDByName[key];
          }
        }
      });
    }
    setHeaderDetail(id);
    handleModuleScoreModalOpen();
  };

  const handleSaveVersionButtonClick = (version) => {
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
    let modulesWithPortion = [];

    data.slice(0, data.length - 2).forEach((item) => {
      modulesWithPortion.push({
        moduleID: item.moduleID,
        proportion: item.portion,
      });
    });

    let studentData = [];
    scoreInTable.forEach((item) => {
      let moduleOnly = {};

      Object.keys(item).forEach((key) => {
        if (
          key !== "SID" &&
          key !== "studentName" &&
          key !== "studentGrade" &&
          key !== "calculatedTotalScore" &&
          key !== "roundedTotalScore" &&
          key !== "sumPortion"
        ) {
          moduleOnly[key] = item[key];
        }
      });

      studentData.push({
        sID: item.SID,
        sName: item.studentName,
        totalScore: item.calculatedTotalScore,
        roundScore: item.roundedTotalScore,
        totalGrade: item.studentGrade,
        scoreModule: moduleOnly,
      });
    });
    let crsID = [];
    data.slice(0, data.length - 2).find((item) => {
      crsID.push(item.crsID);
    });
    const shapedData = {
      courses: crsID[0],
      crsID: crsIDToConfirm[0],
      modules: modulesWithPortion,
      students: studentData,
      gradeAll: [
        {
          cName: "A",
          cScore: cutOffGradeA,
          sAmount: countAmount.A,
          sPercent: percentAmount.A,
        },
        {
          cName: "B+",
          cScore: cutOffGradeBPlus,
          sAmount: countAmount["B+"],
          sPercent: percentAmount["B+"],
        },
        {
          cName: "B",
          cScore: cutOffGradeB,
          sAmount: countAmount.B,
          sPercent: percentAmount.B,
        },
        {
          cName: "C+",
          cScore: cutOffGradeCPlus,
          sAmount: countAmount["C+"],
          sPercent: percentAmount["C+"],
        },
        {
          cName: "C",
          cScore: cutOffGradeC,
          sAmount: countAmount.C,
          sPercent: percentAmount.C,
        },
        {
          cName: "D+",
          cScore: cutOffGradeDPlus,
          sAmount: countAmount["D+"],
          sPercent: percentAmount["D+"],
        },
        {
          cName: "D",
          cScore: cutOffGradeD,
          sAmount: countAmount.D,
          sPercent: percentAmount.D,
        },
        {
          cName: "F",
          sAmount: countAmount.F,
          sPercent: percentAmount.F,
        },
        {
          cName: "I",
          sAmount: countAmountMore.I,
          sPercent: percentAmountMore.I,
        },
        {
          cName: "M",
          sAmount: countAmountMore.M,
          sPercent: percentAmountMore.M,
        },
        {
          cName: "W",
          sAmount: countAmountMore.W,
          sPercent: percentAmountMore.W,
        },
        {
          cName: "S",
          sAmount: countAmountMore.S,
          sPercent: percentAmountMore.S,
        },
        {
          cName: "U",
          sAmount: countAmountMore.U,
          sPercent: percentAmountMore.V,
        },
        {
          cName: "V",
          sAmount: countAmountMore.V,
          sPercent: percentAmountMore.V,
        },
      ],
      version: version,
      isused: false,
      year: year,
      semester: semesterValue,
    };

    axios
      .post(`http://localhost:8000/api/grades/`, shapedData)
      .then((res) => {
        console.log("success", res.data);
        getVersion();
        getAllScores;
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  // ฟังก์ชันคำนวณเกรด
  function calGradeAfterChangeCriteria() {
    const newData = []; // เก็บข้อมูลใหม่ที่จะเปลี่ยนแปล
    let scoreUseInHistogram = [];
    let countLoop = 0;

    secondStorage.forEach((studentData) => {
      const newRow = { ...studentData }; // สำเนาข้อมูลนักเรียน
      let totalCalScore = 0;
      let totalRoundScore = 0;
      let totalScoreHistogram = 0;
      let histogramScoreStorage = [];
      let totScoreStorage = [];
      let roundScoreStorage = [];
      // หาคะแนนรวมและคะแนนเต็มของนักเรียน
      Object.keys(studentData).forEach((key) => {
        if (
          key !== "SID" &&
          key !== "studentName" &&
          key !== "studentGrade" &&
          key !== "sumPortion"
        ) {
          if (countLoop <= secondStorage.length) {
            const score = parseFloat(studentData[key]);
            if (!isNaN(score)) {
              totalCalScore += parseFloat(studentData[key]);
              totalRoundScore += parseFloat(studentData[key]);
              totalScoreHistogram += parseFloat(studentData[key]);
            } else {
              totScoreStorage.push(studentData[key]);
              roundScoreStorage.push(studentData[key]);
              histogramScoreStorage.push(studentData[key]);
            }
          }
        }
      });
      histogramScoreStorage.push(Math.round(totalScoreHistogram));
      totScoreStorage.push(totalCalScore.toFixed(2));
      roundScoreStorage.push(Math.round(totalRoundScore));
      if (!isNaN(totScoreStorage[0])) {
        scoreUseInHistogram.push(Math.round(totScoreStorage[0]));
      } else {
        scoreUseInHistogram.push(totScoreStorage[0]);
      }
      // คำนวณเกร
      let grade = ""; // เกรด
      if (Math.round(totalCalScore) >= cutOffGradeA) grade = "A";
      else if (Math.round(totalCalScore) >= cutOffGradeBPlus) grade = "B+";
      else if (Math.round(totalCalScore) >= cutOffGradeB) grade = "B";
      else if (Math.round(totalCalScore) >= cutOffGradeCPlus) grade = "C+";
      else if (Math.round(totalCalScore) >= cutOffGradeC) grade = "C";
      else if (Math.round(totalCalScore) >= cutOffGradeDPlus) grade = "D+";
      else if (Math.round(totalCalScore) >= cutOffGradeD) grade = "D";
      else {
        // เพิ่มเงื่อนไขสำหรับคะแนนที่เป็น I, W, M, S, U, V
        if (totScoreStorage[0] === "I") grade = "I";
        else if (totScoreStorage[0] === "W") grade = "W";
        else if (totScoreStorage[0] === "M") grade = "M";
        else if (totScoreStorage[0] === "S") grade = "S";
        else if (totScoreStorage[0] === "U") grade = "U";
        else if (totScoreStorage[0] === "V") grade = "V";
        else grade = "F";
      }
      newRow["studentGrade"] = grade; // เซ็ตเกรดให้กับข้อมูลใหม
      newRow["roundedTotalScore"] = roundScoreStorage[0];
      newRow["calculatedTotalScore"] = totScoreStorage[0];

      newData.push(newRow); // เพิ่มข้อมูลใหม่เข้าไปใน newData

      countLoop++;
    });
    setHistogramScore(scoreUseInHistogram);
    setScoreInTable(newData); // เซ็ตข้อมูลใหม่ให้กับ state
  }
  const handleSaveCutOffButton = () => {
    setCutOffGradeA(cutOffGradeA);
    setCutOffGradeBPlus(cutOffGradeBPlus);
    setCutOffGradeB(cutOffGradeB);
    setCutOffGradeCPlus(cutOffGradeCPlus);
    setCutOffGradeC(cutOffGradeC);
    setCutOffGradeDPlus(cutOffGradeDPlus);
    setCutOffGradeD(cutOffGradeD);
    calGradeAfterChangeCriteria();
    newAmount();
  };
  const table = useMaterialReactTable({
    columns,
    data: scoreInTable,
    enableColumnPinning: true,
    paginationDisplayMode: "pages",

    initialState: {
      columnPinning: {
        left: ["rowNumbers", "SID", "studentName"],
        right: ["calculatedTotalScore", "roundedTotalScore", "studentGrade"],
      },
    },
  });

  const handleNextButtonClick = () => {
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
    let modulesWithPortion = [];

    let crsIDtoCheck = [];
    data.slice(0, data.length - 2).find((item) => {
      crsIDtoCheck.push(item.crsID);
    });
    data.slice(0, data.length - 2).forEach((item) => {
      modulesWithPortion.push({
        moduleID: item.moduleID,
        proportion: item.portion,
      });
    });

    let studentData = [];
    scoreInTable.forEach((item) => {
      let moduleOnly = {};

      Object.keys(item).forEach((key) => {
        if (
          key !== "SID" &&
          key !== "studentName" &&
          key !== "studentGrade" &&
          key !== "calculatedTotalScore" &&
          key !== "roundedTotalScore" &&
          key !== "sumPortion"
        ) {
          moduleOnly[key] = item[key];
        }
      });

      studentData.push({
        sID: item.SID,
        sName: item.studentName,
        totalScore: item.calculatedTotalScore,
        roundScore: item.roundedTotalScore,
        totalGrade: item.studentGrade,
        scoreModule: moduleOnly,
      });
    });
    console.log("studentData", studentData);
    let crsID = [];
    data.slice(0, data.length - 2).find((item) => {
      crsID.push(item.crsID);
    });
    const shapedData = {
      courses: crsID[0],
      crsID: crsIDToConfirm[0],
      modules: modulesWithPortion,
      students: studentData,
      gradeAll: [
        {
          cName: "A",
          cScore: cutOffGradeA,
          sAmount: countAmount.A,
          sPercent: percentAmount.A,
        },
        {
          cName: "B+",
          cScore: cutOffGradeBPlus,
          sAmount: countAmount["B+"],
          sPercent: percentAmount["B+"],
        },
        {
          cName: "B",
          cScore: cutOffGradeB,
          sAmount: countAmount.B,
          sPercent: percentAmount.B,
        },
        {
          cName: "C+",
          cScore: cutOffGradeCPlus,
          sAmount: countAmount["C+"],
          sPercent: percentAmount["C+"],
        },
        {
          cName: "C",
          cScore: cutOffGradeC,
          sAmount: countAmount.C,
          sPercent: percentAmount.C,
        },
        {
          cName: "D+",
          cScore: cutOffGradeDPlus,
          sAmount: countAmount["D+"],
          sPercent: percentAmount["D+"],
        },
        {
          cName: "D",
          cScore: cutOffGradeD,
          sAmount: countAmount.D,
          sPercent: percentAmount.D,
        },
        {
          cName: "F",
          sAmount: countAmount.F,
          sPercent: percentAmount.F,
        },
        {
          cName: "I",
          sAmount: countAmountMore.I,
          sPercent: percentAmountMore.I,
        },
        {
          cName: "M",
          sAmount: countAmountMore.M,
          sPercent: percentAmountMore.M,
        },
        {
          cName: "W",
          sAmount: countAmountMore.W,
          sPercent: percentAmountMore.W,
        },
        {
          cName: "S",
          sAmount: countAmountMore.S,
          sPercent: percentAmountMore.S,
        },
        {
          cName: "U",
          sAmount: countAmountMore.U,
          sPercent: percentAmountMore.V,
        },
        {
          cName: "V",
          sAmount: countAmountMore.V,
          sPercent: percentAmountMore.V,
        },
      ],
      isused: true,
      year: year,
      semester: semesterValue,
    };

    let mergedPackedDatas = {};

    mergedPackedDatas["scoreInTable"] = scoreInTable;
    mergedPackedDatas["shapedData"] = shapedData;
    mergedPackedDatas["crsID"] = crsIDtoCheck[0];

    setData(mergedPackedDatas);
    setCookie("packedData", mergedPackedDatas);
    navigate("/confirmScore");
  };

  return (
    <div
      style={{
        maxWidth: "auto",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          // paddingLeft: "10%",
          // paddingRight: "10%",
        }}
      >
        <BarChart
          width={1100}
          height={550}
          series={[{ data: histogramData, label: "จำนวนนักเรียน" }]}
          xAxis={[
            {
              data: xAxisData,
              scaleType: "band",
              tickPlacement: "middle",
            },
          ]}
        />

        <OverlayContainer>
          {" "}
          {/* ส่วนทับ */}
          <ResponsiveChartContainer
            margin={{ top: 5, left: 5, right: 5, bottom: 5 }}
            height={500}
            series={
              [
                // {
                //   type: "line",
                //   data: y, // ใช้ข้อมูลแกน Y ที่คุณสร้างขึ้นเป็นเส้นตรงแนวตั้ง
                // },
              ]
            }
            xAxis={[{ data: y, scaleTyxpe: "linear", min: -0.492, max: 3 }]} // ไม่ได้ใช้ข้อมูล X เนื่องจากต้องการเส้นตรงแนวตั้งเท่านั้น
            yAxis={[{ min: -2, max: 2 }]}
          >
            <CartesianAxis
              cutoff={{
                cutOffGradeA: cutOffGradeA,
                cutOffGradeBPlus: cutOffGradeBPlus,
                cutOffGradeB: cutOffGradeB,
                cutOffGradeCPlus: cutOffGradeCPlus,
                cutOffGradeC: cutOffGradeC,
                cutOffGradeDPlus: cutOffGradeDPlus,
                cutOffGradeD: cutOffGradeD,
              }}
            />
            <LinePlot />
          </ResponsiveChartContainer>
        </OverlayContainer>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          // paddingLeft: "10%",
          // paddingRight: "10%",
        }}
      >
        <Grid container spacing={2} paddingBottom={2}>
          <Grid item xs={4} md={5}>
            <Item
              style={{
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                width: 450,
              }}
            >
              <Grid container spacing={1}>
                <Grid item md={2}>
                  <Typography
                    sx={{ display: "flex", justifyContent: "center" }}
                  >
                    เกรด
                  </Typography>
                </Grid>
                <Grid
                  item
                  md={4}
                  sx={{ display: "flex", flexDirection: "row" }}
                >
                  <Typography>เกณฑ์คะแนน</Typography>
                  <IconButton
                    color="success"
                    sx={{ marginTop: -2.5 }}
                    onClick={() => {
                      // setOriginalCountAmountMore();
                      handleSaveCutOffButton();
                    }}
                  >
                    <SaveIcon />
                  </IconButton>
                </Grid>
                <Grid item md={3}>
                  <Typography>
                    จำนวน <br />
                    (คน)
                  </Typography>
                </Grid>
                <Grid item md={3}>
                  <Typography>
                    คิดเป็น <br />
                    (%)
                  </Typography>
                </Grid>
              </Grid>
              <Grid container spacing={2} paddingTop={1}>
                <Grid item md={2}>
                  <Typography sx={{ paddingTop: "10px" }}>A</Typography>
                </Grid>
                <Grid item md={4}>
                  <TextField
                    size="small"
                    placeholder="00.00"
                    value={cutOffGradeA}
                    onChange={(event) => {
                      setCutOffGradeA(event.target.value);
                    }}
                    sx={{ width: "75px" }}
                  />
                </Grid>
                <Grid item md={3}>
                  <Typography sx={{ paddingTop: "10px" }}>
                    {countAmount.A}
                  </Typography>
                </Grid>
                <Grid item md={3}>
                  <Typography sx={{ paddingTop: "10px" }}>
                    {percentAmount.A}
                  </Typography>
                </Grid>
              </Grid>

              <Grid container spacing={2} paddingTop={1}>
                <Grid item xs={2}>
                  <Typography sx={{ paddingTop: "10px", paddingLeft: "7px" }}>
                    B+
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    size="small"
                    placeholder="00.00"
                    value={cutOffGradeBPlus}
                    onChange={(event) => {
                      setCutOffGradeBPlus(event.target.value);
                    }}
                    sx={{ width: "75px" }}
                  />
                </Grid>
                <Grid item xs={3}>
                  <Typography sx={{ paddingTop: "10px" }}>
                    {countAmount["B+"]}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography sx={{ paddingTop: "10px" }}>
                    {percentAmount["B+"]}
                  </Typography>
                </Grid>
              </Grid>

              <Grid container spacing={2} paddingTop={1}>
                <Grid item xs={2}>
                  <Typography sx={{ paddingTop: "10px" }}>B</Typography>
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    size="small"
                    placeholder="00.00"
                    value={cutOffGradeB}
                    onChange={(event) => {
                      setCutOffGradeB(event.target.value);
                    }}
                    sx={{ width: "75px" }}
                  />
                </Grid>
                <Grid item xs={3}>
                  <Typography sx={{ paddingTop: "10px" }}>
                    {countAmount.B}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography sx={{ paddingTop: "10px" }}>
                    {percentAmount.B}
                  </Typography>
                </Grid>
              </Grid>

              <Grid container spacing={2} paddingTop={1}>
                <Grid item xs={2}>
                  <Typography sx={{ paddingTop: "10px", paddingLeft: "7px" }}>
                    C+
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    size="small"
                    placeholder="00.00"
                    value={cutOffGradeCPlus}
                    onChange={(event) => {
                      setCutOffGradeCPlus(event.target.value);
                    }}
                    sx={{ width: "75px" }}
                  />
                </Grid>
                <Grid item xs={3}>
                  <Typography sx={{ paddingTop: "10px" }}>
                    {countAmount["C+"]}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography sx={{ paddingTop: "10px" }}>
                    {percentAmount["C+"]}
                  </Typography>
                </Grid>
              </Grid>

              <Grid container spacing={2} paddingTop={1}>
                <Grid item xs={2}>
                  <Typography sx={{ paddingTop: "10px" }}>C</Typography>
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    size="small"
                    placeholder="00.00"
                    value={cutOffGradeC}
                    onChange={(event) => {
                      setCutOffGradeC(event.target.value);
                    }}
                    sx={{ width: "75px" }}
                  />
                </Grid>
                <Grid item xs={3}>
                  <Typography sx={{ paddingTop: "10px" }}>
                    {countAmount.C}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography sx={{ paddingTop: "10px" }}>
                    {percentAmount.C}
                  </Typography>
                </Grid>
              </Grid>

              <Grid container spacing={2} paddingTop={1}>
                <Grid item xs={2}>
                  <Typography sx={{ paddingTop: "10px", paddingLeft: "7px" }}>
                    D+
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    size="small"
                    placeholder="00.00"
                    value={cutOffGradeDPlus}
                    onChange={(event) => {
                      setCutOffGradeDPlus(event.target.value);
                    }}
                    sx={{ width: "75px" }}
                  />
                </Grid>
                <Grid item xs={3}>
                  <Typography sx={{ paddingTop: "10px" }}>
                    {countAmount["D+"]}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography sx={{ paddingTop: "10px" }}>
                    {percentAmount["D+"]}
                  </Typography>
                </Grid>
              </Grid>

              <Grid container spacing={2} paddingTop={1}>
                <Grid item xs={2}>
                  <Typography sx={{ paddingTop: "10px" }}>D</Typography>
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    size="small"
                    placeholder="00.00"
                    value={cutOffGradeD}
                    onChange={(event) => {
                      setCutOffGradeD(event.target.value);
                    }}
                    sx={{ width: "75px" }}
                  />
                </Grid>
                <Grid item xs={3}>
                  <Typography sx={{ paddingTop: "10px" }}>
                    {countAmount.D}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography sx={{ paddingTop: "10px" }}>
                    {percentAmount.D}
                  </Typography>
                </Grid>
              </Grid>

              <Grid container spacing={2} paddingTop={1} paddingBottom={1}>
                <Grid item xs={2}>
                  <Typography sx={{ paddingTop: "10px" }}>F</Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography sx={{ paddingTop: "10px" }}>
                    {"<"}
                    {cutOffGradeD}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography sx={{ paddingTop: "10px" }}>
                    {countAmount.F}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography sx={{ paddingTop: "10px" }}>
                    {percentAmount.F}
                  </Typography>
                </Grid>
              </Grid>
            </Item>
          </Grid>
          <Grid item md={4}>
            <Item
              style={{
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                width: 450,
              }}
            >
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Typography>เกรด</Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography>
                    จำนวน
                    <br />
                    (คน)
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography>
                    คิดเป็น <br /> (%)
                  </Typography>
                </Grid>
              </Grid>
              <Grid container spacing={2} paddingTop={1}>
                <Grid item xs={4}>
                  <Typography sx={{ paddingTop: "10px" }}>I</Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography sx={{ paddingTop: "10px" }}>
                    {" "}
                    {countAmountMore.I}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography sx={{ paddingTop: "10px" }}>
                    {percentAmountMore.I}
                  </Typography>
                </Grid>
              </Grid>
              <Grid container spacing={2} paddingTop={2}>
                <Grid item xs={4}>
                  <Typography sx={{ paddingTop: "10px" }}>M</Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography sx={{ paddingTop: "10px" }}>
                    {countAmountMore.M}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography sx={{ paddingTop: "10px" }}>
                    {percentAmountMore.M}
                  </Typography>
                </Grid>
              </Grid>
              <Grid container spacing={2} paddingTop={2}>
                <Grid item xs={4}>
                  <Typography sx={{ paddingTop: "10px" }}>W</Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography sx={{ paddingTop: "10px" }}>
                    {countAmountMore.W}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography sx={{ paddingTop: "10px" }}>
                    {percentAmountMore.W}
                  </Typography>
                </Grid>
              </Grid>
              <Grid container spacing={2} paddingTop={2}>
                <Grid item xs={4}>
                  <Typography sx={{ paddingTop: "10px" }}>S</Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography sx={{ paddingTop: "10px" }}>
                    {countAmountMore.S}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography sx={{ paddingTop: "10px" }}>
                    {percentAmountMore.S}
                  </Typography>
                </Grid>
              </Grid>
              <Grid container spacing={2} paddingTop={2}>
                <Grid item xs={4}>
                  <Typography sx={{ paddingTop: "10px" }}>U</Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography sx={{ paddingTop: "10px" }}>
                    {countAmountMore.U}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography sx={{ paddingTop: "10px" }}>
                    {percentAmountMore.U}
                  </Typography>
                </Grid>
              </Grid>
              <Grid container spacing={2} paddingTop={2}>
                <Grid item xs={4}>
                  <Typography sx={{ paddingTop: "10px" }}>V</Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography sx={{ paddingTop: "10px" }}>
                    {countAmountMore.V}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography sx={{ paddingTop: "10px" }}>
                    {percentAmountMore.V}
                  </Typography>
                </Grid>
              </Grid>
              <Grid container spacing={2} paddingTop={2}>
                <Grid item xs={4}>
                  <Typography sx={{ paddingTop: "10px" }}>รวม</Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography sx={{ paddingTop: "10px" }}>
                    {totalAmount}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography sx={{ paddingTop: "10px" }}>
                    {totalPercentAmount.toFixed(0)}
                  </Typography>
                </Grid>
              </Grid>
              <Grid container spacing={2} paddingTop={2} paddingBottom={1}>
                <Grid item xs={4}>
                  <Typography sx={{ paddingTop: "10px" }}>
                    เกรดเฉลี่ย
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography sx={{ paddingTop: "10px" }}>
                    {(meanGrade / totalAmountWithLetterGrade).toFixed(2)}
                  </Typography>
                </Grid>
              </Grid>
            </Item>
          </Grid>
          <Grid item xs={4} md={2} sx={{ marginLeft: "90px" }}>
            <Item
              style={{
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                width: 155,
              }}
            >
              <Button
                sx={sxVersion1}
                onClick={() => {
                  setFocusVersion(version1);
                  setVersionSendToDB("1");
                  version1.map((grade) => {
                    if (grade.cName === "A") {
                      setCutOffGradeA(grade.cScore);
                    }
                    if (grade.cName === "B+") {
                      setCutOffGradeBPlus(grade.cScore);
                    }
                    if (grade.cName === "B") {
                      setCutOffGradeB(grade.cScore);
                    }
                    if (grade.cName === "C+") {
                      setCutOffGradeCPlus(grade.cScore);
                    }
                    if (grade.cName === "C") {
                      setCutOffGradeC(grade.cScore);
                    }
                    if (grade.cName === "D+") {
                      setCutOffGradeDPlus(grade.cScore);
                    }
                    if (grade.cName === "D") {
                      setCutOffGradeD(grade.cScore);
                    }
                  });
                }}
              >
                เวอร์ชัน 1
              </Button>

              <Button
                sx={sxVersion2}
                onClick={() => {
                  setFocusVersion(version2);
                  setVersionSendToDB("2");
                  version2.map((grade) => {
                    if (grade.cName === "A") {
                      setCutOffGradeA(grade.cScore);
                    }
                    if (grade.cName === "B+") {
                      setCutOffGradeBPlus(grade.cScore);
                    }
                    if (grade.cName === "B") {
                      setCutOffGradeB(grade.cScore);
                    }
                    if (grade.cName === "C+") {
                      setCutOffGradeCPlus(grade.cScore);
                    }
                    if (grade.cName === "C") {
                      setCutOffGradeC(grade.cScore);
                    }
                    if (grade.cName === "D+") {
                      setCutOffGradeDPlus(grade.cScore);
                    }
                    if (grade.cName === "D") {
                      setCutOffGradeD(grade.cScore);
                    }
                  });
                }}
              >
                เวอร์ชัน 2
              </Button>

              <Button
                sx={sxVersion3}
                onClick={() => {
                  setFocusVersion(version3);
                  setVersionSendToDB("3");
                  version3.map((grade) => {
                    if (grade.cName === "A") {
                      setCutOffGradeA(grade.cScore);
                    }
                    if (grade.cName === "B+") {
                      setCutOffGradeBPlus(grade.cScore);
                    }
                    if (grade.cName === "B") {
                      setCutOffGradeB(grade.cScore);
                    }
                    if (grade.cName === "C+") {
                      setCutOffGradeCPlus(grade.cScore);
                    }
                    if (grade.cName === "C") {
                      setCutOffGradeC(grade.cScore);
                    }
                    if (grade.cName === "D+") {
                      setCutOffGradeDPlus(grade.cScore);
                    }
                    if (grade.cName === "D") {
                      setCutOffGradeD(grade.cScore);
                    }
                  });
                }}
              >
                เวอร์ชัน 3
              </Button>
            </Item>

            {/* <Box sx={{ width: "110px", maxHeight: "250px" }}> */}
            <Box
              sx={() => ({
                display: "flex",
                flexDirection: "column",
                justifyItems: "center",
                width: 170,
              })}
            >
              <Typography
                sx={{
                  paddingBlock: 2,
                  marginLeft: -0.5,
                  justifyContent: "center",
                }}
              >
                ผลการตัดเกรดย้อนหลัง
              </Typography>
              <Item
                style={{
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  width: 155,
                  height: 250,
                  overflowY: "auto",
                  "&::WebkitScrollbar": {
                    width: "12px", // กำหนดความกว้างของ scrollbar
                  },
                  "&::WebkitScrollbarThumb": {
                    backgroundColor: "#888", // กำหนดสีของ scrollbar thumb
                    borderRadius: "6px", // กำหนดรูปร่างของ scrollbar thumb
                  },
                  "&::WebkitScrollbarTrack": {
                    backgroundColor: "#f1f1f1", // กำหนดสีของ scrollbar track
                    borderRadius: "6px", // กำหนดรูปร่างของ scrollbar track
                  },
                }}
              >
                {" "}
                {historyData.map((historyItem, index) => (
                  <Button
                    key={index}
                    sx={{
                      // width: 130,
                      color: "#FFFFFF",
                      marginBottom: "10px",
                      backgroundColor: GreenPallette.main,
                      "&:hover": { backgroundColor: GreenPallette.light },
                    }}
                    onClick={() => handleHistoryCriteriaClick(index)}
                  >
                    {historyItem.year}/{historyItem.semester}
                  </Button>
                ))}
              </Item>
            </Box>
          </Grid>
        </Grid>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
        }}
      >
        <Grid
          style={{
            maxWidth: "1324px",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
          paddingBottom={2}
        >
          <Item
            style={{
              width: 954,
              display: "flex",
              flexDirection: "row",
              textAlign: "center",
              justifyContent: "center",
            }}
          >
            <Grid
              container
              spacing={3.5}
              paddingLeft={"10px"}
              paddingBottom={"10px"}
            >
              <Grid item xs={1}>
                <Typography sx={{ paddingTop: "10px" }}>Max</Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography sx={{ paddingTop: "10px" }}>{maxScore}</Typography>
              </Grid>
              <Grid item xs={1}>
                <Typography sx={{ paddingTop: "10px" }}>Min</Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography sx={{ paddingTop: "10px" }}>{minScore}</Typography>
              </Grid>
              <Grid item xs={1}>
                <Typography sx={{ paddingTop: "10px" }}>Mean</Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography sx={{ paddingTop: "10px" }}>
                  {meanScore.toFixed(2)}
                </Typography>
              </Grid>
              <Grid item xs={1}>
                <Typography sx={{ paddingTop: "10px" }}>S.D.</Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography sx={{ paddingTop: "10px" }}>
                  {sd.toFixed(2)}
                </Typography>
              </Grid>
            </Grid>
          </Item>
          <Grid sx={{ marginLeft: "20px" }}>
            <Button
              variant="contained"
              color="success"
              sx={{
                height: "37px",
                marginLeft: 8,
              }}
              onClick={() => {
                handleSaveVersionButtonClick(versionSendToDB);
              }}
            >
              บันทึก
            </Button>
          </Grid>
        </Grid>
      </div>
      <div style={{ width: 1150 }}>
        <MaterialReactTable table={table} />
      </div>
      {moduleScoreModalOpen && (
        <Modal
          open={moduleScoreModalOpen}
          onClose={handleModuleScoreModalClose}
          onSubmit={handleModuleScoreModalSubmit}
          moduleID={headerDetail}
        />
      )}
      {historyCriteriaOpen && (
        <HistoryModal
          open={historyCriteriaOpen}
          onClose={handleHistoryCriteriaClose}
          onSubmit={handleHistoryCriteriaSubmit}
          historyData={dataToHistoryModal}
        />
      )}

      <div
        style={{
          // paddingLeft: "10%",
          // paddingRight: "10%",
          marginTop: "30px",
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 40,
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
            navigate("/selectSubject2grading");
          }}
        >
          ย้อนกลับ
        </Button>
        <Button
          variant="contained"
          color="success"
          endIcon={<ArrowForwardIosIcon />}
          onClick={handleNextButtonClick}
        >
          ต่อไป
        </Button>
      </div>
    </div>
  );
}
