import { useMemo, useState } from 'react';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
// import { MaterialReactTable } from 'material-react-table';
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { fakeData as initialData } from './makeData';
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material';
import './ModuleTable.css'
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { PinkPallette } from '../../assets/pallettes';

const Example = () => {
  const [validationErrors, setValidationErrors] = useState({});
  const [editedSubjects, setEditedSubjects] = useState({});

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
        muiEditTextFieldProps: ({ cell, row }) => ({
          type: 'text',
          required: true,
          error: !!validationErrors?.[cell.id],
          helperText: validationErrors?.[cell.id],
          //store edited user in state to be saved later
          onBlur: (event) => {
            const validationError = !validateRequired(event.currentTarget.value)
              ? 'กรุณากรอก'
              : undefined;
            setValidationErrors({
              ...validationErrors,
              [cell.id]: validationError,
            });
            setEditedSubjects({ ...editedSubjects, [row.id]: row.original });
          },
        }),
      },
      {
        accessorKey: 'year_semester',
        header: 'ปีการศึกษา/ภาค',
        // muiTableHeadCellProps: {
        //   align: 'center'
        // },
        muiTableBodyCellProps: {
          align: 'center'
        },
        muiEditTextFieldProps: ({ cell, row }) => ({
          type: 'text',
          required: true,
          error: !!validationErrors?.[cell.id],
          helperText: validationErrors?.[cell.id],
          //store edited user in state to be saved later
          onBlur: (event) => {
            const validationError = !validateRequired(event.currentTarget.value)
              ? 'กรุณากรอก'
              : undefined;
            setValidationErrors({
              ...validationErrors,
              [cell.id]: validationError,
            });
            setEditedSubjects({ ...editedSubjects, [row.id]: row.original });
          },
        }),

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
        accessorKey: 'hours',
        header: 'จำนวนชั่วโมงเรียน',
        // muiTableHeadCellProps: {
        //   align: 'center'
        // },
        muiTableBodyCellProps: {
          align: 'center'
        }
      },
    ],
    [editedSubjects, validationErrors],
    //end
  );

  //call CREATE hook
  const { mutateAsync: addSubject, isPending: isAddingSubject } =
    useAddSubject();
  //call READ hook
  const {
    data: fetchedSubjects = [],
    isError: isLoadingSubjectsError,
    isFetching: isFetchingSubjects,
    isLoading: isLoadingSubjects,
  } = useGetSubjects();
  //call UPDATE hook
  const { mutateAsync: updateSubjects, isPending: isUpdatingSubjects } =
    useUpdateSubjects();
  //call DELETE hook
  const { mutateAsync: deleteSubject, isPending: isDeletingSubject } =
    useDeleteSubject();

  //CREATE action
  const handleAddSubject = async ({ values, table }) => {
    const newValidationErrors = validateSubject(values);
    if (Object.values(newValidationErrors).some((error) => error)) {
      setValidationErrors(newValidationErrors);
      return;
    }
    setValidationErrors({});
    await addSubject(values);
    table.setCreatingRow(null); //exit creating mode
  };

  //UPDATE action
  const handleSaveSubjects = async () => {
    if (Object.values(validationErrors).some((error) => !!error)) return;
    await updateSubjects(Object.values(editedSubjects));
    setEditedSubjects({});
  };

  //DELETE action
  const openDeleteConfirmModal = (row) => {
    if (window.confirm('คุณแน่ใจที่จะลบมอดูลนี้ใช่ไหม?')) {
      deleteSubject(row.original.id);
    }
  };

  const table = useMaterialReactTable({
    columns,
    data: fetchedSubjects,
    createDisplayMode: 'row', // ('modal', and 'custom' are also available)
    editDisplayMode: 'table', // ('modal', 'row', 'cell', and 'custom' are also
    enableEditing: true,
    enableRowActions: true,
    positionActionsColumn: 'last',
    getRowId: (row) => row.id,
    muiToolbarAlertBannerProps: isLoadingSubjectsError
      ? {
          color: 'error',
          children: 'Error loading data',
        }
      : undefined,
    muiTableContainerProps: {
      sx: {
        minHeight: '500px',
      },
    },
    muiTablePaperProps:{
      elevation: '0',
      sx: {
        border: '0'
      }
    },
    onCreatingRowCancel: () => setValidationErrors({}),
    onCreatingRowSave: handleAddSubject,
    renderRowActions: ({ row }) => (
      <Box sx={{ display: 'flex', gap: '1rem', paddingLeft: '1rem' }}>
        <Tooltip title="Delete">
          <IconButton color="error" onClick={() => openDeleteConfirmModal(row)}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    renderTopToolbarCustomActions: ({ table }) => (
      <Button
        variant="contained"
        sx={{ backgroundColor: PinkPallette.main, '&:hover': {
          backgroundColor: PinkPallette.light,
        }}}
        startIcon={<AddCircleOutlineIcon />}
        onClick={() => {
          table.setCreatingRow(true);
        }}
      >
        เพิ่มมอดูล
      </Button>
    ),
    renderBottomToolbarCustomActions: () => (
      <Box sx={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <Button
          color="success"
          variant="contained"
          onClick={handleSaveSubjects}
          disabled={
            Object.keys(editedSubjects).length === 0 ||
            Object.values(validationErrors).some((error) => !!error)
          }
        >
          {isUpdatingSubjects ? <CircularProgress size={25} /> : 'บันทึก'}
        </Button>
        {Object.values(validationErrors).some((error) => !!error) && (
          <Typography color="error">กรุณากรอกข้อมูลให้ครบก่อนกดบันทึก</Typography>
        )}
      </Box>
    ),
    state: {
      isLoading: isLoadingSubjects,
      isSaving: isAddingSubject || isUpdatingSubjects || isDeletingSubject,
      showAlertBanner: isLoadingSubjectsError,
      showProgressBars: isFetchingSubjects,
    }


  });
  return (
    <MaterialReactTable
      table = {table}
      // renderRowActionMenuItems={({ row, table }) => [
      //   <MRT_ActionMenuItem //or just use a normal MUI MenuItem component
      //     icon={<EditIcon />}
      //     key="edit"
      //     label="Edit"
      //     onClick={() => {
      //       table.setEditingRow(row);
      //     }}
      //     table={table}
      //   />,
      //   <MRT_ActionMenuItem
      //     icon={<DeleteIcon />}
      //     key="delete"
      //     label="Delete"
      //     // onClick={() => {
      //     //   data.splice(row.index, 1); //assuming simple data table
      //     //   setData([...data]);
      //     // }}
      //     onClick={() => openDeleteConfirmModal(row)}
      //     table={table}
      //   />,
      // ]}
      
    />
  );
};

//CREATE hook (post new subject to api)
function useAddSubject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (subject) => {
      //send api update request here
      await new Promise((resolve) => setTimeout(resolve, 1000)); //fake api call
      return Promise.resolve();
    },
    //client side optimistic update
    onMutate: (newSubjectInfo) => {
      queryClient.setQueryData(['subjects'], (prevSubjects) => [
        ...prevSubjects,
        {
          ...newSubjectInfo,
          id: (Math.random() + 1).toString(36).substring(7),
        },
      ]);
    },
    // onSettled: () => queryClient.invalidateQueries({ queryKey: ['users'] }), //refetch users after mutation, disabled for demo
  });
}

