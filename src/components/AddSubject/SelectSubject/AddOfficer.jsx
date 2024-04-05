import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import * as XLSX from "xlsx";
import "./AddOfficer.css";
import { styled } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Delete as DeleteIcon } from "@mui/icons-material";
import { PinkPallette } from "../../../assets/pallettes";
// import { mockStaffName } from "./makeData";
import { Box, Button, IconButton, Tooltip } from "@mui/material";
import { useCookies } from "react-cookie";
import axios from "axios";
import ModalForAddSubject from "./DialogAddSubject";
import ReCheckModal from "../../utility/Recheck";

const Example = () => {
  const [excelData, setExcelData] = useState([]);
  const [staffs, setStaffs] = useState([]);
  const [addSubjectModalOpen, setAddSubjectModalOpen] = useState(false);
  const [deleteSubjectModalOpen, setDeleteSubjectModalOpen] = useState(false);
  const [editSubjectModalOpen, setEditSubjectModalOpen] = useState(false);
  const [rowData, setRowData] = useState({});
  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies([]);
  const year = cookies["year"];
  const semester = cookies["semester"];

  function getStaffs() {
    axios
      .get(`http://localhost:8000/api/staffs/?name=&page=1&perPage=10`)
      .then((response) => {
        console.log("response data", response.data);
        let staffObject = [];

        response.data.staffs.map((item) => {
          let id = item.staffID;
          let fullname = item.staffName + " " + item.staffSurname;
          staffObject.push({
            staffID: id,
            staffFullname: fullname,
            //เผื่อใช้
            // firstName: item.staffName,
            // surname: item.staffSurname,
          });
        });
        setStaffs(staffObject);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    getStaffs();
  }, []);

  const handleSaveButtonClick = (data) => {
    console.log("data in handleSaveButtonClick", data);
    // console.log("staffs", staffs);
    // console.log("data with coordinators", data.coordinators);

    const staffIDs = data.coordinators.map((name) => {
      // console.log("name", name);
      const staff = staffs.find((staff) => staff.staffFullname === name);
      // console.log("fullname", staff);
      return staff ? staff.staffID : "ไม่มี";
    });
    // console.log("staffIDs", staffIDs);

    let semesterValue = "";
    switch (semester) {
      case "ภาคต้น":
        semesterValue = "1";
        break;
      case "ภาคปลาย":
        semesterValue = "2";
        break;
      case "ภาคฤดูร้อน":
        semesterValue = "3";
        break;
      default:
        semesterValue = "0";
    }

    // console.log("selectedStaffIdList", selectedStaffIdList);
    // สร้างข้อมูลสำหรับส่ง API request
    // const lastRowData = excelData[excelData.length - 1];
    // console.log("lastRowData", lastRowData);
    const courseDetail = {
      coursesData: [
        {
          crsID: data.crsID,
          crsName: data.crsName,
          crsSec: data.crsSec,
          crsCre: data.crsCre,
          year: year.toString(),
          semester: semesterValue,
          coordinators: { staffID: staffIDs },
        },
      ],
    };
    console.log("courseDetail", courseDetail);

    axios
      .post(`http://localhost:8000/api/courses/many`, courseDetail)
      .then((res) => {
        console.log(res);
      });
  };

  const handleAddSubjectModalClose = () => {
    setAddSubjectModalOpen(false);
  };

  const handleAddSubjectModalOpen = () => {
    setAddSubjectModalOpen(true);
  };

  const handleAddSubjectModalSubmit = (data) => {
    const formattedCoordinators = data.coordinators.join(" / ");
    data = { ...data, joinedCoordinators: formattedCoordinators };
    console.log("data in add new subject", data);
    setExcelData((prevState) => {
      const newDataSet = [...prevState, data];
      return newDataSet;
    });
    handleSaveButtonClick(data);
  };

  const handleDeleteSubjectModalOpen = () => {
    setDeleteSubjectModalOpen(true);
  };

  const handleDeleteSubjectModalClose = () => {
    setDeleteSubjectModalOpen(false);
  };

  const handleDeleteSubjectModalSubmit = (row) => {
    excelData.splice(row.index, 1); //assuming simple data table
    setExcelData([...excelData]);
    handleDeleteSubjectModalClose();
  };

  const handleEditSubjectModalOpen = () => {
    setEditSubjectModalOpen(true);
  };

  const handleEditSubjectModalClose = () => {
    setEditSubjectModalOpen(false);
  };

  const handleEditSubjectModalSubmit = (data) => {
    const formattedCoordinators = data.coordinators.join(" / ");
    const newData = { ...data, joinedCoordinators: formattedCoordinators };
    data = newData;
    setExcelData((prevState) => {
      // คัดลอกข้อมูลเก่าทั้งหมด
      const newDataSet = [...prevState];
      // ค้นหา index ของแถวที่ต้องการแก้ไข
      const rowIndex = newDataSet.findIndex((row) => row.crsID === data.crsID);
      // หากพบแถวที่ต้องการแก้ไข
      if (rowIndex !== -1) {
        // ลบแถวเก่าออกจากข้อมูล
        newDataSet.splice(rowIndex, 1);
        // เพิ่มแถวใหม่เข้าไปในข้อมูล
        newDataSet.push(data);
      }
      // ส่งข้อมูลใหม่กลับ
      return newDataSet;
    });
    // ปิด Modal หลังจากทำการแก้ไขข้อมูลเสร็จสิ้น
    setEditSubjectModalOpen(false);
    if (rowData) handleSaveButtonClick(data);
    else return;
  };

  const handleCheckRowData = () => {
    if (rowData) handleEditSubjectModalOpen();
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const excelData = XLSX.utils.sheet_to_json(worksheet, { header: 2 });
      console.log("excelData", excelData);
      setExcelData(excelData);
    };

    reader.readAsArrayBuffer(file);
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "crsID",
        header: "รหัสวิชา",
        size: 40,
        enableEditing: true,
      },
      {
        accessorKey: "crsName",
        header: "ชื่อวิชา",
        size: 200,
        enableEditing: true,
      },
      {
        accessorKey: "crsSec",
        header: "ตอนเรียน",
        size: 20,
        muiTableBodyCellProps: {
          sx: {
            alignItems: "center",
          },
        },
        enableEditing: true,
      },
      {
        accessorKey: "crsCre",
        header: "หน่วยกิต",
        size: 20,
        muiTableBodyCellProps: {
          sx: {
            alignItems: "center",
          },
        },
        enableEditing: true,
      },
      {
        accessorKey: "joinedCoordinators",
        header: "ผู้ประสานงานรายวิชา",
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data: excelData,
    createDisplayMode: "modal", // ('modal', and 'custom' are also available)
    editDisplayMode: "modal", // ('modal', 'row', 'cell', and 'custom' are also
    // enableEditing: true,
    enableColumnActions: false,
    enableRowActions: true,
    positionActionsColumn: "last",
    getRowId: (row) => row.id,
    displayColumnDefOptions: {
      "mrt-row-actions": {
        header: "", //change header text
        paddingLeft: "1rem",
        grow: false,
      },
    },
    renderRowActions: ({ row }) => (
      <Box sx={{ display: "flex", gap: "1rem" }}>
        <Tooltip title="Edit">
          <IconButton
            onClick={() => {
              setRowData(row.original);
              console.log("rowData", row.original);
              handleCheckRowData();
              handleEditSubjectModalOpen();
            }}
          >
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton color="error" onClick={handleDeleteSubjectModalOpen}>
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
            handleAddSubjectModalOpen();
          }}
        >
          เพิ่มรายวิชา
        </Button>
        <Button
          color="success"
          variant="contained"
          // onClick={() => {

          //   navigate("/")
          // }}
          onClick={() => {
            navigate("/confirmAddSubject");
          }}
        >
          ต่อไป
        </Button>
      </Box>
    ),
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
      <ModalForAddSubject
        mode={"add"}
        open={addSubjectModalOpen}
        staffList={staffs.map((staff) => staff.staffFullname)}
        onClose={handleAddSubjectModalClose}
        onSubmit={handleAddSubjectModalSubmit}
      />
      {editSubjectModalOpen && (
        <ModalForAddSubject
          mode={"edit"}
          open={editSubjectModalOpen}
          staffList={staffs.map((staff) => staff.staffFullname)}
          onClose={handleEditSubjectModalClose}
          onSubmit={handleEditSubjectModalSubmit}
          data={rowData}
        />
      )}
      <ReCheckModal
        open={deleteSubjectModalOpen}
        title={"ลบรายวิชา"}
        detail={"คุณยืนยันที่จะลบวิชานี้ใช่หรือไม่"}
        onClose={handleDeleteSubjectModalClose}
        onSubmit={handleDeleteSubjectModalSubmit}
      />
      <Button
        component="label"
        variant="contained"
        className="import-style"
        sx={{ backgroundColor: PinkPallette.main }}
        startIcon={<CloudUploadIcon />}
      >
        อัพโหลดไฟล์
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

export default Example;
