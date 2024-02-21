// eslint-disable-next-line no-unused-vars
import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { Grid, Paper, Typography } from '@mui/material';
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
            <Grid container spacing={2}>
                <Grid item xs={4} md={5}>
                    <Item style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
                        <Grid item xs direction='column' justifyContent='center'>
                            <Typography>เกรด</Typography>
                            <Typography>A</Typography>
                            <Typography sx={{ paddingLeft: '7px'}}>B+</Typography>
                            <Typography>B</Typography>
                            <Typography sx={{ paddingLeft: '7px'}}>C+</Typography>
                            <Typography>C</Typography>
                            <Typography sx={{ paddingLeft: '7px'}}>D+</Typography>
                            <Typography>D</Typography>
                            <Typography>F</Typography>
                        </Grid>
                        <Grid item xs>
                            เกณฑ์คะแนน
                        </Grid>
                        <Grid item xs>
                            จำนวนนิสิต (คน)
                        </Grid>
                        <Grid item xs>
                            คิดเป็น (%)
                        </Grid>
                    </Item>
                </Grid>
                <Grid item xs={4} md={5}>
                    <Item style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }}>
                    <Grid item xs direction='column' justifyContent='center'>
                            <Typography>เกรด</Typography>
                            <Typography>I</Typography>
                            <Typography>M</Typography>
                            <Typography>W</Typography>
                            <Typography>S</Typography>
                            <Typography>U</Typography>
                            <Typography>V</Typography>
                            <Typography>รวม</Typography>
                            <Typography>เกรดเฉลี่ย</Typography>
                        </Grid>
                        <Grid item xs>
                            จำนวนนิสิต (คน)
                        </Grid>
                        <Grid item xs>
                            คิดเป็น (%)
                        </Grid>
                    </Item>
                </Grid>
                <Grid item xs={4} md={2}>
                    <Item>

                    </Item>
                </Grid>
            </Grid>
        </div>

    );
}