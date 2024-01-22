// eslint-disable-next-line no-unused-vars
import React from 'react';
import './HomepageC.css';
import SearchAppBar from "../AppBar/ButtonAppBar";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import BeenhereIcon from '@mui/icons-material/Beenhere';
import { PinkPallette } from '../../assets/pallettes';
import { useNavigate } from 'react-router-dom';

function Homepage() {
    const navigate = useNavigate();
    return (
        <div>
            <SearchAppBar/>
            <section className="wallpaperHomepage">
                <div className='content'>
                <Card sx={{ maxWidth: 271, mr: 12, backgroundColor: PinkPallette.main, '&:hover': {backgroundColor: PinkPallette.light,}}}>
                <CardActionArea sx={{ p: 3, paddingRight: 7, paddingLeft: 7 }} onClick = { () => {navigate('/scoring')}}> 
                    <CardContent sx={{ color: 'white' }} >
                        <CardMedia sx={{  display: 'flex', justifyContent: 'center' }}>
                            <EditIcon sx={{ width: '107px', height: '107px'}}></EditIcon>
                        </CardMedia>
                        <Typography variant="body2" >
                            ให้คะแนน
                        </Typography>
                    </CardContent>
                </CardActionArea>
                </Card>

                <Card sx={{ maxWidth: 271, ml: 12, backgroundColor: PinkPallette.main }}>
                <CardActionArea sx={{ p: 3, paddingRight: 7, paddingLeft: 7, '&:hover': {backgroundColor: PinkPallette.light,}}} onClick = { () => {navigate('/')}}>     
                    <CardContent sx={{ color: 'white' }}>
                        <CardMedia sx={{  display: 'flex', justifyContent: 'center' }}>
                            <BeenhereIcon sx={{ width: '109px', height: '109px' }}></BeenhereIcon>
                        </CardMedia>
                        <Typography variant="body2" whiteSpace="nowrap">
                            ออกเกรด
                        </Typography>
                    </CardContent>
                </CardActionArea>
                </Card>
                </div>
            </section>
            
        </div>
      
    );
  }
  
  export default Homepage;
