/* =========================================
   School Score System v2
   config-ui.js - Configuration Screen Controller
   ========================================= */

"use strict";

window.renderConfigPage = renderConfigPage;

function renderConfigPage() {
    const container = document.getElementById("config-page");
    if (!container) return;

    // Read current config if it exists
    const currentConfig = ConfigManager.load() || {};
    const apiUrl = currentConfig.apiUrl || "";
    const spreadsheetId = currentConfig.spreadsheetId || "";
    const pin = currentConfig.pin || "";

    container.innerHTML = `
        <header class="topbar">
            <div class="topbar-title">⚙️ System Configuration</div>
        </header>

        <main class="content" style="padding: 20px;">
            <p class="khmer-text" style="color: var(--subtext-color); margin-bottom: 20px; font-size: 14px;">
                សូមបញ្ជូលព័ត៌មានប្រព័ន្ធ ដើម្បីចាប់ផ្ដើមប្រើប្រាស់។
            </p>

            <div class="form-group" style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: 600; font-size: 14px;">Google Apps Script URL</label>
                <input type="text" id="config-api-url" class="form-input" style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--border-color); background: var(--card-bg); color: var(--text-color);" placeholder="https://script.google.com/..." value="${escapeHtml(apiUrl)}">
            </div>

            <div class="form-group" style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: 600; font-size: 14px;">Spreadsheet ID</label>
                <input type="text" id="config-sheet-id" class="form-input" style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--border-color); background: var(--card-bg); color: var(--text-color);" placeholder="1mJKR6w3z..." value="${escapeHtml(spreadsheetId)}">
            </div>

            <div class="form-group" style="margin-bottom: 25px;">
                <label style="display: block; margin-bottom: 5px; font-weight: 600; font-size: 14px;">PIN Code</label>
                <input type="password" id="config-pin" class="form-input" style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--border-color); background: var(--card-bg); color: var(--text-color);" placeholder="Enter 4-digit PIN" value="${escapeHtml(pin)}">
            </div>

            <button id="save-config-btn" class="btn btn-primary" style="width: 100%; padding: 14px; font-size: 16px; font-weight: bold; border-radius: 8px;">
                Save Configuration
            </button>
            <p id="config-error" style="color: var(--danger-color); margin-top: 10px; text-align: center; font-size: 14px;"></p>
        </main>
    `;

    document.getElementById("save-config-btn").addEventListener("click", () => {
        const urlVal = document.getElementById("config-api-url").value;
        const sheetVal = document.getElementById("config-sheet-id").value;
        const pinVal = document.getElementById("config-pin").value;
        const errEl = document.getElementById("config-error");

        if (!urlVal) {
            errEl.textContent = "API URL is required!";
            return;
        }
        if (!pinVal) {
            errEl.textContent = "PIN Code is required!";
            return;
        }

        ConfigManager.save(urlVal, sheetVal, pinVal);
        
        // After saving, reload the app to run the startup sequence again
        window.location.reload();
    });
}
