import React from 'react';
import ReactDOM from 'react-dom/client';
const App = require('./App');
const reportWebVitals = require('./reportWebVitals');

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
reportWebVitals();