import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TextField } from '@mui/material';


export default function ModuleModal({open, onClose, onSubmit, data, mode}) {
    const [name, setName] = React.useState(data?.moduleName ? data?.moduleName : '')
    const [yearAndSemester, setYearAndSemester] = React.useState(data?.yearAndSemester ? data?.yearAndSemester : '')
    const [duration, setDuration] = React.useState(data?.duration ? data?.duration : '')
    const [startDate, setStartDate] = React.useState('');
    const [endDate, setEndDate] = React.useState('');
    
    let title = ''
    switch (mode){
        case "edit": 
            title = "แก้ไขรายวิชา"
            break
        case "add":
            title = "เพิ่มรายวิชา"
            break
        case "duplicate":
            title = "คัดลอกมอดูล"
            break
      default: 
        break
    }
    
    const handleSubmit = () => {
        const rowAdded = {
            moduleName: name,
            yearAndSemester: yearAndSemester,
            duration: duration,
            selectedDate: startDate.format('DD/MM/YYYY') + ' - ' + endDate.format('DD/MM/YYYY')        }
        onSubmit(rowAdded);
        handleClose();
    }

    const handleClose = () => {
        setName('');
        setYearAndSemester('');
        setDuration('');
        setStartDate(null); // เคลียร์ค่า selectedDateString เมื่อปิด Modal
        setEndDate(null);
        onClose();
    }

  return (
        <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
        <DialogTitle id="alert-dialog-title">
            {title}
        </DialogTitle>
        <DialogContent style={{ display: 'flex', flexDirection: 'column' }}>
            <TextField 
                variant="standard"
                label='ชื่อมอดูล'
                value={name}
                onChange={(event) => {
                    setName(event.target.value)
                }}
            />
            <TextField 
                variant="standard"
                label='ปี/ภาคการศึกษา'
                value={yearAndSemester}
                onChange={(event) => {
                    setYearAndSemester(event.target.value)
                }}
            />
            <TextField 
                variant="standard"
                label='ระยะเวลาที่สอน'
                value={duration}
                onChange={(event) => {
                    setDuration(event.target.value)
                }}
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker 
                    label="วันที่เริ่มต้น"
                    slotProps={{ textField: { variant: 'standard' } }}
                    value={startDate}
                    onChange={(newValue) => {
                        setStartDate(newValue);
                    }}
                />
            </LocalizationProvider>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker 
                        label="วันที่สิ้นสุด"
                        slotProps={{ textField: { variant: 'standard' } }}
                        value={endDate}
                        onChange={(newValue) => {
                            setEndDate(newValue);
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
  );
}

