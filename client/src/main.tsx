import React, { useContext, useEffect, useState } from "react";
import { createRoot } from 'react-dom/client';
import { useNavigate, BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthContext, AuthProvider } from './components/AuthContext';
import App from './App';
import Login from './Login';
//import NotFound from "./components/NotFound";

import "./index.css";

const Main: React.FC = () => {
  const backendServer = import.meta.env.VITE_APP_SERVER;
  const { isLoggedIn, isFirstLogin, setIsFirstLogin } = useContext(AuthContext);
  const [currentAmount, setCurrentAmount] = useState("0.00");
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/');
    } else {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);


  const handleSavingsSubmit = async () => {
    console.log(currentAmount);
    const response = await fetch(`${backendServer}/changesavings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_id: localStorage.getItem('userEmail'),
        month: 'initial',
        income: Number(0),
        saving: Number(currentAmount),
      })
    });
    if (!response.ok) {
      throw new Error('HTTP error ' + response.status);
    }
    navigate("/");
    setIsFirstLogin(false);
  };

  if (!isLoggedIn) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
      </Routes>
    );
  }

  if (isFirstLogin) {
    return (
      <div className="row d-flex flex-column justify-content-center align-items-center text-center">
        <div className="col-12 col-md-8 col-lg-6">
          <h2>Inital Setup</h2>
          <p>To have the maximum capacity of the project, if you already have some money in a savings account, then please provide the exact value!</p>
          <input type="text" value={currentAmount} onChange={e => setCurrentAmount(e.target.value)} />
          <div className="d-flex justify-content-center align-items-center text-center gap-3 mt-4">
            <button onClick={handleSavingsSubmit}>Save</button>
            <a onClick={() => {setIsFirstLogin(false); navigate("/")}}>Skip</a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Routes>
      <Route path="/" element={<App />} />
      {/* <Route path="*" element={<NotFound />} /> */}
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