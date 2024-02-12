// eslint-disable-next-line no-unused-vars
import * as React from 'react';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export default function CheckboxesTags() {
  return (
    <Autocomplete
      multiple
      id="checkboxes-tags-demo"
      options={nameList}
      disableCloseOnSelect
      getOptionLabel={(option) => option.title}
      renderOption={(props, option, { selected }) => (
        <li {...props}>
          <Checkbox
            icon={icon}
            checkedIcon={checkedIcon}
            style={{ marginRight: 8 }}
            checked={selected}
          />
          {option.title}
        </li>
      )}
      style={{ width: 550 }}
      renderInput={(params) => (
        <TextField {...params} placeholder="กรุณาเลือกรายชื่อ" sx={{borderRadius: '4px', backgroundColor:'white'  }}/>
      )}
    />
  );
}

// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
const nameList = [
  { title: 'นายสมชาย ใจจริง', year: 1994 },
  { title: 'นางสมหญิง จริงใจ', year: 1972 },
  { title: 'นายสมปอง ถูกใจ', year: 1974 },
  { title: 'นายสมหมาย ใจดี', year: 2008 },
  { title: 'นางสมสมร ดีใจ', year: 1957 },
  { title: "ผศ.ดร.ภควรรณ ปักษี", year: 1993 },
  { title: 'ผศ.ดร.ณัฐพงศ์', year: 1994 },
];