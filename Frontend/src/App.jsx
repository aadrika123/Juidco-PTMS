import React from "react";
import Main from "./Components/Main";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Recipt from "./Components/Recipt";
import BusRegistration from "./Components/Registration/BusRegistration";
import ConductorRegistration from "./Components/Registration/ConductorRegistration";
import RegisterMain from "./Components/Registration/RegisterMain";
import ChangeScheduling from "./Components/Registration/ChangeScheduling";
import Report_Generation from "./Components/Registration/Report_Generation";
import Conductor_dashboard from "./Components/Conductor/Conductor_dashboard";
import Ticket_check from "./Components/Conductor/Ticket_check";
import Conductor_Report_Generation from "./Components/Conductor/Conductor_Report_Generation";
import Bus_Report_Generation from "./Components/Registration/Bus_Report_Generation";
import Conductor_report_page from "./Components/Registration/Report/Conductor_report_page";
import Bus_report_page from "./Components/Registration/Report/Bus_report_page";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/main" element={<Main />} />
        <Route path="/RMC_dashboard" element={<RegisterMain />} />
        <Route path="/recipt" element={<Recipt />} />
        <Route path="/registerBus" element={<BusRegistration />} />
        <Route
          path="/ConductorRegistration"
          element={<ConductorRegistration />}
        />
        <Route path="/chagneScheduling" element={<ChangeScheduling />} />
        <Route path="/reportGeneration" element={<Report_Generation />} />
        <Route
          path="/BusreportGeneration"
          element={<Bus_Report_Generation />}
        />
        <Route path="/conductor_dashboard" element={<Conductor_dashboard />} />
        <Route path="/ticket_check" element={<Ticket_check />} />
        <Route
          path="/conductor_Report"
          element={<Conductor_Report_Generation />}
        />
        <Route
          path="/Conductor_report_page"
          element={<Conductor_report_page />}
        />
        <Route path="/Bus_report_page" element={<Bus_report_page />} />
      </Routes>
    </Router>
  );
}

export default App;
