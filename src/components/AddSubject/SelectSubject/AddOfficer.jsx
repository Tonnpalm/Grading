// eslint-disable-next-line no-unused-vars
import { useMemo, useState } from "react";
import {
  MaterialReactTable,
  // createRow,
  useMaterialReactTable,
} from "material-react-table";
import * as XLSX from "xlsx";
import "./AddOfficer.css";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Delete as DeleteIcon } from "@mui/icons-material";
import { PinkPallette } from "../../../assets/pallettes";
import { staffName } from "./makeData";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
// import { useCookies } from "react-cookie";

const Example = () => {
  const [validationErrors, setValidationErrors] = useState({});
  //keep track of rows that have been edited
  const [editedUsers, setEditedUsers] = useState({});
  const [excelData, setExcelData] = useState([]);

  // const [cookies, setCookie] = useCookies([]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const excelData = XLSX.utils.sheet_to_json(worksheet, { header: 2 });
      console.log(excelData);
      setExcelData(excelData);
    };

    reader.readAsArrayBuffer(file);
  };

  // const handleEditChange = (event, id, key) => {
  //   const value = event.target.value;
  //   setEditedUsers(prevEditedUsers => ({
  //     ...prevEditedUsers,
  //     [id]: { ...prevEditedUsers[id], [key]: value }
  //   }));
  //   setExcelData(prevExcelData => {
  //     const updatedExcelData = prevExcelData.map(row => {
  //       if (row.id === id) {
  //         return { ...row, [key]: value };
  //       }
  //       return row;
  //     });
  //     return updatedExcelData;
      
  //   });
  // };


  const columns = useMemo(
    () => [
      {
        accessorKey: "ID",
        header: "รหัสวิชา",
        size: 40,
        // muiEditTextFieldProps: ({ cell, row }) => ({
        //   type: "text",
        //   required: true,
        //   error: !!validationErrors?.[cell.id],
        //   helperText: validationErrors?.[cell.id],
        //   //store edited user in state to be saved later
        //   onBlur: (event) => {
        //     const validationError = !validateRequired(event.currentTarget.value)
        //       ? "Required"
        //       : undefined;
        //     setValidationErrors({
        //       ...validationErrors,
        //       [cell.id]: validationError,
        //     });
        //     setEditedUsers({ ...editedUsers, [row.id]: row.original });
        //   },
        // }),
        enableEditing: false
      },
      {
        accessorKey: "Name",
        header: "ชื่อวิชา",
        size: 200,
        // muiEditTextFieldProps: ({ cell, row }) => ({
        //   type: "text",
        //   required: true,
        //   error: !!validationErrors?.[cell.id],
        //   helperText: validationErrors?.[cell.id],
        //   //store edited user in state to be saved later
        //   onBlur: (event) => {
        //     const validationError = !validateRequired(event.currentTarget.value)
        //       ? "Required"
        //       : undefined;
        //     setValidationErrors({
        //       ...validationErrors,
        //       [cell.id]: validationError,
        //     });
        //     setEditedUsers({ ...editedUsers, [row.id]: row.original });
        //   },
        // }),
        enableEditing: false
      },
      {
        accessorKey: "Section",
        header: "ตอนเรียน",
        size: 20,
        muiTableBodyCellProps: {
          sx: {
            alignItems: 'center'
          }
        },
        // muiEditTextFieldProps: ({ cell, row }) => ({
        //   type: "text",
        //   required: true,
        //   error: !!validationErrors?.[cell.id],
        //   helperText: validationErrors?.[cell.id],
        //   //store edited user in state to be saved later
        //   onBlur: (event) => {
        //     const validationError = !validateRequired(event.currentTarget.value)
        //       ? "Required"
        //       : undefined;
        //     setValidationErrors({
        //       ...validationErrors,
        //       [cell.id]: validationError,
        //     });
        //     setEditedUsers({ ...editedUsers, [row.id]: row.original });
        //   },
        // }),
        enableEditing: false
      },
      {
        accessorKey: "officer",
        header: "ผู้ประสานงานรายวิชา",
        editVariant: "select", // กำหนดให้เป็น multi-select
        editSelectOptions: staffName, // กำหนดตัวเลือกให้กับ multi-select
        muiEditTextFieldProps: ({ row }) => ({
          select: true, // ให้สามารถเลือกหลายตัวเลือกได้
          error: !!validationErrors?.officer,
          helperText: validationErrors?.officer,
          onChange: (event) => {
            setEditedUsers({
              ...editedUsers,
              [row.id]: { ...row.original, officer: event.target.value },
            });
          },
        }),
      },
    ],
    [editedUsers, validationErrors],
    console.log(editedUsers)
  );

  //call CREATE hook
  const { mutateAsync: createUser, isPending: isCreatingUser } = useCreateUser();

  //call READ hook
  const { isError: isLoadingUsersError, isFetching: isFetchingUsers, isLoading: isLoadingUsers } = useGetUsers();

  //call UPDATE hook
  const { mutateAsync: updateUsers, isPending: isUpdatingUsers } = useUpdateUsers();

  //call DELETE hook
  const { mutateAsync: deleteUser, isPending: isDeletingUser } = useDeleteUser();

  const handleCreateUser = async ({ values, table }) => {
    const newValidationErrors = validateUser(values);
    if (Object.values(newValidationErrors).some((error) => error)) {
      setValidationErrors(newValidationErrors);
      return;
    }
    setValidationErrors({});
  
    try {
      await createUser(values); // เรียกใช้ createUser ด้วย await เพื่อรอการดำเนินการเสร็จสิ้น
      table.setCreatingRow(null); // ออกจากโหมดการสร้าง
    } catch (error) {
      console.error("Error creating user:", error);
      // จัดการข้อผิดพลาดที่เกิดขึ้น อาจต้องแสดงข้อความผิดพลาดให้กับผู้ใช้
    }
  };
  

  //UPDATE action
  const handleSaveUsers = async () => {
    if (Object.values(validationErrors).some((error) => !!error)) return;
    await updateUsers(excelData);
    setEditedUsers({});
  };
  

  //DELETE action
  const openDeleteConfirmModal = (row) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      deleteUser(row.original.id);
    }
  };

  const table = useMaterialReactTable({
    columns,
    data: excelData,
    createDisplayMode: "row", // ('modal', and 'custom' are also available)
    editDisplayMode: "table", // ('modal', 'row', 'cell', and 'custom' are also
    enableEditing: true,
    enableColumnActions: false,
    enableRowActions: true,
    positionActionsColumn: "last",
    getRowId: (row) => row.id,
    muiToolbarAlertBannerProps: isLoadingUsersError
      ? {
          color: "error",
          children: "Error loading data",
        }
      : undefined,
    muiTableContainerProps: {
      sx: {
        minHeight: "500px",
      },
    },
    displayColumnDefOptions: {
      "mrt-row-actions": {
        header: "ลบ", //change header text
        paddingLeft: "1rem",
        grow: false,
      },
    },
    onCreatingRowCancel: () => setValidationErrors({}),
    onCreatingRowSave: handleCreateUser,
    renderRowActions: ({ row }) => (
      <Box sx={{ display: "flex", gap: "1rem" }}>
        <Tooltip title="Delete">
          <IconButton color="error" onClick={() => openDeleteConfirmModal(row)}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    renderBottomToolbarCustomActions: () => (
      <Box sx={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        <Button
          variant="text"
          style={{ textDecoration: "underline", color: PinkPallette.main }}
          onClick={() => {
            table.setCreatingRow(true); //simplest way to open the create row modal with no default values
            //or you can pass in a row object to set default values with the `createRow` helper function
            // table.setCreatingRow(
            //   createRow(table, {
            //     //optionally pass in default values for the new row, useful for nested data or other complex scenarios
            //   }),
            // );
          }}
        >
          เพิ่มรายวิชา
        </Button>
        <Button
          color="success"
          variant="contained"
          onClick = {
            handleSaveUsers
            // handleEditChange()
          }
          disabled={
            Object.keys(editedUsers).length === 0 ||
            Object.values(validationErrors).some((error) => !!error)
          }
        >
          {isUpdatingUsers ? <CircularProgress size={25} /> : "บันทึก"}
        </Button>
        {Object.values(validationErrors).some((error) => !!error) && (
          <Typography color="error">Fix errors before submitting</Typography>
        )}
      </Box>
    ),
    state: {
      isLoading: isLoadingUsers,
      isSaving: isCreatingUser || isUpdatingUsers || isDeletingUser,
      showAlertBanner: isLoadingUsersError,
      showProgressBars: isFetchingUsers,
    },
  });

  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });

  return (
    <div className="import-space">
      {/* <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} /> */}
      <Button
        component="label"
        variant="contained"
        className="import-style"
        sx={{ backgroundColor: PinkPallette.main }}
        startIcon={<CloudUploadIcon />}
      >
        Upload file
        <VisuallyHiddenInput
          type="file"
          className="form-control custom-form-control"
          onChange={handleFileUpload}
        />
      </Button>
      <div className="table-space">
        <MaterialReactTable table={table} />
      </div>
    </div>
  );
};

