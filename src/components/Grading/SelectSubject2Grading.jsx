// eslint-disable-next-line no-unused-vars
import React, {useState} from 'react'
import './SelectSubject2Grading.css'
import ResponsiveAppBar from '../AppBar/ButtonAppBar'
import { Button, Divider, Typography } from '@mui/material'
import { styled } from '@mui/material/styles';
import SubjectIcon from '@mui/icons-material/Subject';
import VibrationIcon from '@mui/icons-material/Vibration';
import TextField from '@mui/material/TextField';
import ComboBox from './ComboBox';
import { PinkPallette } from '../../assets/pallettes';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useNavigate } from 'react-router';

export default function SelectSubject2Grading() {
    const navigate = useNavigate();

    const VisuallyHiddenInput = styled('input')({
        clip: 'rect(0 0 0 0)',
        clipPath: 'inset(50%)',
        height: 1,
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        left: 0,
        whiteSpace: 'nowrap',
        width: 1,
      });

    const [fileName, setFileName] = useState(""); // เก็บชื่อไฟล์ที่เลือก
      
    const handleFileChange = (event) => {
    const file = event.target.files[0];
        if (file) {
            setFileName(file.name);
          }
        };

        const [count, setCount] = useState(1); // เก็บจำนวน Component

        const handleAddComponent = () => {
          setCount(count + 1); // เพิ่มจำนวน Component ที่ต้องการแสดง
        };
      
  return (
    <div>
        <ResponsiveAppBar/>
        <div  className='select-subject-container'>
            <Button variant='contained' onClick={() => {navigate('/homepage')}}>
                กลับ
            </Button>
            <Typography sx={{ marginTop: '20px'}}>การประเมิมผลการศึกษาภาคปลาย ปีการศึกษา 2566</Typography>
            <div style={{ display: 'flex', flexDirection: 'row'}}>
                <div style={{ display: 'flex', flexDirection: 'column'}} >
                    <SubjectIcon sx={{ width: '35px', height: '31px'}}/>
                </div>
                <div>
                    <Typography>รายวิชา</Typography>
                    <Typography>เลือกวิชาที่ต้องการตัดเกรด</Typography>
                    <ComboBox/>
                    <Typography>อัปโหลดไฟล์ CR58</Typography>
                    {/* <input type="file" accept=".xlsx, .xls" style={{ backgroundColor: PinkPallette.main }}/> */}
                    <Button component="label" variant="contained" className="import-style" sx={{ backgroundColor: PinkPallette.main }} startIcon={<CloudUploadIcon />}>
                        Upload file
                        <VisuallyHiddenInput type="file" className="form-control custom-form-control" onChange={handleFileChange} />
                    </Button>
                    <TextField 
                        id="outlined-basic" 
                        placeholder="ชื่อไฟล์" 
                        variant="outlined" 
                        value={fileName}
                    />
                    <Divider sx={{ marginTop: '100px', backgroundColor: 'black' }}/>
                </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'row'}}>
                <div style={{ display: 'flex', flexDirection: 'column'}}>
                    <VibrationIcon sx={{ width: '35px', height: '31px'}}/>
                </div>
                <div>
                    <Typography>รูปแบบการให้คะแนน</Typography>
                    <Typography>กำหนดสัดส่วนน้ำหนักมอดูล</Typography>
                    {Array.from({ length: count }, (_, index) => (
                    <AddMoreModule key={index} index={index + 1} /> // กำหนด key เพื่อให้ React รู้จักแต่ละ Component และส่งตัวเลขกำกับไปให้ Component
                    ))}        
                    <Button onClick={handleAddComponent}>เพิ่มมอดูล</Button>
                </div>
            </div>
        </div>
    </div>
  )
}

// eslint-disable-next-line react/prop-types
function AddMoreModule({ index }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'row', marginTop: '10px' }}>
            <Typography>มอดูลที่ {index}</Typography>
            <ComboBox sx={{ padding: 0}}/>
            <Typography sx={{ marginLeft: 2 }}>คิดเป็น</Typography>
            <TextField sx={{ marginLeft: 2 }}>00.00</TextField>
            <Typography>ส่วน</Typography>
        </div>
    )
  }