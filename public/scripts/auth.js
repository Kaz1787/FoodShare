// Dynamic Navbar
const loggedOutLinks = document.querySelectorAll('.logged-out');
const loggedInLinks = document.querySelectorAll('.logged-in');

const setupUI = (user) => {
    if (user) {
        loggedInLinks.forEach(item => item.style.display = 'block');
        loggedOutLinks.forEach(item => item.style.display = 'none');
    } else {
        loggedInLinks.forEach(item => item.style.display = 'none');
        loggedOutLinks.forEach(item => item.style.display = 'block');
    }   
};

// Firebase Authentication: Check User Login Status
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-auth.js";


const firebaseConfig = {
    apiKey: "AIzaSyBiklfN2NrneTSJd_KlxsDh439nMjYb6GY",
    authDomain: "wad2-foodshare.firebaseapp.com",
    projectId: "wad2-foodshare",
    storageBucket: "wad2-foodshare.appspot.com",
    messagingSenderId: "837663248289",
    appId: "1:837663248289:web:856889a8e60f87803145e0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();

onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in
        setupUI(user);
        
    } else {
        // User is signed out
        setupUI();
    }
});

const logout = document.querySelector('#logout');
logout.addEventListener('click', (e) => {
    e.preventDefault();
    signOut(auth).then(() => {
      // Sign-out successful.
      window.alert("You have successfully signed out!")
    }).catch((error) => {
      // An error happened.
    });
});