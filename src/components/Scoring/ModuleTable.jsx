import { useEffect, useMemo, useState, useContext } from "react";
import { useCookies } from "react-cookie";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { Box, Button, Typography } from "@mui/material";
import "./ModuleTable.css";
import { Assignment, Edit } from "@mui/icons-material";
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
  const [idScoreForDelete, setIdScoreForDelete] = useState();
  const [idForDuplucate, setIdForDuplicate] = useState();
  const [rowDataToDuplicate, setRowDataToDuplicate] = useState();
  const [rowData, setRowData] = useState({});
  const [rowIndex, setRowIndex] = useState();
  const { data } = useContext(DataAcrossPages);
  const { setData } = useContext(DataAcrossPages);
  const [cookies, setCookie] = useCookies([]);
  const staffIDFromHomepage = cookies["staffIDFromHomepage"];
  // const semester = cookies["semester"];

  function getModuleID() {
    console.log(staffIDFromHomepage);

    axios
      .get(`http://localhost:8000/api/modules/${staffIDFromHomepage}`)
      .then((res) => {
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

  const handleAddSubmitSendingToServer = async (datas) => {
    const formattedDataFromAddModule = {
      moduleName: datas.moduleName,
      startPeriod: datas.selectedDate.split(" - ")[0],
      endPeriod: datas.selectedDate.split(" - ")[1],
      hours: datas.duration,
      year: datas.yearAndSemester.split("/")[0],
      semester: datas.yearAndSemester.split("/")[1],
      crsID: null,
      instructorID: staffIDFromHomepage,
    };
    axios
      .post(`http://localhost:8000/api/modules/`, formattedDataFromAddModule, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      .then((res) => {
        console.log("data", res);
        getModuleID();
      });
  };

  const handleCheckRowData = (row) => {
    console.log("row.original.", row.original);
    setIdForEdit(row.original._id);
    if (rowData) handleEditModuleModalOpen();
  };

  const handleSaveButtonClick = (datas) => {
    console.log("data", datas);
    const startDate = datas.selectedDate.split(" - ")[0];
    const endDate = datas.selectedDate.split(" - ")[1];
    const year = datas.yearAndSemester.split("/")[0];
    const semester = datas.yearAndSemester.split("/")[1];

    const editDataSendToServer = {
      moduleName: datas.moduleName,
      startPeriod: startDate,
      endPeriod: endDate,
      hours: datas.duration,
      year: year,
      semester: semester,
      crsID: null,
      instructorID: staffIDFromHomepage,
    };

    console.log("editDataSendToServer", editDataSendToServer);
    axios
      .put(
        `http://localhost:8000/api/modules/${idForEdit}`,
        editDataSendToServer
      )
      .then((res) => {
        getModuleID();
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

  const handleEditModuleModalSubmit = (datas) => {
    // setModuleDetail((prevState) => {
    //   const newDataSet = [...prevState];
    //   // ค้นหา index ของแถวที่ต้องการแก้ไข
    //   const rowIndex = newDataSet.findIndex((row) => row.crsID === datas.crsID);
    //   // หากพบแถวที่ต้องการแก้ไข
    //   if (rowIndex !== -1) {
    //     // ลบแถวเก่าออกจากข้อมูล
    //     newDataSet[rowIndex] = datas;
    //   }
    //   // ส่งข้อมูลใหม่กลับ
    //   return newDataSet;
    // });

    setModuleDetail((prevState) => {
      const newDataSet = [...prevState];

      if (rowIndex !== -1) {
        console.log("rorwIndex", rowIndex);
        newDataSet[rowIndex] = datas;
      }
      return newDataSet;
    });

    setAddModuleModalOpen(false);
    console.log(moduleDetail);
    if (rowData) handleSaveButtonClick(datas);
    else return;
  };

  const handleCheckRowDataForDelete = (row) => {
    console.log("row.original._id", row.original._id);
    setIdForDelete(row.original._id);
    axios
      .get(`http://localhost:8000/api/scores/${row.original._id}`)
      .then((res) => {
        if (res.data.scores._id) {
          setIdScoreForDelete(res.data.scores._id);
        } else return;
      });
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
        getModuleID();
      })
      .catch((error) => {
        console.log("error", error);
      });
    if (idScoreForDelete) {
      axios
        .delete(`http://localhost:8000/api/scores/${idScoreForDelete}`)
        .then((res) => {
          getModuleID();
        });
    }
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
    // console.log("newRow", newRow);

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
      // instructorID: newRow.instructorID._id,
      instructorID: staffIDFromHomepage,
    };
    axios
      .post(`http://localhost:8000/api/modules/`, duplicateDataSendToServer)
      .then((res) => {
        console.log("res", res);
        getModuleID();
      });
    axios
      .get(`http://localhost:8000/api/scores/${idForDuplucate}`)
      .then((res) => {
        const dupData = {
          moduleObjectId: idForDuplucate,
          assignments: res.data.scores.assignments.map((item) => ({
            accessorKey: item.accessorKey,
            headerName: item.headerName,
            nType: item.nType,
            fullScore: item.fullScore,
          })),
          students: [
            {
              sID: "",
              sName: "",
              totalScore: 0, // เก็บคะแนนรวม
              scores: {},
            },
          ],
        };
        axios
          .post(`http://localhost:8000/api/scores/`, dupData)
          .then((res) => {
            console.log("success", res);
          })
          .catch((error) => {
            console.log("ว้ายยย", error);
          });
      });
    handleDuplicateModuleModalClose();
  };

  const handleCheckRowDataToDuplicate = (row) => {
    handleDuplicateModuleModalOpen(row);
    setRowDataToDuplicate(row);
    setIdForDuplicate(row._id);
    console.log("row.orginal", row._id);
  };

  const handleScoringClick = (row) => {
    setData(row);
    setCookie("row", row);
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
        sortDescFirst: true,
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
    renderRowActionMenuItems: ({ row, closeMenu }) => (
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <MenuItem
          key="edit"
          onClick={() => {
            setRowData(row.original);
            setRowIndex(row.index);
            handleCheckRowData(row);
            closeMenu();
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
            closeMenu();
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
            closeMenu();
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
            closeMenu();
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
