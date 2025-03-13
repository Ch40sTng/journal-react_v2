import React from "react";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import Home from "./home";
import Navigate from "./Navigate";
import Journal from "./journal";
import Login from "./login";
import JCR_AHCI from "./JCR_AHCI";
import JCR_ESCI from "./JCR_ESCI";
import JCR_SCIE from "./JCR_SCIE";
import JCR_SSCI from "./JCR_SSCI";

const App = () => {
  return (
    <BrowserRouter>
      <Navigate />
          <Routes>
              <Route path="/" element={<Home />}/>
              <Route path="/journals" element={<Journal/>}/>
              <Route path="/journals/JCR_AHCI" element={<JCR_AHCI/>}/>
              <Route path="/journals/JCR_ESCI" element={<JCR_ESCI/>}/>
              <Route path="/journals/JCR_SCIE" element={<JCR_SCIE/>}/>
              <Route path="/journals/JCR_SSCI" element={<JCR_SSCI/>}/>
              <Route path="/login" element={<Login/>}/>
          </Routes>
    </BrowserRouter>
  );
};

export default App;
