import ResponsiveAppBar from "../../AppBar/ButtonAppBar";
import Grading from "./TestHistogram";
import { useContext } from "react";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { Typography, Button } from "@mui/material";
import { PinkPallette } from "../../../assets/pallettes";
import { DataAcrossPages } from "../../../assets/DataAcrossPages";
import { useNavigate } from "react-router-dom";

export default function GradeAdjustment() {
  const navigate = useNavigate;
  const { data } = useContext(DataAcrossPages);
  console.log(data);

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
          <Typography>2302008 Chem Tech II ภาคปลาย ปีการศึกษา 2024</Typography>
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
        {/* <div
          style={{
            paddingLeft: "10%",
            paddingRight: "10%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ScoreTable />
        </div> */}
        <div
          style={{
            paddingLeft: "10%",
            paddingRight: "10%",
            marginTop: "30px",
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 40,
          }}
        >
          <Button
            variant="contained"
            startIcon={<ArrowBackIosIcon />}
            sx={{
              backgroundColor: PinkPallette.main,
              "&:hover": {
                backgroundColor: PinkPallette.light,
              },
            }}
            onClick={() => {
              navigate("/selectSubject2grading");
            }}
          >
            ย้อนกลับ
          </Button>
          <Button
            variant="contained"
            color="success"
            endIcon={<ArrowForwardIosIcon />}
          >
            ต่อไป
          </Button>
        </div>
      </div>
    </div>
  );
}
