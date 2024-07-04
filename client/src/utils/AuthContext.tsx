import React, { createContext, useState, useEffect } from 'react';
import { 
  // signInWithEmailAndPassword,
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
  // registerPassword: (email: string, password: string) => void;
  // loginPassword: (email: string, password: string) => void;
  logInGoogle: () => void;
  logInGithub: () => void;
  logOut: () => void;
}

export const AuthContext = createContext<AuthContextProps>({
  isLoggedIn: false,
  setIsLoggedIn: () => {},
  isFirstLogin: true,
  setIsFirstLogin: () => {},
  // registerPassword: () => {},
  // loginPassword: () => {},
  logInGoogle: () => {},
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
      if(user && user.displayName && user.email && user.photoURL)
      {
        // const storedToken = await getStoredToken(); // Implement getStoredToken function (see below)
        // if (storedToken) {
        //   try {
        //     const decoded = jwt.verify(storedToken, process.env.JWT_SECRET);
        //     const userId = decoded.userId;
        //   } catch (error) {
        //     console.log(error);
        //   }
        // }

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
            const primaryName = response.data[0].primary_name === "" ? "null" : response.data[0].primary_name;
            const secondaryName = response.data[0].secondary_name === "" ? "null" : response.data[0].secondary_name;
            const thirdName = response.data[0].third_name === "" ? "null" : response.data[0].third_name;
          
            const primaryFormat = response.data[0].primary_format === "" ? "null" : response.data[0].primary_format;
            const secondaryFormat = response.data[0].secondary_format === "" ? "null" : response.data[0].secondary_format;
            const thirdFormat = response.data[0].third_format === "" ? "null" : response.data[0].third_format;
          
            const primaryTag = response.data[0].primary_tag === "" ? "null" : response.data[0].primary_tag;
            const secondaryTag = response.data[0].secondary_tag === "" ? "null" : response.data[0].secondary_tag;
            const thirdTag = response.data[0].third_tag === "" ? "null" : response.data[0].third_tag;
          
            localStorage.setItem("primary_name", primaryName);
            localStorage.setItem("secondary_name", secondaryName);
            localStorage.setItem("third_name", thirdName);
          
            localStorage.setItem("primary_format", primaryFormat);
            localStorage.setItem("secondary_format", secondaryFormat);
            localStorage.setItem("third_format", thirdFormat);
          
            localStorage.setItem("primary_tag", primaryTag);
            localStorage.setItem("secondary_tag", secondaryTag);
            localStorage.setItem("third_tag", thirdTag);
            
            localStorage.setItem("settings", JSON.stringify(response.data[0].settings_json));
          setIsFirstLogin(false);
        }
      }
    })
    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  // const registerPassword = async (email: string, password: string) => {
  //   console.log(email, password);
  //   // await createUserWithEmailAndPassword(auth, email, password)
  //   // .then(async (userCredential) => {
  //   //   setIsLoggedIn(email !== null);
  //   //   localStorage.setItem("isLoggedIn", email !== null ? "true" : "false");
  //   //   if(email && password){
  //   //     localStorage.setItem("userName", "");
  //   //     localStorage.setItem("userEmail", email);
  //   //     localStorage.setItem("password", password);
  //   //     localStorage.setItem("userPhoto", "");
  //   //     // Send a GET request to the server to check if the user exists
  //   //     const response = await axios.get(`${backendServer}/checkUser`, {
  //   //       params: {
  //   //         user_id: localStorage.getItem("userEmail"),
  //   //       }
  //   //     });
  
  //   //     if (!response || !response.data || response.data.length === 0) {
  //   //       setIsFirstLogin(true);
  //   //       localStorage.setItem("isFirstLogin", "true");
  //   //     } 
  //   //   }     
  //   // })
  //   // .catch ((error) => {
  //   //   alert(error);
  //   // })
  // }
  // const loginPassword = async (email: string, password: string) => {
  //   try {
  //     await signInWithEmailAndPassword(auth, email, password);
  //     setIsLoggedIn(email !== null);
  //     localStorage.setItem("isLoggedIn", email !== null ? "true" : "false");
  //     if(email && password)
  //       {
  //       localStorage.setItem("userName", "");
  //       localStorage.setItem("userEmail", email);
  //       localStorage.setItem("userPhoto", "user.photoURL");
  //       // Send a GET request to the server to check if the user exists
  //       const response = await axios.get(`${backendServer}/checkUser`, {
  //         params: {
  //           user_id: localStorage.getItem("userEmail"),
  //         }
  //       });

  //       if (!response || !response.data || response.data.length === 0) {
  //         setIsFirstLogin(true);
  //         localStorage.setItem("isFirstLogin", "true");
  //       }      
  //     }
  //   } catch (error) {
  //     alert(error);
  //   }
  // }

  const logInGoogle = async () => {
    const googleProvider = new GoogleAuthProvider();
    try {  
      const userCredential = await signInWithPopup(auth, googleProvider);
      return userCredential;
    }
    catch(error:any) {
      if (error.code === 'auth/account-exists-with-different-credential') {        
        // console.log(error.customData.email);
        // console.log(error.customData._tokenResponse.photoUrl);
        // console.log(error.customData._tokenResponse.displayName);

        const user = { email: error.customData.email, photoURL: error.customData._tokenResponse.photoUrl, displayName: error.customData._tokenResponse.displayName };

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
              const primaryName = response.data[0].primary_name === "" ? "null" : response.data[0].primary_name;
              const secondaryName = response.data[0].secondary_name === "" ? "null" : response.data[0].secondary_name;
              const thirdName = response.data[0].third_name === "" ? "null" : response.data[0].third_name;
            
              const primaryFormat = response.data[0].primary_format === "" ? "null" : response.data[0].primary_format;
              const secondaryFormat = response.data[0].secondary_format === "" ? "null" : response.data[0].secondary_format;
              const thirdFormat = response.data[0].third_format === "" ? "null" : response.data[0].third_format;
            
              const primaryTag = response.data[0].primary_tag === "" ? "null" : response.data[0].primary_tag;
              const secondaryTag = response.data[0].secondary_tag === "" ? "null" : response.data[0].secondary_tag;
              const thirdTag = response.data[0].third_tag === "" ? "null" : response.data[0].third_tag;
            
              localStorage.setItem("primary_name", primaryName);
              localStorage.setItem("secondary_name", secondaryName);
              localStorage.setItem("third_name", thirdName);
            
              localStorage.setItem("primary_format", primaryFormat);
              localStorage.setItem("secondary_format", secondaryFormat);
              localStorage.setItem("third_format", thirdFormat);
            
              localStorage.setItem("primary_tag", primaryTag);
              localStorage.setItem("secondary_tag", secondaryTag);
              localStorage.setItem("third_tag", thirdTag);

              localStorage.setItem("settings", JSON.stringify(response.data[0].settings_json));

              setIsFirstLogin(false);
          }
        }
      }
      else{
        alert(error);
      }
    }
  }
  const logInGithub = async () => {
    const githubProvider = new GithubAuthProvider();
    try {  
      const userCredential = await signInWithPopup(auth, githubProvider);
      return userCredential;
    }
    catch(error:any) {
      if (error.code === 'auth/account-exists-with-different-credential') {        
        // console.log(error.customData.email);
        // console.log(error.customData._tokenResponse.photoUrl);
        // console.log(error.customData._tokenResponse.displayName);

        const user = { email: error.customData.email, photoURL: error.customData._tokenResponse.photoUrl, displayName: error.customData._tokenResponse.displayName };

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
              const primaryName = response.data[0].primary_name === "" ? "null" : response.data[0].primary_name;
              const secondaryName = response.data[0].secondary_name === "" ? "null" : response.data[0].secondary_name;
              const thirdName = response.data[0].third_name === "" ? "null" : response.data[0].third_name;
            
              const primaryFormat = response.data[0].primary_format === "" ? "null" : response.data[0].primary_format;
              const secondaryFormat = response.data[0].secondary_format === "" ? "null" : response.data[0].secondary_format;
              const thirdFormat = response.data[0].third_format === "" ? "null" : response.data[0].third_format;
            
              const primaryTag = response.data[0].primary_tag === "" ? "null" : response.data[0].primary_tag;
              const secondaryTag = response.data[0].secondary_tag === "" ? "null" : response.data[0].secondary_tag;
              const thirdTag = response.data[0].third_tag === "" ? "null" : response.data[0].third_tag;
            
              localStorage.setItem("primary_name", primaryName);
              localStorage.setItem("secondary_name", secondaryName);
              localStorage.setItem("third_name", thirdName);
            
              localStorage.setItem("primary_format", primaryFormat);
              localStorage.setItem("secondary_format", secondaryFormat);
              localStorage.setItem("third_format", thirdFormat);
            
              localStorage.setItem("primary_tag", primaryTag);
              localStorage.setItem("secondary_tag", secondaryTag);
              localStorage.setItem("third_tag", thirdTag);

              localStorage.setItem("settings", JSON.stringify(response.data[0].settings_json));

              setIsFirstLogin(false);
          }
        }
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
    } catch (error) {
      alert(error);
    }
  };

  return (
    // registerPassword, loginPassword,
      <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, isFirstLogin, setIsFirstLogin,  logInGoogle, logInGithub, logOut }}>
        {children}
      </AuthContext.Provider>
    );
};