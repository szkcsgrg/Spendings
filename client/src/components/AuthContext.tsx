import React, { createContext, useState, useEffect } from 'react';
import { GoogleAuthProvider, signInWithRedirect, signOut, onAuthStateChanged, signInWithPopup } from "firebase/auth";
import {auth} from "./firebase";
import axios from "axios";

interface AuthContextProps {
  isLoggedIn: boolean;
  isFirstLogin: boolean;
  setIsFirstLogin: (isFirstLogin: boolean) => void;
  logIn: () => void;
  logOut: () => void;
}

export const AuthContext = createContext<AuthContextProps>({
  isLoggedIn: false,
  isFirstLogin: true,
  setIsFirstLogin: () => {},
  logIn: () => {},
  logOut: () => {},
});

export const AuthProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const backendServer = import.meta.env.VITE_APP_SERVER;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isFirstLogin, setIsFirstLogin] = useState(true);
  

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async user => {
      setIsLoggedIn(user !== null);
      if(user && user.displayName && user.email && user.photoURL)
      {
        localStorage.setItem("userName", user.displayName);
        localStorage.setItem("userEmail", user.email);
        localStorage.setItem("userPhoto", user.photoURL);
        // Send a GET request to the server to check if the user exists
        const response = await axios.get(`${backendServer}/checkUser`, {
          params: {
            user_id: localStorage.getItem("userEmail"),
          }
        });

        if (!response || !response.data || response.data.length === 0) {
          setIsFirstLogin(true);
          axios.post(`${backendServer}/login`, {
            email: localStorage.getItem("userEmail"),
            displayName: localStorage.getItem("userName"),
            photoURL: localStorage.getItem("userPhoto")
          });
        } else {
          setIsFirstLogin(false);
        }
      }
    })
    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  const logIn = async () => {
    const googleProvider = new GoogleAuthProvider();
    try {
      if (/Mobi|Android/i.test(navigator.userAgent)) {
        await signInWithPopup(auth, googleProvider);
      }
      else{
        await signInWithRedirect(auth, googleProvider);
      }
    }
    catch(error) {
      alert(error);
    }
  }

  const logOut = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("userName");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userPhoto");
      setIsLoggedIn(false);
    } catch (error) {
      alert(error);
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, isFirstLogin, setIsFirstLogin, logIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};