import React from "react";
import SearchAppBar from "../AppBar/ButtonAppBar";
// import TableTest from '../Excel/tableTest';
import "./Scoring.css";
import { Button, Tooltip } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { useNavigate } from 'react-router-dom';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import BasicModal from "./Modal";


// import RecipeReviewCard from "./ModuleCard/ModuleCard";
const settings = ['แก้ไขมอดูล', 'ทำซ้ำมอดูล', 'ลบมอดูล'];

function Scoring() {
  function createData(name, term, duration, hours, manage) {
    return { name, term, duration, hours, manage };
  }
  const rows = [
    createData("Intro Nanochem II", "2566/1", "01/01/2023 - 03/03/2023", 45),
    // createData('Ice cream sandwich', 237, 9.0),
    // createData('Eclair', 262, 16.0),
    // createData('Cupcake', 305, 3.7),
    // createData('Gingerbread', 356, 16.0), 
    
  ];

  const navigate = useNavigate();
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };


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
          {/* <Button
            component="label"
            variant="contained"
            sx={{ backgroundColor: PinkPallette.main, color: "black" }}
            startIcon={<AddCircleOutlineIcon />}
            onClick={ () => {<BasicModal/>}}
          >
            เพิ่มส่วนการให้คะแนน/มอดูล
          </Button> */}
          <BasicModal></BasicModal>
        </div>
        <div>
          {/* export default function BasicTable() {
  return ( */}
          <TableContainer component={Paper}>
            <Table
              sx={{ minWidth: 1164, boxShadow: "none" }}
              aria-label="simple table"
            >
              <TableHead>
                <TableRow>
                  <TableCell>ชื่อมอดูล</TableCell>
                  <TableCell align="center">ปีการศึกษา/ภาค</TableCell>
                  <TableCell align="center">ระยะเวลาที่สอน</TableCell>
                  <TableCell align="center">ชั่วโมงเรียน</TableCell>
                  <TableCell align="center">จัดการรายวิชา</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow
                    key={row.name}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">{row.name}</TableCell>
                    <TableCell align="center">{row.term}</TableCell>
                    <TableCell align="center">{row.duration}</TableCell>
                    <TableCell align="center">{row.hours}</TableCell>
                    <TableCell align="center">
                      <Box sx={{ flexGrow: 0 }}>
                      <Tooltip >
                        <IconButton onClick={handleOpenUserMenu} >
                          <EditIcon/>
                        </IconButton>
                        <Menu
                          sx={{ mt: '45px' }}
                          id="menu-appbar"
                          anchorEl={anchorElUser}
                          anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                          }}
                          keepMounted
                          transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                          }}
                          open={Boolean(anchorElUser)}
                          onClose={handleCloseUserMenu}
                        >
                          {settings.map((setting) => (
                            <MenuItem key={setting} onClick={handleCloseUserMenu}>
                              <Typography textAlign="center">{setting}</Typography>
                            </MenuItem>
                          ))}
                        </Menu>
                      </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}

                {/* <RecipeReviewCard/> */}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </div>
  );
}

export default Scoring;
