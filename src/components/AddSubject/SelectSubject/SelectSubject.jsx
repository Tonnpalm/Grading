// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import SearchAppBar from '/Users/pongpipatsrimuang/Desktop/GradingFront/src/components/AppBar/ButtonAppBar.jsx';
// import AddSubTable from './AddSubTable'
import AddOfficer from './AddOfficer'
import './SelectSubject.css'
import { useNavigate } from 'react-router';
import Button from '@mui/material/Button';
import { PinkPallette } from '../../../assets/pallettes';
import { GreenPallette } from '../../../assets/pallettes';

function SelectSubject() {
  const navigate = useNavigate();

  
  return (
    <div>
        <SearchAppBar/>
        <div className='content-container'>
          <h style={{ fontSize: '30px'}}>นำเข้ารายวิชา</h>
          <div className='add-table-container'>
            <AddOfficer />
          </div>
          <div className='button-container'>
            <Button style={{ textDecoration: 'underline', color: PinkPallette.main }} onClick={()=> {navigate('/addMoreSubject')}}>เพิ่มรายวิชา</Button>
            <Button component="label" variant="contained" sx={{ backgroundColor: GreenPallette.main }} onClick={() => {navigate("/")}}>ยืนยัน</Button>
          </div>
        </div>
    </div>
  )
}
export default SelectSubject;