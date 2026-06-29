/* =========================================
   School Score System v2.6
   settings.js - Application Settings & Active Subject Management
   ========================================= */

"use strict";

window.renderSettingsPage = renderSettingsPage;

function renderSettingsPage() {
    const container = document.getElementById("settings-page");
    if (!container) return;

    const currentConfig = ConfigManager.load() || {};
    const googleUrl = currentConfig.apiUrl || "";
    const sheetId = currentConfig.spreadsheetId || "";
    const pin = currentConfig.pin || "1234";

    const botToken = localStorage.getItem(STORAGE.TG_BOT_TOKEN) || SESSION.tgBotToken || "";
    const chatId = localStorage.getItem(STORAGE.TG_CHAT_ID) || SESSION.tgChatId || "";
    const logs = window.getAuditLogs ? window.getAuditLogs() : [];

    let logsHtml = "";
    if (logs.length === 0) {
        logsHtml = `<p class="text-muted text-center khmer-text" style="font-size: 12px; padding: 10px;">មិនទាន់មានកំណត់ត្រាកែប្រែនៅឡើយទេ។</p>`;
    } else {
        logs.slice(0, 10).forEach(l => {
            logsHtml += `
                <div style="font-size: 12px; border-bottom: 1px dashed var(--border-color); padding: 6px 0;">
                    <div><b>[${l.timestamp}]</b> ${l.user}</div>
                    <div style="color: var(--primary-color);">អត្តលេខ: ${l.studentId} | ${l.subject}: <s>${l.oldVal}</s> ➔ <b>${l.newVal}</b></div>
                </div>
            `;
        });
    }

    container.innerHTML = `
        <header class="topbar">
            <div class="topbar-title">⚙️ ការកំណត់ប្រព័ន្ធ</div>
        </header>

        <main class="content">
            <div class="card">
                <h3 class="khmer-text">🔒 សុវត្ថិភាពកូដ PIN</h3>
                <div class="form-group margin-top">
                    <label class="khmer-text">កូដ PIN សម្ងាត់កម្មវិធី៖</label>
                    <input type="password" id="setting-pin" value="${escapeHtml(pin)}" maxlength="4" style="text-align: center; letter-spacing: 4px; font-weight: 700;">
                </div>
            </div>

            <div class="card">
                <h3 class="khmer-text">☁️ ការកំណត់ Google Cloud Backend</h3>
                <div class="form-group margin-top">
                    <label class="khmer-text">Google Apps Script Web App URL៖</label>
                    <input type="text" id="setting-google-url" value="${escapeHtml(googleUrl)}" placeholder="https://script.google.com/macros/s/.../exec">
                </div>
                <div class="form-group margin-top">
                    <label class="khmer-text">Spreadsheet ID (អត្តលេខសន្លឹកកិច្ចការ)៖</label>
                    <input type="text" id="setting-sheet-id" value="${escapeHtml(sheetId)}" placeholder="1mJKR6w3z...">
                </div>
            </div>

            <div class="card">
                <h3 class="khmer-text">✈️ ការភ្ជាប់ Telegram Bot</h3>
                <p class="khmer-text text-subtitle" style="margin-top: 4px; margin-bottom: 12px;">
                    កំណត់ Bot Token និង Chat ID ដើម្បីផ្ញើរបាយការណ៍ពិន្ទុ និងការជូនដំណឹងទៅកាន់ Telegram Group/Channel៖
                </p>
                <div class="form-group margin-top">
                    <label class="khmer-text">Telegram Bot Token (បានពី @BotFather)៖</label>
                    <input type="text" id="setting-tg-token" value="${escapeHtml(botToken)}" placeholder="6109639827:AA...">
                </div>
                <div class="form-group">
                    <label class="khmer-text">Target Chat ID ឬ Channel Username (@channel)៖</label>
                    <input type="text" id="setting-tg-chat" value="${escapeHtml(chatId)}" placeholder="-100xxxxxxx ឬ User ID">
                </div>
                <button id="test-tg-btn" class="btn btn-outline full-width khmer-text text-normal" style="margin-top: 12px;">
                    🧪 សាកល្បងផ្ញើសារសាកល្បង (Test Telegram Bot)
                </button>
            </div>

            <button id="save-settings-btn" class="btn btn-primary full-width khmer-text">
                💾 រក្សាទុកការកំណត់
            </button>

            <div class="card" style="margin-top: 16px;">
                <h3 class="khmer-text">📜 កំណត់ត្រាកែប្រែចុងក្រោយ (Audit Logs)</h3>
                <div style="max-height: 180px; overflow-y: auto; margin-top: 10px;">
                    ${logsHtml}
                </div>
            </div>

            <div class="card card-danger" style="margin-top: 16px;">
                <h3 class="khmer-text">⚠️ កន្លែងប្រុងប្រយ័ត្ន (Danger Zone)</h3>
                <button id="reset-data-btn" class="btn btn-danger full-width khmer-text" style="margin-top: 10px;">
                    🗑️ កំណត់ឡើងវិញនូវទិន្នន័យទាំងអស់ (Reset All Data)
                </button>
            </div>
        </main>
    `;

    bindSettingsEvents();
}

