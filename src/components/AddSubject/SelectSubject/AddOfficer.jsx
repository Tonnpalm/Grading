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
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { Delete as DeleteIcon } from "@mui/icons-material";
import { PinkPallette } from "../../../assets/pallettes";
import { Box, Button, IconButton, Tooltip } from "@mui/material";
import { useCookies } from "react-cookie";
import { axios } from "../../../utils/customAxios";
import ModalForAddSubject from "./DialogAddSubject";
import ReCheckModal from "../../utility/Recheck";

const Example = () => {
  const [excelData, setExcelData] = useState([]);
  const [staffs, setStaffs] = useState([]);
  const [addSubjectModalOpen, setAddSubjectModalOpen] = useState(false);
  const [deleteSubjectModalOpen, setDeleteSubjectModalOpen] = useState(false);
  const [deleteSubjectAllModalOpen, setDeleteSubjectAllModalOpen] =
    useState(false);
  const [editSubjectModalOpen, setEditSubjectModalOpen] = useState(false);
  const [idForDelete, setIdForDelete] = useState();
  const [idForEdit, setIdForEdit] = useState();
  const [rowToDelete, setRowToDelete] = useState();
  const [crsID, setCrsID] = useState();
  const [rowData, setRowData] = useState({});
  const [rowIndex, setRowIndex] = useState();
  const [countNum, setCountNum] = useState(0);

  const navigate = useNavigate();
  const [cookies] = useCookies([]);
  const year = cookies["year"];
  const semester = cookies["semester"];

  function getStaffs() {
    axios
      .get(`/staffs/allStaffs`)
      .then((response) => {
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

  function getCourses() {
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
    axios
      .get(
        `/courses?year=${year}&semester=${semesterValue}`
      )
      .then((response) => {
        console.log("data in getCourses", response.data.courses);
        const updatedCoordinators = response.data.courses.map((course) => {
          const fullname = course.coordinators.map((item) => {
            const staffFullName = item.staffName + " " + item.staffSurname;
            return staffFullName;
          });
          return { ...course, joinedCoordinators: fullname.join(" / ") };
        });
        setExcelData(updatedCoordinators); // ใช้ updatedCoordinators แทน response.data.courses
      });
  }

  function getCoursesID() {
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
    axios
      .get(
        `/courses?year=${year}&semester=${semesterValue}`
      )
      .then((response) => {
        console.log("data in getCourses", response.data.courses);
        const crs_id = response.data.courses.map((course) => {
          const id = course[course.length - 1]._id;
          return id;
        });
        console.log(crs_id);
        setCrsID(crs_id); // ใช้ crs_id แทน response.data.courses
      });
  }

  useEffect(() => {
    getStaffs();
    getCourses();
  }, []);

  const handleSaveButtonClick = (data, state) => {
    const staffIDs = data.coordinators.map((name) => {
      const staff = staffs.find((staff) => staff.staffFullname === name);
      return staff ? staff.staffID : "ไม่มี";
    });

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

    const coursesData = {
      crsID: data.crsID,
      crsName: data.crsName,
      crsSec: data.crsSec,
      crsCre: data.crsCre,
      year: year.toString(),
      semester: semesterValue,
      coordinators: { staffID: staffIDs },
    };

    // console.log("courseDetail", courseDetail);

    if (state === "add") {
      axios
        .post(`/courses/`, coursesData)
        .then((res) => {
          getCoursesID();
          // console.log("crsID", crsID);
          console.log(res);
        });
    }
    if (state === "edit") {
      axios
        .put(`/courses/${idForEdit}`, coursesData)
        .then((res) => {
          getCourses();
          getStaffs();
          console.log(res);
        })
        .catch((error) => {
          console.log("error kaa", error);
        });
    }
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
    handleSaveButtonClick(data, "add");
  };

  const handleDeleteSubjectModalOpen = (row) => {
    setDeleteSubjectModalOpen(true);
  };

  const handleDeleteSubjectModalClose = () => {
    setDeleteSubjectModalOpen(false);
  };

  const doingDelete = (mode) => {
    if (mode === "inDB") {
      axios
        .delete(`/courses/${idForDelete}`)
        .then((response) => {
          getStaffs();
          getCourses();
          setIdForDelete("");
          handleDeleteSubjectModalClose();
        })
        .catch((error) => {
          console.log("error");
        });
    }
    if (mode === "notInDB") {
      const updatedExcelData = [...excelData]; // Create a copy of the state
      updatedExcelData.splice(rowIndex, 1); // Remove the row at the specified index
      setExcelData(updatedExcelData); // Update the state with the modified data
      handleDeleteSubjectModalClose(); // Close modal after deletio
    }
  };
  const handleDeleteSubjectModalSubmit = () => {
    console.log(rowToDelete);
    if (idForDelete) {
      // Check if row.original and row.original._id exist
      if (idForDelete === rowToDelete._id) {
        doingDelete("inDB");
      }
      // else if ()
    } else {
      doingDelete("notInDB");
    }
  };

  const handleCheckRowDataForDelete = (row) => {
    if (row.original._id) {
      setIdForDelete(row.original._id);
      setRowToDelete(row.original);
      handleDeleteSubjectModalOpen();
    } else {
      handleDeleteSubjectModalOpen();
    }
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
      const newDataSet = [...prevState];

      if (rowIndex !== -1) {
        console.log("rorwIndex", rowIndex);
        newDataSet[rowIndex] = newData;
      }
      return newDataSet;
    });
    console.log("excelData", excelData);
    // console.log("data in edit modal", data);
    if (idForEdit) {
      // ถ้ามี idForEdit ให้ส่ง "edit"
      handleSaveButtonClick(data, "edit");
    } else {
      // ถ้าไม่มี idForEdit ให้ส่ง "add"
      handleSaveButtonClick(data, "add");
    }
    setRowIndex("");
    setEditSubjectModalOpen(false);
  };

  const handleCheckRowData = (row) => {
    console.log("_id", row.original._id);
    if (row.original._id) {
      // ถ้ามี _id ให้ setIdForEdit และเปิด modal แก้ไข
      setIdForEdit(row.original._id);
      handleEditSubjectModalOpen();
    } else {
      // ถ้าไม่มี _id ให้เปิด modal แก้ไข และส่ง "add" เมื่อกดบันทึก
      handleEditSubjectModalOpen();
    }
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
      setCountNum(countNum + 1);
    };

    reader.readAsArrayBuffer(file);
    // sendExcelDataToDB();
  };

  // ใช้ useEffect เพื่อดำเนินการหลังจากที่ค่า state ถูกอัพเดต
  useEffect(() => {
    if (excelData.length > 0) {
      // เรียก sendExcelDataToDB() เมื่อ excelData มีค่า
      sendExcelDataToDB();
    }
  }, [countNum]);

  const sendExcelDataToDB = () => {
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
    // ตรวจสอบว่า staffIDs ถูกกำหนดมาหรือไม่
    let staffIDs = [];
    if (typeof staffIDs !== "undefined" && staffIDs !== null) {
      staffIDs = [];
    }

    const courseDetail = {
      coursesData: excelData.map((item) => ({
        crsID: item.crsID,
        crsName: item.crsName,
        crsSec: item.crsSec,
        crsCre: item.crsCre,
        year: year.toString(),
        semester: semesterValue,
        coordinators: { staffID: staffIDs },
      })),
    };

    console.log(courseDetail);
    axios
      .post(`/courses/many`, courseDetail)
      .then((res) => {
        console.log(courseDetail);
        console.log("success", res);
        getCourses();
        getStaffs();
        // console.log("crsID", crsID);
      })
      .catch((error) => {
        console.log("error", error);
      });
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
        enableEditing: true,
      },
    ],
    []
  );
  const handleDeleteSubjectAllModalOpen = () => {
    setDeleteSubjectAllModalOpen(true);
  };

  const handleDeleteSubjectAllModalClose = () => {
    setDeleteSubjectAllModalOpen(false);
  };
  const handleDeleteSubjectAllModalSubmit = () => {
    // เก็บ ID ของรายวิชาที่เลือกไว้
    let courseIDToDelete = [];
    table.getSelectedRowModel().flatRows.map((row) => {
      courseIDToDelete.push(row.original._id);
    });

    // ส่ง ID ของรายวิชาที่เลือกไปยัง API เพื่อทำการลบ
    const crssObjID = {
      ids: courseIDToDelete,
    };

    axios
      .delete(`/courses/many`, { data: crssObjID })
      .then((res) => {
        console.log(crssObjID);
        console.log("success", res);
        getStaffs();
        getCourses();
        setRowSelection({});
      })
      .catch((error) => {
        console.log("error", error);
      });

    // ปิด Modal หลังจากที่ดำเนินการเสร็จสิ้น
    handleDeleteSubjectAllModalClose();
  };

  const [rowSelection, setRowSelection] = useState({});
  const table = useMaterialReactTable({
    columns,
    data: excelData,
    createDisplayMode: "modal", // ('modal', and 'custom' are also available)
    editDisplayMode: "modal", // ('modal', 'row', 'cell', and 'custom' are also
    enableRowSelection: true,
    positionToolbarAlertBanner: "bottom",
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
    onRowSelectionChange: setRowSelection,
    state: { rowSelection },
    renderRowActions: ({ row }) => (
      <Box sx={{ display: "flex", gap: "1rem" }}>
        <Tooltip title="Edit">
          <IconButton
            onClick={() => {
              console.log(row.index);
              setRowIndex(row.index);
              setRowData(row.original);
              handleCheckRowData(row);
              handleEditSubjectModalOpen();
            }}
          >
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton
            color="error"
            onClick={() => {
              setRowIndex(row.index);
              handleCheckRowDataForDelete(row);
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    renderBottomToolbarCustomActions: () => (
      <Box sx={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        <Button
          variant="text"
          style={{
            textDecoration: "underline",
            color: PinkPallette.main,
            "&:hover": {
              backgroundColor: PinkPallette.light,
            },
          }}
          onClick={() => {
            handleAddSubjectModalOpen();
          }}
        >
          เพิ่มรายวิชา
        </Button>
        <Button
          color="success"
          variant="contained"
          endIcon={<ArrowForwardIosIcon />}
          onClick={() => {
            // ตรวจสอบว่ามีข้อมูลในตารางหรือไม่
            if (excelData.length === 0) {
              // หากไม่มีข้อมูลในตาราง ให้แสดง alert เพื่อแจ้งให้ผู้ใช้รู้
              alert("ไม่สามารถดำเนินการต่อไปได้เพราะไม่มีข้อมูลในตาราง");
              return; // ไม่สามารถดำเนินการต่อไปได้
            }
            // หากมีข้อมูลในตารางให้ทำการ navigate ไปยังหน้าต่อไป
            navigate("/confirmAddSubject");
          }}
          disabled={excelData.length === 0} // ปุ่มจะถูก disable หากไม่มีข้อมูลในตาราง
        >
          ต่อไป
        </Button>
      </Box>
    ),
    renderTopToolbarCustomActions: ({ table }) => {
      // const handleDeactivate = () => {
      //   let courseIDToDelete = [];
      //   table.getSelectedRowModel().flatRows.map((row) => {
      //     courseIDToDelete.push(row.original._id);
      //   });
      //   const crssObjID = {
      //     ids: courseIDToDelete,
      //   };
      //   axios
      //     .delete(`http://localhost:8000/api/courses/many`, { data: crssObjID })
      //     .then((res) => {
      //       console.log(crssObjID);
      //       console.log("success", res);
      //       getStaffs();
      //       getCourses();
      //       setRowSelection({});
      //     })
      //     .catch((error) => {
      //       console.log("error", error);
      //     });
      // };
      return (
        <Box
          sx={{
            ml: "auto",
            display: "flex",
            justifyContent: "flex-end",
            gap: "0.5rem",
          }}
        >
          <Button
            // sx={{ backgroundColor: PinkPallette.main }}
            color="error"
            disabled={
              !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
            }
            onClick={handleDeleteSubjectAllModalOpen}
            variant="contained"
          >
            ลบแถวที่เลือก
          </Button>
        </Box>
      );
    },
  });
  //do something when the row selection changes...
  useEffect(() => {
    console.info({ rowSelection }); //read your managed row selection state
    // console.info(table.getState().rowSelection); //alternate way to get the row selection state
  }, [rowSelection]);

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
      {deleteSubjectModalOpen && (
        <ReCheckModal
          open={deleteSubjectModalOpen}
          title={"ลบรายวิชา"}
          detail={"คุณยืนยันที่จะลบวิชานี้ใช่หรือไม่"}
          onClose={handleDeleteSubjectModalClose}
          onSubmit={handleDeleteSubjectModalSubmit}
        />
      )}
      {deleteSubjectAllModalOpen && (
        <ReCheckModal
          open={deleteSubjectAllModalOpen}
          title={"ลบรายวิชาที่เลือก"}
          detail={"คุณยืนยันที่จะลบวิชาที่เลือกใช่หรือไม่"}
          onClose={handleDeleteSubjectAllModalClose}
          onSubmit={handleDeleteSubjectAllModalSubmit}
        />
      )}
      <Button
        component="label"
        variant="contained"
        className="import-style"
        sx={{
          backgroundColor: PinkPallette.main,
          "&:hover": {
            backgroundColor: PinkPallette.light,
          },
        }}
        startIcon={<CloudUploadIcon />}
      >
        อัปโหลดไฟล์
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
