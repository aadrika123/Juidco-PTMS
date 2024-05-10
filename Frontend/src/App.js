import React from "react";
import Main from "./Components/Main";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Recipt from "./Components/Recipt";
import BusRegistration from "./Components/BusRegistration";
import ConductorRegistration from "./Components/ConductorRegistration";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/main" element={<Main />} />
        <Route path="/recipt" element={<Recipt />} />
        <Route path="/registerBus" element={<BusRegistration />} />
        <Route
          path="/ConductorRegistration"
          element={<ConductorRegistration />}
        />
      </Routes>
    </Router>
  );
}

export default App;
