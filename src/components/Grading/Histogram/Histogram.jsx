import * as React from "react";
import { styled } from "@mui/material/styles";

import {
  ResponsiveChartContainer,
  LinePlot,
  useDrawingArea,
  useYScale,
  useXScale,
} from "@mui/x-charts";

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

function CartesianAxis() {
  // Get the drawing area bounding box
  const { left, top, width, height } = useDrawingArea();

  // Get the two scale
  const yAxisScale = useYScale();
  const xAxisScale = useXScale();

  const yOrigin = yAxisScale(0);
  const xOrigin = xAxisScale(0);

  // const xTicks = [-2, -1, 1, 2, 3];
  // const yTicks = [-2, -1, 1, 2, 3, 4, 5];

  return (
    <React.Fragment>
      <StyledPath d={`M ${left} ${yOrigin} l ${width} 0`} color="primary" />
      <StyledPath d={`M ${xOrigin} ${top} l 0 ${height}`} color="primary" />
      {/* เส้นตรงแนวตั้ง */}
      <line
        x1={xOrigin + 3}
        y1={top}
        x2={xOrigin + 3}
        y2={top + height}
        stroke="red"
      />
    </React.Fragment>
  );
}

export default function OriginDemo() {
  return (
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
      xAxis={[{ data: y, scaleTyxpe: "linear", min: 0, max: 3 }]} // ไม่ได้ใช้ข้อมูล X เนื่องจากต้องการเส้นตรงแนวตั้งเท่านั้น
      yAxis={[{ min: -2, max: 2 }]}
    >
      <CartesianAxis />
      <LinePlot />
    </ResponsiveChartContainer>
  );
}
