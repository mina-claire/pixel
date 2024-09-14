import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';

import { ConfigProvider } from 'antd';
import { ThemeProvider } from './ThemeProvider.js';
import { TaskProvider } from './TaskContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard.js';
import Login from './pages/Login.js';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
  <GoogleOAuthProvider clientId={process.env.REACT_APP_CLIENT_ID}>
      <ThemeProvider>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: '#FAB5EC',
              colorPrimarybg: '#CF9FFF',
              fontFamily: 'Avenir',
              colorTextBase: '#706f6f',
              colorBorder: '#a3a3a3',
            }  
          }}
        >
          <TaskProvider>
          <Router basename="/pixel">
            <Routes>
              <Route path="/pixel" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
         </Router>
          </TaskProvider>
        </ConfigProvider>
      </ThemeProvider>
    </GoogleOAuthProvider>
      </React.StrictMode>
);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
