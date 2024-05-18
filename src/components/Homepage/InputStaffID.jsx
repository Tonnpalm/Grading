import * as React from "react";
import toast, { Toaster } from "react-hot-toast";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Box, Toolbar, Container } from "@mui/material";
import Groups2Icon from "@mui/icons-material/Groups2";
import { PinkPallette } from "../../assets/pallettes";
import { AppBar } from "@mui/material";
import { axios } from "../../utils/customAxios";

export default function InputStaffID() {
  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies([]);
  const [staffID, setStaffID] = React.useState("");

  const numOnly = () =>
    toast.error("กรุณากรอกตัวเลขเท่านั้น", {
      style: {
        borderRadius: "10px",
        background: "red",
        color: "#fff",
      },
    });

  const notInDB = () =>
    toast.error("ไม่พบรหัสพนักงาน", {
      style: {
        borderRadius: "10px",
        background: "red",
        color: "#fff",
      },
    });

  const handleSubmit = () => {
    axios.get(`/staffs/${staffID}`).then((res) => {
      // console.log('check', res?.data);
      if (res.data.staffs !== null) {
        const isNumericID = /^\d+$/.test(staffID);
        if (!isNumericID) {
          numOnly();
          return;
        } else {
          setCookie("storedCode", staffID.toString());
          navigate("homepage/");
        }
      } else {
        notInDB();
      }
    });
  };

  const handleKeyDown = (event) => {
    if (!isDisabled) {
      if (event.key === "Enter") {
        handleSubmit();
      }
    }
    // } else {
    //   return;
    // }
  };

  const isDisabled = !/^\d{5}$/.test(staffID);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <AppBar position="static" sx={{ backgroundColor: "#ff79a9" }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Typography
              variant="h6"
              noWrap
              component="a"
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex" },
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
                "&:hover": {
                  color: PinkPallette.light,
                },
              }}
            >
              Grading
            </Typography>
            <Typography
              variant="h5"
              noWrap
              component="a"
              sx={{
                mr: 2,
                display: { xs: "flex", md: "none" },
                flexGrow: 1,
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
                "&:hover": {
                  color: PinkPallette.light,
                },
              }}
            >
              Grading
            </Typography>
          </Toolbar>
        </Container>
      </AppBar>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <Groups2Icon sx={{ width: 200, height: 200, paddingBottom: 0 }} />

        <Card sx={{ width: 500, marginTop: -4.5 }}>
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
              กรุณากรอกรหัสพนักงาน
            </Typography>
            <Grid justifyContent="center" alignItems="center">
              <Grid item xs={8}>
                <TextField
                  value={staffID}
                  onChange={(event) => {
                    if (isNaN(event.target.value)) {
                      numOnly();
                    } else {
                      setStaffID(event.target.value);
                    }
                  }}
                  onKeyDown={handleKeyDown}
                />
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
            <Box sx={{ display: "flex", gap: "1rem", alignItems: "center" }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                // color="error"
                sx={{
                  backgroundColor: PinkPallette.main,
                  "&:hover": {
                    backgroundColor: PinkPallette.light,
                  },
                }}
                onClick={handleSubmit}
                disabled={isDisabled}
              >
                ตกลง
              </Button>
              <Toaster />
            </Box>
          </CardActions>
        </Card>
      </div>
    </div>
  );
}