//CREATE hook (post new user to api)
function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (user) => {
      // ทำการส่งข้อมูลผู้ใช้ไปยัง API
      await new Promise((resolve) => setTimeout(resolve, 1000)); // เสียงการเรียก API เทียบเท่ากับ 1 วินาที (สำหรับการจำลอง)
      return Promise.resolve();
    },
    //client side optimistic update
    onMutate: (newUserInfo) => {
      // ดึงข้อมูลผู้ใช้ล่าสุด
      let prevUsers = queryClient.getQueryData(['users']); // ดึงข้อมูลผู้ใช้ที่อาจจะเป็น null หรือ undefined ออกมา
      if (!prevUsers) { // ตรวจสอบว่า prevUsers เป็น null หรือ undefined หรือไม่
        prevUsers = []; // ถ้าเป็นให้กำหนดให้เป็นอาร์เรย์เปล่า
      }
      // เพิ่มข้อมูลผู้ใช้ใหม่เข้าไปในอาร์เรย์
      const updatedUsers = prevUsers.concat({
        ...newUserInfo,
        id: (Math.random() + 1).toString(36).substring(7),
      });
      // อัปเดตข้อมูลผู้ใช้ในแคช
      queryClient.setQueryData(['users'], updatedUsers);
    },
        // onSettled: () => queryClient.invalidateQueries({ queryKey: ['users'] }), // รีเฟรชข้อมูลผู้ใช้หลังจาก mutation, ยกเว้นสำหรับเพื่อสาธารณะ
  });
}