function bindSettingsEvents() {
    const testTgBtn = document.getElementById("test-tg-btn");
    if (testTgBtn) {
        testTgBtn.addEventListener("click", async () => {
            const botToken = document.getElementById("setting-tg-token").value.trim();
            const chatId = document.getElementById("setting-tg-chat").value.trim();

            if (!botToken) {
                alert("⚠️ សូមបញ្ជូល Telegram Bot Token ជាមុនសិន!");
                return;
            }
            if (!chatId) {
                alert("⚠️ សូមបញ្ជូល Target Chat ID ឬ Channel Username ជាមុនសិន!");
                return;
            }

            const originalText = testTgBtn.innerHTML;
            testTgBtn.innerHTML = "កំពុងផ្ញើសារសាកល្បង... ⏳";
            testTgBtn.disabled = true;

            try {
                const text = encodeURIComponent("🔔 *សារសាកល្បងពី School Score System V2*\n\n🟢 ការភ្ជាប់ Telegram Bot ជាមួយកម្មវិធីត្រូវបានជោគជ័យ 100%!");
                const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${text}&parse_mode=Markdown`);
                const data = await res.json();

                if (data.ok) {
                    alert("🟢 ជោគជ័យ! Telegram Bot បានផ្ញើសារសាកល្បងទៅកាន់ Telegram របស់អ្នករួចរាល់ហើយ។");
                    if (window.triggerHaptic) window.triggerHaptic("success");
                } else {
                    alert(`⚠️ បរាជ័យក្នុងការផ្ញើសារ៖ ${data.description}`);
                    if (window.triggerHaptic) window.triggerHaptic("error");
                }
            } catch (e) {
                console.error("Test Telegram failed:", e);
                alert("⚠️ មានបញ្ហាបណ្តាញ អំឡុងពេលតភ្ជាប់ទៅ Telegram API។");
                if (window.triggerHaptic) window.triggerHaptic("error");
            }

            testTgBtn.innerHTML = originalText;
            testTgBtn.disabled = false;
        });
    }

    const saveBtn = document.getElementById("save-settings-btn");
    if (saveBtn) {
        saveBtn.addEventListener("click", async () => {
            const googleUrl = document.getElementById("setting-google-url").value.trim();
            const sheetId = document.getElementById("setting-sheet-id").value.trim();
            const botToken = document.getElementById("setting-tg-token").value.trim();
            const chatId = document.getElementById("setting-tg-chat").value.trim();
            const pin = document.getElementById("setting-pin").value.trim();

            if (!pin || pin.length < 4) {
                alert("⚠️ កូដ PIN ត្រូវតែមានយ៉ាងហោចណាស់ ៤ ខ្ទង់!");
                return;
            }

            ConfigManager.save(googleUrl, sheetId, pin);

            localStorage.setItem(STORAGE.TG_BOT_TOKEN, botToken);
            localStorage.setItem(STORAGE.TG_CHAT_ID, chatId);

            SESSION.tgBotToken = botToken;
            SESSION.tgChatId = chatId;

            // Sync Active Subjects to backend API
            const activeIds = JSON.parse(localStorage.getItem(STORAGE.ACTIVE_SUBJECTS) || "[]");
            if (window.API && window.API.saveActiveSubjects && activeIds.length > 0) {
                try {
                    await window.API.saveActiveSubjects(activeIds);
                } catch (e) {
                    console.warn("Could not sync active subjects to cloud:", e);
                }
            }

            triggerHaptic("success");
            alert("✅ ការកំណត់ត្រូវបានរក្សាទុកដោយជោគជ័យ!");
        });
    }

    const resetBtn = document.getElementById("reset-data-btn");
    if (resetBtn) {
        resetBtn.addEventListener("click", () => {
            if (confirm("⚠️ តើអ្នកពិតជាចង់កំណត់ទិន្នន័យទាំងអស់ឡើងវិញមែនទេ? (Reset local storage)")) {
                localStorage.clear();
                triggerHaptic("warning");
                alert("✅ បានកំណត់ឡើងវិញជោគជ័យ! ទំព័រនឹងផ្ដើមឡើងវិញ។");
                location.reload();
            }
        });
    }
}
