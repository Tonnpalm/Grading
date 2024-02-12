import { useMemo } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';


//nested data is ok, see accessorKeys in ColumnDef below
const data = [
  {
    name: {
      firstName: 'John',
    },
    Order: '1',
    SID: '6334000000',
    state: 'Kentucky',
  },
  {
    name: {
      firstName: 'Jane',
    },
    Order: '2',
    SID: '6334111111',
    state: 'Ohio',
  },
  {
    name: {
      firstName: 'Joe',
    },
    Order: '3',
    SID: '6334222222',
    state: 'West Virginia',
  },
  {
    name: {
      firstName: 'Kevin',
    },
    Order: '4',
    SID: '6334333333',
    state: 'Nebraska',
  },
  {
    name: {
      firstName: 'Joshua',
    },
    Order: '5',
    SID: '6334444444',
    state: 'South Carolina',
  },
];

const Example = () => {
  //should be memoized or stable
  const columns = useMemo(
    () => [
      {
        accessorKey: 'Order', //normal accessorKey
        header: 'ชื่อมอดูล',
        size: 200,
      },
      {
        accessorKey: 'SID',
        header: 'ปีการศึกษา/ภาค',
        size: 150,
      },
      {
        accessorKey: 'name.firstName', //access nested data with dot notation
        header: 'ระยะเวลาที่สอน',
        size: 150,
      },
      {
        accessorKey: 'state',
        header: 'ชั่วโมงเรียน',
        size: 150,
      },
      {
        accessorKey: 'state',
        header: 'จัดการมอดูล',
        size: 150,
      },
    ],
    [],
  );

  const table = useMaterialReactTable({
    columns,
    data, //data must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
  });

  return <MaterialReactTable table={table} />;
};

export default Example;
