// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import ResponsiveAppBar from '../../AppBar/ButtonAppBar';
// import AddSubTable from './AddSubTable'
import AddOfficer from './AddOfficer'
import './SelectSubject.css'
import { useNavigate } from 'react-router';
import Button from '@mui/material/Button';
// import { PinkPallette } from '../../../assets/pallettes';
import { GreenPallette } from '../../../assets/pallettes';
import { useCookies } from 'react-cookie';
import { Typography } from '@mui/material';

function SelectSubject() {
  const navigate = useNavigate();

  // eslint-disable-next-line no-unused-vars
  const [cookies, setCookie] = useCookies([]);
  const year = cookies['year']
  const semester = cookies['semester'] 
  
  return (
    <div>
        <ResponsiveAppBar/>
        <div className='content-container'>
          <Typography sx={{ fontSize: '30px'}}>นำเข้ารายวิชาภาค{semester} ปีการศึกษา {year}</Typography>
          <div className='add-table-container'>
            <AddOfficer />
          </div>
          <div className='button-container'>
            {/* <Button style={{ textDecoration: 'underline', color: PinkPallette.main }} onClick={()=> {navigate('/addMoreSubject')}}>เพิ่มรายวิชา</Button> */}
            <Button component="label" variant="contained" sx={{ backgroundColor: GreenPallette.main }} onClick={() => {navigate("/")}}>ยืนยัน</Button>
          </div>
        </div>
    </div>
  )
}
export default SelectSubject;