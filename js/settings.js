/* =========================================
   School Score System v2.6
   settings.js - Application Settings & Active Subject Management
   ========================================= */

"use strict";

window.renderSettingsPage = renderSettingsPage;
window.renderSystemConfigPage = renderSystemConfigPage;

function renderSettingsPage() {
    const container = document.getElementById("settings-page");
    if (!container) return;

    container.innerHTML = `
        <header class="topbar">
            <div class="topbar-title">⚙️ ការកំណត់ & របៀបប្រើប្រាស់</div>
        </header>

        <main class="content">
            <!-- TOP SECTION: SYSTEM CONFIGURATION GATEWAY -->
            <div class="card" style="background: linear-gradient(135deg, var(--card-bg) 0%, var(--primary-light) 100%); border: 1.5px solid var(--primary-color); padding: 18px;">
                <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
                    <div style="background: var(--primary-color); color: white; border-radius: 12px; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center;">
                        <i data-lucide="sliders-horizontal" style="width: 24px; height: 24px;"></i>
                    </div>
                    <div>
                        <h3 class="khmer-text" style="margin: 0; font-size: 15px;">🔧 កែសម្រួលការកំណត់ប្រព័ន្ធ</h3>
                        <p class="khmer-text text-subtitle" style="margin: 0; font-size: 12px;">កំណត់ PIN, Google Sheet ID, និង Telegram Bot</p>
                    </div>
                </div>
                <button id="btn-goto-config" class="btn btn-primary full-width khmer-text text-normal" style="margin-top: 6px; min-height: 44px; padding: 10px;">
                    <i data-lucide="settings" style="width: 16px; height: 16px;"></i> ចូលទៅកាន់ការកំណត់ (System Setup)
                </button>
            </div>

            <!-- BOTTOM SECTION: HELP GUIDES & INSTRUCTIONS -->
            <div class="card" style="margin-top: 16px; padding: 18px;">
                <h3 class="khmer-text" style="font-size: 16px; margin-bottom: 4px; color: var(--accent-color);">
                    <i data-lucide="book-open" style="width: 20px; height: 20px;"></i> សៀវភៅណែនាំ និងរបៀបដំឡើង (Guides)
                </h3>
                <p class="khmer-text text-subtitle" style="margin-bottom: 15px;">ស្វែងយល់ពីរបៀបរៀបចំប្រព័ន្ធ របៀបបង្កើត Bot និងទាញយកគំរូសន្លឹកកិច្ចការ៖</p>
                
                <!-- Accordion 1 -->
                <div class="accordion-item" style="border: 1px solid var(--border-color); border-radius: var(--radius-sm); margin-bottom: 8px; overflow: hidden;">
                    <button class="accordion-header" style="width: 100%; text-align: left; padding: 12px; background: var(--bg-color); font-weight: 700; font-size: 13px; color: var(--text-color); display: flex; justify-content: space-between; align-items: center; border: none; min-height: unset; cursor: pointer; box-shadow: none;">
                        <span class="khmer-text">📋 ១. ទាញយកគំរូសន្លឹកកិច្ចការ (Get Google Sheet Template)</span>
                        <i data-lucide="chevron-down" style="width: 16px; height: 16px; transition: transform 0.2s;"></i>
                    </button>
                    <div class="accordion-content hidden" style="padding: 12px; font-size: 12.5px; border-top: 1px solid var(--border-color); line-height: 1.6; color: var(--subtext-color);">
                        <p class="khmer-text" style="margin-bottom: 10px;">ដើម្បីប្រើប្រាស់ប្រព័ន្ធនេះ លោកអ្នកត្រូវចម្លងសន្លឹកកិច្ចការគំរូទៅកាន់ Google Drive ផ្ទាល់ខ្លួន៖</p>
                        <a href="https://docs.google.com/spreadsheets/d/1mJKR6w3z9LFTUIsWMi4CnH25Y_9CsAdUyubdiK4mwVw/copy" target="_blank" class="btn btn-sm btn-outline full-width khmer-text text-normal" style="text-decoration: none; display: inline-flex; min-height: 38px; padding: 8px;">
                            <i data-lucide="copy" style="width: 14px; height: 14px;"></i> ចម្លងគំរូសន្លឹកកិច្ចការ (Make a Copy)
                        </a>
                    </div>
                </div>

                <!-- Accordion 2 -->
                <div class="accordion-item" style="border: 1px solid var(--border-color); border-radius: var(--radius-sm); margin-bottom: 8px; overflow: hidden;">
                    <button class="accordion-header" style="width: 100%; text-align: left; padding: 12px; background: var(--bg-color); font-weight: 700; font-size: 13px; color: var(--text-color); display: flex; justify-content: space-between; align-items: center; border: none; min-height: unset; cursor: pointer; box-shadow: none;">
                        <span class="khmer-text">✈️ ២. របៀបបង្កើត និងតភ្ជាប់ Telegram Bot</span>
                        <i data-lucide="chevron-down" style="width: 16px; height: 16px; transition: transform 0.2s;"></i>
                    </button>
                    <div class="accordion-content hidden" style="padding: 12px; font-size: 12.5px; border-top: 1px solid var(--border-color); line-height: 1.6; color: var(--subtext-color);">
                        <ol class="khmer-text" style="padding-left: 16px; margin: 0;">
                            <li style="margin-bottom: 4px;">ស្វែងរក <b>@BotFather</b> ក្នុង Telegram រួចចុច Start។</li>
                            <li style="margin-bottom: 4px;">ផ្ញើសារ <b>/newbot</b> រួចបំពេញឈ្មោះ Bot និង Username (ឧ. school_bot)។</li>
                            <li style="margin-bottom: 4px;">ចម្លង (Copy) <b>HTTP API Token</b> យកមកដាក់ក្នុងប្រអប់កំណត់ខាងលើ។</li>
                            <li style="margin-bottom: 4px;">បង្កើត Group/Channel Telegram ➔ ទាញ Bot ចូលជា Admin ➔ ផ្ញើសារសាកល្បង ➔ យក Chat ID មកកំណត់ (ឬប្រើ Bot ដូចជា @raw_data_bot ដើម្បីមើល ID ផ្ទាល់ខ្លួន)។</li>
                        </ol>
                    </div>
                </div>

                <!-- Accordion 3 -->
                <div class="accordion-item" style="border: 1px solid var(--border-color); border-radius: var(--radius-sm); margin-bottom: 8px; overflow: hidden;">
                    <button class="accordion-header" style="width: 100%; text-align: left; padding: 12px; background: var(--bg-color); font-weight: 700; font-size: 13px; color: var(--text-color); display: flex; justify-content: space-between; align-items: center; border: none; min-height: unset; cursor: pointer; box-shadow: none;">
                        <span class="khmer-text">💻 ៣. របៀបដំឡើង Google Apps Script (Backend)</span>
                        <i data-lucide="chevron-down" style="width: 16px; height: 16px; transition: transform 0.2s;"></i>
                    </button>
                    <div class="accordion-content hidden" style="padding: 12px; font-size: 12.5px; border-top: 1px solid var(--border-color); line-height: 1.6; color: var(--subtext-color);">
                        <ol class="khmer-text" style="padding-left: 16px; margin: 0;">
                            <li style="margin-bottom: 4px;">បើក Google Sheet គំរូដែលលោកអ្នកបានចម្លងរួច។</li>
                            <li style="margin-bottom: 4px;">ចុចលើ <b>Extensions (ផ្នែកបន្ថែម)</b> ➔ <b>Apps Script</b>។</li>
                            <li style="margin-bottom: 4px;">ចម្លងកូដក្នុងឯកសារ <b>gas/Code.gs</b> ផាស (Paste) ជំនួសកូដទាំងអស់ក្នុង Apps Script រួចចុច Save។</li>
                            <li style="margin-bottom: 4px;">ចុច <b>Deploy</b> ➔ <b>New deployment</b> ➔ ជ្រើសរើសប្រភេទ <b>Web app</b>។</li>
                            <li style="margin-bottom: 4px;">កំណត់៖ <b>Execute as</b>: Me (ខ្ញុំ) និង <b>Who has access</b>: Anyone (អ្នកណាក៏បាន) រួចចុច Deploy និងអនុញ្ញាត (Allow access)។</li>
                            <li style="margin-bottom: 4px;">ចម្លង Web App URL យកមកដាក់ក្នុងការកំណត់របស់កម្មវិធី។</li>
                        </ol>
                    </div>
                </div>

                <!-- Accordion 4 -->
                <div class="accordion-item" style="border: 1px solid var(--border-color); border-radius: var(--radius-sm); overflow: hidden;">
                    <button class="accordion-header" style="width: 100%; text-align: left; padding: 12px; background: var(--bg-color); font-weight: 700; font-size: 13px; color: var(--text-color); display: flex; justify-content: space-between; align-items: center; border: none; min-height: unset; cursor: pointer; box-shadow: none;">
                        <span class="khmer-text">💡 ៤. របៀបប្រើប្រាស់ទូទៅ (Scoring Modes)</span>
                        <i data-lucide="chevron-down" style="width: 16px; height: 16px; transition: transform 0.2s;"></i>
                    </button>
                    <div class="accordion-content hidden" style="padding: 12px; font-size: 12.5px; border-top: 1px solid var(--border-color); line-height: 1.6; color: var(--subtext-color);">
                        <ul class="khmer-text" style="padding-left: 16px; margin: 0;">
                            <li style="margin-bottom: 4px;"><b>Turbo Mode (បញ្ចូលពិន្ទុរហ័ស)</b>៖ ងាយស្រួលអូសបញ្ចូលពិន្ទុម្នាក់ៗ ស្គីបទៅសិស្សបន្ទាប់ស្វ័យប្រវត្តដោយគ្រាន់តែចុច Enter។</li>
                            <li style="margin-bottom: 4px;"><b>Normal Mode (តារាងពិន្ទុ)</b>៖ បង្ហាញជាទម្រង់ Grid Spreadsheet អាចតម្រៀបតាមចំណាត់ថ្នាក់ ងាយស្រួលផ្ទៀងផ្ទាត់។</li>
                            <li style="margin-bottom: 4px;"><b>Floating Action (Edit)</b>៖ លាក់ខ្លួនស្វ័យប្រវត្តិពេលកំពុងអូសចុះឡើង ដើម្បីកុំឱ្យបាំងផ្ទៃការងារ និងបង្ហាញមកវិញក្រោយឈប់អូស ៣ វិនាទី។</li>
                        </ul>
                    </div>
                </div>
            </div>
        </main>
    `;

    bindSettingsPageEvents();
    if (window.lucide) window.lucide.createIcons();
}

