// eslint-disable-next-line no-unused-vars
import * as React from 'react';
import { Grid } from '@mui/material';
import { TextField } from "@mui/material";
// import FormControl from '@mui/material/FormControl';
// import MenuItem from '@mui/material/MenuItem';
// import Select from '@mui/material/Select';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ResponsiveAppBar from '../../AppBar/ButtonAppBar';
import CheckboxesTags from './Checkboxes';
import './AddMoreSubject.css'
import { useNavigate } from "react-router-dom";
import { PinkPallette } from '../../../assets/pallettes';

const contentSx = {
    textAlign: "left",
    paddingLeft: 10,
  };

export default function BasicCard() {

      // eslint-disable-next-line no-unused-vars
      const navigate = useNavigate();

  return (
    <div>
        <ResponsiveAppBar/>
        <div className='addMore-container'>
            <Typography sx={{ marginBottom: '20px', fontSize: 34}}>เพิ่มรายวิชา</Typography>
            <Card sx={{ width: 1000, backgroundColor: PinkPallette.light }}>
            <CardContent 
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginTop: '20px'
            }}>
            <Grid
                container
                spacing={3}
                justifyContent="center"
                alignItems="center"
            >
                <Grid item xs={3}>
                    <Typography sx={contentSx}>รหัสวิชา</Typography>
                </Grid>
                <Grid item xs={8}>
                    <TextField  placeholder="กรุณากรอกรหัสวิชา" sx={{ width: 550, borderRadius: '4px', backgroundColor:'white' }}/>
                </Grid>
                <Grid item xs={3}>
                    <Typography sx={contentSx}>ชื่อวิชา</Typography>
                </Grid>
                <Grid item xs={8}>
                    <TextField  placeholder="กรุณากรอกชื่อวิชา" sx={{ width: 550, borderRadius: '4px', backgroundColor:'white'  }}/>
                </Grid>
                <Grid item xs={3}>
                    <Typography sx={contentSx}>ตอนเรียน</Typography>
                </Grid>
                <Grid item xs={8}>
                    <TextField  placeholder="กรุณากรอกตอนเรียน Ex. 1-5" sx={{ width: 550, borderRadius: '4px', backgroundColor:'white'  }}/>
                </Grid>
                <Grid item xs={3}>
                    <Typography sx={contentSx}>หน่วยกิต</Typography>
                </Grid>
                <Grid item xs={8}>
                    <TextField  placeholder="กรุณากรอกจำนวนหน่วยกิต" sx={{ width: 550, borderRadius: '4px', backgroundColor:'white'  }}/>
                </Grid>
                <Grid item xs={3}>
                    <Typography sx={contentSx}>ผู้ประสานงาน</Typography>
                </Grid>
                <Grid item xs={8}>
                    <CheckboxesTags/>
                </Grid>
            </Grid>

            </CardContent>
            <CardActions sx={{ justifyContent: 'center', marginBottom: '20px'}}>
                <Button variant="contained" onClick={() => {navigate('/selectSubject')}}>ยกเลิก</Button>
                <Button variant="contained">ตกลง</Button>
            </CardActions>
            </Card>
        </div>
    </div>
  );
}

