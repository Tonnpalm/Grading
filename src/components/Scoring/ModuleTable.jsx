import { useMemo, useState } from 'react';
import { MaterialReactTable, MRT_ActionMenuItem } from 'material-react-table';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { data as initialData } from './makeData';
import './ModuleTable.css'

export const Example = () => {
  const columns = useMemo(
    //column definitions...
    () => [
      {
        accessorKey: 'moduleName',
        header: 'ชื่อมอดูล',
        muiTableHeadCellProps: {
          align: 'center'
        },
        muiTableBodyCellProps: {
          align: 'center'
        }
      },
      {
        accessorKey: 'year_semester',
        header: 'ปีการศึกษา/ภาค',
        muiTableHeadCellProps: {
          align: 'center'
        },
        muiTableBodyCellProps: {
          align: 'center'
        }
      },
      {
        accessorKey: 'duration',
        header: 'ระยะเวลาที่สอน',
        muiTableHeadCellProps: {
          align: 'center'
        },
        muiTableBodyCellProps: {
          align: 'center'
        }
      },
      {
        accessorKey: 'hours',
        header: 'จำนวนชั่วโมงเรียน',
        muiTableHeadCellProps: {
          align: 'center'
        },
        muiTableBodyCellProps: {
          align: 'center'
        }
      },
    ],
    [],
    //end
  );

  const [data, setData] = useState(initialData);

  return (
    <MaterialReactTable
      columns={columns}
      data={data}
      // layoutMode="grid"
      displayColumnDefOptions={{
        'mrt-row-actions': {
          header: 'จัดการมอดูล',
          size: 180,
          grow: false,
        },
      }}
      enableRowActions
      muiTablePaperProps={{
        elevation: '0',
        sx: {
          border: '0'
        }}
      }
      positionActionsColumn='last'
      renderRowActionMenuItems={({ row, table }) => [
        <MRT_ActionMenuItem //or just use a normal MUI MenuItem component
          icon={<EditIcon />}
          key="edit"
          label="Edit"
          onClick={() => {
            table.setEditingRow(row);
          }}
          table={table}
        />,
        <MRT_ActionMenuItem
          icon={<DeleteIcon />}
          key="delete"
          label="Delete"
          onClick={() => {
            data.splice(row.index, 1); //assuming simple data table
            setData([...data]);
          }}
          table={table}
        />,
      ]}
    />
  );
};

export default Example;
