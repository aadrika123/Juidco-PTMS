import React from 'react';
import Main from './Components/Main';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Recipt from './Components/Recipt';


function App() {
  return (
      <Router>
        <Routes>
          <Route  path="/main" element={<Main/>} />
          <Route path="/recipt" element={<Recipt/>} />
        </Routes>
      </Router>
  );
}

export default App;
