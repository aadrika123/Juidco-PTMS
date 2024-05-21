import React, { useEffect, useState } from "react";
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
import Bus_Onboarding from "./Components/Registration/Onboarding/Bus_Onboarding";
import Conductor_Onboarding from "./Components/Registration/Onboarding/Conductor_Onboarding";
import ChaneScheduling_main from "./Components/Registration/ChangeScheduling/ChaneScheduling_main";
import ReportGeneration_main from "./Components/Registration/ReportGeneration/ReportGeneration_main";
import Login_main from "./Components/Login/Login_main";
import Cookies from "js-cookie";

function App() {
  const [access_token, set_access_token] = useState("");
  const [userType, set_userType] = useState("");

  useEffect(() => {
    const token = Cookies.get("accesstoken");
    if (token) {
      const userDetails = sessionStorage.getItem("user_details");
      const type = JSON.parse(userDetails).user_type;
      console.log(type, "type");
      set_userType(type);
    }
    console.log(token);
    set_access_token(token);

    console.log("User ", userType);
  }, []);

  if (access_token) {
    return (
      <Router basename="/ptms">
        <Routes>
          <Route path="/" element={<RegisterMain />} />
          <Route path="/main" element={<Main />} />
          <Route path="/recipt" element={<Recipt />} />

          <Route path="/Bus-onboarding" element={<Bus_Onboarding />} />
          <Route
            path="/Conductor-onboarding"
            element={<Conductor_Onboarding />}
          />

          <Route path="/registerBus" element={<BusRegistration />} />
          <Route
            path="/ConductorRegistration"
            element={<ConductorRegistration />}
          />
          <Route
            path="/ChangeScheduling-Main"
            element={<ChaneScheduling_main />}
          />
          <Route path="/chagneScheduling" element={<ChangeScheduling />} />
          <Route path="/reportGeneration" element={<Report_Generation />} />
          <Route
            path="/BusreportGeneration"
            element={<Bus_Report_Generation />}
          />
          <Route
            path="/conductor_dashboard"
            element={<Conductor_dashboard />}
          />
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
          <Route
            path="/ReportGeneration-main"
            element={<ReportGeneration_main />}
          />
        </Routes>
      </Router>
    );
  } else {
    return (
      <Router basename="/ptms">
        <Routes>
          <Route path="/" element={<Login_main />} />
        </Routes>
      </Router>
    );
  }
}

export default App;
