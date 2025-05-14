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


import "./styles/index.css";

const Main: React.FC = () => {
  const {isLoggedIn, isFirstLogin, errorMessage} = useContext(AuthContext);
  // - If there as connection loss to the server show a component that says that the server is down...
  return (
    <>
    {errorMessage !== "" ? 
    <div className='box-ui h-100 row d-flex flex-column justify-content-center align-items-center text-center mt-2 pt-2 mt-md-5 pt-md-5 mx-2'>
      <h2 className="error-title my-3">Service Unavailable</h2>
      <p className="error-description">
        We are currently experiencing technical difficulties. <br /> Our team is working to resolve the issue. <br /> Please try again later.
      </p>
    </div>
    :
    // ? After inital setup The user cannot access the input fields until refresh.
      <Suspense fallback={<div className="loader"></div>}>
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
      </Suspense>
    }
    </>
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