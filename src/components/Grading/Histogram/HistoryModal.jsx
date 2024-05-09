import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { useEffect, useState } from "react";
import { Grid, Paper } from "@mui/material";
import { styled } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import { PinkPallette } from "../../../assets/pallettes";
import { useCookies } from "react-cookie";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  alignContent: "center",

  color: theme.palette.text.secondary,
}));

export default function HistoryModal({ open, onClose, onSubmit, historyData }) {
  const handleClose = () => {
    onClose();
  };
  const [cookies, setCookie] = useCookies();
  const crsName = cookies["crsName"];

  const fullWidth = true;
  const maxWidth = "lg";
  const year = historyData;
  let semesterValue = "";
  switch (year.semester) {
    case "1":
      semesterValue = "ภาคต้น";
      break;
    case "2":
      semesterValue = "ภาคปลาย";
      break;
    case "3":
      semesterValue = "ภาคฤดูร้อน";
      break;
    default:
      semesterValue = "0";
  }

  const [cutOffGradeA, setCutOffGradeA] = useState(); // ค่าเริ่มต้นของ cut-off grade A
  const [amountA, setAmountA] = useState();
  const [perAmountA, setPerAmountA] = useState();
  const [cutOffGradeBPlus, setCutOffGradeBPlus] = useState(); // ค่าเริ่มต้นของ cut-off grade B+
  const [amountBPlus, setAmountBPlus] = useState();
  const [perAmountBPlus, setPerAmountBPlus] = useState();
  const [cutOffGradeB, setCutOffGradeB] = useState(); // ค่าเริ่มต้นของ cut-off grade B
  const [amountB, setAmountB] = useState();
  const [perAmountB, setPerAmountB] = useState();
  const [cutOffGradeCPlus, setCutOffGradeCPlus] = useState(); // ค่าเริ่มต้นของ cut-off grade C+
  const [amountCPlus, setAmountCPlus] = useState();
  const [perAmountCPlus, setPerAmountCPlus] = useState();
  const [cutOffGradeC, setCutOffGradeC] = useState(); // ค่าเริ่มต้นของ cut-off grade C
  const [amountC, setAmountC] = useState();
  const [perAmountC, setPerAmountC] = useState();
  const [cutOffGradeDPlus, setCutOffGradeDPlus] = useState(); // ค่าเริ่มต้นของ cut-off grade D+
  const [amountDPlus, setAmountDPlus] = useState();
  const [perAmountDPlus, setPerAmountDPlus] = useState();
  const [cutOffGradeD, setCutOffGradeD] = useState(); // ค่าเริ่มต้นของ cut-off grade D
  const [amountD, setAmountD] = useState();
  const [perAmountD, setPerAmountD] = useState();
  const [amountF, setAmountF] = useState();
  const [perAmountF, setPerAmountF] = useState();

  const [amountI, setAmountI] = useState();
  const [perAmountI, setPerAmountI] = useState();
  const [amountM, setAmountM] = useState();
  const [perAmountM, setPerAmountM] = useState();
  const [amountW, setAmountW] = useState();
  const [perAmountW, setPerAmountW] = useState();
  const [amountS, setAmountS] = useState();
  const [perAmountS, setPerAmountS] = useState();
  const [amountU, setAmountU] = useState();
  const [perAmountU, setPerAmountU] = useState();
  const [amountV, setAmountV] = useState();
  const [perAmountV, setPerAmountV] = useState();

  const totalAmount =
    parseFloat(amountA || 0) +
    parseFloat(amountBPlus || 0) +
    parseFloat(amountB || 0) +
    parseFloat(amountCPlus || 0) +
    parseFloat(amountC || 0) +
    parseFloat(amountDPlus || 0) +
    parseFloat(amountD || 0) +
    parseFloat(amountF || 0) +
    parseFloat(amountI || 0) +
    parseFloat(amountM || 0) +
    parseFloat(amountW || 0) +
    parseFloat(amountS || 0) +
    parseFloat(amountU || 0) +
    parseFloat(amountV || 0);

  const totalPerAmount =
    parseFloat(perAmountA || 0) +
    parseFloat(perAmountBPlus || 0) +
    parseFloat(perAmountB || 0) +
    parseFloat(perAmountCPlus || 0) +
    parseFloat(perAmountC || 0) +
    parseFloat(perAmountDPlus || 0) +
    parseFloat(perAmountD || 0) +
    parseFloat(perAmountF || 0) +
    parseFloat(perAmountI || 0) +
    parseFloat(perAmountM || 0) +
    parseFloat(perAmountW || 0) +
    parseFloat(perAmountS || 0) +
    parseFloat(perAmountU || 0) +
    parseFloat(perAmountV || 0);

  const mean =
    (parseFloat(amountA || 0) * 4 +
      parseFloat(amountBPlus || 0) * 3.5 +
      parseFloat(amountB || 0) * 3 +
      parseFloat(amountCPlus || 0) * 2.5 +
      parseFloat(amountC || 0) * 2 +
      parseFloat(amountDPlus || 0) * 1.5 +
      parseFloat(amountD || 0) * 1) /
    (parseFloat(amountA || 0) +
      parseFloat(amountBPlus || 0) +
      parseFloat(amountB || 0) +
      parseFloat(amountCPlus || 0) +
      parseFloat(amountC || 0) +
      parseFloat(amountDPlus || 0) +
      parseFloat(amountD || 0) +
      parseFloat(amountF || 0));

  useEffect(() => {
    const shapedData = historyData;
    shapedData.criteria.map((grade) => {
      if (grade.cName === "A") {
        setCutOffGradeA(grade.cScore);
        setAmountA(grade.sAmount);
        setPerAmountA(grade.sPercent);
      }
      if (grade.cName === "B+") {
        setCutOffGradeBPlus(grade.cScore);
        setAmountBPlus(grade.sAmount);
        setPerAmountBPlus(grade.sPercent);
      }
      if (grade.cName === "B") {
        setCutOffGradeB(grade.cScore);
        setAmountB(grade.sAmount);
        setPerAmountB(grade.sPercent);
      }
      if (grade.cName === "C+") {
        setCutOffGradeCPlus(grade.cScore);
        setAmountCPlus(grade.sAmount);
        setPerAmountCPlus(grade.sPercent);
      }
      if (grade.cName === "C") {
        setCutOffGradeC(grade.cScore);
        setAmountC(grade.sAmount);
        setPerAmountC(grade.sPercent);
      }
      if (grade.cName === "D+") {
        setCutOffGradeDPlus(grade.cScore);
        setAmountDPlus(grade.sAmount);
        setPerAmountDPlus(grade.sPercent);
      }
      if (grade.cName === "D") {
        setCutOffGradeD(grade.cScore);
        setAmountD(grade.sAmount);
        setPerAmountD(grade.sPercent);
      }
      if (grade.cName === "F") {
        setAmountF(grade.sAmount);
        setPerAmountF(grade.sPercent);
      }
      if (grade.cName === "I") {
        setAmountI(grade.sAmount);
        setPerAmountI(grade.sPercent);
      }
      if (grade.cName === "M") {
        setAmountM(grade.sAmount);
        setPerAmountM(grade.sPercent);
      }
      if (grade.cName === "W") {
        setAmountW(grade.sAmount);
        setPerAmountW(grade.sPercent);
      }
      if (grade.cName === "S") {
        setAmountS(grade.sAmount);
        setPerAmountS(grade.sPercent);
      }
      if (grade.cName === "U") {
        setAmountU(grade.sAmount);
        setPerAmountU(grade.sPercent);
      }
      if (grade.cName === "V") {
        setAmountV(grade.sAmount);
        setPerAmountV(grade.sPercent);
      }
    });
  }, []);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth={fullWidth}
      maxWidth={maxWidth}
    >
      <AppBar sx={{ position: "relative", backgroundColor: PinkPallette.main }}>
        <Toolbar>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            ผลการตัดเกรดย้อนหลัง
          </Typography>
          <IconButton
            autoFocus
            edge="end"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <DialogContent>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            paddingBottom: 20,
          }}
        >
          <Typography fontSize={18}>
            วิชา {crsName} {semesterValue} ปีการศึกษา {year.year}
          </Typography>
        </div>
        <div>
          <Grid
            container
            spacing={2}
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            <Grid item md={5}>
              <Item
                style={{
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  width: 450,
                  height: 440,
                }}
              >
                <Grid container spacing={1}>
                  <Grid item md={2}>
                    <Typography
                      sx={{ display: "flex", justifyContent: "center" }}
                    >
                      เกรด
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    md={4}
                    sx={{ display: "flex", flexDirection: "row" }}
                  >
                    <Typography>เกณฑ์คะแนน</Typography>
                  </Grid>
                  <Grid item md={3}>
                    <Typography>จำนวน (คน)</Typography>
                  </Grid>
                  <Grid item md={3}>
                    <Typography>คิดเป็น (%)</Typography>
                  </Grid>
                </Grid>
                <Grid container spacing={2} paddingTop={1}>
                  <Grid item md={2}>
                    <Typography sx={{ paddingTop: "10px" }}>A</Typography>
                  </Grid>
                  <Grid item md={4}>
                    <Typography sx={{ paddingTop: "10px" }}>
                      {cutOffGradeA}
                    </Typography>
                  </Grid>
                  <Grid item md={3}>
                    <Typography sx={{ paddingTop: "10px" }}>
                      {amountA}
                    </Typography>
                  </Grid>
                  <Grid item md={3}>
                    <Typography sx={{ paddingTop: "10px" }}>
                      {perAmountA}
                    </Typography>
                  </Grid>
                </Grid>

                <Grid container spacing={2} paddingTop={2}>
                  <Grid item xs={2}>
                    <Typography sx={{ paddingTop: "10px", paddingLeft: "7px" }}>
                      B+
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography sx={{ paddingTop: "10px" }}>
                      {cutOffGradeBPlus}
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography sx={{ paddingTop: "10px" }}>
                      {amountBPlus}
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography sx={{ paddingTop: "10px" }}>
                      {perAmountBPlus}
                    </Typography>
                  </Grid>
                </Grid>

                <Grid container spacing={2} paddingTop={2}>
                  <Grid item xs={2}>
                    <Typography sx={{ paddingTop: "10px" }}>B</Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography sx={{ paddingTop: "10px" }}>
                      {cutOffGradeB}
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography sx={{ paddingTop: "10px" }}>
                      {amountB}
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography sx={{ paddingTop: "10px" }}>
                      {perAmountB}
                    </Typography>
                  </Grid>
                </Grid>

                <Grid container spacing={2} paddingTop={2}>
                  <Grid item xs={2}>
                    <Typography sx={{ paddingTop: "10px", paddingLeft: "7px" }}>
                      C+
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography sx={{ paddingTop: "10px" }}>
                      {cutOffGradeCPlus}
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography sx={{ paddingTop: "10px" }}>
                      {amountCPlus}
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography sx={{ paddingTop: "10px" }}>
                      {perAmountCPlus}
                    </Typography>
                  </Grid>
                </Grid>

                <Grid container spacing={2} paddingTop={2}>
                  <Grid item xs={2}>
                    <Typography sx={{ paddingTop: "10px" }}>C</Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography sx={{ paddingTop: "10px" }}>
                      {cutOffGradeC}
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography sx={{ paddingTop: "10px" }}>
                      {amountC}
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography sx={{ paddingTop: "10px" }}>
                      {perAmountC}
                    </Typography>
                  </Grid>
                </Grid>

                <Grid container spacing={2} paddingTop={2}>
                  <Grid item xs={2}>
                    <Typography sx={{ paddingTop: "10px", paddingLeft: "7px" }}>
                      D+
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography sx={{ paddingTop: "10px" }}>
                      {cutOffGradeDPlus}
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography sx={{ paddingTop: "10px" }}>
                      {amountDPlus}
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography sx={{ paddingTop: "10px" }}>
                      {perAmountDPlus}
                    </Typography>
                  </Grid>
                </Grid>

                <Grid container spacing={2} paddingTop={2}>
                  <Grid item xs={2}>
                    <Typography sx={{ paddingTop: "10px" }}>D</Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography sx={{ paddingTop: "10px" }}>
                      {cutOffGradeD}
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography sx={{ paddingTop: "10px" }}>
                      {amountD}
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography sx={{ paddingTop: "10px" }}>
                      {perAmountD}
                    </Typography>
                  </Grid>
                </Grid>

                <Grid container spacing={2} paddingTop={2} paddingBottom={1}>
                  <Grid item xs={2}>
                    <Typography sx={{ paddingTop: "10px" }}>F</Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography sx={{ paddingTop: "10px" }}>
                      {"<"}
                      {cutOffGradeD}
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography sx={{ paddingTop: "10px" }}>
                      {amountF || 0}
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography sx={{ paddingTop: "10px" }}>
                      {perAmountF || 0}
                    </Typography>
                  </Grid>
                </Grid>
              </Item>
            </Grid>
            <Grid item md={5}>
              <Item
                style={{
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  width: 450,
                }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <Typography>เกรด</Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography>จำนวน (คน)</Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography>คิดเป็น(%)</Typography>
                  </Grid>
                </Grid>
                <Grid container spacing={2} paddingTop={1}>
                  <Grid item xs={4}>
                    <Typography sx={{ paddingTop: "10px" }}>I</Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography sx={{ paddingTop: "10px" }}>
                      {" "}
                      {amountI || 0}
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography sx={{ paddingTop: "10px" }}>
                      {perAmountI || 0}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container spacing={2} paddingTop={2}>
                  <Grid item xs={4}>
                    <Typography sx={{ paddingTop: "10px" }}>M</Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography sx={{ paddingTop: "10px" }}>
                      {amountM || 0}
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography sx={{ paddingTop: "10px" }}>
                      {perAmountM || 0}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container spacing={2} paddingTop={2}>
                  <Grid item xs={4}>
                    <Typography sx={{ paddingTop: "10px" }}>W</Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography sx={{ paddingTop: "10px" }}>
                      {amountW || 0}
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography sx={{ paddingTop: "10px" }}>
                      {perAmountW || 0}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container spacing={2} paddingTop={2}>
                  <Grid item xs={4}>
                    <Typography sx={{ paddingTop: "10px" }}>S</Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography sx={{ paddingTop: "10px" }}>
                      {amountS || 0}
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography sx={{ paddingTop: "10px" }}>
                      {perAmountS || 0}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container spacing={2} paddingTop={2}>
                  <Grid item xs={4}>
                    <Typography sx={{ paddingTop: "10px" }}>U</Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography sx={{ paddingTop: "10px" }}>
                      {amountU || 0}
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography sx={{ paddingTop: "10px" }}>
                      {perAmountU || 0}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container spacing={2} paddingTop={2}>
                  <Grid item xs={4}>
                    <Typography sx={{ paddingTop: "10px" }}>V</Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography sx={{ paddingTop: "10px" }}>
                      {amountV || 0}
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography sx={{ paddingTop: "10px" }}>
                      {perAmountV || 0}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container spacing={2} paddingTop={2}>
                  <Grid item xs={4}>
                    <Typography sx={{ paddingTop: "10px" }}>รวม</Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography sx={{ paddingTop: "10px" }}>
                      {totalAmount}
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography sx={{ paddingTop: "10px" }}>
                      {totalPerAmount.toFixed(0)}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container spacing={2} paddingTop={2} paddingBottom={1}>
                  <Grid item xs={4}>
                    <Typography sx={{ paddingTop: "10px" }}>
                      เกรดเฉลี่ย
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography sx={{ paddingTop: "10px" }}>
                      {mean.toFixed(2)}
                    </Typography>
                  </Grid>
                </Grid>
              </Item>
            </Grid>
          </Grid>
        </div>
      </DialogContent>
    </Dialog>
  );
}
