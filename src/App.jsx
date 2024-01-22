import { Routes, Route } from "react-router-dom";
import LoginT from "./components/LoginPage/Login";
import Homepage from "./components/Homepage/Hompage";
import Histogram from "./components/Histogram/Histogram";
import AddSubject from "./components/AddSubject/AddSubject";
import SelectSubject from "./components/AddSubject/SelectSubject/SelectSubject";
import Table from "./components/Excel/tableTest";
import Scoring from "./components/Scoring/Scoring";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { ThemeProvider, createTheme } from "@mui/material";
import "./App.css";

function App() {
  const theme = createTheme({
    typography: {
      fontFamily: "Prompt",
    },
  });
  return (
    <ThemeProvider theme={theme}>
      <Routes>
        <Route path="/" element={<LoginT />} />
        <Route path="homepage" element={<Homepage />} />
        <Route path="histogram" element={<Histogram />} />
        <Route path="addSubject" element={<AddSubject />} />
        <Route path="selectSubject" element={<SelectSubject />} />
        <Route path="table" element={<Table />} />
        <Route path="scoring" element={<Scoring />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
