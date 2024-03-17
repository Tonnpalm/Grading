import { useMemo, useState } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { MenuItem } from '@mui/material';
import { data } from './makeData';
import { useCookies } from 'react-cookie';
import Modal from './Modal';

const Example = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cookies, setCookie] = useCookies([]);
  const CR58 = cookies['CR58']

  const handleHeaderClick = () => {
    setIsModalOpen(true);
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'rowNumbers',
        header: 'ลำดับ',
        size: 70,
        Cell: ({ row }) => row.index + 1, 
        enableColumnPinning: true, 
        enableSorting: false,
        enableColumnActions: false
      },
      {
        accessorKey: 'studentName',
        header: 'ชื่อ-นามสกุล',
        enableSorting: true,
        enableColumnActions: false
      },
      {
        accessorKey: 'SID',
        header: 'รหัสนิสิต',
        size: 120,
        disableSortBy: true,
        enableColumnActions: false
      },
      {
        accessorKey: 'lastName',
        header: 'ชื่อเล่น',
        renderColumnActionsMenuItems: ({ closeMenu }) => [
          <MenuItem
            key={1}
            onClick={() => {
              handleHeaderClick();
              closeMenu();
            }}
          >
            ดูคะแนน
          </MenuItem>,
        ],
        enableSorting: false,
      },
      {
        accessorKey: 'address',
        header: 'ที่อยู่',
        size: 300,
        enableSorting: false,
        renderColumnActionsMenuItems: ({ closeMenu }) => [
          <MenuItem
            key={1}
            onClick={() => {
              handleHeaderClick();
              closeMenu();
            }}
          >
            ดูคะแนน
          </MenuItem>,
        ],
      },
            {
        accessorKey: 'studentGrade', 
        header: 'เกรด',
      },
      {
        accessorKey: 'state', 
        header: 'State',
      },
      {
        accessorKey: 'country',
        header: 'Country',
      },
    ],
    [],
  );

  const table = useMaterialReactTable({
    columns,
    data: CR58,
    enableColumnPinning: true,
    // enableColumnActions: false,
    layoutMode: 'grid-no-grow', //constant column widths
    initialState: {
      columnPinning: { left: ['rowNumbers', 'SID', 'studentName'], right: ['studentGrade'] },
    },
  });

  return (
  <>
    <MaterialReactTable table={table} />
    {isModalOpen && <Modal onClose={() => setIsModalOpen(false)} />}
  </>
)};

export default Example;
