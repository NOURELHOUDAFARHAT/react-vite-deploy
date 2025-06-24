import firebase from 'firebase/app';
import 'firebase/auth';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB12piMm8mC4Vi7cJDFsHTSuUR42rBVf3g",
  authDomain: "tripease-firebase.firebaseapp.com",
  projectId: "tripease-firebase",
  storageBucket: "tripease-firebase.appspot.com",
  messagingSenderId: "623451722900",
  appId: "1:623451722900:web:1c754d3e65db593032d081",
  measurementId: "G-6YM9GGQL03"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

export default app;