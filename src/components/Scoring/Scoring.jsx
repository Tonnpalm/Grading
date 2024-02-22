// eslint-disable-next-line no-unused-vars
import React from "react";
import SearchAppBar from "../AppBar/ButtonAppBar";
import "./Scoring.css";
import { Button } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { useNavigate } from 'react-router-dom';
// import BasicModal from './Modal'
import Example from './ModuleTable'


function Scoring() {
  const navigate = useNavigate();


  return (
    <div>
      <SearchAppBar />
      <div className="Scoring-container">
        <div className="button-control">
          <Button
            component="label"
            variant="contained"
            sx={{ backgroundColor: "white", color: "black" }}
            startIcon={<ArrowBackIosIcon />}
            onClick = { () => {navigate('/homepage')}}
          >
            กลับ
          </Button>
          {/* <BasicModal></BasicModal> */}
        </div>
        <div className="scoring-table-container">
          <Example/>
        </div>
      </div>
    </div>
  );
}

export default Scoring;
