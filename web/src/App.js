import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dash from './screens/Dash';

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