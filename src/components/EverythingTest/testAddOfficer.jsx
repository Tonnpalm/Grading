import { useMemo, useState, useEffect } from "react";
import {
  MaterialReactTable,
  // createRow,
  useMaterialReactTable,
} from "material-react-table";
import * as XLSX from "xlsx";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Delete as DeleteIcon } from "@mui/icons-material";
import { PinkPallette } from "../../assets/pallettes"; 
import {
    Box,
    Button,
    CircularProgress,
    IconButton,
    Tooltip,
    Typography,
  } from "@mui/material";
import axios from "axios";
  
  
const TestAddOfficer = () => {
    const [validationErrors, setValidationErrors] = useState({});
    const [editedSubjects, setEditedSubjects] = useState({});
    const [excelData, setExcelData] = useState([]);
    const [staffs, setStaffs] = useState([]);

    function getStaffs() {
      axios.get(`http://localhost:8000/api/staffs/?staffName=&page=1&perPage=5`)
          .then((response) => {
              const staffNameList = []
              response.data.staffs.map((item) => {
                staffNameList.push(item.staffName)
              })
              setStaffs(staffNameList)
          }) 
          .catch((error) => {
              console.log(error)
          })
    }
    console.log(staffs)
    useEffect(() => {
      getStaffs()
    }, [])

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

    const columns = useMemo(
        () => [
            {
                accessorKey: "ID",
                header: 'รหัสวิชา',
                muiEditTextFieldProps: ({ cell, row }) => ({
                    type: "text",
                    required: true,
                    error: !!validationErrors?.[cell.id],
                    helperText: validationErrors?.[cell.id],
                    //store edited user in state to be saved later
                    onBlur: (event) => {
                      const validationError = !validateRequired(event.currentTarget.value)
                        ? "Required"
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
                accessorKey: "Name",
                header: 'ชื่อวิชา',
                muiEditTextFieldProps: ({ cell, row }) => ({
                    type: "text",
                    required: true,
                    error: !!validationErrors?.[cell.id],
                    helperText: validationErrors?.[cell.id],
                    //store edited user in state to be saved later
                    onBlur: (event) => {
                      const validationError = !validateRequired(event.currentTarget.value)
                        ? "Required"
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
                accessorKey: "Section",
                header: 'ตอนเรียน',
                muiEditTextFieldProps: ({ cell, row }) => ({
                    type: "text",
                    required: true,
                    error: !!validationErrors?.[cell.id],
                    helperText: validationErrors?.[cell.id],
                    //store edited user in state to be saved later
                    onBlur: (event) => {
                      const validationError = !validateRequired(event.currentTarget.value)
                        ? "Required"
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
              accessorKey: "officer",
              header: "ผู้ประสานงานรายวิชา",
              editVariant: "select", // กำหนดให้เป็น multi-select
              editSelectOptions: staffs, // กำหนดตัวเลือกให้กับ multi-select
              enableEditing: true,
              muiEditTextFieldProps: ({ row }) => ({
                select: true, // ให้สามารถเลือกหลายตัวเลือกได้
                error: !!validationErrors?.officer,
                helperText: validationErrors?.officer,
                onChange: (event) => {
                  setEditedSubjects({
                    ...editedSubjects,
                    [row.id]: { ...row.original, officer: event.target.value },
                  });
                },
              }),
                      
            },
        ],
        [editedSubjects, validationErrors, staffs] //กลับมาแก้ด้วย
    )    

    //CREATE action
    const handleCreateSubject = async ({ values, table }) => {
        const newValidationErrors = validateUser(values);
        if (Object.values(newValidationErrors).some((error) => error)) {
            setValidationErrors(newValidationErrors);
            return;
        }
        const newRow = {
            ID: values.ID,
            Name: values.Name,
            Section: values.Section,
            officer: values.officer,
        };
        setExcelData((prevData) => [...prevData, newRow]); // Add new row to existing data
        table.setCreatingRow(null); //exit creating mode
        console.log(values)
    };
         
    //UPDATE action
    const handleSaveSubjects = async () => {
        if (Object.values(validationErrors).some((error) => !!error)) return;
        setEditedSubjects({});

    };
    //DELETE action
    const deleteSubject = (index) => {
      setExcelData((prevData) => prevData.filter((_, i) => i !== index));
    };
    
    const openDeleteConfirmModal = (index) => {
      if (window.confirm("Are you sure you want to delete this row?")) {
        deleteSubject(index);
      }
    };
            

    const table = useMaterialReactTable ({
        columns,
        data: excelData,
        createDisplayMode: "row", // ('modal', and 'custom' are also available)
        editDisplayMode: "table", // ('modal', 'row', 'cell', and 'custom' are also
        enableEditing: true,
        enableRowActions: true,
        positionActionsColumn: "last",
        displayColumnDefOptions: {
            "mrt-row-actions": {
              header: "ลบ", //change header text
              grow: false,
            },
        },
        onCreatingRowSave: handleCreateSubject,        
        onCreatingRowCancel: () => setValidationErrors({}),
        renderRowActions: ({ row }) => (
            <Box sx={{ display: "flex", gap: "1rem" }}>
              <Tooltip title="Delete">
                <IconButton color="error" onClick={() => openDeleteConfirmModal(row.index)}>
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </Box>
          ),
        renderBottomToolbarCustomActions: ({ table }) => (
            <Box sx={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <Button
                variant="text"
                style={{ textDecoration: "underline", color: PinkPallette.main }}
                onClick={() => {
                table.setCreatingRow(true); 
              }}
            >
              เพิ่มรายวิชา
            </Button><Button
                color="success"
                variant="contained"
                onClick = {
                    handleSaveSubjects
                    // handleEditChange()
                }
                disabled={
                    Object.keys(editedSubjects).length === 0 ||
                    Object.values(validationErrors).some((error) => !!error)
                }
                >
                    <Typography>บันทึก</Typography>
                </Button>
                {Object.values(validationErrors).some((error) => !!error) && (
                <Typography color="error">โปรดแก้ไขก่อนบันทึก</Typography>
                )}
            </Box>
        ),
     
    })

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
        <div>
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
        <MaterialReactTable table={table}/>
        </div>
    )
};
export default TestAddOfficer

const validateRequired = (value) => !!value.length;

function validateUser(Subject) {
    return {
      ID: !validateRequired(Subject.ID) ? "Subject ID is Required" : "",
      Name: !validateRequired(Subject.Name) ? "Subject name is Required" : "",
    };
}


  
