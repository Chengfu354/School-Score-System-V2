/* =========================================
   School Score System v2.6
   result.js - Score Analysis & Leaderboard (Google Sheets Driver)
   ========================================= */

"use strict";

window.renderResultsPage = renderResultsPage;

async function renderResultsPage() {
    const container = document.getElementById("results-page");
    if (!container) return;

    // Show loading state in Khmer
    container.innerHTML = `
        <header class="topbar">
            <div class="topbar-title">📊 របាយការណ៍លទ្ធផល និងចំណាត់ថ្នាក់</div>
        </header>
        <main class="content" style="display: flex; justify-content: center; align-items: center;">
            <div class="khmer-text" style="font-size: 16px; font-weight: 600;">កំពុងទាញយកទិន្នន័យពី Google Sheets... ⏳</div>
        </main>
    `;

    let data;
    try {
        if (window.API && window.API.getStudents) {
            data = await window.API.getStudents(true); // silentError — fallback to localStorage
        }
    } catch (e) {
        console.warn("Results page: API offline, using localStorage cache.", e);
    }

    // Fallback: build data object from localStorage cache
    if (!data) {
        const cachedStudents = JSON.parse(localStorage.getItem(STORAGE.STUDENTS) || "[]");
        const cachedScores = JSON.parse(localStorage.getItem(STORAGE.SCORES) || "{}");
        if (cachedStudents.length > 0) {
            data = { students: cachedStudents, scores: cachedScores };
        } else {
            container.innerHTML = `
                <header class="topbar"><div class="topbar-title">📊 របាយការណ៍លទ្ធផល</div></header>
                <main class="content" style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;text-align:center;gap:12px;">
                    <div style="font-size:40px;">📡</div>
                    <div class="khmer-text" style="font-size:15px;font-weight:700;">មិនអាចភ្ជាប់ទៅកាន់ម៉ាស៊ីនមេបានទេ</div>
                    <div class="khmer-text text-muted" style="font-size:13px;">សូមពិនិត្យការតភ្ជាប់អ៊ីនធឺណិត រួចចុចព្យាយាមម្ដងទៀត។</div>
                    <button class="btn btn-outline khmer-text" onclick="window.renderResultsPage && window.renderResultsPage()">🔄 ព្យាយាមម្ដងទៀត</button>
                </main>`;
            return;
        }
    }

    const students = data.students || [];

    // Save fetched students to update local storage view if needed
    localStorage.setItem(STORAGE.STUDENTS, JSON.stringify(students));

    // Sort by rank for display purposes
    const studentResults = [...students].sort((a, b) => {
        const rankA = parseInt(a.rank) || 999;
        const rankB = parseInt(b.rank) || 999;
        return rankA - rankB;
    });

    let rowsHtml = "";
    if (studentResults.length === 0) {
        rowsHtml = `<tr><td colspan="5" class="text-center text-muted khmer-text" style="padding:20px;">មិនទាន់មានទិន្នន័យសិស្សនៅឡើយទេ។</td></tr>`;
    } else {
        studentResults.forEach((res, idx) => {
            const rankPos = idx + 1; // 1, 2, 3, 4, 5...
            let rankClass = "rank-badge";
            if (rankPos === 1) rankClass += " rank-1";
            else if (rankPos === 2) rankClass += " rank-2";
            else if (rankPos === 3) rankClass += " rank-3";
            else if (rankPos === 4) rankClass += " rank-4";
            else if (rankPos === 5) rankClass += " rank-5";

            const gradeClass = (res.grade === "F" || res.grade === "E" || res.grade === "ធ្លាក់") ? "grade-fail" : "grade-pass";
            const seqNo = idx + 1;

            // Format Average to exactly 2 decimal places (e.g. 9.83)
            const avgVal = parseFloat(res.average);
            const displayAverage = !isNaN(avgVal) ? avgVal.toFixed(2) : (res.average || 0);

            // Row text styled small and single-line layout (Hiding gender and total score, minimal paddings)
            rowsHtml += `
                <tr style="font-size: 12.5px;">
                    <td style="text-align: center; font-weight: 600; color: var(--subtext-color); white-space: nowrap; padding: 8px 4px;">${seqNo}</td>
                    <td style="white-space: nowrap; padding: 8px 6px;">
                        <div class="khmer-text text-bold" style="font-size: 12.5px; white-space: nowrap;">${escapeHtml(res.name)}</div>
                    </td>
                    <td style="text-align: center; white-space: nowrap; padding: 8px 4px; font-weight: 600;">${displayAverage}</td>
                    <td style="text-align: center; white-space: nowrap; padding: 8px 4px;">
                        <span class="${rankClass}" style="margin: 0 auto; display: inline-flex; align-items: center; justify-content: center; width: 24px; height: 24px; font-size: 12px; font-weight: 800;">${res.rank || '-'}</span>
                    </td>
                    <td style="text-align: center; white-space: nowrap; padding: 8px 4px;">
                        <span class="badge ${gradeClass}" style="font-size: 10px; padding: 2px 6px; font-weight: 600;">${res.grade || '-'}</span>
                    </td>
                </tr>
            `;
        });
    }

    container.innerHTML = `
        <header class="topbar">
            <div class="topbar-title text-title">📊 របាយការណ៍លទ្ធផល និងចំណាត់ថ្នាក់</div>
        </header>

        <main class="content" style="padding: 10px; padding-bottom: 90px;">
            <div class="card" style="padding: 10px; margin-bottom: 12px;">
                <h3 class="khmer-text text-title" style="font-size: 15px; margin-bottom: 4px;">🏆 តារាងចំណាត់ថ្នាក់សិស្សប្រចាំខែ</h3>
                <p class="khmer-text text-subtitle" style="margin-bottom: 12px; font-size: 11px;">* ទិន្នន័យ និងចំណាត់ថ្នាក់ត្រូវបានគណនាដោយផ្ទាល់ពី Google Sheets</p>
                <div class="result-table-container" style="margin-top: 5px;">
                    <table class="result-table" style="font-size: 12.5px;">
                        <thead>
                            <tr>
                                <th style="text-align: center; font-size: 11.5px; width: 35px; padding: 8px 4px; white-space: nowrap;">ល.រ</th>
                                <th style="font-size: 11.5px; padding: 8px 6px; white-space: nowrap;">គោត្តនាម នាម</th>
                                <th style="text-align: center; font-size: 11.5px; width: 65px; padding: 8px 4px; white-space: nowrap;">មធ្យមភាគ</th>
                                <th style="text-align: center; font-size: 11.5px; width: 65px; padding: 8px 4px; white-space: nowrap;">ចំណាត់</th>
                                <th style="text-align: center; font-size: 11.5px; width: 65px; padding: 8px 4px; white-space: nowrap;">និទ្ទេស</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${rowsHtml}
                        </tbody>
                    </table>
                </div>
            </div>

            <button id="send-tg-report-btn" class="btn btn-primary full-width khmer-text text-normal" style="margin-top: 5px;">
                ✈️ ផ្ញើរបាយការណ៍ចំណាត់ថ្នាក់ទៅ Telegram
            </button>
        </main>
    `;

    bindResultPageEvents(studentResults);
}

