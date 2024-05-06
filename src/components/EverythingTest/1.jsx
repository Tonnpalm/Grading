import React, { useState, useEffect } from "react";
import {
  Grid,
  Paper,
  TextField,
  Typography,
  Button,
  Box,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const data = [1, 2, 3, 4];

const CreateComponentByWantedAmount = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (count < data.length) {
      setCount((prevCount) => prevCount + 1);
    }
  }, [count]);

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    alignContent: "center",

    color: theme.palette.text.secondary,
  }));

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        fontSize: 40,
      }}
    >
      {data.slice(0, count).map((item, index) => (
        <Typography key={index}>{item}</Typography>
      ))}

      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          // marginTop: "-109px",
          // marginBottom: "30px",
        }}
      >
        <Grid style={{ maxWidth: "1024px" }}>
          <Item
            style={{
              width: 820,
              display: "flex",
              flexDirection: "row",
              textAlign: "center",
              justifyContent: "center",
            }}
          >
            <Grid
              container
              spacing={3.5}
              paddingLeft={"10px"}
              paddingBottom={"10px"}
            >
              <Grid item xs={1}>
                <Typography sx={{ paddingTop: "10px" }}>Max</Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography sx={{ paddingTop: "10px" }}>maxScore</Typography>
              </Grid>
              <Grid item xs={1}>
                <Typography sx={{ paddingTop: "10px" }}>Min</Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography sx={{ paddingTop: "10px" }}>minScore</Typography>
              </Grid>
              <Grid item xs={1}>
                <Typography sx={{ paddingTop: "10px" }}>Mean</Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography sx={{ paddingTop: "10px" }}>
                  meanScore.toFixed(2)
                </Typography>
              </Grid>
              <Grid item xs={1}>
                <Typography sx={{ paddingTop: "10px" }}>S.D.</Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography sx={{ paddingTop: "10px" }}>
                  sd.toFixed(2)
                </Typography>
              </Grid>
            </Grid>
          </Item>
        </Grid>
      </div>
    </div>
  );
};

export default CreateComponentByWantedAmount;
