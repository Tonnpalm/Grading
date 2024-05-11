import * as React from "react";
import ResponsiveAppBar from "../../AppBar/ButtonAppBar";
import { axios } from "../../../utils/customAxios";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import { GreenPallette, PinkPallette } from "../../../assets/pallettes";
import { Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { DataAcrossPages } from "../../../assets/DataAcrossPages";

function ConfirmAddSubject() {
  const [confirmCrsID, setConfirmCrsID] = React.useState([]);
  const [confirmCrsName, setConfirmCrsName] = React.useState([]);
  const [confirmCrsSec, setConfirmCrsSec] = React.useState([]);
  const [confirmCrsCre, setConfirmCrsCre] = React.useState([]);
  const [confirmCoordinators, setConfirmCoordinators] = React.useState([]);
  const [confirmCrsYearAndSemester, setConfirmCrsYearAndSemester] =
    React.useState([]);
  const navigate = useNavigate();

  const { data } = React.useContext(DataAcrossPages);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `/grades/?year=${data[0]}&semester=${data[1]}`
        );
        console.log("data to show", response.data.grades);
        console.log("year&Semester&crsID", data);
        response.data.grades.map((item) => {
          item.gradeAll.map((grade) => {
            if (data[3] === grade.courses) {
              axios
                .get(
                  `/courses/onceID?year=${data[0]}&semester=${data[1]}&_id=${data[2]}`
                )
                .then((res) => {
                  let crsID2Confirm = [];
                  res.data.courses.map((ID) => {
                    let id = ID.crsID;
                    crsID2Confirm.push(id);
                  });
                  setConfirmCrsID(crsID2Confirm);
                  let crsName2Confirm = [];
                  res.data.courses.map((crsName) => {
                    let name = crsName.crsName;
                    crsName2Confirm.push(name);
                  });
                  setConfirmCrsName(crsName2Confirm);
                  let crsSec2Confirm = [];
                  res.data.courses.map((crsSec) => {
                    let section = crsSec.crsSec;
                    crsSec2Confirm.push(section);
                  });
                  setConfirmCrsSec(crsSec2Confirm);
                  let crsYearAndSemester = [];
                  res.data.courses.map((item) => {
                    let yearAndSemester = item.year + "/" + item.semester;
                    crsYearAndSemester.push(yearAndSemester);
                  });
                  setConfirmCrsYearAndSemester(crsYearAndSemester);
                });
            }
          });
        });
        // let crsID2Confirm = [];
        // response.data.courses.map((ID) =>{
        //   let id = ID.crsID;
        //   crsID2Confirm.push(id);
        // });
        // setConfirmCrsID(crsID2Confirm);

        // let crsName2Confirm = [];
        // response.data.courses.map((crsName) => {
        //   let name = crsName.crsName;
        //   crsName2Confirm.push(name);
        // });
        // setConfirmCrsName(crsName2Confirm);

        // let crsSec2Confirm = [];
        // response.data.courses.map((crsSec) => {
        //   let section = crsSec.crsSec;
        //   crsSec2Confirm.push(section);
        // });
        // setConfirmCrsSec(crsSec2Confirm);

        // let crsCre2Confirm = [];
        // response.data.courses.map((crsCre) => {
        //   let credit = crsCre.crsCre;
        //   crsCre2Confirm.push(credit);
        // });
        // setConfirmCrsCre(crsCre2Confirm);

        // let coordinators2Confirm = [];
        // response.data.courses.map((course) => {
        //   let coordinators = course.coordinators;
        //   if (Array.isArray(coordinators) && coordinators.length > 1) {
        //     let staffFullNames = coordinators.map(
        //       (name) => `${name.staffName} ${name.staffSurname}`
        //     );
        //     coordinators2Confirm.push(staffFullNames.join(", "));
        //   } else {
        //     coordinators.map((name) => {
        //       console.log("something", name);
        //       let staffFullName = name.staffName + " " + name.staffSurname;
        //       coordinators2Confirm.push(staffFullName);
        //     });
        //   }
        // });
        // setConfirmCoordinators(coordinators2Confirm);
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูล:", error);
      }
    };

    fetchData();
  }, []); // ใส่ [] เพื่อให้ useEffect เรียกฟังก์ชันของเราเฉพาะครั้งแรกเท่านั้น
  return (
    <div>
      <ResponsiveAppBar />
      <div style={{ paddingBottom: 80 }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "100px",
          }}
        >
          <TaskAltIcon
            sx={{ width: "127px", height: "127px", color: GreenPallette.main }}
          />
          <Typography sx={{ fontSize: 50, color: GreenPallette.main }}>
            เสร็จสิ้น
          </Typography>
          <Typography sx={{ fontSize: 20 }}>ยืนยันเกรดเสร็จสิ้นแล้ว</Typography>
          <div style={{ display: "flex", flexDirection: "row", marginTop: 30 }}>
            <Typography>
              รหัสวิชา
              {confirmCrsID.map((id, index) => (
                <React.Fragment key={index}>
                  <br />
                  {id}
                </React.Fragment>
              ))}
            </Typography>
            <Typography sx={{ marginLeft: 7 }}>
              ชื่อวิชา
              {confirmCrsName.map((name, index) => (
                <React.Fragment key={index}>
                  <br />
                  {name}
                </React.Fragment>
              ))}
            </Typography>
            <Typography
              sx={{
                marginLeft: 7,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              ตอนเรียน
              {confirmCrsSec.map((section, index) => (
                <React.Fragment key={index}>
                  <br />
                  {section}
                </React.Fragment>
              ))}
            </Typography>
            <Typography sx={{ marginLeft: 7 }}>
              ปี/ภาคการศึกษา
              {confirmCrsYearAndSemester.map((term, index) => (
                <React.Fragment key={index}>
                  <br />
                  {term}
                </React.Fragment>
              ))}
            </Typography>
            <Typography sx={{ marginLeft: 7 }}>
              สถานะการตัดเกรด
              <br />
              ตัดเกรดแล้ว
              {/* {confirmCoordinators.map((coordinators, index) => (
                <React.Fragment key={index}>
                  <br />
                  {coordinators}
                </React.Fragment>
              ))} */}
            </Typography>
          </div>
          <Button
            sx={{
              marginTop: 10,
              color: "white",
              backgroundColor: PinkPallette.main,
              "&:hover": {
                backgroundColor: PinkPallette.light,
              },
              borderRadius: 20,
              width: 200,
            }}
            onClick={() => {
              navigate("/");
            }}
          >
            กลับหน้าหลัก
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmAddSubject;
