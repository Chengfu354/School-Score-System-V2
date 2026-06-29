/* =========================================
   School Score System v2
   telegram.js - Telegram Mini App Integration
   ========================================= */

"use strict";

const TG = {
    webApp: null,
    user: null,
    isExpanded: false
};

document.addEventListener("DOMContentLoaded", () => {
    initTelegramWebApp();
});

function initTelegramWebApp() {
    if (window.Telegram && window.Telegram.WebApp) {
        TG.webApp = window.Telegram.WebApp;
        TG.webApp.ready();
        TG.webApp.expand();
        TG.isExpanded = true;

        if (TG.webApp.initDataUnsafe && TG.webApp.initDataUnsafe.user) {
            TG.user = TG.webApp.initDataUnsafe.user;
            console.log("Telegram User:", TG.user);
            updateTelegramUserInfo();
        }

        applyTelegramTheme();
        TG.webApp.onEvent("themeChanged", applyTelegramTheme);
    } else {
        console.log("Running in Web Browser mode outside Telegram");
    }
}

function applyTelegramTheme() {
    if (!TG.webApp) return;

    const theme = TG.webApp.themeParams;
    const body = document.body;

    if (TG.webApp.colorScheme === "dark") {
        body.classList.add("dark-theme");
    } else {
        body.classList.remove("dark-theme");
    }

    const root = document.documentElement;
    if (theme.bg_color) root.style.setProperty("--bg-color", theme.bg_color);
    if (theme.secondary_bg_color) root.style.setProperty("--card-bg", theme.secondary_bg_color);
    if (theme.text_color) root.style.setProperty("--text-color", theme.text_color);
    if (theme.hint_color) root.style.setProperty("--subtext-color", theme.hint_color);
    if (theme.button_color) root.style.setProperty("--primary-color", theme.button_color);
    if (theme.button_text_color) root.style.setProperty("--button-text-color", theme.button_text_color);
}

function updateTelegramUserInfo() {
    const userContainer = document.getElementById("tg-user-greeting");
    if (userContainer && TG.user) {
        const name = TG.user.first_name + (TG.user.last_name ? " " + TG.user.last_name : "");
        userContainer.innerHTML = `👋 <b>${escapeHtml(name)}</b>`;
    }
}

function triggerHaptic(type = "light") {
    if (TG.webApp && TG.webApp.HapticFeedback) {
        switch (type) {
            case "success":
                TG.webApp.HapticFeedback.notificationOccurred("success");
                break;
            case "error":
                TG.webApp.HapticFeedback.notificationOccurred("error");
                break;
            case "warning":
                TG.webApp.HapticFeedback.notificationOccurred("warning");
                break;
            case "medium":
                TG.webApp.HapticFeedback.impactOccurred("medium");
                break;
            case "heavy":
                TG.webApp.HapticFeedback.impactOccurred("heavy");
                break;
            default:
                TG.webApp.HapticFeedback.impactOccurred("light");
        }
    }
}

function escapeHtml(text) {
    if (!text) return "";
    return String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