function bindResultPageEvents(results) {
    const btn = document.getElementById("send-tg-report-btn");
    if (btn) {
        btn.addEventListener("click", () => {
            sendTelegramLeaderboard(results);
        });
    }
}

async function sendTelegramLeaderboard(results) {
    const token = (localStorage.getItem(STORAGE.TG_BOT_TOKEN) || SESSION.tgBotToken).trim();
    let chatId = (localStorage.getItem(STORAGE.TG_CHAT_ID) || SESSION.tgChatId).trim();

    if (!token) {
        alert("⚠️ សូមកំណត់ Telegram Bot Token នៅក្នុងការកំណត់ (Settings) ជាមុនសិន!");
        return;
    }

    if (!chatId) {
        chatId = prompt("សូមបញ្ជូល Target Telegram Chat ID ឬ Channel Username (ឧទាហរណ៍ @channel ឬ ID):");
        if (!chatId) return;
        localStorage.setItem(STORAGE.TG_CHAT_ID, chatId.trim());
    }

    let reportMsg = `📊 *របាយការណ៍ចំណាត់ថ្នាក់សិស្ស*\n👥 *ចំនួនសិស្សសរុប:* ${results.length} នាក់\n\n\`\`\`\n`;

    // Dynamic padding calculation based on the longest name (min baseline: 24 characters)
    const maxNameLen = Math.max(24, ...results.map(r => r.name ? r.name.length : 0));

    // Process all students and output single-line style aligned vertically: "01  មាន សុកហៀង  9.83  ល្អប្រសើរ"
    results.forEach(res => {
        const displayRank = String(res.rank || '').padStart(2, '0');
        const avgVal = parseFloat(res.average);
        const displayAverage = !isNaN(avgVal) ? avgVal.toFixed(2) : (res.average || 0);
        const grade = res.grade || '-';

        // Pad the name dynamically in monospace format to ensure columns align perfectly
        const paddedName = res.name.padEnd(maxNameLen, ' ');

        reportMsg += `${displayRank}  ${paddedName}  ${displayAverage}  ${grade}\n`;
    });

    reportMsg += `\`\`\``;

    try {
        const text = encodeURIComponent(reportMsg);
        const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatId}&text=${text}&parse_mode=Markdown`);
        const data = await res.json();

        if (data.ok) {
            if (window.showToast) window.showToast("🟢 បានផ្ញើរបាយការណ៍ទៅ Telegram រួចរាល់!", 1500);
            else alert("🟢 បានផ្ញើរបាយការណ៍ចំណាត់ថ្នាក់ទៅកាន់ Telegram ដោយជោគជ័យ!");
            triggerHaptic("success");
        } else {
            alert(`⚠️ Telegram API Error: ${data.description}`);
            triggerHaptic("error");
        }
    } catch (e) {
        console.error("Failed to send Telegram report:", e);
        alert("⚠️ មានបញ្ហាបណ្តាញ អំឡុងពេលផ្ញើរបាយការណ៍។");
        triggerHaptic("error");
    }
}

function escapeHtml(text) {
    if (!text) return "";
    return String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
