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
        rowsHtml = `<tr><td colspan="7" class="text-center text-muted khmer-text" style="padding:20px;">មិនទាន់មានទិន្នន័យសិស្សនៅឡើយទេ។</td></tr>`;
    } else {
        studentResults.forEach((res, idx) => {
            const r = parseInt(res.rank) || 0;
            let rankClass = "rank-badge";
            if (r === 1) rankClass += " rank-1";
            else if (r === 2) rankClass += " rank-2";
            else if (r === 3) rankClass += " rank-3";

            const gradeClass = (res.grade === "F" || res.grade === "E" || res.grade === "ធ្លាក់") ? "grade-fail" : "grade-pass";
            const seqNo = idx + 1;

            rowsHtml += `
                <tr>
                    <td class="text-center text-normal" style="font-weight: 600; color: var(--subtext-color);">${seqNo}</td>
                    <td>
                        <div class="khmer-text text-normal text-bold">${escapeHtml(res.name)}</div>
                    </td>
                    <td class="text-center khmer-text text-normal">${escapeHtml(res.gender || '-')}</td>
                    <td class="text-center text-normal"><b>${res.total || 0}</b></td>
                    <td class="text-center text-normal">${res.average || 0}</td>
                    <td class="text-center"><span class="${rankClass}">${res.rank || '-'}</span></td>
                    <td class="text-center"><span class="badge ${gradeClass}">${res.grade || '-'}</span></td>
                </tr>
            `;
        });
    }

    container.innerHTML = `
        <header class="topbar">
            <div class="topbar-title text-title">📊 របាយការណ៍លទ្ធផល និងចំណាត់ថ្នាក់</div>
        </header>

        <main class="content">
            <div class="card">
                <h3 class="khmer-text text-title" style="font-size: 16px; margin-bottom: 6px;">🏆 តារាងចំណាត់ថ្នាក់សិស្សប្រចាំខែ</h3>
                <p class="khmer-text text-subtitle" style="margin-bottom: 12px;">* ទិន្នន័យ និងចំណាត់ថ្នាក់ត្រូវបានគណនាដោយផ្ទាល់ពី Google Sheets</p>
                <div class="result-table-container">
                    <table class="result-table">
                        <thead>
                            <tr>
                                <th class="text-center text-sm">ល.រ</th>
                                <th class="text-sm">គោត្តនាម នាម</th>
                                <th class="text-center text-sm">ភេទ</th>
                                <th class="text-center text-sm">ពិន្ទុសរុប</th>
                                <th class="text-center text-sm">មធ្យមភាគ</th>
                                <th class="text-center text-sm">ចំណាត់ថ្នាក់</th>
                                <th class="text-center text-sm">និទ្ទេស</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${rowsHtml}
                        </tbody>
                    </table>
                </div>
            </div>

            <button id="send-tg-report-btn" class="btn btn-primary full-width khmer-text text-normal" style="margin-top: 10px;">
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

    let reportMsg = `📊 *របាយការណ៍ចំណាត់ថ្នាក់សិស្ស*\n👥 *ចំនួនសិស្សសរុប:* ${results.length} នាក់\n\n🏆 *សិស្សដែលមានចំណាត់ថ្នាក់ល្អសមរម្យ:*\n`;

    results.slice(0, 10).forEach(res => {
        const r = parseInt(res.rank) || 0;
        let medal = "▫️";
        if (r === 1) medal = "🥇";
        else if (r === 2) medal = "🥈";
        else if (r === 3) medal = "🥉";
        reportMsg += `${medal} *លេខ ${res.rank}* ${res.name} (ភេទ: ${res.gender}) - ពិន្ទុសរុប: *${res.total}* (មធ្យមភាគ: ${res.average}, និទ្ទេស: ${res.grade})\n`;
    });

    try {
        const text = encodeURIComponent(reportMsg);
        const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatId}&text=${text}&parse_mode=Markdown`);
        const data = await res.json();

        if (data.ok) {
            alert("🟢 បានផ្ញើរបាយការណ៍ចំណាត់ថ្នាក់ទៅកាន់ Telegram ដោយជោគជ័យ!");
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
