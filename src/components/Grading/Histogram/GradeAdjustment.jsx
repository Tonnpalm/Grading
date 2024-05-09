import ResponsiveAppBar from "../../AppBar/ButtonAppBar";
import Grading from "./TestHistogram";
import { useContext, useEffect, useState } from "react";
import { Typography, Button } from "@mui/material";
import { DataAcrossPages } from "../../../assets/DataAcrossPages";
import { useCookies } from "react-cookie";
import axios from "axios";

export default function GradeAdjustment() {
  const { data } = useContext(DataAcrossPages);
  const [cookies, setCookie] = useCookies([]);
  const year = cookies["year"];
  const semester = cookies["semester"];

  const [courseName, setCourseName] = useState("");
  const [courseID, setCourseID] = useState("");

  function getOnce() {
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
      .get(
        `http://localhost:8000/api/courses/onceID?year=${year}&semester=${semesterValue}&_id=${data[0].crsID}`
      )
      .then((res) => {
        const course = res.data.courses;
        console.log(course[0].crsName);
        setCourseName(course[0].crsName);
        setCourseID(course[0].crsID);
        setCookie("crsName", course[0].crsName);
      });
  }

  useEffect(() => {
    console.log(semester);

    getOnce();
  }, []);
  return (
    <div>
      <ResponsiveAppBar />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
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
          <Typography>
            {courseID} {courseName} {semester} ปีการศึกษา {year}
          </Typography>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Grading />
        </div>
      </div>
    </div>
  );
}
