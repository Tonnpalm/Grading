// eslint-disable-next-line no-unused-vars
import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

export default function ComboBox() {
  return (
    <Autocomplete
      disablePortal
      id="combo-box-demo"
      options={top100Films}
      sx={{ width: 510 }}
      renderInput={(params) => <TextField {...params} placeholder="ค้นหารหัส/ชื่อวิชา" />}
    />
  );
}

// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
const top100Films = [
  { label: 'Intro Nanochem', year: 1994 },
  { label: 'Chem Porous Mat', year: 1972 },
  { label: 'Intro Nanochem II', year: 1974 },
  { label: 'Intro Nanochem III', year: 2008 },
  { label: 'Intro Chem', year: 1957 },
  { label: "Nanochem Tech", year: 1993 },
  { label: 'Chem Tech II', year: 1994 },
  
];