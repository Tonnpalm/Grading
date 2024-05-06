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

  const yOrigin = yAxisScale(0);
  const xOrigin = xAxisScale(0);

  const cutOffGradeA = cutoff.cutOffGradeA;
  const cutOffGradeBPlus = cutoff.cutOffGradeBPlus;
  const cutOffGradeB = cutoff.cutOffGradeB;
  const cutOffGradeCPlus = cutoff.cutOffGradeCPlus;
  const cutOffGradeC = cutoff.cutOffGradeC;
  const cutOffGradeDPlus = cutoff.cutOffGradeDPlus;
  const cutOffGradeD = cutoff.cutOffGradeD;
  const cutOffGradeF = cutoff.cutOffGradeF;

  return (
    <React.Fragment>
      {/* {/* <StyledPath d={`M ${left} ${yOrigin} l ${width} 0`} color="primary" /> */}
      {/* <StyledPath d={`M ${xOrigin} ${top} l 0 ${height}`} color="primary" /> */}
      {/* cut off Grade A */}
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
  const [haveVersion, setHaveVersion] = React.useState(); // ค่าเริ่มต้นของ cut-off grade F

  const { setData } = React.useContext(DataAcrossPages);
  const { data } = React.useContext(DataAcrossPages);

  const [cookies, setCookie] = useCookies();
  // const mergedPackedData = cookies["mergedPackedData"];
  const year = cookies["year"];
  const semester = cookies["semester"];

  const [columns, setColumns] = React.useState([]);
  const [histogramScore, setHistogramScore] = React.useState([]);
  const [scoreInTable, setScoreInTable] = React.useState([]);
  const [secondStorage, setSecondStorage] = React.useState([]);
  const [headerDetail, setHeaderDetail] = React.useState("");

  const [countAmount, setCountAmount] = React.useState({}); // เปลี่ยนการประกาศ countAmount เป็น useState
  const [countAmountMore, setCountAmountMore] = React.useState({}); // เพิ่มการประกาศ useState สำหรับ countAmountMore
  const [dataToCal, setDataToCal] = React.useState([]); // เพิ่มการประกาศ useState สำหรับ dataToCal

  const [moduleScoreModalOpen, setModuleScoreModalOpen] = React.useState(false);

  const [version1, setVersion1] = React.useState([]);
  const [version2, setVersion2] = React.useState([]);
  const [version3, setVersion3] = React.useState([]);
  const [focusVersion, setFocusVersion] = React.useState();
  const [versionSendToDB, setVersionSendToDB] = React.useState("1");

  const navigate = useNavigate();

  const getVersion = () => {
    let crsIDtoCheck = [];
    data.slice(0, data.length - 2).find((item) => {
      crsIDtoCheck.push(item.crsID);
    });

    axios
      .get(`http://localhost:8000/api/grades/${crsIDtoCheck[0]}`)
      .then((res) => {
        console.log(res.data);
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
    getVersion();
    console.log("version 1", version1);
    console.log("version 2", version2);
    console.log("version 3", version3);
  }, []);

  const sxVersion1 = () => {
    if (version1.length !== 0) {
      if (versionSendToDB === "1") {
        return { backgroundColor: PinkPallette.main };
      } else {
        return { backgroundColor: GreenPallette.main };
      }
    } else if (version1.length === 0) {
      if (versionSendToDB === "1") {
        return { backgroundColor: PinkPallette.main };
      } else {
        return { backgroundColor: GreyPallette.main };
      }
    }
  };

  const sxVersion2 = () => {
    if (version2.length !== 0) {
      if (versionSendToDB === "2") {
        return { backgroundColor: PinkPallette.main };
      } else {
        return { backgroundColor: GreenPallette.main };
      }
    } else if (version2.length === 0) {
      if (versionSendToDB === "2") {
        return { backgroundColor: PinkPallette.main };
      } else {
        return { backgroundColor: GreyPallette.main };
      }
    }
  };

  const sxVersion3 = () => {
    if (version3.length !== 0) {
      if (versionSendToDB === "3") {
        return { backgroundColor: PinkPallette.main };
      } else {
        return { backgroundColor: GreenPallette.main };
      }
    } else if (version3.length === 0) {
      if (versionSendToDB === "3") {
        return { backgroundColor: PinkPallette.main };
      } else {
        return { backgroundColor: GreyPallette.main };
      }
    }
  };

  const handleModuleScoreModalOpen = () => {
    setModuleScoreModalOpen(true);
  };

  const handleModuleScoreModalClose = () => {
    setModuleScoreModalOpen(false);
  };

  const handleModuleScoreModalSubmit = () => {
    setModuleScoreModalOpen(false);
  };

  function getAllScores() {
    axios.get(`http://localhost:8000/api/scores/`).then((res) => {
      const apiScores = res.data.scores;
      console.log("ข้อมูลจาก API", apiScores);
      // เพิ่มตัวแปร formattedData เพื่อเก็บข้อมูลที่จะนำเข้าตารา
      const formattedData = [];
      let calTotScore = 0;
      //คะแนนเต็มของแต่ละมอดู
      let marks = {};
      let portionStorage = [];
      const apiData = res.data.scores;
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
        console.log("scores_portion", scores_portion);
        portionStorage.push(scores_portion);
      });

      console.log("portionStorage", portionStorage);
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

      let mergedStudentPortion = [];

      studentWithSumPortion.forEach((student) => {
        // ตรวจสอบว่า SID ของนักเรียนนี้มีอยู่ใน mergedStudentPortion หรือไม
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
            // const name = relevantData.map((item) => item.moduleName);
            if (studentData) {
              const mergedStudent = mergedStudentPortion.find(
                (item) => item.SID === studentData.SID
              );
              if (mergedStudent) {
                const checking = student.totalScore;
                relevantData.map((item) => {
                  // Object.keys(item).forEach((temp) => {
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
                  // });
                });
              }
              // console.log(modulePortion);
              // console.log(mergedStudent)
              if (mergedStudent.sumPortion >= parseFloat(modulePortion)) {
                // console.log(calTotScore);
                relevantData.map((item) => {
                  if (moduleIDs === item.moduleID) {
                    if (!isNaN(calTotScore)) {
                      // console.log(relevantData[0].moduleName);
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
              // console.log(
              //   "No relevant data found for student SID:",
              //   student.sID
              // );
            }
          });
        } else {
          // console.log("No relevant data found for moduleID:", moduleID);
        }
      });
      console.log("formattedData", formattedData);
      setScoreInTable(formattedData);
      setSecondStorage(formattedData);
      // });
    });
  }

  React.useEffect(() => {
    console.log("data", data);
    getAllScores();
  }, []);

  let moduleIDByName = {};
  data.slice(0, data.length - 2).forEach((item) => {
    moduleIDByName[item.moduleName] = item.moduleID;
  });

  const dataMap = new Map();
  histogramScore.map((value) => {
    dataMap.set(value, (dataMap.get(value) || 0) + 1);
  });

  const newAmount = () => {
    console.log(countAmountMore);
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

    console.log(newCountAmountMore);
    // อัพเดต state ของ countAmount และ countAmountMore
    setCountAmount(newCountAmount);
    // setCountAmountMore(newCountAmountMore);

    // อัพเดต state ของ dataToCal
    // setDataToCal(histogramScore.filter((value) => typeof value === "number"));
  };
  // const dataMap = new Map();
  // histogramScore.forEach((value) => {
  //   console.log("ค่าในการลูปฮิสโตแกรม", value);
  //   if (isNaN(value)) {
  //     dataMap.set(value, (dataMap.get(value) || 0) + 1);
  //     // console.log("ค่าในการลูปฮิสโตแกรม", value);
  //   } else {
  //     dataMap.set(value, (dataMap.get(value) || 0) + 1);
  //   }
  // });

  // const [countAmount, setCountAmount] = React.useState({});
  // // const countAmount = {};
  // const countAmountMore = {};
  // const dataToCal = [];

  // histogramScore.forEach((value) => {
  //   const grade = calculateGradeFromScore(value); // ให้ calculateGradeFromScore เป็นฟังก์ชันที่คำนวณเกรดจากคะแนนที่กำหนด
  //   countAmount[grade] = (countAmount[grade] || 0) + 1 || 0;
  //   if (
  //     grade === "I" ||
  //     grade === "M" ||
  //     grade === "W" ||
  //     grade === "S" ||
  //     grade === "U" ||
  //     grade === "V"
  //   ) {
  //     countAmountMore[grade] = (countAmountMore[grade] || 0) + 1 || 0;
  //   }
  //   dataToCal.push(value);
  // });

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

  // console.log(countAmount);
  let sumCountAmount = 0;
  let sumCountAmountMore = 0;
  for (let key in countAmount) {
    sumCountAmount += countAmount[key];
  }
  for (let key in countAmountMore) {
    console.log(countAmountMore);
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
      key === "D"
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
    // console.log("เข้าฟังก์ชันเทียบเกรด เพื่อนับจำนวน", score);
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
    // console.log("data", data);
    // สร้าง columns ที่มีหัวตารางเป็นชื่อ moduleName
    const uniqueModuleNames = data
      .slice(0, data.length - 2)
      .map((item) => item.moduleName);
    // const uniqueModuleID = data
    //   .slice(0, data.length - 2)
    //   .map((item) => item.moduleID);
    // console.log(uniqueModuleID);
    console.log(uniqueModuleNames);
    const moduleNameColumns = uniqueModuleNames.map((moduleName) => ({
      accessorKey: moduleName,
      header: moduleName,
      enableSorting: false,
      enableColumnActions: true,
      renderColumnActionsMenuItems: ({ closeMenu }) => (
        <MenuItem
          key={1}
          onClick={() => {
            // console.log("moduleName", moduleName);
            // setHeaderDetail(moduleName);
            handleHeaderClick(moduleName);
            // handleModuleScoreModalOpen();
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
      ...moduleNameColumns, // เพิ่ม columns ที่สร้างจาก moduleName ที่ได้จาก dat
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
      // console.log("totScoreStorage[0]", totScoreStorage[0]);
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
      newRow["studentGrade"] = grade; // เซ็ตเกรดให้กับข้อมูลใหม่
      newRow["roundedTotalScore"] = roundScoreStorage[0];
      newRow["calculatedTotalScore"] = totScoreStorage[0];

      newData.push(newRow); // เพิ่มข้อมูลใหม่เข้าไปใน newData

      countLoop++;
    });
    console.log("scoreUseInHistogram", scoreUseInHistogram);
    setHistogramScore(scoreUseInHistogram);
    setScoreInTable(newData); // เซ็ตข้อมูลใหม่ให้กับ state
  }
  React.useEffect(() => {
    calculateGrade();
  }, [secondStorage]);

  const handleHeaderClick = (moduleName) => {
    let id = "";
    // console.log(headerDetail);
    if (moduleName !== "") {
      Object.keys(moduleIDByName).forEach((key) => {
        console.log(moduleIDByName[key]);
        if (key === moduleName) {
          id = moduleIDByName[key];
        }
      });
    }
    console.log("id", id);
    setHeaderDetail(id);
    handleModuleScoreModalOpen();
  };

  // React.useEffect(() => {
  //   if (headerDetail !== "") {
  //     handleHeaderClick();
  //   }
  // }, [headerDetail, handleHeaderClick]);

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
    // console.log("scoreTable", scoreInTable);
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
          // console.log("temps", key);
          moduleOnly[key] = item[key];
        }
      });

      // console.log("moduleOnly", moduleOnly);
      studentData.push({
        sID: item.SID,
        sName: item.studentName,
        totalScore: item.calculatedTotalScore,
        roundScore: item.roundedTotalScore,
        totalGrade: item.studentGrade,
        scoreModule: moduleOnly,
      });
    });
    // console.log("studentData", studentData);
    let crsID = [];
    data.slice(0, data.length - 2).find((item) => {
      crsID.push(item.crsID);
    });
    const shapedData = {
      courses: crsID[0],
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
      ],
      version: version,
      isused: false,
      year: year,
      semester: semesterValue,
    };

    console.log("shapdata", shapedData);
    axios.post(`http://localhost:8000/api/grades/`, shapedData).then((res) => {
      console.log("success", res.data);
      getVersion();
      getAllScores;
    });
  };
  // // สร้าง state เพื่อเก็บค่าจำนวนซ้ำของเกรด I M W S U V ก่อนการเปลี่ยนแปลง
  // const [originalCountAmountMore, setOriginalCountAmountMore] = React.useState({
  //   I: countAmountMore.I,
  //   M: countAmountMore.M,
  //   W: countAmountMore.W,
  //   S: countAmountMore.S,
  //   U: countAmountMore.U,
  //   V: countAmountMore.V,
  // });

  // // เมื่อมีการเปลี่ยนแปลงใน cut-off ของเกรด A-F
  // const handleSaveCutOffButton = () => {
  //   // ใช้ค่าจำนวนซ้ำของเกรด I M W S U V ก่อนการเปลี่ยนแปลงในการคำนวณค่าใหม่ของแต่ละเกรด A-F
  //   const newCountAmount = {
  //     A: countAmount.A,
  //     "B+": countAmount["B+"],
  //     B: countAmount.B,
  //     "C+": countAmount["C+"],
  //     C: countAmount.C,
  //     "D+": countAmount["D+"],
  //     D: countAmount.D,
  //     F: countAmount.F,
  //   };
  //   let xx = 0;
  //   for (let key in originalCountAmountMore) {
  //     xx += originalCountAmountMore[key];
  //   }
  //   // คำนวณค่าใหม่ของแต่ละเกรด A-F โดยไม่รวมค่าจำนวนซ้ำของเกรด I M W S U V ที่คงที่
  //   // นับค่าเกรดทั้งหมด (รวมเกรดที่ได้และเกรดที่ไม่ได้) และลบค่าจำนวนซ้ำของเกรด I M W S U V ที่คงที่ออก
  //   newCountAmount.A -= xx;
  //   newCountAmount["B+"] -= xx;
  //   newCountAmount.B -= xx;
  //   newCountAmount["C+"] -= xx;
  //   newCountAmount.C -= xx;
  //   newCountAmount["D+"] -= xx;

  //   // อัพเดต state ของค่าจำนวนซ้ำของแต่ละเกรด A-F เพื่อแสดงการเปลี่ยนแปลง
  //   setCountAmount(newCountAmount);

  //   // อัพเดตค่าจำนวนซ้ำของเกรด I M W S U V ที่คงที่ ให้เป็นค่าปัจจุบัน
  //   setOriginalCountAmountMore({
  //     I: countAmountMore.I,
  //     M: countAmountMore.M,
  //     W: countAmountMore.W,
  //     S: countAmountMore.S,
  //     U: countAmountMore.U,
  //     V: countAmountMore.V,
  //   });

  //   // เรียกใช้ฟังก์ชัน handleSaveCutOffButton ที่เขียนไว้ในโค้ดเดิม
  //   // เพื่ออัพเดต cut-off และคำนวณเกรดใหม่
  //   handleSaveCutOffButtonX();
  // };
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
      // console.log("totScoreStorage[0]", totScoreStorage[0]);
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
    console.log("scoreUseInHistogram", scoreUseInHistogram);
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
    console.log("scoreTable", scoreInTable);
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
          console.log("temps", key);
          moduleOnly[key] = item[key];
        }
      });

      console.log("moduleOnly", moduleOnly);
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
      ],
      isused: true,
      year: year,
      semester: semesterValue,
    };

    console.log("shapdata", shapedData);

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
        {/* <div
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        > */}
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
            xAxis={[{ data: y, scaleTyxpe: "linear", min: -0.514, max: 3 }]} // ไม่ได้ใช้ข้อมูล X เนื่องจากต้องการเส้นตรงแนวตั้งเท่านั้น
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
        {/* </div> */}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          // paddingLeft: "10%",
          // paddingRight: "10%",
        }}
      >
        <Grid container spacing={2} paddingBottom={8}>
          <Grid item xs={4} md={5}>
            <Item
              style={{
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
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
                    color="primary"
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
              }}
            >
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Typography>เกรด</Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography>จำนวน (คน)</Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography>คิดเป็น (%)</Typography>
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
          <Grid item xs={4} md={2}>
            <Item>
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
            </Item>
            <Item>
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
            </Item>
            <Item>
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
            <Button
              variant="contained"
              color="success"
              sx={{
                marginTop: 43,
                marginLeft: 7,
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
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          marginTop: "-109px",
          marginBottom: "30px",
        }}
      >
        <Grid style={{ maxWidth: "1024px" }}>
          <Item
            style={{
              width: 820,
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
        </Grid>
      </div>
      <div style={{ width: 1024 }}>
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
      {/* </div> */}
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
