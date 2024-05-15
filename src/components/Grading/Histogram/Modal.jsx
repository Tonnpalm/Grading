import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { axios } from "../../../utils/customAxios";
import { useState, useEffect, forwardRef } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import { PinkPallette } from "../../../assets/pallettes";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function Modal({ open, onClose, onSubmit, moduleID }) {
  const [dataInTable, setDataInTable] = useState([]);

  const [maxScore, setMaxScore] = useState("");
  const [minScore, setMinScore] = useState("");
  const [meanScore, setMeanScore] = useState("");
  const [sdScore, setSdScore] = useState("");
  const [columns, setColumns] = useState([
    {
      accessorKey: "number",
      header: "ลำดับ",
      size: 70,
      Cell: ({ row }) => row.index + 1,
      enableColumnPinning: true,
      enableSorting: false,
      enableColumnActions: false,
      enableEditing: false,
    },
    {
      accessorKey: "ID",
      header: "รหัสนิสิต",
      enableEditing: false,
      enableColumnActions: false,
      size: 140,
    },
    {
      accessorKey: "ชื่อ-นามสกุล",
      header: "ชื่อ-นามสกุล",
      enableEditing: false,
      enableColumnActions: false,
      size: 200,
    },
    {
      accessorKey: "totalScore",
      header: "คะแนนรวม",
      enableColumnActions: false,
      size: 70,
      enableEditing: false,
    },
  ]);

  const handleClose = () => {
    onClose();
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(
          `/scores/${moduleID}`
        );
        const assignments = response.data.scores.assignments;
        const students = response.data.scores.students;

        // Create new columns
        const newColumns = assignments.map((assignment) => ({
          accessorKey: assignment.accessorKey,
          header: assignment.headerName,
          size: 70,
          enableColumnActions: true,
        }));
        setColumns((prevColumns) => [...prevColumns, ...newColumns]);

        // Process old scores
        const processedData = students.map((student) => {
          if (!isNaN(student.totalScore)) {
            const row = {
              ID: student.sID,
              "ชื่อ-นามสกุล": student.sName,
              totalScore: parseFloat(student.totalScore).toFixed(2),
            };
            assignments.forEach((assignment) => {
              row[assignment.accessorKey] =
                parseFloat(student.scores[assignment.accessorKey]).toFixed(2) ||
                "-";
            });
            return row;
          } else {
            const row = {
              ID: student.sID,
              "ชื่อ-นามสกุล": student.sName,
              totalScore: student.totalScore,
            };
            assignments.forEach((assignment) => {
              row[assignment.accessorKey] =
                student.scores[assignment.accessorKey] || "-";
            });
            return row;
          }
        });
        setDataInTable(processedData);

        const totalScoreToCal = processedData.map((item) => {
          // item.totalScore.filter((value) => typeof value === "number");
          if (!isNaN(item.totalScore)) {
            return parseFloat(item.totalScore);
          } else {
            return 0;
          }
        });

        console.log("totalScoreToCal", totalScoreToCal);
        console.log("Math.max(totalScoreToCal)", Math.max(...totalScoreToCal));

        setMaxScore(Math.max(...totalScoreToCal));
        setMinScore(Math.min(...totalScoreToCal));
        setMeanScore(
          totalScoreToCal.reduce((acc, curr) => acc + curr, 0) /
            totalScoreToCal.length
        );
        const mean =
          totalScoreToCal.reduce((acc, curr) => acc + curr, 0) /
          totalScoreToCal.length;

        setSdScore(
          Math.sqrt(
            totalScoreToCal.reduce((acc, cur) => acc + (cur - mean) ** 2, 0) /
              totalScoreToCal.length
          )
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, []);

  const table = useMaterialReactTable({
    columns,
    data: dataInTable,
    enableColumnPinning: true,
    paginationDisplayMode: "pages",
    initialState: {
      columnPinning: {
        left: ["number", "ID", "ชื่อ-นามสกุล"],
        right: ["totalScore"],
      },
    },
  });
  const fullWidth = true;
  const maxWidth = "lg";

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth={fullWidth}
      maxWidth={maxWidth}
    >
      <AppBar sx={{ position: "relative", backgroundColor: PinkPallette.main }}>
        <Toolbar>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            ภาพรวมคะแนน
          </Typography>
          <IconButton
            autoFocus
            edge="end"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
            TransitionComponent={Transition}
          >
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <DialogContent>
        <Typography
          sx={{
            fontSize: 20,
            display: "flex",
            justifyContent: "center",
          }}
        >
          รายละเอียดคะแนน
        </Typography>
        <div style={{ padding: 30, paddingLeft: 260 }}>
          <Typography>Max: {parseFloat(maxScore).toFixed(2)}</Typography>
          {/* <Typography>{maxScore}</Typography> */}
          <Typography>Min: {parseFloat(minScore).toFixed(2)}</Typography>
          {/* <Typography>{minScore}</Typography> */}
          <Typography>Mean: {parseFloat(meanScore).toFixed(2)}</Typography>
          {/* <Typography>{meanScore}</Typography> */}
          <Typography>S.D.: {parseFloat(sdScore).toFixed(2)}</Typography>
        </div>
        <div>
          <MaterialReactTable table={table} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
