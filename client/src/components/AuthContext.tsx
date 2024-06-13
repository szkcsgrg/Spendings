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
        } else {
          localStorage.setItem("primary_name", response.data[0].primary_name);
          localStorage.setItem("secondary_name", response.data[0].secondary_name);
          localStorage.setItem("third_name", response.data[0].third_name);
          localStorage.setItem("primary_format", response.data[0].primary_format);
          localStorage.setItem("secondary_format", response.data[0].secondary_format);
          localStorage.setItem("third_format", response.data[0].third_format);
          localStorage.setItem("primary_tag", response.data[0].primary_tag);
          localStorage.setItem("secondary_tag", response.data[0].secondary_tag);
          localStorage.setItem("third_tag", response.data[0].third_tag);
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
      localStorage.removeItem("primary_name");
      localStorage.removeItem("secondary_name");
      localStorage.removeItem("third_name");
      localStorage.removeItem("primary_format");
      localStorage.removeItem("secondary_format");
      localStorage.removeItem("third_format");
      localStorage.removeItem("primary_tag");
      localStorage.removeItem("secondary_tag");
      localStorage.removeItem("third_tag");
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