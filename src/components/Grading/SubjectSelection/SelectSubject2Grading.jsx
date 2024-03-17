// eslint-disable-next-line no-unused-vars
import React, {useState} from 'react'
import './SelectSubject2Grading.css'
import ResponsiveAppBar from '../../AppBar/ButtonAppBar'
import { Button, Divider, Typography } from '@mui/material'
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { styled } from '@mui/material/styles';
import SubjectIcon from '@mui/icons-material/Subject';
import VibrationIcon from '@mui/icons-material/Vibration';
import TextField from '@mui/material/TextField';
import ComboBox from './ComboBox';
import { PinkPallette } from '../../../assets/pallettes';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useNavigate } from 'react-router';
import Grid from '@mui/material/Grid';
import * as XLSX from "xlsx";
import { useCookies } from 'react-cookie';


export default function SelectSubject2Grading() {
    const navigate = useNavigate();
    const [cookies, setCookie] = useCookies([]);
    const [CR58, setCR58] = React.useState('');
    const [course, setCourse] = React.useState('');
    const [excelData, setExcelData] = useState([]);
    const [moduleDetail, setModuleDetail] = useState([]);

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
      
        // const Item = styled(Paper)(({ theme }) => ({
        //     backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        //     ...theme.typography.body2,
        //     padding: theme.spacing(1),
        //     textAlign: 'center',
        //     color: theme.palette.text.secondary,
        //   }));
        const handleFileUpload = (event) => {
            const file = event.target.files[0];
            const reader = new FileReader();
        
            reader.onload = (e) => {
              const data = new Uint8Array(e.target.result);
              const workbook = XLSX.read(data, { type: "array" });
              const firstSheetName = workbook.SheetNames[0];
              const worksheet = workbook.Sheets[firstSheetName];
              const excelData = XLSX.utils.sheet_to_json(worksheet, { header: 2 });
              console.log(excelData);
              setExcelData(excelData);
            };
        
            reader.readAsArrayBuffer(file);
          };
  return (
    <div>
        <ResponsiveAppBar/>
        <div  className='select-subject-container'>
            <Button 
                variant='contained' 
                sx={{ backgroundColor: "white", color: "black" }}
                startIcon={<ArrowBackIosIcon />} 
                onClick={() => {navigate('/')}}>
                กลับ
            </Button>
            <Typography sx={{ marginTop: '20px'}}>การประเมิมผลการศึกษาภาคปลาย ปีการศึกษา 2566</Typography>
            <div style={{ display: 'flex', flexDirection: 'row', marginTop: '50px'}}>
                <div style={{ display: 'flex', flexDirection: 'column'}} >
                    <SubjectIcon sx={{ width: '35px', height: '31px'}}/>
                </div>
                <div style={{ marginLeft: '20px' }}>
                    <Grid container spacing={2}>
                        <Grid item xs={6} md={8}>
                            <Typography sx={{ marginTop: '3px' }}>รายวิชา</Typography>
                            <Typography sx={{ marginTop: '10px', marginBottom: '10px', color: '#018ADA'}}>เลือกวิชาที่ต้องการตัดเกรด</Typography>
                            <ComboBox sx={{ marginTop: '15px' }}/>
                            <Typography sx={{ marginTop: '15px', marginBottom: '10px', color: '#018ADA'}}>อัปโหลดไฟล์ CR58</Typography>
                            {/* <input type="file" accept=".xlsx, .xls" style={{ backgroundColor: PinkPallette.main }}/> */}
                            <Button component="label" variant="contained" className="import-style" sx={{ backgroundColor: PinkPallette.main }} startIcon={<CloudUploadIcon />}>
                                Upload file
                                <VisuallyHiddenInput 
                                    type="file" 
                                    className="form-control custom-form-control" 
                                    onChange={ (event) => {
                                        handleFileChange(event)
                                        handleFileUpload(event)
                                        setCR58(event.target.file)
                                    }} 
                                />
                            </Button>
                            <TextField 
                                id="outlined-basic" 
                                placeholder="ชื่อไฟล์" 
                                variant="outlined" 
                                value={fileName}
                                sx={{ width: '346px', marginLeft: '20px'}}
                            />
                            <Divider sx={{ width: '1024px', marginTop: '30px', backgroundColor: 'black' }}/>
                        </Grid>
                    </Grid>
                    
                </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', marginTop: '30px' }}>
                <div style={{ display: 'flex', flexDirection: 'column'}}>
                    <VibrationIcon sx={{ width: '35px', height: '31px'}}/>
                </div>
                <div style={{ marginLeft: '20px' }}>
                    <Typography sx= {{ marginTop: '3px' }}>รูปแบบการให้คะแนน</Typography>
                    <Typography sx= {{ marginTop: '10px', marginBottom: '10px', color: '#018ADA' }}>กำหนดสัดส่วนน้ำหนักมอดูล</Typography>
                    {Array.from({ length: count }, (_, index) => (
                    <AddMoreModule key={index} index={index + 1} /> // กำหนด key เพื่อให้ React รู้จักแต่ละ Component และส่งตัวเลขกำกับไปให้ Component
                    ))}        
                    <Button 
                        onClick={handleAddComponent}
                        sx={{ color: PinkPallette.main, padding: '0px', marginTop: '10px' }}
                    >
                        เพิ่มมอดูล
                    </Button>
                    <Divider sx={{ width: '1024px', marginTop: '30px', backgroundColor: 'black' }}/>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}> 
                        <div style={{ display: 'flex' }}>
                            <Typography sx= {{ marginTop: '30px', marginBottom: '30px' }}>การประเมินผลการศึกษาในรายวิชานี้จำเป็นต้องใช้คะแนนอย่างน้อย</Typography>
                            <TextField
                                placeholder='00.00'
                                sx={{ width: '85px', marginTop: '15px', marginBottom: '30px', marginInline: '10px' }}
                            />
                            <Typography sx= {{ marginTop: '30px', marginBottom: '30px' }}>ส่วน</Typography>
                        </div>                        
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button 
                                variant='contained' 
                                sx={{ backgroundColor: '#BCBCBC',marginTop: '22.5px', marginBottom: '60px'}}
                                onClick={ () => {
                                    setCookie("CR58", CR58)
                                    navigate('/gradeAdjustment')
                                }} 
                            >
                                ต่อไป
                            </Button>
                        </div>
                    </div>
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
            <Typography sx={{ marginRight: '20px'}}>มอดูลที่ {index}</Typography>
            <ComboBox sx={{ padding: 0,}}/>
            <Typography sx={{ marginLeft: '20px' }}>คิดเป็น</Typography>
            <TextField placeholder= '00.00' sx={{ marginLeft: '20px', width: '85px', display: 'flex', justifyContent: 'center' }}/>
            <Typography sx={{ marginLeft: '20px'}}>ส่วน</Typography>
        </div>
    )
  }