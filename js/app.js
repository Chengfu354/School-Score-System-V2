/* =========================================
   School Score System v2
   app.js - Main Application Controller
   ========================================= */

"use strict";

document.addEventListener("DOMContentLoaded", () => {
    initializeApp();
});

async function initializeApp() {
    // 1. Show startup screen properly without hidden class lock
    navigateToPage("startup-page");

    // 2. Seed default local storage cache if missing to ensure UI never renders blank
    seedDefaultDataIfNeeded();

    // 3. Load Configuration
    if (!ConfigManager.isValid()) {
        navigateToPage("config-page");
        return;
    }

    // 4. Bind bottom navigation
    bindBottomNavigation();

    // 5. Authenticate & Route immediately to target page
    const isLoggedIn = localStorage.getItem(STORAGE.LOGIN) === "true";
    SESSION.loggedIn = isLoggedIn;

    if (isLoggedIn) {
        const savedPage = localStorage.getItem("sss_last_page");
        const validPage = (savedPage && savedPage !== "startup-page" && savedPage !== "pin-login-page" && savedPage !== "config-page") ? savedPage : "dashboard-page";
        navigateToPage(validPage);
    } else {
        navigateToPage("pin-login-page");
    }

    // 6. Sync backend data asynchronously in background without blocking UI
    setTimeout(async () => {
        try {
            if (window.API && window.API.ping) {
                await window.API.ping(true);
                await window.API.getSubjects(true);
                await window.API.getStudents(true);
                // Refresh active page UI silently after sync completes
                const activePage = document.querySelector(".page.active");
                if (activePage && activePage.id) {
                    navigateToPage(activePage.id);
                }
            }
        } catch (e) {
            console.warn("Background sync offline, using cached local storage data.", e);
        }
    }, 100);
}

function seedDefaultDataIfNeeded() {
    if (!localStorage.getItem(STORAGE.SUBJECTS)) {
        const defaultSubjects = [
            { id: 5, name: "ស្ដាប់", active: true },
            { id: 6, name: "សរសេរ", active: true },
            { id: 7, name: "អាន", active: true },
            { id: 8, name: "និយាយ", active: true },
            { id: 9, name: "ចំនួន", active: true },
            { id: 10, name: "រង្វាស់រង្វាល់", active: true },
            { id: 11, name: "ធរណីមាត្រ", active: true },
            { id: 12, name: "ពីជគណិត", active: true },
            { id: 13, name: "ស្ថិតិ", active: true },
            { id: 14, name: "រូបវិទ្យា", active: true },
            { id: 15, name: "គីមីវិទ្យា", active: true },
            { id: 16, name: "ជីវវិទ្យា", active: true },
            { id: 17, name: "ផែនដី និងបរិស្ថាន", active: true },
            { id: 18, name: "សីលធម៌ និងពលរដ្ឋវិជ្ជា", active: true },
            { id: 19, name: "ភូមិវិទ្យា", active: true },
            { id: 20, name: "ប្រវត្តិវិទ្យា", active: true },
            { id: 21, name: "អប់រំសិល្បៈ", active: true },
            { id: 22, name: "អប់រំកាយ", active: true },
            { id: 23, name: "សុខភាព", active: true },
            { id: 24, name: "បំណិនជីវិត", active: true },
            { id: 25, name: "ភាសាបរទេស", active: true }
        ];
        localStorage.setItem(STORAGE.SUBJECTS, JSON.stringify(defaultSubjects));
    }

    if (!localStorage.getItem(STORAGE.ACTIVE_SUBJECTS)) {
        const defaultActive = [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25];
        localStorage.setItem(STORAGE.ACTIVE_SUBJECTS, JSON.stringify(defaultActive));
    }
}

function navigateToPage(pageId) {
    const allPages = document.querySelectorAll(".page");
    allPages.forEach(p => {
        p.classList.remove("active");
        p.classList.add("hidden");
    });

    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.remove("hidden");
        targetPage.classList.add("active");
    }

    // Persist last active page for page refresh retention
    if (pageId !== "pin-login-page" && pageId !== "startup-page" && pageId !== "config-page") {
        localStorage.setItem("sss_last_page", pageId);
    }

    // Hide bottom nav on specific screens
    if (pageId === "pin-login-page" || pageId === "startup-page" || pageId === "config-page") {
        hideBottomNavigation();
        if (window.renderPinLoginPage && pageId === "pin-login-page") window.renderPinLoginPage();
        if (window.renderConfigPage && pageId === "config-page") window.renderConfigPage();
    } else {
        showBottomNavigation();
        if (pageId === "select-subject-page" && window.renderSelectSubjectPage) {
            window.renderSelectSubjectPage();
            setActiveNavButton("");
        } else if (pageId === "dashboard-page" && window.renderDashboardOverview) {
            window.renderDashboardOverview();
            setActiveNavButton("nav-home");
        } else if (pageId === "turbo-mode-page" && window.renderTurboModePage) {
            window.renderTurboModePage();
            setActiveNavButton("nav-score");
        } else if (pageId === "normal-mode-page" && window.renderNormalModePage) {
            window.renderNormalModePage();
            setActiveNavButton("nav-score");
        } else if (pageId === "results-page" && window.renderResultsPage) {
            window.renderResultsPage();
            setActiveNavButton("nav-result");
        } else if (pageId === "settings-page" && window.renderSettingsPage) {
            window.renderSettingsPage();
            setActiveNavButton("nav-settings");
        } else if (pageId === "export-page" && window.renderExportPage) {
            window.renderExportPage();
            setActiveNavButton("nav-export");
        }
    }

    if (window.triggerHaptic) window.triggerHaptic("light");
}

function showBottomNavigation() {
    const nav = document.getElementById("bottom-nav");
    if (nav) nav.classList.remove("hidden");
}

function hideBottomNavigation() {
    const nav = document.getElementById("bottom-nav");
    if (nav) nav.classList.add("hidden");
}

function setActiveNavButton(id) {
    document.querySelectorAll("#bottom-nav button").forEach(btn => btn.classList.remove("active"));
    if (id) {
        const btn = document.getElementById(id);
        if (btn) btn.classList.add("active");
    }
}

function bindBottomNavigation() {
    const map = {
        "nav-home": "dashboard-page",
        "nav-score": "normal-mode-page",
        "nav-result": "results-page",
        "nav-export": "export-page",
        "nav-settings": "settings-page"
    };

    Object.keys(map).forEach(id => {
        const btn = document.getElementById(id);
        if (btn) {
            btn.addEventListener("click", () => {
                navigateToPage(map[id]);
            });
        }
    });
}

// Global helper: Khmer Number Converter
const khmerDigits = ["០", "១", "២", "៣", "៤", "៥", "៦", "៧", "៨", "៩"];
function toKhmerNum(num) {
    return String(num).split("").map(d => khmerDigits[d] || d).join("");
}
window.toKhmerNum = toKhmerNum;

// Global helper: Show Toast Message (autohide without OK button)
function showToast(message, duration = 1000) {
    let container = document.getElementById("global-toast-container");
    if (!container) {
        container = document.createElement("div");
        container.id = "global-toast-container";
        container.className = "toast-container";
        document.body.appendChild(container);
    }
    
    container.innerHTML = `<div class="toast-content">${message}</div>`;
    
    // Force reflow
    container.offsetHeight;
    
    container.classList.add("show");
    
    setTimeout(() => {
        container.classList.remove("show");
    }, duration);
}
window.showToast = showToast;