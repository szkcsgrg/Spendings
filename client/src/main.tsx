import React, { useContext, useEffect } from "react";
import { createRoot } from 'react-dom/client';
import { useNavigate, BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthContext, AuthProvider } from './components/AuthContext';

import App from './App';
import Login from './Login';
import InitialSetup from "./components/InitialSetup";
//import NotFound from "./components/NotFound";

import "./index.css";

const Main: React.FC = () => {
  const { isLoggedIn, isFirstLogin } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/');
    } else {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);


  
  //If the user is not Logged in.
  if (!isLoggedIn) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
      </Routes>
    );
  }

  //If first Login
  if (isFirstLogin) {
    return (
      <InitialSetup/>
    )
  }
  else{
    return (
      <Routes>
        <Route path="/" element={<App />} />
      </Routes>
    );
  }

  

  
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