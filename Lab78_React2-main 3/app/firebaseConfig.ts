// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// import { getAuth } from 'firebase/auth';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth'; // Ensure signInWithPopup is imported here// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyByNG33sErSoXgO84tCyo1pLQxEiwy3l4k",
  authDomain: "lab7-react2.firebaseapp.com",
  projectId: "lab7-react2",
  storageBucket: "lab7-react2.firebasestorage.app",
  messagingSenderId: "278822306454",
  appId: "1:278822306454:web:0503aa7bd49adcad4db8b7",
  measurementId: "G-5Q12E6YP14"
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
// export const analytics = getAnalytics(firebaseApp);
export const auth = getAuth(firebaseApp);
export const googleProvider = new GoogleAuthProvider();


