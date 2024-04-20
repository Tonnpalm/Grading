import { useMemo } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import ResponsiveAppBar from "../../AppBar/ButtonAppBar";
import { Box, Button, Typography } from "@mui/material";
import { mkConfig, generateCsv, download } from "export-to-csv";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import OfflinePinIcon from "@mui/icons-material/OfflinePin";
import { PinkPallette } from "../../../assets/pallettes";

const mockData = [
  {
    SID: 6334441823,
    studentName: "นายสมชาย ใจดี",
    lastName: 75,
    address: 70,
    state: 90,
    country: 68,
    studentGrade: "B+",
  },
  {
    SID: 6334441923,
    studentName: "นายสมจิตร ถูกใจ",
    lastName: 90,
    address: 80,
    state: 80,
    country: 67,
    studentGrade: "A",
  },
  {
    SID: 6334442023,
    studentName: "นางสาวสมหญิง จริงใจ",
    lastName: 85,
    address: 65,
    state: 77,
    country: 55,
    studentGrade: "B+",
  },
  {
    SID: 6334458523,
    studentName: "นายสมหมาย ใจรัก",
    lastName: 82,
    address: 60,
    state: 64,
    country: 97,
    studentGrade: "B",
  },
  {
    SID: 6334458623,
    studentName: "นางสาวสมปอง พักใจ",
    lastName: 72,
    address: 75,
    state: 66,
    country: 90,
    studentGrade: "C+",
  },
  {
    SID: 6334467623,
    studentName: "นายพงษ์พัฒน์ ดุจดี",
    lastName: 52,
    address: 55,
    state: 66,
    country: 60,
    studentGrade: "D+",
  },
  {
    SID: 6334467723,
    studentName: "นางสาวรรรรร รรพรรณ",
    lastName: 42,
    address: 55,
    state: 66,
    country: 80,
    studentGrade: "C+",
  },
  {
    SID: 6334467823,
    studentName: "นายบดินทร์ เดชา",
    lastName: 72,
    address: 85,
    state: 76,
    country: 90,
    studentGrade: "B+",
  },
  {
    SID: 6334467923,
    studentName: "นางสาวฤทัย รักสอาด",
    lastName: 52,
    address: 85,
    state: 66,
    country: 90,
    studentGrade: "B",
  },
  {
    SID: 6334468023,
    studentName: "นางสาวพรรณเพ็ญ รักเย็น",
    lastName: 74,
    address: 65,
    state: 96,
    country: 80,
    studentGrade: "B",
  },
  {
    SID: 6334478923,
    studentName: "นายนรชาติ พิทักษ์",
    lastName: 55,
    address: 57,
    state: 66,
    country: 70,
    studentGrade: "C",
  },
  {
    SID: 6334478723,
    studentName: "นายณัฐชัย บัวดำ",
    lastName: 92,
    address: 95,
    state: 86,
    country: 80,
    studentGrade: "A",
  },
  {
    SID: 6334489923,
    studentName: "นางสาวขวัญฤทัย สุขสำราญ",
    lastName: 72,
    address: 85,
    state: 86,
    country: 60,
    studentGrade: "B+",
  },
];

const csvConfig = mkConfig({
  fieldSeparator: ",",
  decimalSeparator: ".",
  useKeysAsHeaders: true,
  filename: "confirm_score",
});

const ConfirmScore = () => {
  const handleExportData = () => {
    const csv = generateCsv(csvConfig)(mockData);
    download(csvConfig)(csv);
  };
  const columns = useMemo(
    () => [
      {
        accessorKey: "rowNumbers",
        header: "ลำดับ",
        size: 70,
        Cell: ({ row }) => row.index + 1,
        enableColumnPinning: true,
        enableSorting: false,
        enableColumnActions: false,
      },
      {
        accessorKey: "studentName",
        header: "ชื่อ-นามสกุล",
        enableSorting: true,
        enableColumnActions: false,
      },
      {
        accessorKey: "SID",
        header: "รหัสนิสิต",
        size: 120,
        disableSortBy: true,
        enableColumnActions: false,
      },
      {
        accessorKey: "lastName",
        header: "มอดูลที่ 1",
        enableSorting: false,
      },
      {
        accessorKey: "address",
        header: "มอดูลที่ 2",
        size: 300,
        enableSorting: false,
      },
      {
        accessorKey: "state",
        header: "มอดูลที่ 3",
      },
      {
        accessorKey: "country",
        header: "มอดูลที่ 4",
      },
      {
        accessorKey: "studentGrade",
        header: "เกรด",
        size: 120,
        enableColumnActions: false,
        muiTableBodyCellProps: {
          align: "center",
        },
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data: mockData,
    renderTopToolbarCustomActions: ({ table }) => (
      <Box
        sx={{
          display: "flex",
          gap: "16px",
          padding: "8px",
          flexWrap: "wrap",
        }}
      >
        <Button
          variant="contained"
          sx={{
            backgroundColor: PinkPallette.main,
            "&:hover": {
              backgroundColor: PinkPallette.light,
            },
          }}
          onClick={handleExportData}
          startIcon={<FileDownloadIcon />}
        >
          ดาวน์โหลด
        </Button>
      </Box>
    ),
  });

  return (
    <div>
      <div>
        <ResponsiveAppBar />
      </div>
      <div>
        <Typography
          sx={{
            fontSize: "30px",
            display: "flex",
            justifyContent: "center",
            paddingTop: "20px",
            paddingBottom: "20px",
          }}
        >
          ผลการตัดเกรด
        </Typography>
        <div style={{ paddingInline: "10%" }}>
          <MaterialReactTable table={table} />
        </div>
        <div
          style={{
            paddingTop: "20px",
            paddingLeft: "10%",
            paddingRight: "10%",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Button
            variant="contained"
            startIcon={<ArrowBackIosIcon />}
            sx={{
              backgroundColor: PinkPallette.main,
              "&:hover": {
                backgroundColor: PinkPallette.light,
              },
            }}
          >
            กลับ
          </Button>
          <Button
            variant="contained"
            endIcon={<OfflinePinIcon />}
            sx={{
              backgroundColor: PinkPallette.main,
              "&:hover": {
                backgroundColor: PinkPallette.light,
              },
            }}
          >
            ยืนยัน
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmScore;
