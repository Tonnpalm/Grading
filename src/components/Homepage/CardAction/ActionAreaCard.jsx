import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import scoringIcon from '/Users/pongpipatsrimuang/Desktop/GradingFront/src/assets/scoringIcon.svg';

export default function ActionAreaCard() {
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardActionArea>
        <CardMedia>
            <scoringIcon></scoringIcon>
        </CardMedia>
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            ให้คะแนน
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}