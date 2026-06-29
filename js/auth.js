/* =========================================
   School Score System v2
   auth.js - PIN Authentication Controller
   ========================================= */

"use strict";

let currentPinInput = "";

window.renderPinLoginPage = renderPinLoginPage;

function renderPinLoginPage() {
    currentPinInput = "";
    const container = document.getElementById("pin-login-page");
    if (!container) return;

    container.innerHTML = `
        <div class="content" style="display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; height: 100%;">
            <div style="font-size: 54px; margin-bottom: 10px;">🎓</div>
            <h2 style="font-size: 24px; font-weight: 800; color: var(--text-color);">School Score System</h2>
            <p class="text-muted khmer-text" style="margin-top: 4px;">បញ្ចូលលេខកូដសម្ងាត់ PIN ដើម្បីចូលប្រព័ន្ធ</p>
            
            <div class="pin-dots">
                <div class="pin-dot" id="dot-0"></div>
                <div class="pin-dot" id="dot-1"></div>
                <div class="pin-dot" id="dot-2"></div>
                <div class="pin-dot" id="dot-3"></div>
            </div>

            <p id="pin-error-msg" style="color: var(--danger-color); font-size: 14px; min-height: 20px; font-weight: 600;"></p>

            <div class="keypad-grid">
                <button class="keypad-btn" data-val="1">1</button>
                <button class="keypad-btn" data-val="2">2</button>
                <button class="keypad-btn" data-val="3">3</button>
                <button class="keypad-btn" data-val="4">4</button>
                <button class="keypad-btn" data-val="5">5</button>
                <button class="keypad-btn" data-val="6">6</button>
                <button class="keypad-btn" data-val="7">7</button>
                <button class="keypad-btn" data-val="8">8</button>
                <button class="keypad-btn" data-val="9">9</button>
                <button class="keypad-btn" data-val="clear" style="font-size: 14px; font-weight: 700; color: var(--subtext-color);">C</button>
                <button class="keypad-btn" data-val="0">0</button>
                <button class="keypad-btn" data-val="back" style="font-size: 18px;">⌫</button>
            </div>
            
            <p class="text-muted" style="font-size: 12px; margin-top: 20px;">(Default PIN: 1234)</p>
        </div>
    `;

    bindPinKeypadEvents();
}

function bindPinKeypadEvents() {
    document.querySelectorAll("#pin-login-page .keypad-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const val = e.currentTarget.getAttribute("data-val");
            handlePinKeyPress(val);
        });
    });
}

function handlePinKeyPress(val) {
    const errorEl = document.getElementById("pin-error-msg");
    if (errorEl) errorEl.textContent = "";

    if (val === "clear") {
        currentPinInput = "";
        triggerHaptic("light");
    } else if (val === "back") {
        currentPinInput = currentPinInput.slice(0, -1);
        triggerHaptic("light");
    } else if (currentPinInput.length < 4) {
        currentPinInput += val;
        triggerHaptic("medium");
    }

    updatePinDots();

    if (currentPinInput.length === 4) {
        verifyPin();
    }
}

function updatePinDots() {
    for (let i = 0; i < 4; i++) {
        const dot = document.getElementById(`dot-${i}`);
        if (dot) {
            if (i < currentPinInput.length) {
                dot.classList.add("filled");
            } else {
                dot.classList.remove("filled");
            }
        }
    }
}

function verifyPin() {
    const storedPin = ConfigManager.getPin();
    if (currentPinInput === storedPin) {
        SESSION.loggedIn = true;
        localStorage.setItem(STORAGE.LOGIN, "true");
        triggerHaptic("success");
        setTimeout(() => {
            if (window.navigateToPage) window.navigateToPage("dashboard-page");
        }, 200);
    } else {
        triggerHaptic("error");
        const errorEl = document.getElementById("pin-error-msg");
        if (errorEl) errorEl.textContent = "❌ លេខកូដ PIN មិនត្រឹមត្រូវទេ!";
        currentPinInput = "";
        setTimeout(updatePinDots, 400);
    }
}
