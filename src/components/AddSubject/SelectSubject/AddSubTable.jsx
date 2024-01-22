import React, { useState } from "react";
import { Container } from "react-bootstrap";
import { styled } from '@mui/material/styles';
import * as xlsx from 'xlsx';
import CheckboxesTags from './Select'
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Button from '@mui/material/Button';
// import ButtonGroup from '@mui/material/ButtonGroup';
import './AddSubTable.css'
import { PinkPallette } from "../../../assets/pallettes";

// npm install xlsx

function TableTest() 
{
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

   const [excelData, setExcelData]= useState([]);
   const readExcel = async(e)=>{
   const file= e.target.files[0];
   const data= await file.arrayBuffer(file);
   const excelfile= xlsx.read(data);
   const excelsheet= excelfile.Sheets[excelfile.SheetNames[0]];
   const exceljson= xlsx.utils.sheet_to_json(excelsheet);
   //console.log(exceljson);
   setExcelData(exceljson);

  }
    return(
        <React.Fragment>
              <Container className="content custom-container">
               <div className="row fthight custom-row">               
               <div className="col-md-4 custom-col-md-4">
                  {/* <input type="file" className="form-control custom-form-control" onChange={ (e)=>readExcel(e)}  /> */}
                  <Button component="label" variant="contained" className="import-style" sx={{ backgroundColor: PinkPallette.main }} startIcon={<CloudUploadIcon />}>
                     Upload file
                     <VisuallyHiddenInput type="file" className="form-control custom-form-control" onChange={ (e)=>readExcel(e)} />
                  </Button>

                  {/* เอาปุ่มเลือกทวิภาคและนานาชาติออก */}
                  {/* <ButtonGroup
                     disableElevation
                     variant="contained"
                     aria-label="Disabled elevation buttons"
                  >
                     <Button style={{ borderRadius: '6px 0 0 6px' }}>ทวิภาค</Button>
                     <Button style={{ borderRadius: '0 6px 6px 0', marginLeft:'1px',  }}>นานาชาติ</Button>
                  </ButtonGroup> */}
               </div>
              
               <div className="col-md-12 mt-3">   
               {(
                <table className="table">
                  <thead>
                     <tr>
                        <th style={{ backgroundColor: '#ff79a9', borderRadius: '10px  0 0 0'}}>รหัสวิชา</th>
                        <th style={{ backgroundColor: '#ff79a9'}}>ชื่อวิชา</th>
                        <th style={{ backgroundColor: '#ff79a9'}}>ตอนเรียน</th>
                        <th style={{ backgroundColor: '#ff79a9', borderRadius: '0 10px 0 0' }}>ผู้ประสานงานรายวิชา</th>
                     </tr>
                  </thead>
                  <tbody style={{ border: '1px solid', borderBottom: 'transparent' }}>
                    { excelData.length > 1 &&                 
                    excelData.map( (getdata, index)=>(
                     <tr key={index}>
                        <td>{ getdata.ID } </td>
                        <td>{ getdata.Name } </td>
                        <td>{ getdata.Section } </td>
                        <td style={{ display: 'flex', justifyContent: 'center' }}><CheckboxesTags/> </td>
                     </tr>
                     ) ) }
                  </tbody>
                </table>
               )
}
               </div>
               </div>
             </Container>
        </React.Fragment>
    );
}
export default TableTest;