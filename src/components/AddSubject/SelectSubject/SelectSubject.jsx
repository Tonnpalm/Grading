// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import ResponsiveAppBar from "../../AppBar/ButtonAppBar";
import AddOfficer from "./AddOfficer";
import "./SelectSubject.css";
import { useCookies } from "react-cookie";
import { Typography } from "@mui/material";

function SelectSubject() {
  // eslint-disable-next-line no-unused-vars
  const [cookies, setCookie] = useCookies([]);
  const year = cookies["year"];
  const semester = cookies["semester"];

  return (
    <div>
      <ResponsiveAppBar />
      <div className="content-container">
        <Typography sx={{ fontSize: "30px" }}>
          นำเข้ารายวิชา{semester} ปีการศึกษา {year}
        </Typography>
        <div className="add-table-container">
          <AddOfficer />
        </div>
      </div>
    </div>
  );
}
export default SelectSubject;
