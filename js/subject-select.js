/* =========================================
   School Score System v2
   subject-select.js - Active Subject Selection Screen (Grouped)
   ========================================= */

"use strict";

window.renderSelectSubjectPage = renderSelectSubjectPage;

function renderSelectSubjectPage() {
    const container = document.getElementById("select-subject-page");
    if (!container) return;

    const allSubjects = JSON.parse(localStorage.getItem(STORAGE.SUBJECTS) || "[]");
    let activeIds = JSON.parse(localStorage.getItem(STORAGE.ACTIVE_SUBJECTS) || "[]");

    let groupsHtml = "";
    const SUBJECT_GROUPS_DEF = [
        { title: "ខ្មែរ", keywords: ["ស្ដាប់", "សរសេរ", "អាន", "និយាយ", "ខ្មែរ", "ភាសាខ្មែរ"] },
        { title: "គណិតវិទ្យា", keywords: ["ចំនួន", "រង្វាស់រង្វាល់", "ធរណីមាត្រ", "ពីជគណិត", "ស្ថិតិ", "គណិត", "គណិតវិទ្យា"] },
        { title: "វិទ្យាសាស្ត្រ", keywords: ["រូបវិទ្យា", "គីមីវិទ្យា", "ជីវវិទ្យា", "ផែនដី និងបរិស្ថាន", "ផែនដី-បរិស្ថាន", "ផែនដី", "បរិស្ថាន", "វិទ្យាសាស្ត្រ"] },
        { title: "សិក្សាសង្គម", keywords: ["សីលធម៌ និងពលរដ្ឋវិជ្ជា", "សីល-ពលរដ្ឋ", "សីលធម៌", "ពលរដ្ឋ", "ភូមិវិទ្យា", "ប្រវត្តិវិទ្យា", "អប់រំសិល្បៈ", "សិល្បៈ", "សង្គម"] },
        { title: "អប់រំកាយ និងសុខភាព", keywords: ["អប់រំកាយ", "សុខភាព", "កីឡា"] },
        { title: "បំណិនជីវិត", keywords: ["បំណិនជីវិត", "បំណិន"] },
        { title: "ភាសាបរទេស", keywords: ["ភាសាបរទេស", "អង់គ្លេស", "បារាំង", "English", "French"] }
    ];

    const groups = SUBJECT_GROUPS_DEF.map(g => ({ title: g.title, keywords: g.keywords, subjects: [] }));
    const otherGroup = { title: "មុខវិជ្ជាផ្សេងៗ", keywords: [], subjects: [] };

    allSubjects.forEach(sub => {
        let matched = false;
        for (const g of groups) {
            if (g.keywords.some(kw => sub.name.includes(kw))) {
                g.subjects.push(sub);
                matched = true;
                break;
            }
        }
        if (!matched) {
            otherGroup.subjects.push(sub);
        }
    });

    groups.forEach(g => {
        if (g.subjects.length === 0) {
            const fallbackId = (g.title === "បំណិនជីវិត" ? 24 : (g.title === "ភាសាបរទេស" ? 25 : "g_" + g.title));
            g.subjects.push({ id: fallbackId, name: g.title });
        }
    });

    const resultList = [...groups];
    if (otherGroup.subjects.length > 0) resultList.push(otherGroup);

    resultList.forEach(group => {
        let pillsHtml = "";
        group.subjects.forEach(sub => {
            const isSelected = activeIds.some(id => String(id) === String(sub.id)) ? "selected" : "";
            pillsHtml += `
                <div class="subject-pill ${isSelected}" data-id="${sub.id}">
                    ${escapeHtml(sub.name)}
                </div>
            `;
        });

        groupsHtml += `
            <div class="card" style="margin-bottom: 14px;">
                <div style="margin-bottom: 8px; border-bottom: 1px solid var(--border-color); padding-bottom: 6px;">
                    <h3 class="khmer-text text-title" style="font-size: 15px; margin: 0; color: var(--primary-color);">
                        🔹 ${escapeHtml(group.title)}
                    </h3>
                </div>
                <div class="subject-pills" style="display: flex; flex-wrap: wrap; gap: 8px;">
                    ${pillsHtml}
                </div>
            </div>
        `;
    });

    container.innerHTML = `
        <header class="topbar">
            <div class="topbar-title">📚 ជ្រើសរើសមុខវិជ្ជាសកម្ម</div>
        </header>

        <main class="content">
            <div style="margin-bottom: 12px;">
                <h2 class="khmer-text text-title" style="font-size: 17px; font-weight: 700;">មុខវិជ្ជាដែលត្រូវបញ្ចូលពិន្ទុ</h2>
                <p class="khmer-text text-subtitle">ចុចលើមុខវិជ្ជាដើម្បីបើក/បិទ៖</p>
            </div>
            
            <div id="select-grouped-subjects">
                ${groupsHtml}
            </div>

            <button id="btn-confirm-subjects" class="btn btn-primary full-width khmer-text" style="margin-top: 10px; margin-bottom: 20px;">
                ចូលទៅកាន់ផ្ទាំងគ្រប់គ្រង (Go to Dashboard) ➔
            </button>
        </main>
    `;

    bindSubjectSelectEvents();
}

function bindSubjectSelectEvents() {
    document.querySelectorAll("#select-subject-page .subject-pill").forEach(pill => {
        pill.addEventListener("click", () => {
            const id = pill.getAttribute("data-id");
            let activeIds = JSON.parse(localStorage.getItem(STORAGE.ACTIVE_SUBJECTS) || "[]");
            
            if (pill.classList.contains("selected")) {
                pill.classList.remove("selected");
                activeIds = activeIds.filter(s => String(s) !== String(id));
            } else {
                pill.classList.add("selected");
                if (!activeIds.some(s => String(s) === String(id))) {
                    activeIds.push(isNaN(id) ? id : parseInt(id));
                }
            }
            
            localStorage.setItem(STORAGE.ACTIVE_SUBJECTS, JSON.stringify(activeIds));
            if (window.triggerHaptic) window.triggerHaptic("light");
        });
    });

    const confirmBtn = document.getElementById("btn-confirm-subjects");
    if (confirmBtn) {
        confirmBtn.addEventListener("click", async () => {
            const activeIds = JSON.parse(localStorage.getItem(STORAGE.ACTIVE_SUBJECTS) || "[]");
            if (activeIds.length === 0) {
                alert("⚠️ សូមជ្រើសរើសយ៉ាងហោចណាស់មុខវិជ្ជា 1!");
                if (window.triggerHaptic) window.triggerHaptic("warning");
                return;
            }
            
            SESSION.selectedSubjectId = activeIds[0];
            
            if (window.API && window.API.saveActiveSubjects) {
                const originalText = confirmBtn.innerHTML;
                confirmBtn.innerHTML = "រក្សាទុក... (Saving...)";
                confirmBtn.disabled = true;
                
                try {
                    await window.API.saveActiveSubjects(activeIds);
                    if (window.triggerHaptic) window.triggerHaptic("medium");
                    if (window.navigateToPage) window.navigateToPage("dashboard-page");
                } catch (e) {
                    confirmBtn.innerHTML = originalText;
                    confirmBtn.disabled = false;
                }
            } else {
                if (window.triggerHaptic) window.triggerHaptic("medium");
                if (window.navigateToPage) window.navigateToPage("dashboard-page");
            }
        });
    }
}
