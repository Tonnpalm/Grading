import { useEffect, useState, useContext } from "react";
import { DataAcrossPages } from "../../../assets/DataAcrossPages";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { MenuItem } from "@mui/material";
import Modal from "./Modal";

const Example = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data } = useContext(DataAcrossPages);
  const [columns, setColumns] = useState([]);
  const [checkCR58, setCheckCR58] = useState();

  useEffect(() => {
    console.log("ข้อมูลจากหน้าเลือกความต้องการ", data[data.length - 2]);

    if (!data) return;

    // สร้าง formattedData โดยจัดรูปแบบข้อมูลก่อนส่งเข้าในตาราง
    const formatted = data[data.length - 2];
    console.log("formatted", formatted);

    setCheckCR58(formatted);
    console.log("cr58", checkCR58);

    // สร้าง columns ที่มีหัวตารางเป็นชื่อ moduleName
    const uniqueModuleNames = data
      .slice(0, data.length - 2)
      .map((item) => item.moduleName);
    const moduleNameColumns = uniqueModuleNames.map((moduleName, index) => ({
      accessorKey: `moduleName_${index}`,
      header: moduleName,
      enableSorting: false,
      enableColumnActions: true,
      renderColumnActionsMenuItems: ({ closeMenu }) => (
        <MenuItem
          key={1}
          onClick={() => {
            handleHeaderClick();
            closeMenu();
          }}
        >
          ดูคะแนน
        </MenuItem>
      ),
    }));

    setColumns([
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
      ...moduleNameColumns, // เพิ่ม columns ที่สร้างจาก moduleName ที่ได้จาก data
      {
        accessorKey: "studentGrade",
        header: "เกรด",
        size: 120,
        enableColumnActions: false,
        muiTableBodyCellProps: {
          align: "center",
        },
      },
    ]);
  }, [data]);

  const handleHeaderClick = () => {
    setIsModalOpen(true);
  };

  const table = useMaterialReactTable({
    columns,
    data: data[data.length - 2],
    enableColumnPinning: true,
    initialState: {
      columnPinning: {
        left: ["rowNumbers", "SID", "studentName"],
        right: ["studentGrade"],
      },
    },
  });

  return (
    <>
      <MaterialReactTable table={table} />
      {isModalOpen && <Modal onClose={() => setIsModalOpen(false)} />}
    </>
  );
};

export default Example;
