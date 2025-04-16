import React from "react";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import Home from "./pages/home";
import Navigate from "./Navigate";
import Journal from "./pages/journal";
import Login from "./pages/login";
import JournalViewer from "./pages/journalviewer";
import Collections from "./pages/collections"

const App = () => {
  return (
    <BrowserRouter>
      <Navigate />
          <Routes>
              <Route path="/" element={<Home />}/>
              <Route path="/journals" element={<Journal/>}/>
              <Route path="/login" element={<Login/>}/>
              <Route path="/journals/:databaseName" element={<JournalViewer />} />
              <Route path="/collections" element={<Collections />} />
          </Routes>
    </BrowserRouter>
  );
};

export default App;