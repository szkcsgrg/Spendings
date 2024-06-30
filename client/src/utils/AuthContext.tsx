import React, { createContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword,
  // createUserWithEmailAndPassword,
  GoogleAuthProvider, 
  GithubAuthProvider,
  signOut, 
  onAuthStateChanged, 
  signInWithPopup, 
  // signInWithRedirect
} from "firebase/auth";
import {auth} from "./firebase";
import axios from "axios";

interface AuthContextProps {
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  isFirstLogin: boolean;
  setIsFirstLogin: (isFirstLogin: boolean) => void;
  registerPassword: (email: string, password: string) => void;
  loginPassword: (email: string, password: string) => void;
  logIn: () => void;
  logInGithub: () => void;
  logOut: () => void;
}

export const AuthContext = createContext<AuthContextProps>({
  isLoggedIn: false,
  setIsLoggedIn: () => {},
  isFirstLogin: true,
  setIsFirstLogin: () => {},
  registerPassword: () => {},
  loginPassword: () => {},
  logIn: () => {},
  logInGithub: () => {},
  logOut: () => {},
});

export const AuthProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const backendServer = import.meta.env.VITE_APP_SERVER;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isFirstLogin, setIsFirstLogin] = useState(true);
  

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async user => {
      setIsLoggedIn(user !== null);
      localStorage.setItem("isLoggedIn", user !== null ? "true" : "false");
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

        if (response.data.existingUser) {
          const confirmation = confirm('An account already exists with this email address. Link your account?');
          if (confirmation) {
            // Handle account linking logic using Firebase Authentication (refer to previous responses)
          } else {
            // Redirect user to the existing sign-in flow based on the existing provider (refer to previous responses)
          }
        }
        if (!response || !response.data || response.data.length === 0) {
          setIsFirstLogin(true);
          localStorage.setItem("isFirstLogin", "true");
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
          localStorage.setItem("isFirstLogin", "false");
        }
      }
    })
    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  const registerPassword = async (email: string, password: string) => {
    console.log(email, password);
    // await createUserWithEmailAndPassword(auth, email, password)
    // .then(async (userCredential) => {
    //   setIsLoggedIn(email !== null);
    //   localStorage.setItem("isLoggedIn", email !== null ? "true" : "false");
    //   if(email && password){
    //     localStorage.setItem("userName", "");
    //     localStorage.setItem("userEmail", email);
    //     localStorage.setItem("password", password);
    //     localStorage.setItem("userPhoto", "");
    //     // Send a GET request to the server to check if the user exists
    //     const response = await axios.get(`${backendServer}/checkUser`, {
    //       params: {
    //         user_id: localStorage.getItem("userEmail"),
    //       }
    //     });
  
    //     if (!response || !response.data || response.data.length === 0) {
    //       setIsFirstLogin(true);
    //       localStorage.setItem("isFirstLogin", "true");
    //     } 
    //   }     
    // })
    // .catch ((error) => {
    //   alert(error);
    // })
  }
  const loginPassword = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setIsLoggedIn(email !== null);
      localStorage.setItem("isLoggedIn", email !== null ? "true" : "false");
      if(email && password)
        {
        localStorage.setItem("userName", "");
        localStorage.setItem("userEmail", email);
        localStorage.setItem("userPhoto", "user.photoURL");
        // Send a GET request to the server to check if the user exists
        const response = await axios.get(`${backendServer}/checkUser`, {
          params: {
            user_id: localStorage.getItem("userEmail"),
          }
        });

        if (!response || !response.data || response.data.length === 0) {
          setIsFirstLogin(true);
          localStorage.setItem("isFirstLogin", "true");
        }      
      }
    } catch (error) {
      alert(error);
    }
  }
  const logIn = async () => {
      const googleProvider = new GoogleAuthProvider();
      try {  
        // alert(navigator.userAgent);
        // if (/Mobi|Android|iPhone/i.test(navigator.userAgent)) {
        // if(navigator.userAgent.match('GSA')){
        
        // await signInWithRedirect(auth, googleProvider);
        // }
        // else{
         await signInWithPopup(auth, googleProvider);
        // }
      }
      catch(error:any) {
        if (error.code === 'auth/account-exists-with-different-credential') {
          return;
        }
      }
  }
  const logInGithub = async () => {
    const githubProvider = new GithubAuthProvider();
    try {  
      await signInWithPopup(auth, githubProvider);
    }
    catch(error:any) {
      if (error.code === 'auth/account-exists-with-different-credential') {
      //     setIsLoggedIn(user !== null);
      //     localStorage.setItem("isLoggedIn", user !== null ? "true" : "false");
      //     if(user && user.displayName && user.email && user.photoURL)
      //       {
      //       localStorage.setItem("userName", user.displayName);
      //       localStorage.setItem("userEmail", user.email);
      //       localStorage.setItem("userPhoto", user.photoURL);
      //       // Send a GET request to the server to check if the user exists
      //       const response = await axios.get(`${backendServer}/checkUser`, {
      //         params: {
      //           user_id: localStorage.getItem("userEmail"),
      //         }
      //       });
    
      //       if (response.data.existingUser) {
      //         const confirmation = confirm('An account already exists with this email address. Link your account?');
      //         if (confirmation) {
      //           // Handle account linking logic using Firebase Authentication (refer to previous responses)
      //         } else {
      //           // Redirect user to the existing sign-in flow based on the existing provider (refer to previous responses)
      //         }
      //       }
      //       if (!response || !response.data || response.data.length === 0) {
      //         setIsFirstLogin(true);
      //         localStorage.setItem("isFirstLogin", "true");
      //       } else {
      //         localStorage.setItem("primary_name", response.data[0].primary_name);
      //         localStorage.setItem("secondary_name", response.data[0].secondary_name);
      //         localStorage.setItem("third_name", response.data[0].third_name);
      //         localStorage.setItem("primary_format", response.data[0].primary_format);
      //         localStorage.setItem("secondary_format", response.data[0].secondary_format);
      //         localStorage.setItem("third_format", response.data[0].third_format);
      //         localStorage.setItem("primary_tag", response.data[0].primary_tag);
      //         localStorage.setItem("secondary_tag", response.data[0].secondary_tag);
      //         localStorage.setItem("third_tag", response.data[0].third_tag);
      //         setIsFirstLogin(false);
      //         localStorage.setItem("isFirstLogin", "false");
      //       }
      //     }
      //   })
      alert(error);
      }
      else{
        alert(error);
      }
    }
  }
  
  const logOut = async () => {
    try {
      await signOut(auth);
      setIsLoggedIn(false);
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
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("isFirstLogin");
    } catch (error) {
      alert(error);
    }
  };

  return (
      <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, isFirstLogin, setIsFirstLogin, registerPassword, loginPassword, logIn, logInGithub, logOut }}>
        {children}
      </AuthContext.Provider>
    );
};