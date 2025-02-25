import React from 'react';
  
  const App = () =>  {
	return (
	  <div>
	  </div>
	);
  }
  
  export default App;
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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/main" element={<Main />} />
        <Route path="/RegisterMain" element={<RegisterMain />} />
        <Route path="/recipt" element={<Recipt />} />
        <Route path="/registerBus" element={<BusRegistration />} />
        <Route
          path="/ConductorRegistration"
          element={<ConductorRegistration />}
        />
        <Route path="/chagneScheduling" element={<ChangeScheduling />} />
        <Route path="/reportGeneration" element={<Report_Generation />} />
        <Route path="/conductor_dashboard" element={<Conductor_dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
