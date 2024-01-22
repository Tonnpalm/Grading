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
      options={officerNameList}
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
      style={{ width: 700 }}
      renderInput={(params) => (
        <TextField {...params} label="รายชื่อ" placeholder="ผู้ประสานงาน" />
      )}
    />
  );
}

// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
const officerNameList = [
  { title: 'ผศ.ดร.ภควรรณ ปักษี', year: 1994 },
  { title: 'ผศ.ดร.อธิปัตย์ ธำรงค์ธัญลักษณ์', year: 1972 },
  { title: 'ผศ.ดร.ณัฐพงศ์ ไพบูลย์วรชาติ', year: 1974 },
  { title: 'ผศ.ดร.ภควรรณ ปักษี', year: 1994 },
  { title: 'ผศ.ดร.อธิปัตย์ ธำรงค์ธัญลักษณ์', year: 1972 },
  { title: 'ผศ.ดร.ณัฐพงศ์ ไพบูลย์วรชาติ', year: 1974 },
  { title: 'ผศ.ดร.ภควรรณ ปักษี', year: 1994 },
  { title: 'ผศ.ดร.อธิปัตย์ ธำรงค์ธัญลักษณ์', year: 1972 },
  { title: 'ผศ.ดร.ณัฐพงศ์ ไพบูลย์วรชาติ', year: 1974 },
 
];