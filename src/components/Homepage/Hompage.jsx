// eslint-disable-next-line no-unused-vars
import React, { useContext } from "react";
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
import { useNavigate } from "react-router-dom";
import { DataAcrossPages } from "../../assets/DataAcrossPages";

function Homepage() {
  const navigate = useNavigate();
  const { setData } = useContext(DataAcrossPages);
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
              backgroundColor: PinkPallette.main,
            }}
          >
            <CardActionArea
              sx={{
                p: 3,
                paddingRight: 7,
                paddingLeft: 7,
                "&:hover": { backgroundColor: PinkPallette.light },
              }}
              onClick={() => {
                navigate("/addSubject");
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
              backgroundColor: PinkPallette.main,
              "&:hover": { backgroundColor: PinkPallette.light },
            }}
          >
            <CardActionArea
              sx={{ p: 3, paddingRight: 7, paddingLeft: 7 }}
              onClick={() => {
                setData("65f90efa4ef7a70f80525050");
                navigate("/scoring");
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
            sx={{ maxWidth: 255, ml: 6, backgroundColor: PinkPallette.main }}
          >
            <CardActionArea
              sx={{
                p: 3,
                paddingRight: 7,
                paddingLeft: 7,
                "&:hover": { backgroundColor: PinkPallette.light },
              }}
              onClick={() => {
                navigate("/yearAndSemester");
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
