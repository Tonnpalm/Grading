// import React from "react";
// import MaterialReactTable from "material-react-table";

// // สมมติว่าคุณมีข้อมูลตารางสองตารางดังนี้
// const table1Data = [
//   { id: 1, name: "John", age: 30 },
//   { id: 2, name: "Jane", age: 25 },
//   { id: 3, name: "Doe", age: 40 },
// ];

// const table2Data = [
//   { id: 1, department: "HR", salary: 50000 },
//   { id: 2, department: "Finance", salary: 60000 },
// ];

// // สร้างฟังก์ชันสำหรับเชื่อมข้อมูลจากสองตาราง
// const mergeTables = (table1, table2) => {
//   return table1.map((row1) => {
//     const matchingRow = table2.find((row2) => row2.id === row1.id);
//     return { ...row1, ...matchingRow };
//   });
// };

// // เชื่อมข้อมูลจากสองตาราง
// const mergedData = mergeTables(table1Data, table2Data);

// // Component สำหรับแสดง MaterialReactTable
// const CombinedTable = () => {
//   const columns = [
//     { name: "id", label: "ID" },
//     { name: "name", label: "Name" },
//     { name: "age", label: "Age" },
//     { name: "department", label: "Department" },
//     { name: "salary", label: "Salary" },
//   ];

//   return <MaterialReactTable data={mergedData} columns={columns} />;
// };

// export default CombinedTable;