function bindSettingsPageEvents() {
    const configBtn = document.getElementById("btn-goto-config");
    if (configBtn) {
        configBtn.addEventListener("click", () => {
            if (window.triggerHaptic) window.triggerHaptic("medium");
            if (window.navigateToPage) window.navigateToPage("system-config-page");
        });
    }

    // Bind Accordion headers
    document.querySelectorAll("#settings-page .accordion-header").forEach(header => {
        header.addEventListener("click", () => {
            const content = header.nextElementSibling;
            const icon = header.querySelector("i");
            const isHidden = content.classList.contains("hidden");

            // Close all accordions
            document.querySelectorAll("#settings-page .accordion-content").forEach(c => c.classList.add("hidden"));
            document.querySelectorAll("#settings-page .accordion-header i").forEach(i => {
                i.setAttribute("data-lucide", "chevron-down");
            });

            if (isHidden) {
                content.classList.remove("hidden");
                if (icon) icon.setAttribute("data-lucide", "chevron-up");
            }

            if (window.lucide) window.lucide.createIcons();
            if (window.triggerHaptic) window.triggerHaptic("light");
        });
    });
}

function renderSystemConfigPage() {
    const container = document.getElementById("system-config-page");
    if (!container) return;

    const currentConfig = ConfigManager.load() || {};
    const googleUrl = currentConfig.apiUrl || "";
    const sheetId = currentConfig.spreadsheetId || "";
    const pin = currentConfig.pin || "1234";

    const botToken = localStorage.getItem(STORAGE.TG_BOT_TOKEN) || SESSION.tgBotToken || "";
    const chatId = localStorage.getItem(STORAGE.TG_CHAT_ID) || SESSION.tgChatId || "";
    
    // Audit Logs html
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
            <button class="topbar-btn khmer-text" id="config-back-btn" style="min-height: unset; padding: 6px 12px; background: rgba(255,255,255,0.15);">
                <i data-lucide="arrow-left" style="width: 14px; height: 14px;"></i> ត្រឡប់
            </button>
            <div class="topbar-title" style="margin-left: 10px;">⚙️ ការកំណត់ប្រព័ន្ធ</div>
        </header>

        <main class="content">
            <div class="card">
                <h3 class="khmer-text"><i data-lucide="lock" style="width: 18px; height: 18px;"></i> សុវត្ថិភាពកូដ PIN</h3>
                <div class="form-group margin-top">
                    <label class="khmer-text">កូដ PIN សម្ងាត់កម្មវិធី៖</label>
                    <input type="password" id="setting-pin" value="${escapeHtml(pin)}" maxlength="4" style="text-align: center; letter-spacing: 4px; font-weight: 700;">
                </div>
            </div>

            <div class="card">
                <h3 class="khmer-text"><i data-lucide="cloud" style="width: 18px; height: 18px;"></i> ការកំណត់ Google Cloud Backend</h3>
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
                <h3 class="khmer-text"><i data-lucide="send" style="width: 18px; height: 18px;"></i> ការភ្ជាប់ Telegram Bot</h3>
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

            <button id="save-settings-btn" class="btn btn-primary full-width khmer-text" style="margin-bottom: 15px;">
                <i data-lucide="save" style="width: 16px; height: 16px;"></i> រក្សាទុកការកំណត់
            </button>

            <div class="card" style="margin-top: 10px;">
                <h3 class="khmer-text"><i data-lucide="history" style="width: 18px; height: 18px;"></i> កំណត់ត្រាកែប្រែចុងក្រោយ (Audit Logs)</h3>
                <div style="max-height: 180px; overflow-y: auto; margin-top: 10px;">
                    ${logsHtml}
                </div>
            </div>

            <div class="card card-danger" style="margin-top: 16px;">
                <h3 class="khmer-text"><i data-lucide="trash-2" style="width: 18px; height: 18px;"></i> កន្លែងប្រុងប្រយ័ត្ន (Danger Zone)</h3>
                <button id="reset-data-btn" class="btn btn-danger full-width khmer-text" style="margin-top: 10px;">
                    🗑️ កំណត់ឡើងវិញនូវទិន្នន័យទាំងអស់ (Reset All Data)
                </button>
            </div>
        </main>
    `;

    bindSystemConfigEvents();
    if (window.lucide) window.lucide.createIcons();
}

function bindSystemConfigEvents() {
    const backBtn = document.getElementById("config-back-btn");
    if (backBtn) {
        backBtn.addEventListener("click", () => {
            if (window.triggerHaptic) window.triggerHaptic("medium");
            if (window.navigateToPage) window.navigateToPage("settings-page");
        });
    }

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
                    if (window.showToast) window.showToast("🟢 ជោគជ័យ! Telegram Bot តភ្ជាប់បានជោគជ័យ។", 1500);
                    else alert("🟢 ជោគជ័យ! Telegram Bot បានផ្ញើសារសាកល្បងទៅកាន់ Telegram របស់អ្នករួចរាល់ហើយ។");
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

            const origText = saveBtn.innerHTML;
            saveBtn.innerHTML = "កំពុងរក្សាទុក និងទាញយកទិន្នន័យពី Google Sheet... ⏳";
            saveBtn.disabled = true;

            ConfigManager.save(googleUrl, sheetId, pin);

            localStorage.setItem(STORAGE.TG_BOT_TOKEN, botToken);
            localStorage.setItem(STORAGE.TG_CHAT_ID, chatId);

            SESSION.tgBotToken = botToken;
            SESSION.tgChatId = chatId;

            // Immediately pull subjects & students from Google Sheet
            if (window.API) {
                try {
                    await window.API.getSubjects(true);
                    await window.API.getStudents(true);
                } catch (e) {
                    console.warn("Error fetching data on save settings:", e);
                }
            }

            // Sync Active Subjects to backend API
            const activeIds = JSON.parse(localStorage.getItem(STORAGE.ACTIVE_SUBJECTS) || "[]");
            if (window.API && window.API.saveActiveSubjects && activeIds.length > 0) {
                try {
                    await window.API.saveActiveSubjects(activeIds);
                } catch (e) {
                    console.warn("Could not sync active subjects to cloud:", e);
                }
            }

            saveBtn.innerHTML = origText;
            saveBtn.disabled = false;

            triggerHaptic("success");
            if (window.showToast) window.showToast("✅ ការកំណត់ត្រូវបានរក្សាទុក និងទាញយកទិន្នន័យរួចរាល់!", 1500);
            else alert("✅ ការកំណត់ត្រូវបានរក្សាទុក និងទាញយកទិន្នន័យពី Google Sheet រួចរាល់!");
            if (window.navigateToPage) window.navigateToPage("settings-page");
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

function escapeHtml(text) {
    if (!text) return "";
    return String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
