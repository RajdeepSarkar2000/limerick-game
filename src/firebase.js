// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import firebase from 'firebase/app';
import 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBFHen9LWb5OTli8u9IsFW254HP_8lJP9M",
  authDomain: "limerick-game.firebaseapp.com",
  projectId: "limerick-game",
  storageBucket: "limerick-game.appspot.com",
  messagingSenderId: "799155943285",
  appId: "1:799155943285:web:a077ca375de1a30c13c53c",
  measurementId: "G-TWWJ7YRGCS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);



firebase.initializeApp(firebaseConfig);

export const db = firebase.firestore();