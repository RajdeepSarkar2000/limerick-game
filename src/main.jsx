import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import App from './App';
import Score from './score'
import './index.css';



ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
       <Routes>
        <Route path="/" element={<App/>} />
        <Route path="/scores" element={<Score/>} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);