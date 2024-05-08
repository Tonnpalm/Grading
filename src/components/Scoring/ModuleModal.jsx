import * as React from "react";
import toast, { Toaster } from "react-hot-toast";

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
  Autocomplete,
} from "@mui/material";
import dayjs from "dayjs";

export default function ModuleModal({ open, onClose, onSubmit, data, mode }) {
  const [name, setName] = React.useState(
    data?.moduleName ? data?.moduleName : ""
  );
  const [semester, setSemester] = React.useState(
    data?.yearAndSemester ? data?.yearAndSemester.split("/")[1] : ""
  );
  const [semesterToShow, setSemesterToShow] = React.useState();
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
    data?.selectedDate ? data?.selectedDate.split(" - ")[0] : ""
  );
  const [beforeFormatEndDate, setBeforeFormatEndDate] = React.useState(
    data?.selectedDate ? data?.selectedDate.split(" - ")[1] : ""
  );
  // console.log("date picker", beforeFormatEndDate);
  const formattedStartDate = beforeFormatStartDate
    ? dayjs(beforeFormatStartDate, "DD/MM/YYYY")
    : null;
  const formattedEndDate = beforeFormatEndDate
    ? dayjs(beforeFormatEndDate, "DD/MM/YYYY")
    : null;
  // console.log("date picker", formattedEndDate);

  const [invalidDateError, setInvalidDateError] = React.useState(false);

  const numOnly = () =>
    toast.error("กรุณากรอกเป็นตัวเลขเท่านั้น", {
      style: {
        borderRadius: "10px",
        background: "red",
        color: "#fff",
      },
    });
  const handleChangeYear = (event) => {
    const inputYear = event.target.value;
    // ตรวจสอบว่าเป็นตัวเลขหรือไม่
    if (!isNaN(inputYear)) {
      console.log("ตัวเลขจ้า");
      setYear(inputYear);
    } else {
      // แสดงข้อความแจ้งเตือน
      numOnly();
    }
  };
  const handleChangeDuration = (event) => {
    const inputYear = event.target.value;
    // ตรวจสอบว่าเป็นตัวเลขหรือไม่
    if (!isNaN(inputYear)) {
      console.log("ตัวเลขจ้า");
      setDuration(inputYear);
    } else {
      // แสดงข้อความแจ้งเตือน
      numOnly();
    }
  };

  let title = "";
  switch (mode) {
    case "edit":
      title = "แก้ไขรายวิชา";
      break;
    case "add":
      title = "เพิ่มมอดูล";
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
      formattedEndDate &&
      formattedStartDate &&
      formattedEndDate.isAfter(formattedStartDate)
    ) {
      const rowAdded = {
        moduleName: name,
        yearAndSemester: year + "/" + semester,
        duration: duration,
        selectedDate:
          formattedStartDate.format("DD/MM/YYYY") +
          " - " +
          formattedEndDate.format("DD/MM/YYYY"),
      };
      onSubmit(rowAdded);
      handleClose();
    } else {
      setInvalidDateError(true);
    }
  };

  const handleClose = () => {
    setName("");
    setYear("");
    setSemester("");
    setSemesterToShow("");
    setDuration("");
    setBeforeFormatStartDate(null); // เคลียร์ค่า selectedDateString เมื่อปิด Modal
    setBeforeFormatEndDate(null);
    onClose();
  };
  const handleAutocompleteChange = (event, value) => {
    setSemester(value);
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
            label="ปีการศึกษา (ค.ศ.)"
            value={year}
            onChange={(event) => {
              handleChangeYear(event);
            }}
          />
          {/* <FormControl variant="standard">
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
          </FormControl> */}
          <Autocomplete
            value={semesterToShow}
            onChange={(event, newValue) => {
              setSemester(newValue.value);
              setSemesterToShow(newValue.label);
            }}
            options={[
              { value: 1, label: "ภาคต้น" },
              { value: 2, label: "ภาคปลาย" },
              { value: 3, label: "ภาคฤดูร้อน" },
            ]}
            // getOptionLabel={(option) => option.label}
            renderInput={(params) => (
              <TextField
                {...params}
                label="ภาคการศึกษา"
                variant="standard"
                placeholder="ภาคการศึกษา"
              />
            )}
          />
          <TextField
            variant="standard"
            label="ระยะเวลาที่สอน (ชั่วโมง)"
            value={duration}
            onChange={(event) => {
              handleChangeDuration(event);
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
      <Toaster />
    </>
  );
}
