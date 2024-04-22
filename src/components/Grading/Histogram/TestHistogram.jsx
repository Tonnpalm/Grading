import * as React from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { Grid, Paper, TextField, Typography, Button } from "@mui/material";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { styled } from "@mui/material/styles";
import { MenuItem } from "@mui/material";
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
import { PinkPallette } from "../../../assets/pallettes";
import { useNavigate } from "react-router-dom";

// const uData = [
//   74, 65, 78, 80, 81, 82, 82, 82, 84, 52, 98, 98, 73, 90, 78, 48, 78, 83, 72,
//   55, 66, 92, 87, 87, 93, 66, 62,
// ];
const lineData = [
  { x: 0, y: 0 },
  { x: 0, y: 100 },
];
// เพิ่ม CSS style สำหรับทับ ResponsiveChartContainer บน BarChart
const OverlayContainer = styled("div")({
  position: "absolute",
  top: 198,
  left: 0,
  width: "100%",
  height: "100%",
});

const y = Array.from({ length: 21 }, (_, index) => {
  if (index === 3) return 0; // กำหนดให้มีค่าเป็น 0 เมื่อ index เท่ากับ 3
  return -2 + 0.5 * index;
});

// นับจำนวนครั้งที่ข้อมูลปรากฏซ้ำกันแต่ละค่า
// const dataMap = new Map();
// uData.forEach((value) => {
//   dataMap.set(value, (dataMap.get(value) || 0) + 1);
// });

// // สร้างแกน X ที่แสดงคะแนน 1 ถึง 100
// const xAxisData = Array.from({ length: 100 }, (_, i) => (i + 1).toString()); // สร้างเลขคะแนน 1 ถึง 100

