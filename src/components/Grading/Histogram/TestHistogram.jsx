import * as React from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { Grid, Paper, TextField, Typography, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
// import { DataAcrossPages } from "/Users/pongpipatsrimuang/Desktop/GradingFront/src/App.jsx";
import {
  ResponsiveChartContainer,
  LinePlot,
  useDrawingArea,
  useYScale,
  useXScale,
} from "@mui/x-charts";
import { PinkPallette } from "../../../assets/pallettes";

const uData = [
  74, 65, 78, 80, 81, 82, 82, 82, 84, 52, 98, 98, 73, 90, 78, 48, 78, 83, 72,
  55, 66, 92, 87, 87, 93, 66, 62,
];
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

const StyledPath = styled("path")(({ theme, color }) => ({
  fill: "none",
  stroke: theme.palette.text[color],
  shapeRendering: "crispEdges",
  strokeWidth: 1,
  pointerEvents: "none",
}));

// นับจำนวนครั้งที่ข้อมูลปรากฏซ้ำกันแต่ละค่า
const dataMap = new Map();
uData.forEach((value) => {
  dataMap.set(value, (dataMap.get(value) || 0) + 1);
});

// สร้างแกน X ที่แสดงคะแนน 1 ถึง 100
const xAxisData = Array.from({ length: 100 }, (_, i) => (i + 1).toString()); // สร้างเลขคะแนน 1 ถึง 100

// แมปข้อมูลจำนวนที่ซ้ำตามคะแนนในแกน X
const uDataMapped = xAxisData.map((score) => dataMap.get(parseInt(score)) || 0); // ใช้ Math.floor() เพื่อแปลงเป็นจำนวนนับ

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),

  color: theme.palette.text.secondary,
}));

function CartesianAxis({ cutoff }) {
  // Get the drawing area bounding box
  const { left, top, width, height } = useDrawingArea();

  // Get the two scale
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

export default function SimpleBarChart() {
  const [cutOffGradeA, setCutOffGradeA] = React.useState(80); // ค่าเริ่มต้นของ cut-off grade A
  const [cutOffGradeBPlus, setCutOffGradeBPlus] = React.useState(75); // ค่าเริ่มต้นของ cut-off grade B+
  const [cutOffGradeB, setCutOffGradeB] = React.useState(70); // ค่าเริ่มต้นของ cut-off grade B
  const [cutOffGradeCPlus, setCutOffGradeCPlus] = React.useState(65); // ค่าเริ่มต้นของ cut-off grade C+
  const [cutOffGradeC, setCutOffGradeC] = React.useState(60); // ค่าเริ่มต้นของ cut-off grade C
  const [cutOffGradeDPlus, setCutOffGradeDPlus] = React.useState(55); // ค่าเริ่มต้นของ cut-off grade D+
  const [cutOffGradeD, setCutOffGradeD] = React.useState(50); // ค่าเริ่มต้นของ cut-off grade D
  const [cutOffGradeF, setCutOffGradeF] = React.useState(49.99); // ค่าเริ่มต้นของ cut-off grade F

  // const { data } = useContext(DataAcrossPages);
  // const handleCutOffChange = (event) => {
  //   setCutOffValue(event.target.value);
  //   console.log("Cut-off value:", event.target.value);
  // };

  return (
    <div>
      <BarChart
        width={1100}
        height={550}
        series={[{ data: uDataMapped, label: "จำนวนนักเรียน", type: "bar" }]}
        xAxis={[{ data: xAxisData, scaleType: "band" }]}
        // lineProps={[
        //   {
        //     data: lineData,
        //     stroke: "red",
        //     strokeWidth: 2,
        //   },
        // ]}
        // onLoad={(chart) => {
        //   console.log("Line props:", chart.options.lineProps);
        // }}
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
          xAxis={[{ data: y, scaleTyxpe: "linear", min: -0.531, max: 3 }]} // ไม่ได้ใช้ข้อมูล X เนื่องจากต้องการเส้นตรงแนวตั้งเท่านั้น
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
                <Typography sx={{ paddingTop: "10px" }}>00.00</Typography>
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
    </div>
  );
}
