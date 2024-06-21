import React, { 
  Suspense,
   useContext } from 'react';
import { createRoot } from 'react-dom/client';
import {  BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthContext, AuthProvider } from './utils/AuthContext';

import App from './App';
import InitialSetup from "./components/InitialSetup";
import NotFound from "./components/NotFound";
import ReleaseNotes from "./components/ReleaseNotes";
import Login from './components/Login';


import "./index.css";

const Main: React.FC = () => {
  const {isLoggedIn, isFirstLogin} = useContext(AuthContext);
  
  return (
      <Routes>
        {isLoggedIn ? (
          isFirstLogin ? (
            <Route path="/" element={<InitialSetup />} />
          ) : (
            <Route path="/" element={<Suspense fallback={<div className="loader"></div>}><App /></Suspense>} />
          )
        ) : (
          <Route path="/" element={<Login />} />
        )}   
        <Route path="/" element={<App />} />
        <Route path="/whatisnew" element={<ReleaseNotes />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
  );
  

  
}

const rootContainer = document.getElementById('root');
let root = null;
if (rootContainer !== null) {
  if (root === null) {
    root = createRoot(rootContainer);
  }
  root.render(
    <React.StrictMode>
      <AuthProvider>
        <Router>
          <Main />
        </Router>
      </AuthProvider>
    </React.StrictMode>
  );
}