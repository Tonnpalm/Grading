import { useMemo, useState } from 'react';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
// import { fakeData as initialData } from './makeData';
import {
  Box,
  Button,
  CircularProgress,
  // IconButton,
  // Tooltip,
  Typography,
} from '@mui/material';
import './ModuleTable.css'
import { Edit } from '@mui/icons-material';
import { MenuItem } from '@mui/material';
import ChecklistIcon from '@mui/icons-material/Checklist';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { PinkPallette } from '../../assets/pallettes';
import { useNavigate } from 'react-router-dom';
import ModuleModal from './ModuleModal';

const Example = () => {
  const navigate = useNavigate();
  const [moduleDetail, setModuleDetail] = useState([])
  const [addModuleModalOpen, setAddModuleModalOpen] = useState(false);

  const handleAddModuleModalOpen = () => {
    setAddModuleModalOpen(true)
  }

  const handleAddModuleModalClose = () => {
    setAddModuleModalOpen(false)
  }

  const handleAddModuleModalSubmit = (data) => {
    setModuleDetail((prevState) => {
      const newDataSet = [
        ...prevState, 
        data, 
      ]
      return newDataSet
    })

  }

  const columns = useMemo(
    //column definitions...
    () => [
      {
        accessorKey: 'moduleName',
        header: 'ชื่อมอดูล',
        // muiTableHeadCellProps: {
        //   align: 'center'
        // },
        muiTableBodyCellProps: {
          align: 'center'
        },
      },
      {
        accessorKey: 'yearAndSemester',
        header: 'ปีการศึกษา/ภาค',
        // muiTableHeadCellProps: {
        //   align: 'center'
        // },
        muiTableBodyCellProps: {
          align: 'center'
        },
      },
      {
        accessorKey: 'duration',
        header: 'ระยะเวลาที่สอน',
        // muiTableHeadCellProps: {
        //   align: 'center'
        // },
        muiTableBodyCellProps: {
          align: 'center'
        }
      },
      {
        accessorKey: 'selectedDate',
        header: 'จำนวนชั่วโมงเรียน',
        // muiTableHeadCellProps: {
        //   align: 'center'
        // },
        muiTableBodyCellProps: {
          align: 'center'
        }
      },
    ],
    [],
  );

  const table = useMaterialReactTable({
    columns,
    data: moduleDetail,
    createDisplayMode: 'row', // ('modal', and 'custom' are also available)
    editDisplayMode: 'table', // ('modal', 'row', 'cell', and 'custom' are also
    enableRowActions: true,
    positionActionsColumn: 'last',
    getRowId: (row) => row.id,
    renderRowActionMenuItems: ({ row }) => (
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <MenuItem 
          key="edit" 
          onClick={() => console.info('Edit')}
          sx={{ display: 'flex', flexDirection: 'row', gap: '1rem' }}
        >
          <Edit /> 
          <Typography>แก้ไข</Typography> 
        </MenuItem>
        <MenuItem 
          key="delete" 
          // onClick={console.log('delete')}
          sx={{ display: 'flex', flexDirection: 'row', gap: '1rem' }}
        >
          <DeleteIcon />
          <Typography>ลบ</Typography>
        </MenuItem>
        <MenuItem 
          key="delete" 
          onClick={() => console.info('Duplicate')}
          sx={{ display: 'flex', flexDirection: 'row', gap: '1rem' }}
        >
          <ContentCopyIcon />
          <Typography>คัดลอก</Typography>
        </MenuItem>
        <MenuItem 
          key="scoring" 
          onClick={() => navigate('/scoringTable')}
          sx={{ display: 'flex', flexDirection: 'row', gap: '1rem' }}
        >
          <ChecklistIcon />
          <Typography>ให้คะแนน</Typography>
        </MenuItem>
      </Box>
    ),
    renderTopToolbarCustomActions: ({ table }) => (
      <Button
        variant="contained"
        sx={{ backgroundColor: PinkPallette.main, '&:hover': {
          backgroundColor: PinkPallette.light,
        }}}
        startIcon={<AddCircleOutlineIcon />}
        onClick={handleAddModuleModalOpen}
      >
        เพิ่มมอดูล
      </Button>
    ),

  });
  return (
    <div>
      <ModuleModal
        open={addModuleModalOpen}
        onClose={handleAddModuleModalClose}
        onSubmit={handleAddModuleModalSubmit}
        mode={'add'}
      />
      <MaterialReactTable table = {table}/>
    </div>
    
  );
};

export default Example;