import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { TextField, Autocomplete } from '@mui/material';


export default function ModalForAddSubject({open, onClose, onSubmit, staffList, data, mode}) {
    const [id, setId] = React.useState(data?.ID ? data?.ID : '')
    const [subjectName, setSubjectName] = React.useState(data?.subjectName ? data?.subjectName : '')
    const [section, setSection] = React.useState(data?.section ? data?.section : '')
    const [coordinators, setCoordinators] = React.useState(data?.coordinators ? data?.coordinators : [])
    
    let title = ''
    switch (mode){
      case "edit": 
        title = "แก้ไขรายวิชา"
        break
      case "add":
        title = "เพิ่มรายวิชา"
        break
      default: 
        break
    }
    
    React.useEffect(() => {
      console.log('id', id)
      console.log('subjectName', subjectName);
      console.log('sectioin', section);
      console.log('coordinator', coordinators);
    },[])

    const handleSubmit = () => {
        const rowAdded = {
            id: id,
            subjectName: subjectName,
            section: section,
            coordinators: coordinators,
        }
        onSubmit(rowAdded)
        handleClose()
    }

    const handleClose = () => {
        setId('')
        setSubjectName('')
        setSection('')
        setCoordinators([])
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
        <DialogContent style={{ display: 'flex', flexDirection: 'column' }}>
          <TextField 
            variant="standard"
            label='รหัสวิชา'
            value={id}
            onChange={(event) => {
                setId(event.target.value)
            }}
          />
          <TextField 
            variant="standard"
            label='ชื่อวิชา'
            value={subjectName}
            onChange={(event) => {
                setSubjectName(event.target.value)
            }}
          />
          <TextField 
            variant="standard"
            label='ตอนเรียน'
            value={section}
            onChange={(event) => {
                setSection(event.target.value)
            }}
          />
          <Autocomplete
            multiple
            id="staff"
            value={coordinators}
            options={staffList}
            // getOptionLabel={(option) => option.title}
            renderInput={(params) => (
                <TextField
                    {...params}
                    variant="standard"
                    label="ผู้ประสานงาน"
                />
            )}
            onChange={ (event, newValue, index) => {
              setCoordinators(newValue)
              console.log('index',index)
            }}
          />
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