//READ hook (get users from api)
function useGetSubjects() {
  return useQuery({
    queryKey: ['subjects'],
    queryFn: async () => {
      //send api request here
      await new Promise((resolve) => setTimeout(resolve, 1000)); //fake api call
      return Promise.resolve(initialData);
    },
    refetchOnWindowFocus: false,
  });
}

//UPDATE hook (put user in api)
function useUpdateSubjects() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (subject) => {
      //send api update request here
      await new Promise((resolve) => setTimeout(resolve, 1000)); //fake api call
      return Promise.resolve();
    },
    //client side optimistic update
    onMutate: (newSubjects) => {
      queryClient.setQueryData(['subjects'], (prevSubjects) =>
        prevSubjects?.map((subject) => {
          const newSubject = newSubjects.find((s) => s.id === subject.id);
          return newSubject ? newSubject : subject;
        }),
      );
    },
    // onSettled: () => queryClient.invalidateQueries({ queryKey: ['users'] }), //refetch users after mutation, disabled for demo
  });
}

//DELETE hook (delete subject in api)
function useDeleteSubject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (subjectId) => {
      //send api update request here
      await new Promise((resolve) => setTimeout(resolve, 1000)); //fake api call
      return Promise.resolve();
    },
    //client side optimistic update
    onMutate: (subjectId) => {
      queryClient.setQueryData(['subjects'], (prevSubjects) =>
        prevSubjects?.filter((subject) => subject.id !== subjectId),
      );
    },
    // onSettled: () => queryClient.invalidateQueries({ queryKey: ['users'] }), //refetch users after mutation, disabled for demo
  });
}

const queryClient = new QueryClient();

const ExampleWithProviders = () => (
  //Put this with your other react-query providers near root of your app
  <QueryClientProvider client={queryClient}>
    <Example />
  </QueryClientProvider>
);

export default ExampleWithProviders;

const validateRequired = (value) => !!value.length;
function validateSubject(subject) {
  return {
    moduleName: !validateRequired(subject.firstName)
      ? 'Module Name is Required'
      : '',
    year_semester: !validateRequired(subject.lastName) ? 'Semester is Required' : '',
  };
}
