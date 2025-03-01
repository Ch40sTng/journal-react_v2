import React from "react";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import Home from "./home";
import Navigate from "./Navigate";
import Journal from "./journal";

const App = () => {
  return (
    <BrowserRouter>
      <Navigate />
          <Routes>
              <Route path="/" element={<Home />}/>
              <Route path="/journals" element={<Journal/>}/>
          </Routes>
    </BrowserRouter> 
  );
};

export default App;
