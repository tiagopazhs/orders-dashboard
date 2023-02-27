import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";

const Dash = require('./screens/Dash');

function App () {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Dash />}  />
      </Routes>
    </HashRouter>
  )
}

export default App;