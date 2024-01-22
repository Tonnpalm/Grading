// import { useState } from 'react'
// import * as XLSX from "xlsx"
// import './tableTest.css'
// // eslint-disable-next-line no-unused-vars
// import React from 'react'

// function TableTest() {

//   // eslint-disable-next-line react-hooks/rules-of-hooks
//   const [data, setData] = useState([]);


//   const handleFileUpload = (e) => {
//     const reader = new FileReader();
//     reader.readAsBinaryString(e.target.files[0]);
//     reader.onload = (e) => {
//       const data = e.target.result;
//       const workbook = XLSX.read(data, { type: "binary" });
//       const sheetName = workbook.SheetNames[0];
//       const sheet = workbook.Sheets[sheetName];
//       const parsedData = XLSX.utils.sheet_to_json(sheet);
//       setData(parsedData);
//     };
//   }


//   return (
//     <div className="App">


//       <input 
//         type="file" 
//         accept=".xlsx, .xls" 
//         onChange={handleFileUpload} 
//       />


//       {data.length > 0 && (
//         <table className="table">
//           <thead>
//             <tr>
//               {Object.keys(data[0]).map((key) => (
//                 <th key={key}>{key}</th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {data.map((row, index) => (
//               <tr key={index}>
//                 {Object.values(row).map((value, index) => (
//                   <td key={index}>{value}</td>
//                 ))}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}


//       <br /><br />
//       ... webstylepress ...
//     </div>
//   );
// }export default TableTest

import React, { useState } from "react";
import { Container } from "react-bootstrap";
import * as xlsx from 'xlsx';

// npm install xlsx

function TableTest() 
{
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
              <Container className="content">
               <div className="row fthight">               
               <div className="col-md-4 ">
               {/* <h3 className='mt-3'>Fetch Excel Data in React js</h3> */}
               <label className="form-label">File </label>
               <input type="file" className="form-control" onChange={ (e)=>readExcel(e)}  />
               </div>
              
               <div className="col-md-12 mt-3">   
               {(
                <table className="table">
                  <thead>
                     <tr>
                        <th>Sr. No</th>
                        <th>Name</th>
                        <th>Age</th>
                        <th>State</th>
                        <th>Country</th>
                        <th>Interests</th>
                     </tr>
                  </thead>
                  <tbody>
                    { excelData.length > 1 &&                 
                    excelData.map( (getdata, index)=>(
                     <tr key={index}>
                        <td>{ index+1 }</td>
                        <td>{ getdata.Name} </td>
                        <td>{ getdata.Age} </td>
                        <td>{ getdata.State} </td>
                        <td>{ getdata.Country} </td>
                        <td>{ getdata.Interests} </td>
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