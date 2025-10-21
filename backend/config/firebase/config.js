// backend/config/firebase/config.js
const { initializeApp } = require("firebase/app");
const { getAuth } = require("firebase/auth");
const { getFirestore } = require("firebase/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyCBMxCN2l2sugD1NrldwEgC8qa6nXxynVA",
  authDomain: "groovia-14b3b.firebaseapp.com",
  projectId: "groovia-14b3b",
  storageBucket: "groovia-14b3b.firebasestorage.app",
  messagingSenderId: "33223385619",
  appId: "1:33223385619:web:25df069ef03d64066ed5e6",
  measurementId: "G-1TZZSPVPBN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);

module.exports = { auth, db };