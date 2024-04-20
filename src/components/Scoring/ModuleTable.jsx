import { useEffect, useMemo, useState, useContext } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { Box, Button, Typography } from "@mui/material";
import "./ModuleTable.css";
import { Edit } from "@mui/icons-material";
import { MenuItem } from "@mui/material";
import ChecklistIcon from "@mui/icons-material/Checklist";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { PinkPallette } from "../../assets/pallettes";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ModuleModal from "./ModuleModal";
import ReCheckModal from "../utility/Recheck";
import { DataAcrossPages } from "../../assets/DataAcrossPages.jsx";

const Example = () => {
  const navigate = useNavigate();
  const [moduleDetail, setModuleDetail] = useState([]);
  const [addModuleModalOpen, setAddModuleModalOpen] = useState(false);
  const [editModuleModalOpen, setEditModuleModalOpen] = useState(false);
  const [deleteModuleModalOpen, setDeleteModuleModalOpen] = useState(false);
  const [duplicateModuleModalOpen, setDuplicateModuleModalOpen] =
    useState(false);
  const [idForEdit, setIdForEdit] = useState();
  const [idForDelete, setIdForDelete] = useState();
  const [rowDataToDuplicate, setRowDataToDuplicate] = useState();
  const [rowData, setRowData] = useState({});
  const { data } = useContext(DataAcrossPages);
  const { setData } = useContext(DataAcrossPages);

  function getModuleID() {
    axios.get(`http://localhost:8000/api/modules/${data}`).then((res) => {
      console.log("res.data", res.data);
      const pushDataToModuleDetail = res.data.moduleID.map((item) => {
        const date = item.startPeriod + " - " + item.endPeriod;
        const term = item.year + "/" + item.semester;
        return {
          ...item,
          selectedDate: date,
          yearAndSemester: term,
          duration: item.hours,
        };
      });
      setModuleDetail(pushDataToModuleDetail);
    });
  }

  useEffect(() => {
    getModuleID();
  }, []);

  const handleAddModuleModalOpen = () => {
    setAddModuleModalOpen(true);
  };

  const handleAddModuleModalClose = () => {
    setAddModuleModalOpen(false);
  };

  const handleAddModuleModalSubmit = async (data) => {
    await setModuleDetail((prevState) => {
      const newDataSet = [...prevState, data];
      return newDataSet;
    });
    handleAddSubmitSendingToServer(data);
  };

  const handleAddSubmitSendingToServer = async (data) => {
    console.log("data in handleSaveButtonClick", data);
    const formattedDataFromAddModule = {
      moduleName: data.moduleName,
      startPeriod: data.selectedDate.split(" - ")[0],
      endPeriod: data.selectedDate.split(" - ")[1],
      hours: data.duration,
      year: data.yearAndSemester.split("/")[0],
      semester: data.yearAndSemester.split("/")[1],
      crsID: "6601138a5a0240478a1e078d",
      instructorID: "65f90efa4ef7a70f80525050",
    };
    console.log("formattedDataFromAddModule", formattedDataFromAddModule);
    // const res = axios
    //   .post(`http://localhost:8000/api/modules/`, formattedDataFromAddModule)
    //   .then((res) => {
    //     console.log("error", res);
    //   });
    const res = axios
      .post(`http://localhost:8000/api/modules/`, formattedDataFromAddModule, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      .then((res) => {
        console.log("error", res);
      });
  };

  const handleCheckRowData = (row) => {
    console.log("row.original.", row.original);
    setIdForEdit(row.original._id);
    if (rowData) handleEditModuleModalOpen();
  };

  const handleSaveButtonClick = (data) => {
    console.log("data", data);
    const startDate = data.selectedDate.split(" - ")[0];
    const endDate = data.selectedDate.split(" - ")[1];
    const year = data.yearAndSemester.split("/")[0];
    const semester = data.yearAndSemester.split("/")[1];

    const editDataSendToServer = {
      moduleName: data.moduleName,
      startPeriod: startDate,
      endPeriod: endDate,
      hours: data.duration,
      year: year,
      semester: semester,
      crsID: null,
      instructorID: "65f90efa4ef7a70f80525050",
    };

    console.log("editDataSendToServer", editDataSendToServer);
    axios
      .put(
        `http://localhost:8000/api/modules/${idForEdit}`,
        editDataSendToServer
      )
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        console.log("error kaa", error);
      });
  };

  const handleEditModuleModalOpen = () => {
    setEditModuleModalOpen(true);
  };

  const handleEditModuleModalClose = () => {
    setEditModuleModalOpen(false);
  };

  const handleEditModuleModalSubmit = (data) => {
    setModuleDetail((prevState) => {
      const newDataSet = [...prevState];
      // ค้นหา index ของแถวที่ต้องการแก้ไข
      const rowIndex = newDataSet.findIndex((row) => row.crsID === data.crsID);
      // หากพบแถวที่ต้องการแก้ไข
      if (rowIndex !== -1) {
        // ลบแถวเก่าออกจากข้อมูล
        newDataSet[rowIndex] = data;
      }
      // ส่งข้อมูลใหม่กลับ
      return newDataSet;
    });
    setAddModuleModalOpen(false);
    console.log(moduleDetail);
    if (rowData) handleSaveButtonClick(data);
    else return;

    // axios.put(`http://localhost:8000/api/modules/${idForEdit}`);
  };

  const handleCheckRowDataForDelete = (row) => {
    // console.log("row.original._id", row.original._id);
    setIdForDelete(row.original._id);
    handleDeleteModuleModalOpen();
  };

  const handleDeleteModuleModalOpen = () => {
    setDeleteModuleModalOpen(true);
  };

  const handleDeleteModuleModalClose = () => {
    setDeleteModuleModalOpen(false);
  };

  const handleDeleteModuleModalSubmit = (row) => {
    axios
      .delete(`http://localhost:8000/api/modules/${idForDelete}`)
      .then((response) => {
        getModules();
      })
      .catch((error) => {
        console.log("error");
      });
    handleDeleteModuleModalClose();
  };

  const handleDuplicateModuleModalOpen = (row) => {
    // console.log("data", row);
    setDuplicateModuleModalOpen(true);
  };

  const handleDuplicateModuleModalClose = () => {
    setDuplicateModuleModalOpen(false);
  };

  const handleDuplicateModuleModalSubmit = () => {
    const newRow = { ...rowDataToDuplicate }; // คัดลอกข้อมูลของแถวที่ต้องการ duplicate
    console.log("row", rowDataToDuplicate);
    setModuleDetail((prevState) => [...prevState, newRow]); // เพิ่มแถวใหม่เข้าไปใน state
    handleDuplicateModuleModalClose();
    console.log("newRow", newRow);

    const startDate = newRow.selectedDate.split(" - ")[0];
    const endDate = newRow.selectedDate.split(" - ")[1];
    const year = newRow.yearAndSemester.split("/")[0];
    const semester = newRow.yearAndSemester.split("/")[1];

    const duplicateDataSendToServer = {
      moduleName: newRow.moduleName,
      startPeriod: startDate,
      endPeriod: endDate,
      hours: newRow.duration,
      year: year,
      semester: semester,
      crsID: newRow.crsIDd,
      instructorID: newRow.instructorID._id,
    };
    axios
      .post(`http://localhost:8000/api/modules/`, duplicateDataSendToServer)
      .then((res) => {
        console.log("res", res);
      });
  };

  const handleCheckRowDataToDuplicate = (row) => {
    handleDuplicateModuleModalOpen(row);
    setRowDataToDuplicate(row);
    console.log("row.orginal", row);
  };

  const handleScoringClick = (row) => {
    setData(row);
    navigate("/scoringTable");
  };

  const columns = useMemo(
    //column definitions...
    () => [
      {
        accessorKey: "moduleName",
        header: "ชื่อมอดูล",
      },
      {
        accessorKey: "yearAndSemester",
        header: "ปีการศึกษา/ภาค",
      },
      {
        accessorKey: "selectedDate",
        header: "ระยะเวลาที่สอน",
      },
      {
        accessorKey: "duration",
        header: "จำนวนชั่วโมงเรียน",
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data: moduleDetail,
    createDisplayMode: "row", // ('modal', and 'custom' are also available)
    editDisplayMode: "table", // ('modal', 'row', 'cell', and 'custom' are also
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
    renderRowActionMenuItems: ({ row }) => (
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <MenuItem
          key="edit"
          onClick={() => {
            setRowData(row.original);
            handleCheckRowData(row);
          }}
          sx={{ display: "flex", flexDirection: "row", gap: "1rem" }}
        >
          <Edit />
          <Typography>แก้ไข</Typography>
        </MenuItem>

        <MenuItem
          key="delete"
          onClick={() => {
            handleCheckRowDataForDelete(row);
          }}
          sx={{ display: "flex", flexDirection: "row", gap: "1rem" }}
        >
          <DeleteIcon />
          <Typography>ลบ</Typography>
        </MenuItem>

        <MenuItem
          key="duplicate"
          onClick={() => {
            handleCheckRowDataToDuplicate(row.original);
          }}
          sx={{ display: "flex", flexDirection: "row", gap: "1rem" }}
        >
          <ContentCopyIcon />
          <Typography>คัดลอก</Typography>
        </MenuItem>

        <MenuItem
          key="scoring"
          // onClick={() => navigate("/scoringTable")}
          onClick={() => {
            console.log("row.ori", row.original);
            handleScoringClick(row.original);
          }}
          sx={{ display: "flex", flexDirection: "row", gap: "1rem" }}
        >
          <ChecklistIcon />
          <Typography>ให้คะแนน</Typography>
        </MenuItem>
      </Box>
    ),
    renderTopToolbarCustomActions: ({ table }) => (
      <Button
        variant="contained"
        sx={{
          backgroundColor: PinkPallette.main,
          "&:hover": {
            backgroundColor: PinkPallette.light,
          },
        }}
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
        mode={"add"}
      />
      {editModuleModalOpen && (
        <ModuleModal
          open={editModuleModalOpen}
          onClose={handleEditModuleModalClose}
          onSubmit={handleEditModuleModalSubmit}
          data={rowData}
          mode={"edit"}
        />
      )}
      <ReCheckModal
        open={deleteModuleModalOpen}
        title={"ลบมอดูลนี้?"}
        detail={"คุณยืนยันที่จะลบมอดูลนี้ใช่หรือไม่"}
        onClose={handleDeleteModuleModalClose}
        onSubmit={handleDeleteModuleModalSubmit}
      />
      <ReCheckModal
        open={duplicateModuleModalOpen}
        title={"คัดลอกมอดูลนี้?"}
        detail={"คุณยืนยันที่จะคัดลอกมอดูลนี้ใช่หรือไม่"}
        onClose={handleDuplicateModuleModalClose}
        onSubmit={handleDuplicateModuleModalSubmit}
      />
      <MaterialReactTable table={table} />
    </div>
  );
};

export default Example;
