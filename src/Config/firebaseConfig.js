// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCEw0bPvvgqbOqVXyUXcPvKeJsyTcm9S44",
  authDomain: "chat-friends-40d1f.firebaseapp.com",
  projectId: "chat-friends-40d1f",
  storageBucket: "chat-friends-40d1f.firebasestorage.app",
  messagingSenderId: "283372982957",
  appId: "1:283372982957:web:2c5c0d944500d590d5ac24"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth=getAuth(app);
const db=getFirestore(app);
const storage=getStorage(app);

export default app;
export {auth,db,storage};
