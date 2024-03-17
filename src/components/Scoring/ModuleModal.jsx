import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { SingleInputDateRangeField } from '@mui/x-date-pickers-pro/SingleInputDateRangeField';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { TextField } from '@mui/material';


export default function ModuleModal({open, onClose, onSubmit, data, mode}) {
    const [name, setName] = React.useState(data?.moduleName ? data?.moduleName : '')
    const [yearAndSemester, setYearAndSemester] = React.useState(data?.yearAndSemester ? data?.yearAndSemester : '')
    const [duration, setDuration] = React.useState(data?.duration ? data?.duration : '')
    const [hours, setHours] = React.useState(data?.hours ? data?.hours : [])
    
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
            hours: hours,
        }
        onSubmit(rowAdded)
        handleClose()
    }

    const handleClose = () => {
        setName('')
        setYearAndSemester('')
        setDuration('')
        setHours([])
        onClose()
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
        <DialogContent>
            <TextField 
                variant='outlined'
                label='ชื่อมอดูล'
                value={name}
                onChange={(event) => {
                    setName(event.target.value)
                }}
            />
            <TextField 
                variant='outlined'
                label='ปี/ภาคการศึกษา'
                value={yearAndSemester}
                onChange={(event) => {
                    setYearAndSemester(event.target.value)
                }}
            />
            <TextField 
                variant='outlined'
                label='ระยะเวลาที่สอน'
                value={duration}
                onChange={(event) => {
                    setDuration(event.target.value)
                }}
            />
<LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['SingleInputDateRangeField']}>
        <DateRangePicker
          slots={{ field: SingleInputDateRangeField }}
          name="allowedRange"
        />
      </DemoContainer>
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

