// eslint-disable-next-line no-unused-vars
import React from "react";
import ResponsiveAppBar from "../../AppBar/ButtonAppBar";
import SimpleBarChart from "./TestHistogram";
import ScoreTable from "./ScoreTable";
import { useContext } from "react";
import { Typography } from "@mui/material";
import { useCookies } from "react-cookie";
// import { DataAcrossPages } from "/Users/pongpipatsrimuang/Desktop/GradingFront/src/App.jsx";

export default function GradeAdjustment() {
  const [cookies, setCookie] = useCookies([]);
  const course = cookies["course"];

  //   const { data } = useContext(DataAcrossPages);

  return (
    <div>
      <ResponsiveAppBar />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: "60px",
          }}
        >
          <Typography fontSize={30}>ตัดเกรด</Typography>
          <Typography>2302008 Chem Tech II ภาคปลาย ปีการศึกษา 2566</Typography>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <SimpleBarChart />
        </div>
        <div
          style={{
            width: "80%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ScoreTable />
        </div>
      </div>
    </div>
  );
}
