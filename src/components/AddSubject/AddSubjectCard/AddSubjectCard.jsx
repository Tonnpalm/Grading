import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Grid from "@mui/material/Grid";
import { useNavigate } from "react-router-dom";
import { TextField } from "@mui/material";

const contentSx = {
  textAlign: "right",
};

export default function AddSubjectCard() {
  const navigate = useNavigate();
  const [term, setTerm] = React.useState('');

  const handleChange = (event) => {
    setTerm(event.target.value);
  };

  return (
    <>
      <Card sx={{ width: 500 }}>
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{ fontSize: 28, m: 4 }}
            color="text.secondary"
            gutterBottom
          >
            กรุณากรอกข้อมูล
          </Typography>
          {/* <Box sx={{ width: "100%" }}> */}
          <Grid
            container
            spacing={3}
            justifyContent="center"
            alignItems="center"
          >
            <Grid item xs={4}>
              <Typography sx={contentSx}>ปีการศึกษา</Typography>
            </Grid>
            <Grid item xs={8}>
              <TextField/>
            </Grid>
            <Grid item xs={4}>
              <Typography sx={contentSx}>ภาคการศึกษา</Typography>
            </Grid>
            <Grid item xs={8}>

              <FormControl sx={{ width: 249.1 }}>
                
                <Select
                  labelId="demo-simple-select-autowidth-label"
                  id="demo-simple-select-autowidth"
                  value={term}
                  onChange={handleChange}
                  autoWidth
                  
                >
                  <MenuItem value={10}>ภาคต้น</MenuItem>
                  <MenuItem value={21}>ภาคปลาย</MenuItem>
                  <MenuItem value={22}>ภาคฤดูร้อน</MenuItem>
                </Select>
              </FormControl>

              {/* <select id="dropdown" style={{ height: '59.1px',
                width: '249.1px',
                // backgroundColor: 'white',
                border: '1px solid rgba(0, 0,0,0.2)',
                borderRadius: '6px'}}>
                <option value="">Select...</option>
                <option value="option1">ภาคต้น</option>
                <option value="option2">ภาคปลาย</option>
                <option value="option3">ภาคฤดูร้อน</option>   
              </select> */}
            </Grid>
          </Grid>
          
        </CardContent>
        <CardActions
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mb: 5,
          }}
        >
          <input
            type="submit"
            onClick={() => {
              navigate("/selectSubject");
            }}
          />
        </CardActions>
      </Card>
    </>
  );
}
