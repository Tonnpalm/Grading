import * as React from "react";
import toast, { Toaster } from "react-hot-toast";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Grid from "@mui/material/Grid";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Box } from "@mui/material";
import { PinkPallette } from "../../../assets/pallettes";
import { DataAcrossPages } from "../../../assets/DataAcrossPages";
import ResponsiveAppBar from "../../AppBar/ButtonAppBar";
import axios from "axios";

const contentSx = {
  textAlign: "right",
};

export default function AddSubjectCard() {
  const navigate = useNavigate();
  const [year, setYear] = React.useState("");
  const [semester, setSemester] = React.useState("");
  const [staffIDFromHomepage, setStaffIDFromHomepage] = React.useState("");
  const { data } = React.useContext(DataAcrossPages);
  const { setData } = React.useContext(DataAcrossPages);
  const [checkStaff, setCheckStaff] = React.useState(false);
  const numOnly = () =>
    toast.error("กรุณากรอกเป็นตัวเลขเท่านั้น", {
      style: {
        borderRadius: "10px",
        background: "red",
        color: "#fff",
      },
    });

  const notInDB = () =>
    toast.error("ปีที่กรอกไม่มีข้อมูลรายวิชา", {
      style: {
        borderRadius: "10px",
        background: "red",
        color: "#fff",
      },
    });

  const notStaff = () =>
    toast.error("คุณไม่ได้เป็นผู้ประสานงานในปีนี้", {
      style: {
        borderRadius: "10px",
        background: "red",
        color: "#fff",
      },
    });

  const checkYear = (y, s) => {
    axios
      .get(`http://localhost:8000/api/courses?year=${y}&semester=${s}`)
      .then((res) => {
        // ตรวจสอบว่าเลขที่นิสิตเป็นตัวเลขจริง ๆ
        const isNumericYear = /^\d+$/.test(y);
        if (!isNumericYear) {
          numOnly();
          return;
        }

        let foundStaff = false;

        // วนลูปหาผู้ประสานงานในรายวิชา
        res.data.courses.some((item) => {
          return item.coordinators.some((id) => {
            if (id._id === data) {
              console.log("ID จาก API", id._id);
              console.log(("ID จากหน้าก่อนหน้า", data));

              console.log("เจอจ้า");
              foundStaff = true;
              return true; // หยุดการวนลูปเมื่อเจอค่า true
            } else {
              console.log("ไม่เจอจ้า");
              return false; // ไม่เจอจะทำการวนลูปต่อ
            }
          });
        });
        // ตรวจสอบว่าค่า year และ semester ที่ผู้ใช้ป้อนตรงกับข้อมูลในฐานข้อมูลหรือไม
        const foundCourse = res.data.courses.find((course) => {
          return course.year === y && parseFloat(course.semester) === s;
        });

        if (!foundCourse && foundStaff === true) {
          console.log(foundCourse);
          console.log("ไม่่เจอคอร์สจ้า");

          notInDB();
          return;
        }
        if (!foundCourse && foundStaff === false) {
          console.log("ไม่่เจอคอร์สจ้า");

          notInDB();
          return;
        }

        if (foundStaff === false && foundCourse) {
          console.log(foundStaff);
          console.log("ไม่เจอพนักงานจ้า");
          notStaff();
          return;
        } else if (foundCourse && foundStaff === true) {
          console.log(foundCourse);
          console.log(foundStaff);
          console.log("เข้าจ้า");

          setCookie("year", y);
          let semesterValue;
          switch (s) {
            case 1:
              semesterValue = "ภาคต้น";
              break;
            case 2:
              semesterValue = "ภาคปลาย";
              break;
            case 3:
              semesterValue = "ภาคฤดูร้อน";
              break;
            default:
              semesterValue = "";
          }
          if (semesterValue) {
            // setData(data);
            // setStaffIDFromHomepage(data);
            console.log(data);
            setCookie("staffIDFromHomepage", data);
            setCookie("semester", semesterValue);
            navigate("/selectSubject2Grading");
          }
        }
      });
  };

  const [cookies, setCookie] = useCookies([]);

  const handleChange = (event) => {
    setSemester(event.target.value);
  };

  return (
    <div>
      <ResponsiveAppBar />
      <div
        style={{ display: "flex", justifyContent: "center", paddingTop: 150 }}
      >
        <Card sx={{ width: 500 }}>
          <CardContent
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography
              sx={{ fontSize: 28, m: 4 }}
              color="text.secondary"
              gutterBottom
            >
              กรุณากรอกข้อมูล
            </Typography>
            {/* <Box sx={{ width: "100%" }}> */}
            <Grid
              container
              spacing={3}
              justifyContent="center"
              alignItems="center"
            >
              <Grid item xs={4}>
                <Typography sx={contentSx}>ปีการศึกษา</Typography>
              </Grid>
              <Grid item xs={8}>
                <TextField
                  placeholder="กรุณากรอกเป็น ค.ศ. เช่น 2024"
                  value={year}
                  onChange={(event) => {
                    setYear(event.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={4}>
                <Typography sx={contentSx}>ภาคการศึกษา</Typography>
              </Grid>
              <Grid item xs={8}>
                <FormControl sx={{ width: 249.1 }}>
                  <Select
                    placeholder="กรุณาเลือกภาคการศึกษา"
                    value={semester}
                    onChange={handleChange}
                    autoWidth
                  >
                    <MenuItem value={1} sx={{ width: 249.1 }}>
                      ภาคต้น
                    </MenuItem>
                    <MenuItem value={2} sx={{ width: 249.1 }}>
                      ภาคปลาย
                    </MenuItem>
                    <MenuItem value={3} sx={{ width: 249.1 }}>
                      ภาคฤดูร้อน
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
          <CardActions
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mb: 5,
            }}
          >
            <Box sx={{ display: "flex", gap: "1rem", alignItems: "center" }}>
              <Button
                variant="outlined"
                size="large"
                sx={{
                  color: "black",
                  borderColor: "black",
                  "&:hover": {
                    backgroundColor: "E5E5E5",
                    borderColor: "black",
                  },
                }}
                onClick={() => {
                  navigate("/");
                }}
              >
                ยกเลิก
              </Button>
              <Button
                type="submit"
                variant="contained"
                size="large"
                // color="error"
                sx={{
                  backgroundColor: PinkPallette.main,
                  "&:hover": {
                    backgroundColor: PinkPallette.light,
                  },
                }}
                onClick={() => {
                  checkYear(year, semester);
                }}
                disabled={!year || !semester}
              >
                ตกลง
              </Button>
              <Toaster />
            </Box>
          </CardActions>
        </Card>
      </div>
    </div>
  );
}
