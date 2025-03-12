import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";
import { getFirestore, collection, addDoc, deleteDoc, doc, updateDoc,
     onSnapshot, query, where } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyC1pMYkeeIHxKiq-KkZgP39rVK8ysy2gvI",
  authDomain: "task2-6e195.firebaseapp.com",
  projectId: "task2-6e195",
  storageBucket: "task2-6e195.firebasestorage.app",
  messagingSenderId: "1071788181904",
  appId: "1:1071788181904:web:70728ef4458ce9d9548b15"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db, signInWithEmailAndPassword, createUserWithEmailAndPassword, 
    signOut, collection, addDoc, deleteDoc, doc, updateDoc, onSnapshot, query, where };