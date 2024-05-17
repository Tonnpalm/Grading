// eslint-disable-next-line no-unused-vars
import React, { useContext, useEffect, useState } from "react";
import "./HomepageC.css";
import ResponsiveAppBar from "../AppBar/ButtonAppBar";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import BeenhereIcon from "@mui/icons-material/Beenhere";
import AddToPhotosIcon from "@mui/icons-material/AddToPhotos";
import { PinkPallette } from "../../assets/pallettes";
import { GreyPallette } from "../../assets/pallettes";

import { useNavigate } from "react-router-dom";
import { DataAcrossPages } from "../../assets/DataAcrossPages";
import { axios } from "../../utils/customAxios";
import { useCookies } from "react-cookie";

function Homepage() {
  const navigate = useNavigate();
  const { setData } = useContext(DataAcrossPages);
  const [cookies, setCookie] = useCookies([]);
  const [staffIDFromHomepage, setStaffIDFromHomepage] = React.useState("");
  // const [semester, setSemester] = React.useState("");

  const [goToImportWithStaffID, setGoToImportWithStaffID] = useState("");
  const [registerOfficer, setRegisterOfficer] = useState(false);
  const [goToScoringWithStaffID, setGoToScoringWithStaffID] = useState();

  useEffect(() => {
    const storedCode = "34131"; // รหัสที่ต้องการตรวจสอ[]

    axios.get(`/staffs/allStaffs`).then((response) => {
      console.log(response.data);
      response.data.staffs.map((staff) => {
        if (staff.isRegistraOfficer === true) {
          console.log(staff.staffID);
          console.log(storedCode);
          if (staff.staffID === storedCode) {
            setRegisterOfficer(true);
            setGoToImportWithStaffID(staff.staffID);
            setGoToScoringWithStaffID(staff._id);
          }
        } else {
          if (staff.staffID === storedCode) {
            // setRegisterOfficer(true);
            console.log("staff id", staff._id);
            setGoToImportWithStaffID(staff.staffID);
            setGoToScoringWithStaffID(staff._id);
          }
        }
      });
    });
  }, []);

  const handleImportSubjectButton = () => {
    setData(goToImportWithStaffID);
    navigate("/addSubject");
  };

  const handleScoringButton = () => {
    // setData(goToScoringWithStaffID);
    setCookie("staffIDFromHomepage", goToScoringWithStaffID);
    navigate("/scoring");
  };
  34131;
  const handleGradingButton = () => {
    setData(goToScoringWithStaffID);
    // setData("65f90efa4ef7a70f80525052");

    navigate("/yearAndSemester");
  };
  return (
    <div>
      <ResponsiveAppBar />
      <section className="wallpaperHomepage">
        <div className="content">
          <Card
            sx={{
              maxWidth: 255,
              maxHeight: 255,
              mr: 6,
              backgroundColor:
                registerOfficer === true
                  ? PinkPallette.main
                  : GreyPallette.main, // ใช้ GreyPallette แทน "grey"
            }}
          >
            <CardActionArea
              sx={{
                p: 3,
                paddingRight: 7,
                paddingLeft: 7,
                "&:hover":
                  registerOfficer === true
                    ? { backgroundColor: PinkPallette.light }
                    : {}, // ใช้เงื่อนไขเพื่อกำหนด hover ตามรหัส
              }}
              onClick={() => {
                if (registerOfficer === true) {
                  handleImportSubjectButton(); // ให้ทำงานเมื่อมีรหัสเข้ามา
                }
              }}
            >
              <CardContent
                sx={{
                  color: "white",
                  width: "155",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <CardMedia sx={{ display: "flex", justifyContent: "center" }}>
                  <AddToPhotosIcon sx={{ width: "107px", height: "107px" }} />
                </CardMedia>
                <Typography
                  variant="body2"
                  whiteSpace="nowrap"
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    textAlign: "center",
                  }}
                >
                  นำเข้ารายวิชา
                  <br />
                  ทั้งหมด
                </Typography>
                {/* <Typography
                  variant="body2"
                  whiteSpace="nowrap"
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    padding: 0,
                  }}
                >
                  
                </Typography> */}
              </CardContent>
            </CardActionArea>
          </Card>

          <Card
            sx={{
              maxWidth: 255,
              mr: 6,
              ml: 6,
              backgroundColor: PinkPallette.main, // ใช้ GreyPallette แทน "grey"
              "&:hover": { backgroundColor: PinkPallette.light }, // ใช้เงื่อนไขเพื่อกำหนด hover ตามรหัส
            }}
          >
            <CardActionArea
              sx={{ p: 3, paddingRight: 7, paddingLeft: 7 }}
              onClick={() => {
                handleScoringButton();
              }}
            >
              <CardContent sx={{ color: "white", width: "155" }}>
                <CardMedia sx={{ display: "flex", justifyContent: "center" }}>
                  <EditIcon sx={{ width: "107px", height: "107px" }}></EditIcon>
                </CardMedia>
                <Typography
                  variant="body2"
                  whiteSpace="nowrap"
                  sx={{ display: "flex", justifyContent: "center" }}
                >
                  ให้คะแนน
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>

          <Card
            sx={{
              maxWidth: 255,
              ml: 6,
              backgroundColor: PinkPallette.main,
            }}
          >
            <CardActionArea
              sx={{
                p: 3,
                paddingRight: 7,
                paddingLeft: 7,
                "&:hover": { backgroundColor: PinkPallette.light }, // ใช้เงื่อนไขเพื่อกำหนด hover ตามรหัส
              }}
              onClick={() => {
                // if (registerOfficer === "ผู้ประสานงาน") {
                //   handleGradingButton();
                // }
                handleGradingButton();
              }}
            >
              <CardContent sx={{ color: "white", width: "155" }}>
                <CardMedia sx={{ display: "flex", justifyContent: "center" }}>
                  <BeenhereIcon
                    sx={{ width: "107px", height: "107px" }}
                  ></BeenhereIcon>
                </CardMedia>
                <Typography
                  variant="body2"
                  whiteSpace="nowrap"
                  sx={{ display: "flex", justifyContent: "center" }}
                >
                  ออกเกรด
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </div>
      </section>
    </div>
  );
}

export default Homepage;
