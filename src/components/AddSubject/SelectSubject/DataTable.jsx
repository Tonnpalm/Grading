// eslint-disable-next-line no-unused-vars
import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import CheckboxesTags from './Select'

const columns = [
  { field: 'id', headerName: 'รหัสวิชา', width: 100 },
  { field: 'subjectName', headerName: 'ชื่อวิชา', width: 130 },
  {
    field: 'section',
    headerName: 'Section',
    type: 'number',
    width: 90,
  },
  {
    field: 'profName',
    headerName: 'อาจารย์ผู้สอน',
    description: 'This column has a value getter and is not sortable.',
    // sortable: false,
    width: 1000,
    // valueGetter: (params) =>
    //   `${params.row.firstName || ''} ${params.row.lastName || ''}`,
    // eslint-disable-next-line no-unused-vars
    renderCell: (checkBoxTag) => (
      <CheckboxesTags/>
    )
  },
];

const rows = [
  { id: 2301006, subjectName: 'xxxxxxx', section: 1 },
  { id: 2301007, subjectName: 'xxxxxxx', section: 2 },
  { id: 2301008, subjectName: 'xxxxxxx', section: 1 },
  { id: 2301111, subjectName: 'xxxxxxx', section: 1 },
  { id: 2301112, subjectName: 'xxxxxxx', section: null },
  { id: 2301113, subjectName: null, section: 1 },
  { id: 2301122, subjectName: 'xxxxxxx', section: 2 },
  { id: 2301233, subjectName: 'xxxxxxx', section: 3 },
  { id: 2301133, subjectName: 'xxxxxxx', section: 4 },
];

export default function DataTable() {
  return (
    <div> 
    <div style={{ height: '100%', width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        
        pageSizeOptions={[5, 10]}
        checkboxSelection
      />
    </div>
    </div>
  );
}