//READ hook (get users from api)
function useGetUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      //send api request here
      await new Promise((resolve) => setTimeout(resolve, 1000)); //fake api call
      return Promise.resolve(XLSX);
    },
    refetchOnWindowFocus: false,
  });
}

//UPDATE hook (put user in api)
  function useUpdateUsers() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async (users) => {
        //send api update request here
        await new Promise((resolve) => setTimeout(resolve, 1000)); //fake api call
        return Promise.resolve();
      },
      //client side optimistic update
      onMutate: (newUsers) => {
        queryClient.setQueryData(['users'], (prevUsers) =>
          prevUsers?.map((user) => {
            const newUser = newUsers.find((u) => u.id === user.id);
            return newUser ? newUser : user;
          }),
        );
      },
      // onSettled: () => queryClient.invalidateQueries({ queryKey: ['users'] }), //refetch users after mutation, disabled for demo
    });
  }


//DELETE hook (delete user in api)
function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userId) => {
      //send api update request here
      await new Promise((resolve) => setTimeout(resolve, 1000)); //fake api call
      return Promise.resolve();
    },
    //client side optimistic update
    onMutate: (userId) => {
      queryClient.setQueryData(['users'], (prevUsers) =>
        prevUsers?.filter((user) => user.id !== userId),
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

function validateUser(user) {
  return {
    ID: !validateRequired(user.ID) ? "Subject ID is Required" : "",
    Name: !validateRequired(user.Name) ? "Subject name is Required" : "",
  };
}
