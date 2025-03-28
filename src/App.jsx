import React from "react";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import Home from "./home";
import Navigate from "./Navigate";
import Journal from "./journal";
import Login from "./login";
import JournalViewer from "./journalviewer";

const App = () => {
  return (
    <BrowserRouter>
      <Navigate />
          <Routes>
              <Route path="/" element={<Home />}/>
              <Route path="/journals" element={<Journal/>}/>
              <Route path="/login" element={<Login/>}/>
              <Route path="/journals/:databaseName" element={<JournalViewer />} />
          </Routes>
    </BrowserRouter>
  );
};

export default App;