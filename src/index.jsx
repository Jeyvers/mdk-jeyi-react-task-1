import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import 'antd/dist/antd.css';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// Making five changes for react to run build.
// 1. React scripts install.
// 2. Replace dev script to 'react-scripts start' from 'vite'.
// 3. Take index.html into the public folder which will be created by react scripts upon installation.
// 4. Change index.jsx extension to index.js.
// 5. Change App import in index.js to app.jsx.
// 6. Remove browser defaults