// // แมปข้อมูลจำนวนที่ซ้ำตามคะแนนในแกน X
// const uDataMapped = xAxisData.map((score) => dataMap.get(parseInt(score)) || 0); // ใช้ Math.floor() เพื่อแปลงเป็นจำนวนนับ

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),

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

  // const xTicks = [-2, -1, 1, 2, 3];
  // const yTicks = [-2, -1, 1, 2, 3, 4, 5];

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
  const [cutOffGradeF, setCutOffGradeF] = React.useState(49.99); // ค่าเริ่มต้นของ cut-off grade F

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const { data } = React.useContext(DataAcrossPages);
  const [columns, setColumns] = React.useState([]);
  const [histogramScore, setHistogramScore] = React.useState([]);
  const [scoreInTable, setScoreInTable] = React.useState([]);
  const [moduleFullScore, setModuleFullScore] = React.useState();
  const navigate = useNavigate();

  const dataMap = new Map();
  histogramScore.map((value) => {
    dataMap.set(value, (dataMap.get(value) || 0) + 1);
  });

  // สร้างแกน X ที่แสดงคะแนน 1 ถึง 100
  const xAxisData = Array.from({ length: 100 }, (_, i) => (i + 1).toString()); // สร้างเลขคะแนน 1 ถึง 100

  // แมปข้อมูลจำนวนที่ซ้ำตามคะแนนในแกน X
  const histogramData = xAxisData.map(
    (score) => dataMap.get(parseInt(score)) || 0
  ); // ใช้ Math.floor() เพื่อแปลงเป็นจำนวนนับ

  // async function getModuleFullScore() {
  //   try {
  //     const res = await axios.get(`http://localhost:8000/api/scores/`);
  //     let marks = {};
  //     const apiData = res.data.scores;
  //     apiData.forEach((item) => {
  //       let fullScoresss = 0;
  //       item.assignments.forEach((full) => {
  //         fullScoresss += parseFloat(full.fullScore || 0);
  //       });
  //       marks[item.moduleObjectID] = fullScoresss.toString();
  //     });
  //     setModuleFullScore(marks);
  //   } catch (error) {
  //     console.error("Error fetching module full score:", error);
  //   }
  // }
  React.useEffect(() => {
    getAllScores();
    calculateGrade();
  }, [data]);

  function getAllScores() {
    axios.get(`http://localhost:8000/api/scores/`).then((res) => {
      const apiScores = res.data.scores;
      console.log("ข้อมูลจาก API", apiScores);
      // เพิ่มตัวแปร formattedData เพื่อเก็บข้อมูลที่จะนำเข้าตาราง
      const formattedData = [];
      let scoreUseInHistogram = [];
      let calTotScore = 0;
      //คะแนนเต็มของแต่ละมอดูล
      let marks = {};
      const apiData = res.data.scores;
      apiData.forEach((item) => {
        let fullScoresss = 0;
        item.assignments.forEach((full) => {
          fullScoresss += parseFloat(full.fullScore || 0);
        });
        marks[item.moduleObjectID] = fullScoresss.toString();
      });

      apiScores.forEach((apiScore) => {
        // หา moduleID จาก API
        const moduleID = apiScore.moduleObjectID;
        // ค้นหาข้อมูลที่มี moduleID เหมือนกับข้อมูลใน API ใน dat
        const relevantData = data
          .slice(0, data.length - 2)
          .filter((item) => item.moduleID === moduleID);
        if (relevantData) {
          apiScore.students.forEach((student) => {
            const studentData = data[data.length - 2].find(
              (item) => item.SID === student.sID
            ); // ค้นหาข้อมูลนักเรียนที่เกี่ยวข้องกับ SID ในตัวแปร data
            const modulePortion = data[data.length - 1];
            if (studentData) {
              calTotScore =
                ((student.totalScore /
                  parseFloat(marks[relevantData[0].moduleID])) *
                  100 *
                  relevantData[0].portion) /
                parseFloat(modulePortion);
              console.log(calTotScore);
              const rowData = {
                SID: studentData.SID,
                studentName: studentData.studentName,
                [relevantData[0].moduleName]: calTotScore.toFixed(2) || 0, // ใช้ชื่อโมดูลเป็น key ในการเก็บคะแนน
                sumPortion: parseFloat(modulePortion),
              };

              scoreUseInHistogram.push(calTotScore);
              // เช็คว่า formattedData มีข้อมูลของนักเรียนนี้อยู่แล้วหรือไม่
              const existingStudentIndex = formattedData.findIndex(
                (item) => item.SID === rowData.SID
              );
              if (existingStudentIndex !== -1) {
                formattedData[existingStudentIndex][
                  relevantData[0].moduleName
                ] = calTotScore.toFixed(2) || 0;
              } else {
                formattedData.push(rowData);
              }
            } else {
              console.log(
                "No relevant data found for student SID:",
                student.sID
              );
            }
          });
        } else {
          console.log("No relevant data found for moduleID:", moduleID);
        }
      });
      setHistogramScore(scoreUseInHistogram);
      setScoreInTable(formattedData);
    });
    calculateGrade();
  }

  React.useEffect(() => {
    if (!data) return;
    // สร้าง columns ที่มีหัวตารางเป็นชื่อ moduleName
    const uniqueModuleNames = data
      .slice(0, data.length - 2)
      .map((item) => item.moduleName);
    const moduleNameColumns = uniqueModuleNames.map((moduleName, index) => ({
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
  }, [data]);

  // ฟังก์ชันคำนวณเกรด
  function calculateGrade() {
    const newData = []; // เก็บข้อมูลใหม่ที่จะเปลี่ยนแปลง
    scoreInTable.forEach((studentData) => {
      const newRow = { ...studentData }; // สำเนาข้อมูลนักเรียน

      let percentage = 0;

      // หาคะแนนรวมและคะแนนเต็มของนักเรียน
      Object.keys(studentData).forEach((key) => {
        if (
          key !== "SID" &&
          key !== "studentName" &&
          key !== "studentGrade" &&
          key !== "sumPortion"
        ) {
          percentage += parseFloat(studentData[key]);
        }
      });

      // คำนวณเกรด
      let grade = ""; // เกรด
      if (percentage >= cutOffGradeA) grade = "A";
      else if (percentage >= cutOffGradeBPlus) grade = "B+";
      else if (percentage >= cutOffGradeB) grade = "B";
      else if (percentage >= cutOffGradeCPlus) grade = "C+";
      else if (percentage >= cutOffGradeC) grade = "C";
      else if (percentage >= cutOffGradeDPlus) grade = "D+";
      else if (percentage >= cutOffGradeD) grade = "D";
      else grade = "F";

      newRow["studentGrade"] = grade; // เซ็ตเกรดให้กับข้อมูลใหม่
      newRow["calculatedTotalScore"] = percentage;
      newData.push(newRow); // เพิ่มข้อมูลใหม่เข้าไปใน newData
    });
    setScoreInTable(newData); // เซ็ตข้อมูลใหม่ให้กับ state
    console.log("หลังคิดเกรดแล้ว", scoreInTable);
  }

  const handleHeaderClick = () => {
    setIsModalOpen(true);
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

  return (
    <div>
      <BarChart
        width={1100}
        height={550}
        series={[{ data: histogramData, label: "จำนวนนักเรียน", type: "bar" }]}
        xAxis={[{ data: xAxisData, scaleType: "band" }]}
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
          xAxis={[{ data: y, scaleTyxpe: "linear", min: -0.375, max: 3 }]} // ไม่ได้ใช้ข้อมูล X เนื่องจากต้องการเส้นตรงแนวตั้งเท่านั้น
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
              cutOffGradeF: cutOffGradeF,
            }}
          />
          <LinePlot />
        </ResponsiveChartContainer>
      </OverlayContainer>
      <Grid container spacing={2} paddingBottom={8}>
        <Grid item xs={4} md={5}>
          <Item
            style={{
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={2}>
                <Typography>เกรด</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography>เกณฑ์คะแนน</Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography>จำนวน (คน)</Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography>คิดเป็น (%)</Typography>
              </Grid>
            </Grid>
            <Grid container spacing={2} paddingTop={1}>
              <Grid item xs={2}>
                <Typography sx={{ paddingTop: "10px" }}>A</Typography>
              </Grid>
              <Grid item xs={4}>
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
              <Grid item xs={3}>
                <Typography sx={{ paddingTop: "10px" }}>13</Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography sx={{ paddingTop: "10px" }}>48.15</Typography>
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
                <Typography sx={{ paddingTop: "10px" }}>4</Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography sx={{ paddingTop: "10px" }}>14.81</Typography>
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
                <Typography sx={{ paddingTop: "10px" }}>3</Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography sx={{ paddingTop: "10px" }}>11.11</Typography>
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
                <Typography sx={{ paddingTop: "10px" }}>2</Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography sx={{ paddingTop: "10px" }}>7.41</Typography>
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
                <Typography sx={{ paddingTop: "10px" }}>2</Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography sx={{ paddingTop: "10px" }}>7.41</Typography>
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
                <Typography sx={{ paddingTop: "10px" }}>0</Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography sx={{ paddingTop: "10px" }}>0</Typography>
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
                <Typography sx={{ paddingTop: "10px" }}>2</Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography sx={{ paddingTop: "10px" }}>7.41</Typography>
              </Grid>
            </Grid>

            <Grid container spacing={2} paddingTop={1} paddingBottom={1}>
              <Grid item xs={2}>
                <Typography sx={{ paddingTop: "10px" }}>F</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography sx={{ paddingTop: "10px" }}>{"<"}50.00</Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography sx={{ paddingTop: "10px" }}>1</Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography sx={{ paddingTop: "10px" }}>3.70</Typography>
              </Grid>
            </Grid>
          </Item>
        </Grid>
        <Grid item xs={4} md={5}>
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
              <Grid item xs={4}>
                <Typography>จำนวน (คน)</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography>คิดเป็น (%)</Typography>
              </Grid>
            </Grid>
            <Grid container spacing={2} paddingTop={1}>
              <Grid item xs={4}>
                <Typography sx={{ paddingTop: "10px" }}>I</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography sx={{ paddingTop: "10px" }}>00.00</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography sx={{ paddingTop: "10px" }}>00.00</Typography>
              </Grid>
            </Grid>
            <Grid container spacing={2} paddingTop={2}>
              <Grid item xs={4}>
                <Typography sx={{ paddingTop: "10px" }}>M</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography sx={{ paddingTop: "10px" }}>00.00</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography sx={{ paddingTop: "10px" }}>00.00</Typography>
              </Grid>
            </Grid>
            <Grid container spacing={2} paddingTop={2}>
              <Grid item xs={4}>
                <Typography sx={{ paddingTop: "10px" }}>W</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography sx={{ paddingTop: "10px" }}>00.00</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography sx={{ paddingTop: "10px" }}>00.00</Typography>
              </Grid>
            </Grid>
            <Grid container spacing={2} paddingTop={2}>
              <Grid item xs={4}>
                <Typography sx={{ paddingTop: "10px" }}>S</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography sx={{ paddingTop: "10px" }}>00.00</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography sx={{ paddingTop: "10px" }}>00.00</Typography>
              </Grid>
            </Grid>
            <Grid container spacing={2} paddingTop={2}>
              <Grid item xs={4}>
                <Typography sx={{ paddingTop: "10px" }}>U</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography sx={{ paddingTop: "10px" }}>00.00</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography sx={{ paddingTop: "10px" }}>00.00</Typography>
              </Grid>
            </Grid>
            <Grid container spacing={2} paddingTop={2}>
              <Grid item xs={4}>
                <Typography sx={{ paddingTop: "10px" }}>V</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography sx={{ paddingTop: "10px" }}>00.00</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography sx={{ paddingTop: "10px" }}>00.00</Typography>
              </Grid>
            </Grid>
            <Grid container spacing={2} paddingTop={2}>
              <Grid item xs={4}>
                <Typography sx={{ paddingTop: "10px" }}>รวม</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography sx={{ paddingTop: "10px" }}>27</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography sx={{ paddingTop: "10px" }}>100</Typography>
              </Grid>
            </Grid>
            <Grid container spacing={2} paddingTop={2} paddingBottom={1}>
              <Grid item xs={4}>
                <Typography sx={{ paddingTop: "10px" }}>เกรดเฉลี่ย</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography sx={{ paddingTop: "10px" }}>3.48</Typography>
              </Grid>
            </Grid>
          </Item>
        </Grid>
        <Grid item xs={4} md={2}>
          <Item>
            <Typography>เวอร์ชัน 1</Typography>
          </Item>
          <Item>
            <Typography>เวอร์ชัน 2</Typography>
          </Item>
          <Button
            variant="contained"
            color="success"
            sx={{
              marginTop: 40,
              marginLeft: 7,
            }}
          >
            บันทึก
          </Button>
        </Grid>
      </Grid>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          paddingLeft: "10%",
          paddingRight: "10%",
        }}
      >
        <MaterialReactTable table={table} />
        {isModalOpen && <Modal onClose={() => setIsModalOpen(false)} />}
      </div>
    </div>
  );
}
