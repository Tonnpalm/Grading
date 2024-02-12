// eslint-disable-next-line no-unused-vars
import React, { useMemo, useState } from 'react';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import * as XLSX from 'xlsx';
// import CheckboxesTags from './Select';
import './AddOfficer.css'
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Delete as DeleteIcon } from '@mui/icons-material';
import Button from '@mui/material/Button';
import { Box, IconButton } from '@mui/material';
import { PinkPallette } from "../../../assets/pallettes";

const Example = () => {
  const [excelData, setExcelData] = useState([]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const excelData = XLSX.utils.sheet_to_json(worksheet, { header: 2 });
      console.log(excelData)
      setExcelData(excelData);
    };

    reader.readAsArrayBuffer(file);
  };


  const columns = useMemo(
    () => [
      {
        accessorKey: 'ID',
        header: 'รหัสวิชา',
        size: 150,
        muiTableHeadCellProps: {
            align: 'center'
          },
        muiTableBodyCellProps: {
            align: 'center'
          }
      },
      {
        accessorKey: 'Name',
        header: 'ชื่อวิชา',
        size: 150,
        muiTableHeadCellProps: {
            align: 'center'
          },
        // muiTableBodyCellProps: {
        //     align: 'center'
        //   }
      },
      {
        accessorKey: 'Section',
        header: 'ตอนเรียน',
        size: 150,
        muiTableHeadCellProps: {
            align: 'center'
          },
        muiTableBodyCellProps: {
            align: 'center'
          }
      },
      {
        header: 'ผู้ประสานงานรายวิชา',
        size: 150,
        muiTableHeadCellProps: {
            align: 'center'
          },
        muiTableBodyCellProps: {
            align: 'center'
          }
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data: excelData,
    enableRowActions: true,
    positionActionsColumn: 'last',
    muiTableHeadCellProps: {
        align: 'center'
    },
    muiTableBodyCellProps: {
        align: 'center',
        justifyContent: 'center'
    },
    displayColumnDefOptions: {
        'mrt-row-actions': {
        header: 'ลบ', //change header text
        size: 100, //make actions column wider
        grow: false,
        },
    },
    renderRowActions: ({ row, table }) => (
    <Box sx={{ display: 'flex', flexWrap: 'nowrap', gap: '8px' }}>
        <IconButton
            color="error"
            onClick={() => {
                table.data.splice(row.index, 1); //assuming simple data table
                setExcelData([...excelData]);
            }}
        >
            <DeleteIcon />
        </IconButton>
    </Box>
    ),
  });

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

  // const [data, setData] = useState()

  return (
    <div className='import-space'>
      {/* <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} /> */}
        <Button component="label" variant="contained" className="import-style" sx={{ backgroundColor: PinkPallette.main }} startIcon={<CloudUploadIcon />}>
            Upload file
            <VisuallyHiddenInput type="file" className="form-control custom-form-control" onChange={handleFileUpload} />
        </Button>
        <div className='table-space'>
            <MaterialReactTable table={table} />
        </div>   
    </div>
  );
};

export default Example;
