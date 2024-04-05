import { Routes, Route } from "react-router-dom";
import TestAPI from "./components/EverythingTest/TestAPI";
import Homepage from "./components/Homepage/Hompage";
import Histogram from "./components/Grading/Histogram/Histogram";
import AddSubject from "./components/AddSubject/AddSubject";
import SelectSubject from "./components/AddSubject/SelectSubject/SelectSubject";
import Table from "./components/Excel/tableTest";
import Scoring from "./components/Scoring/Scoring";
import AddMoreSubject from "./components/AddSubject/AddMoreSubject/AddMoreSubject";
// import TestTable from "./components/Scoring/TestTable"
import SelectSubject2Grading from "./components/Grading/SubjectSelection/SelectSubject2Grading";
import GradeAdjustment from "./components/Grading/Histogram/GradeAdjustment";
// import TTT from './components/EverythingTest/testAddOfficer'
import ScoringTable from "./components/Scoring/ScoringTable";
import Tags from "./components/AddSubject/SelectSubject/TestAutocomplete";
import ConfirmAddSubject from "./components/AddSubject/ConfirmAddSubject/ConfirmAddSubject";
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
        <Route path="/" element={<Homepage />} />
        <Route path="testAPI" element={<TestAPI />} />
        <Route path="testAutocomplete" element={<Tags />} />
        <Route path="histogram" element={<Histogram />} />
        <Route path="addSubject" element={<AddSubject />} />
        <Route path="selectSubject" element={<SelectSubject />} />
        <Route path="table" element={<Table />} />
        <Route path="scoring" element={<Scoring />} />
        <Route path="addMoreSubject" element={<AddMoreSubject />} />
        {/* <Route path="testTable" element={<TestTable />} /> */}
        <Route
          path="selectSubject2grading"
          element={<SelectSubject2Grading />}
        />
        <Route path="gradeAdjustment" element={<GradeAdjustment />} />
        {/* <Route path="ttt" element={<TTT />} /> */}
        <Route path="scoringTable" element={<ScoringTable />} />
        <Route path="confirmAddSubject" element={<ConfirmAddSubject />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
