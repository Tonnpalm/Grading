// eslint-disable-next-line no-unused-vars
import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { Grid, Paper, TextField, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const uData = [74, 65, 78, 80, 81, 82, 82, 82, 84, 52, 98, 98, 73, 90, 78, 48, 78, 83, 2, 55, 66, 2, 2, 2,2,2,2];
const cutOffValue = 7;
// นับจำนวนครั้งที่ข้อมูลปรากฏซ้ำกันแต่ละค่า
const dataMap = new Map();
uData.forEach(value => {
    dataMap.set(value, (dataMap.get(value) || 0) + 1);
});

// สร้างแกน X ที่แสดงคะแนน 1 ถึง 100
const xAxisData = Array.from({ length: 100 }, (_, i) => (i + 1).toString()); // สร้างเลขคะแนน 1 ถึง 100

// แมปข้อมูลจำนวนที่ซ้ำตามคะแนนในแกน X
const uDataMapped = xAxisData.map(score => dataMap.get(parseInt(score)) || 0); // ใช้ Math.floor() เพื่อแปลงเป็นจำนวนนับ

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),

    color: theme.palette.text.secondary,
  }));

export default function SimpleBarChart() {
    return (
        <div>
            <BarChart
            width={1100}
            height={550}
            series={[
                { data: uDataMapped, label: 'จำนวนนักเรียน', type: 'bar' }
            ]}
            xAxis={[{ data: xAxisData, scaleType: 'band' }]}
            lineProps={[
                {
                    data: Array.from({ length: xAxisData.length }, () => cutOffValue), // สร้างข้อมูลเส้น cut-off
                    stroke: 'red', // สีเส้น
                    strokeWidth: 2 // ความหนาของเส้น
                }
            ]}
            legend={{
                position: 'bottom' // ตำแหน่งของ legend ไว้ที่ด้านล่างของกราฟ
            }}
            />
            <Grid container spacing={2} paddingBottom={8}>
                <Grid item xs={4} md={5}>
                    <Item style={{ textAlign: 'center', display: 'flex', flexDirection: 'column' }}>
                        <Grid container spacing={2}>
                            <Grid item xs={2}>
                                <Typography>เกรด</Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <Typography>เกณฑ์คะแนน</Typography>
                            </Grid>
                            <Grid item xs={3}>
                                <Typography>จำนวน (คน)</Typography>
                            </Grid>
                            <Grid item xs={3}> 
                                <Typography>คิดเป็น (%)</Typography>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} paddingTop={1}>
                            <Grid item xs={2}>
                                <Typography sx={{ paddingTop: '10px' }}>A</Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <TextField 
                                    size='small'
                                    placeholder='00.00'
                                    sx={{ width:'75px' }}
                                />
                            </Grid>
                            <Grid item xs={3}>
                                <Typography sx={{ paddingTop: '10px' }}>DATA</Typography>
                            </Grid>
                            <Grid item xs={3}> 
                                <Typography sx={{ paddingTop: '10px' }}>DATA</Typography>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} paddingTop={1}>
                            <Grid item xs={2}>
                                <Typography sx={{ paddingTop: '10px', paddingLeft: '7px' }}>B+</Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <TextField 
                                    size='small'
                                    placeholder='00.00'
                                    sx={{ width:'75px' }}
                                />
                            </Grid>
                            <Grid item xs={3}>
                                <Typography sx={{ paddingTop: '10px' }}>DATA</Typography>
                            </Grid>
                            <Grid item xs={3}> 
                                <Typography sx={{ paddingTop: '10px' }}>DATA</Typography>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} paddingTop={1}>
                            <Grid item xs={2}>
                                <Typography sx={{ paddingTop: '10px' }}>B</Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <TextField 
                                    size='small'
                                    placeholder='00.00'
                                    sx={{ width:'75px' }}
                                />
                            </Grid>
                            <Grid item xs={3}>
                                <Typography sx={{ paddingTop: '10px' }}>DATA</Typography>
                            </Grid>
                            <Grid item xs={3}> 
                                <Typography sx={{ paddingTop: '10px' }}>DATA</Typography>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} paddingTop={1}>
                            <Grid item xs={2}>
                                <Typography sx={{ paddingTop: '10px', paddingLeft: '7px' }}>C+</Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <TextField 
                                    size='small'
                                    placeholder='00.00'
                                    sx={{ width:'75px' }}
                                />
                            </Grid>
                            <Grid item xs={3}>
                                <Typography sx={{ paddingTop: '10px' }}>DATA</Typography>
                            </Grid>
                            <Grid item xs={3}> 
                                <Typography sx={{ paddingTop: '10px' }}>DATA</Typography>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} paddingTop={1}>
                            <Grid item xs={2}>
                                <Typography sx={{ paddingTop: '10px' }}>C</Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <TextField 
                                    size='small'
                                    placeholder='00.00'
                                    sx={{ width:'75px' }}
                                />
                            </Grid>
                            <Grid item xs={3}>
                                <Typography sx={{ paddingTop: '10px' }}>DATA</Typography>
                            </Grid>
                            <Grid item xs={3}> 
                                <Typography sx={{ paddingTop: '10px' }}>DATA</Typography>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} paddingTop={1}>
                            <Grid item xs={2}>
                                <Typography sx={{ paddingTop:'10px', paddingLeft: '7px' }}>D+</Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <TextField 
                                    size='small'
                                    placeholder='00.00'
                                    sx={{ width:'75px' }}
                                />
                            </Grid>
                            <Grid item xs={3}>
                                <Typography sx={{ paddingTop: '10px' }}>DATA</Typography>
                            </Grid>
                            <Grid item xs={3}> 
                                <Typography sx={{ paddingTop: '10px' }}>DATA</Typography>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} paddingTop={1}>
                            <Grid item xs={2}>
                                <Typography sx={{ paddingTop: '10px' }}>D</Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <TextField 
                                    size='small'
                                    placeholder='00.00'
                                    sx={{ width:'75px' }}
                                />
                            </Grid>
                            <Grid item xs={3}>
                                <Typography sx={{ paddingTop: '10px' }}>DATA</Typography>
                            </Grid>
                            <Grid item xs={3}> 
                                <Typography sx={{ paddingTop: '10px' }}>DATA</Typography>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} paddingTop={1} paddingBottom={1}>
                            <Grid item xs={2}>
                                <Typography sx={{ paddingTop: '10px' }}>F</Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <Typography sx={{ paddingTop: '10px' }}>00.00</Typography>
                            </Grid>
                            <Grid item xs={3}>
                                <Typography sx={{ paddingTop: '10px' }}>DATA</Typography>
                            </Grid>
                            <Grid item xs={3}> 
                                <Typography sx={{ paddingTop: '10px' }}>DATA</Typography>
                            </Grid>
                        </Grid>
                    </Item>
                </Grid>
                <Grid item xs={4} md={5}>
                    <Item style={{ textAlign: 'center', display: 'flex', flexDirection: 'column' }}>
                        <Grid container spacing={2}>
                            <Grid item xs={4}>
                                <Typography>เกรด</Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <Typography>จำนวน (คน)</Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <Typography>คิดเป็น (%)</Typography>
                            </Grid>    
                        </Grid>
                        <Grid container spacing={2} paddingTop={1}>
                            <Grid item xs={4}>
                                <Typography sx={{ paddingTop: '10px' }}>I</Typography>
                            </Grid>
                            <Grid item xs={4}> 
                                <Typography sx={{ paddingTop: '10px' }}>DATA</Typography>
                            </Grid>
                            <Grid item xs={4}> 
                                <Typography sx={{ paddingTop: '10px' }}>DATA</Typography>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} paddingTop={2}>
                            <Grid item xs={4}>
                                <Typography sx={{ paddingTop: '10px' }}>M</Typography>
                            </Grid>
                            <Grid item xs={4}> 
                                <Typography sx={{ paddingTop: '10px' }}>DATA</Typography>
                            </Grid>
                            <Grid item xs={4}> 
                                <Typography sx={{ paddingTop: '10px' }}>DATA</Typography>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} paddingTop={2}>
                            <Grid item xs={4}>
                                <Typography sx={{ paddingTop: '10px' }}>W</Typography>
                            </Grid>
                            <Grid item xs={4}> 
                                <Typography sx={{ paddingTop: '10px' }}>DATA</Typography>
                            </Grid>
                            <Grid item xs={4}> 
                                <Typography sx={{ paddingTop: '10px' }}>DATA</Typography>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} paddingTop={2}>
                            <Grid item xs={4}>
                                <Typography sx={{ paddingTop: '10px' }}>S</Typography>
                            </Grid>
                            <Grid item xs={4}> 
                                <Typography sx={{ paddingTop: '10px' }}>DATA</Typography>
                            </Grid>
                            <Grid item xs={4}> 
                                <Typography sx={{ paddingTop: '10px' }}>DATA</Typography>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} paddingTop={2}>
                            <Grid item xs={4}>
                                <Typography sx={{ paddingTop: '10px' }}>U</Typography>
                            </Grid>
                            <Grid item xs={4}> 
                                <Typography sx={{ paddingTop: '10px' }}>DATA</Typography>
                            </Grid>
                            <Grid item xs={4}> 
                                <Typography sx={{ paddingTop: '10px' }}>DATA</Typography>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} paddingTop={2}>
                            <Grid item xs={4}>
                                <Typography sx={{ paddingTop: '10px' }}>V</Typography>
                            </Grid>
                            <Grid item xs={4}> 
                                <Typography sx={{ paddingTop: '10px' }}>DATA</Typography>
                            </Grid>
                            <Grid item xs={4}> 
                                <Typography sx={{ paddingTop: '10px' }}>DATA</Typography>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} paddingTop={2}>
                            <Grid item xs={4}>
                                <Typography sx={{ paddingTop: '10px' }}>รวม</Typography>
                            </Grid>
                            <Grid item xs={4}> 
                                <Typography sx={{ paddingTop: '10px' }}>DATA</Typography>
                            </Grid>
                            <Grid item xs={4}> 
                                <Typography sx={{ paddingTop: '10px' }}>DATA</Typography>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} paddingTop={2} paddingBottom={1}>
                            <Grid item xs={4}>
                                <Typography sx={{ paddingTop: '10px' }}>เกรดเฉลี่ย</Typography>
                            </Grid>
                            <Grid item xs={4}> 
                                <Typography sx={{ paddingTop: '10px' }}>DATA</Typography>
                            </Grid>
                            
                        </Grid>
                    </Item>
                </Grid>
                <Grid item xs={4} md={2}>
                    <Item>
                        <Typography>เวอร์ชัน 1</Typography>
                    </Item>
                    <Item>
                        <Typography>เวอร์ชัน 2</Typography>
                    </Item>
                </Grid>
            </Grid>
        </div>

    );
}
