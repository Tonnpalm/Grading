import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import {
  TextField,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
} from "@mui/material";
import dayjs from "dayjs";

export default function ModuleModal({ open, onClose, onSubmit, data, mode }) {
  const [name, setName] = React.useState(
    data?.moduleName ? data?.moduleName : ""
  );
  const [semester, setSemester] = React.useState(
    data?.yearAndSemester ? data?.yearAndSemester.split("/")[1] : ""
  );
  const [year, setYear] = React.useState(
    data?.yearAndSemester ? data?.yearAndSemester.split("/")[0] : ""
  );
  // const [selectedDate, setSelectedDate] = React.useState(
  //   data?.selectedDate ? data?.selectedDate : ""
  // );
  const [duration, setDuration] = React.useState(
    data?.duration ? data?.duration : ""
  );
  // const [year, setYear] = React.useState("");
  // const [semester, setSemester] = React.useState("");
  // const [beforeFormatStartDate, setBeforeFormatStartDate] = React.useState(
  //   data?.selectedDate ? data?.selectedDate.split("-")[0] : ""
  // );
  // const [beforeFormatEndDate, setBeforeFormatEndDate] = React.useState(
  //   data?.selectedDate ? data?.selectedDate.split("-")[1] : ""
  // );
  // const formattedStartDate = dayjs(
  //   beforeFormatStartDate,
  //   "DD/MM/YYYY"
  // ).format();
  // const formattedEndDate = dayjs(beforeFormatEndDate, "DD/MM/YYYY").format();

  const [beforeFormatStartDate, setBeforeFormatStartDate] = React.useState(
    data?.selectedDate ? data?.selectedDate.split("-")[0] : ""
  );
  const [beforeFormatEndDate, setBeforeFormatEndDate] = React.useState(
    data?.selectedDate ? data?.selectedDate.split("-")[1] : ""
  );
  const formattedStartDate = beforeFormatStartDate
    ? dayjs(beforeFormatStartDate, "DD/MM/YYYY")
    : null;
  const formattedEndDate = beforeFormatEndDate
    ? dayjs(beforeFormatEndDate, "DD/MM/YYYY")
    : null;

  const [invalidDateError, setInvalidDateError] = React.useState(false);

  let title = "";
  switch (mode) {
    case "edit":
      title = "แก้ไขรายวิชา";
      break;
    case "add":
      title = "เพิ่มรายวิชา";
      break;
    case "duplicate":
      title = "คัดลอกมอดูล";
      break;
    default:
      break;
  }

  const handleSubmit = () => {
    // ตรวจสอบว่าวันที่สิ้นสุดมากกว่าหรือเท่ากับวันที่เริ่มต้น
    if (
      beforeFormatEndDate &&
      beforeFormatStartDate &&
      beforeFormatEndDate.isAfter(beforeFormatStartDate)
    ) {
      const rowAdded = {
        moduleName: name,
        yearAndSemester: year + "/" + semester,
        duration: duration,
        selectedDate:
          beforeFormatStartDate.format("DD/MM/YYYY") +
          " - " +
          beforeFormatEndDate.format("DD/MM/YYYY"),
      };
      onSubmit(rowAdded);
      handleClose();
    } else {
      setInvalidDateError(true);
    }

    // const sendModuleDatatoServer = {
    //   moduleName: name,
    //   startPeriod: beforeFormatStartDate.format("DD/MM/YYYY"),
    //   endPeriod: beforeFormatEndDate.format("DD/MM/YYYY"),
    //   hours: duration,
    //   year: year,
    //   semester: semester.toString(),
    //   crsID: "null",
    //   instructorID: "null",
    // };
    // axios
    //   .post(`http://localhost:8000/api/modules/`, sendModuleDatatoServer)
    //   .then((res) => {
    //     console.log(res);
    //   });
    // console.log("sendModule2Server", sendModuleDatatoServer);
  };

  const handleClose = () => {
    setName("");
    setYear("");
    setSemester("");
    setDuration("");
    setBeforeFormatStartDate(null); // เคลียร์ค่า selectedDateString เมื่อปิด Modal
    setBeforeFormatEndDate(null);
    onClose();
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        <DialogContent style={{ display: "flex", flexDirection: "column" }}>
          <TextField
            variant="standard"
            label="ชื่อมอดูล"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
            }}
          />
          <TextField
            variant="standard"
            label="ปีการศึกษา"
            value={year}
            onChange={(event) => {
              setYear(event.target.value);
            }}
          />
          <FormControl variant="standard">
            <InputLabel>ภาคการศึกษา</InputLabel>
            <Select
              variant="standard"
              placeholder="ภาคการศึกษา"
              value={semester}
              onChange={(event) => {
                setSemester(event.target.value);
              }}
            >
              <MenuItem value={1}>ภาคต้น</MenuItem>
              <MenuItem value={2}>ภาคปลาย</MenuItem>
              <MenuItem value={3}>ภาคฤดูร้อน</MenuItem>
            </Select>
          </FormControl>
          <TextField
            variant="standard"
            label="ระยะเวลาที่สอน (ชั่วโมง)"
            value={duration}
            onChange={(event) => {
              setDuration(event.target.value);
            }}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="วันที่เริ่มต้น"
              format="DD/MM/YYYY"
              slotProps={{
                textField: {
                  variant: "standard",
                },
              }}
              value={formattedStartDate}
              onChange={(newValue) => {
                // const formattedDate = dayjs(newValue).format("DD/MM/YYYY");
                setBeforeFormatStartDate(newValue);
              }}
            />
          </LocalizationProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="วันที่สิ้นสุด"
              format="DD/MM/YYYY"
              slotProps={{
                textField: {
                  variant: "standard",
                },
              }}
              value={formattedEndDate}
              onChange={(newValue) => {
                // const formattedDate = dayjs(newValue).format("DD/MM/YYYY");
                setBeforeFormatEndDate(newValue);
              }}
            />
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>ยกเลิก</Button>
          <Button onClick={handleSubmit} autoFocus>
            ตกลง
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={invalidDateError}
        onClose={() => setInvalidDateError(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">เกิดข้อผิดพลาด</DialogTitle>
        <DialogContent>
          <p>วันที่สิ้นสุดต้องไม่เป็นวันก่อนหน้าวันที่เริ่มต้น</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setInvalidDateError(false)} autoFocus>
            ตกลง
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
