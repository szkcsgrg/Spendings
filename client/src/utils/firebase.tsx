import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// import { initializeAppCheck, ReCaptchaEnterpriseProvider } from "firebase/app-check";



const firebaseConfig = {
  apiKey: import.meta.env.VITE_APP_API_KEY_FIREBASE,
  authDomain: import.meta.env.VITE_APP_AUTHDOMAIN,
  projectId: import.meta.env.VITE_APP_PROJECTID,
  storageBucket: import.meta.env.VITE_APP_SB,
  messagingSenderId: import.meta.env.VITE_APP_MSI,
  appId: import.meta.env.VITE_APP_APPID,
  measurementId: import.meta.env.VITE_APP_MI,
};

// Initialize Firebase
// const app =
 initializeApp(firebaseConfig);
export const auth = getAuth();

// const appCheck = initializeAppCheck(app, {
//   provider: new ReCaptchaEnterpriseProvider("6LdLVwIqAAAAAN5cWM9U3n8SgEFMgMBVyJT9JQMG"),
//   isTokenAutoRefreshEnabled: true 
// });
// console.log(appCheck);