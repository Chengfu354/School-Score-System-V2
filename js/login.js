/*
=========================================
School Score System v2
login.js
=========================================
*/

"use strict";

document.addEventListener("DOMContentLoaded", () => {

    const loginBtn = $("login-btn");
    const passwordInput = $("password");

    if (loginBtn) {
        loginBtn.addEventListener("click", login);
    }

    if (passwordInput) {
        passwordInput.focus();

        passwordInput.addEventListener("keydown", function (e) {

            if (e.key === "Enter") {
                login();
            }

        });
    }

});

function login() {

    const password = $("password").value.trim();
    const message = $("login-message");

    if (password === APP.PASSWORD) {

        SESSION.loggedIn = true;

        localStorage.setItem(STORAGE.LOGIN, "true");

        message.style.color = "#2e7d32";
        message.textContent = "Login successful";

        showBottomNavigation();

        showPage("dashboard-page");

        return;

    }

    message.style.color = "#d32f2f";
    message.textContent = "Incorrect password";

    $("password").select();

}

function logout() {

    SESSION.loggedIn = false;

    localStorage.removeItem(STORAGE.LOGIN);

    $("password").value = "";

    $("login-message").textContent = "";

    hideBottomNavigation();

    showPage("login-page");

}