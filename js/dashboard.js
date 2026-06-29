/* =========================================
   School Score System v2
   dashboard.js - Dashboard Overview Controller (Grouped)
   ========================================= */

"use strict";

window.renderDashboardOverview = renderDashboardOverview;

function renderDashboardOverview() {
    const container = document.getElementById("dashboard-page");
    if (!container) return;

    const students = JSON.parse(localStorage.getItem(STORAGE.STUDENTS) || "[]");
    const scores = JSON.parse(localStorage.getItem(STORAGE.SCORES) || "{}");
    let allSubjects = JSON.parse(localStorage.getItem(STORAGE.SUBJECTS) || "[]");
    let activeIds = JSON.parse(localStorage.getItem(STORAGE.ACTIVE_SUBJECTS) || "[]");

    const SUBJECT_GROUPS_DEF = [
        { title: "ខ្មែរ", keywords: ["ស្ដាប់", "សរសេរ", "អាន", "និយាយ", "ខ្មែរ", "ភាសាខ្មែរ"] },
        { title: "គណិតវិទ្យា", keywords: ["ចំនួន", "រង្វាស់រង្វាល់", "ធរណីមាត្រ", "ពីជគណិត", "ស្ថិតិ", "គណិត", "គណិតវិទ្យា"] },
        { title: "វិទ្យាសាស្ត្រ", keywords: ["រូបវិទ្យា", "គីមីវិទ្យា", "ជីវវិទ្យា", "ផែនដី និងបរិស្ថាន", "ផែនដី-បរិស្ថាន", "ផែនដី", "បរិស្ថាន", "វិទ្យាសាស្ត្រ"] },
        { title: "សិក្សាសង្គម", keywords: ["សីលធម៌ និងពលរដ្ឋវិជ្ជា", "សីល-ពលរដ្ឋ", "សីលធម៌", "ពលរដ្ឋ", "ភូមិវិទ្យា", "ប្រវត្តិវិទ្យា", "អប់រំសិល្បៈ", "សិល្បៈ", "សង្គម"] },
        { title: "អប់រំកាយ និងសុខភាព", keywords: ["អប់រំកាយ", "សុខភាព", "កីឡា"] },
        { title: "បំណិនជីវិត", keywords: ["បំណិនជីវិត", "បំណិន"] },
        { title: "ភាសាបរទេស", keywords: ["ភាសាបរទេស", "អង់គ្លេស", "បារាំង", "English", "French"] }
    ];

    // Ensure fallback subject objects exist for 24 & 25 if missing from allSubjects
    const activeSubjectObjs = activeIds.map(id => {
        let found = allSubjects.find(s => String(s.id) === String(id));
        if (!found) {
            if (String(id) === "24" || id === 24 || String(id).includes("បំណិន")) {
                found = { id: 24, name: "បំណិនជីវិត", active: true };
            } else if (String(id) === "25" || id === 25 || String(id).includes("ភាសាបរទេស")) {
                found = { id: 25, name: "ភាសាបរទេស", active: true };
            } else {
                found = { id: id, name: String(id), active: true };
            }
        }
        return found;
    }).filter(Boolean);

    const groups = SUBJECT_GROUPS_DEF.map(g => ({ title: g.title, keywords: g.keywords, subjects: [] }));
    const otherGroup = { title: "មុខវិជ្ជាផ្សេងៗ", keywords: [], subjects: [] };

    activeSubjectObjs.forEach(subInfo => {
        let matched = false;
        for (const g of groups) {
            if (g.keywords.some(kw => subInfo.name.includes(kw))) {
                g.subjects.push(subInfo);
                matched = true;
                break;
            }
        }
        if (!matched) {
            otherGroup.subjects.push(subInfo);
        }
    });

    const activeGroupList = groups.filter(g => g.subjects.length > 0);
    if (otherGroup.subjects.length > 0) activeGroupList.push(otherGroup);

    let progressHtml = "";
    
    if (activeGroupList.length === 0) {
        progressHtml = `<p class="khmer-text text-muted text-center" style="font-size: 13px; padding: 15px;">មិនទាន់មានមុខវិជ្ជាសកម្មនៅឡើយទេ។ សូមទៅកាន់ "ទាញយក" ដើម្បីជ្រើសរើសមុខវិជ្ជា។</p>`;
    } else {
        activeGroupList.forEach(group => {
            let cardsHtml = "";
            group.subjects.forEach(subInfo => {
                let completed = 0;
                students.forEach(s => {
                    if (scores[s.id] && scores[s.id][subInfo.id] !== undefined && scores[s.id][subInfo.id] !== "" && scores[s.id][subInfo.id] !== null) {
                        completed++;
                    }
                });

                const total = students.length;
                const pct = total === 0 ? 0 : Math.round((completed / total) * 100);

                cardsHtml += `
                    <div class="stat-card" data-sub-id="${subInfo.id}" style="cursor: pointer; padding: 10px 12px; border-radius: 10px; background: var(--bg-color); border: 1px solid var(--border-color); display: flex; flex-direction: column; justify-content: space-between;">
                        <div style="font-weight: 700; font-size: 13px; margin-bottom: 6px;" class="khmer-text">${escapeHtml(subInfo.name)}</div>
                        <div class="progress-bar" style="height: 6px; background: #e2e8f0; border-radius: 3px; overflow: hidden;">
                            <div class="progress-fill" style="height: 100%; width: ${pct}%; background: var(--primary-color);"></div>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-top: 6px; font-size: 11px; color: var(--subtext-color);">
                            <span>បានបញ្ចូល៖ ${completed}/${total}</span>
                            <span style="font-weight: 700; color: var(--text-color);">${pct}%</span>
                        </div>
                    </div>
                `;
            });

            progressHtml += `
                <div class="card" style="margin-bottom: 15px;">
                    <h3 class="khmer-text text-title" style="font-size: 15px; margin-bottom: 12px; color: var(--primary-color);">
                        🔹 ${escapeHtml(group.title)}
                    </h3>
                    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 10px;">
                        ${cardsHtml}
                    </div>
                </div>
            `;
        });
    }

    container.innerHTML = `
        <header class="topbar">
            <div class="topbar-title text-title">🏫 ផ្ទាំងគ្រប់គ្រងប្រព័ន្ធពិន្ទុ</div>
        </header>

        <main class="content">
            <div class="card" style="margin-bottom: 20px;">
                <h3 class="khmer-text text-title" style="font-size: 16px;">⚡ របៀបបញ្ចូល និងកែសម្រួលពិន្ទុ</h3>
                <div class="btn-grid" style="margin-top: 12px;">
                    <button id="btn-mode-turbo" class="btn btn-accent full-width khmer-text text-normal">
                        🚀 Turbo Mode (រហ័ស)
                    </button>
                    <button id="btn-mode-normal" class="btn btn-primary full-width khmer-text text-normal">
                        📝 Normal Mode (តារាង)
                    </button>
                </div>
            </div>

            <h3 class="khmer-text text-title" style="font-size: 16px; margin-bottom: 12px;">📊 វឌ្ឍនភាពការបញ្ចូលពិន្ទុ (តាមក្រុមមុខវិជ្ជា)</h3>
            ${progressHtml}

            <div class="card" style="margin-top: 15px;">
                <h3 class="khmer-text text-title" style="font-size: 16px;">🏆 លទ្ធផលប្រចាំខែ</h3>
                <button id="btn-dash-results" class="btn btn-outline full-width khmer-text text-normal" style="margin-top: 10px;">
                    មើលចំណាត់ថ្នាក់ និងនិទ្ទេស
                </button>
            </div>
        </main>
    `;

    bindDashboardEvents();
    if (window.updateTelegramUserInfo) window.updateTelegramUserInfo();
}

function bindDashboardEvents() {
    const map = {
        "btn-mode-turbo": "turbo-mode-page",
        "btn-mode-normal": "normal-mode-page",
        "btn-dash-results": "results-page"
    };

    Object.keys(map).forEach(id => {
        const btn = document.getElementById(id);
        if (btn) {
            btn.addEventListener("click", () => {
                if (window.triggerHaptic) window.triggerHaptic("medium");
                if (window.navigateToPage) window.navigateToPage(map[id]);
            });
        }
    });

    document.querySelectorAll("#dashboard-page .stat-card").forEach(card => {
        card.addEventListener("click", () => {
            const id = card.getAttribute("data-sub-id");
            SESSION.selectedSubjectId = isNaN(id) ? id : parseInt(id);
            if (window.triggerHaptic) window.triggerHaptic("light");
            if (window.navigateToPage) window.navigateToPage("turbo-mode-page");
        });
    });
}
