
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getAuth, signInWithPopup, GmailAuthProvider } from "firebase/auth";

const firebaseConfig = {
  // Your Firebase configuration from firebase-config.json
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAeDeI4piu-q7m-8XQTWIc4F8FzhEfN8ms",
    authDomain: "scr-slot-machine.firebaseapp.com",
    projectId: "scr-slot-machine",
    storageBucket: "scr-slot-machine.appspot.com",
    messagingSenderId: "733400353614",
    appId: "1:733400353614:web:db18768ce57e17049e2c1f"
};

// Initialize Firebase
const auth = initializeApp(firebaseConfig);

// Селекторы DOM
const registerBtn = document.getElementById('register-btn');
const loginBtn = document.getElementById('login-btn');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const authError = document.getElementById('auth-error');

// Регистрация пользователя
registerBtn.addEventListener('click', () => {
    const email = emailInput.value;
    const password = passwordInput.value;

    auth.createUserWithEmailAndPassword(email, password)
        .then(userCredential => {
            window.location.href = "slot.html";  // Переход на страницу слота после регистрации
        })
        .catch(error => {
            authError.textContent = error.message;
        });
});

// Вход пользователя
loginBtn.addEventListener('click', () => {
    const email = emailInput.value;
    const password = passwordInput.value;

    auth.signInWithEmailAndPassword(email, password)
        .then(userCredential => {
            window.location.href = "slot.html";  // Переход на страницу слота после входа
        })
        .catch(error => {
            authError.textContent = error.message;
        });
});