import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { MyProvider } from "./assets/DataAcrossPages";
import TestAPI from "./components/EverythingTest/TestAPI";
import Homepage from "./components/Homepage/Hompage";
import AddSubject from "./components/AddSubject/AddSubjectCard/AddSubject";
import SelectSubject from "./components/AddSubject/SelectSubject/SelectSubject";
import Table from "./components/Excel/tableTest";
import Scoring from "./components/Scoring/Scoring";
import SelectSubject2Grading from "./components/Grading/SubjectSelection/SelectSubject2Grading";
import GradeAdjustment from "./components/Grading/Histogram/GradeAdjustment";
import ScoringTable from "./components/Scoring/ScoringTable";
import ConfirmAddSubject from "./components/AddSubject/ConfirmAddSubject/ConfirmAddSubject";
import ConfirmScore from "./components/Grading/ConfirmScore/ConfirmScore";
import YearAndSemester from "./components/Grading/SubjectSelection/YearAndSemester";
import GradingResult from "./components/Grading/ConfirmScore/GradingResult";
import TickPlacementBars from "./components/Grading/Histogram/TestPlacement";
import InputStaffID from "./components/Homepage/InputStaffID";
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
    <MyProvider>
      <ThemeProvider theme={theme}>
        <Routes>
          <Route path="/" element={<InputStaffID />} />
          <Route path="/homepage" element={<Homepage />} />
          <Route path="testAPI" element={<TestAPI />} />
          <Route path="addSubject" element={<AddSubject />} />
          <Route path="selectSubject" element={<SelectSubject />} />
          <Route path="table" element={<Table />} />
          <Route path="scoring" element={<Scoring />} />
          <Route
            path="selectSubject2grading"
            element={<SelectSubject2Grading />}
          />
          <Route path="gradeAdjustment" element={<GradeAdjustment />} />
          <Route path="scoringTable" element={<ScoringTable />} />
          <Route path="confirmAddSubject" element={<ConfirmAddSubject />} />
          <Route path="confirmScore" element={<ConfirmScore />} />
          <Route path="yearAndSemester" element={<YearAndSemester />} />
          <Route path="gradingResult" element={<GradingResult />} />
          <Route path="placement" element={<TickPlacementBars />} />
          {/* <Route path="responsiveDialog" element={<ResponsiveDialog />} /> */}
        </Routes>
      </ThemeProvider>
    </MyProvider>
  );
}

export default App;
