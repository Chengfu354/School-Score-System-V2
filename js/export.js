/* =========================================
   School Score System v2.6
   export.js - Export & Grouped Subject Management Screen
   ========================================= */

"use strict";

window.renderExportPage = renderExportPage;

const SUBJECT_GROUPS_DEF = [
    {
        title: "ខ្មែរ",
        keywords: ["ស្ដាប់", "សរសេរ", "អាន", "និយាយ", "ខ្មែរ", "ភាសាខ្មែរ"]
    },
    {
        title: "គណិតវិទ្យា",
        keywords: ["ចំនួន", "រង្វាស់រង្វាល់", "ធរណីមាត្រ", "ពីជគណិត", "ស្ថិតិ", "គណិត", "គណិតវិទ្យា"]
    },
    {
        title: "វិទ្យាសាស្ត្រ",
        keywords: ["រូបវិទ្យា", "គីមីវិទ្យា", "ជីវវិទ្យា", "ផែនដី និងបរិស្ថាន", "ផែនដី-បរិស្ថាន", "ផែនដី", "បរិស្ថាន", "វិទ្យាសាស្ត្រ"]
    },
    {
        title: "សិក្សាសង្គម",
        keywords: ["សីលធម៌ និងពលរដ្ឋវិជ្ជា", "សីល-ពលរដ្ឋ", "សីលធម៌", "ពលរដ្ឋ", "ភូមិវិទ្យា", "ប្រវត្តិវិទ្យា", "អប់រំសិល្បៈ", "សិល្បៈ", "សង្គម"]
    },
    {
        title: "អប់រំកាយ និងសុខភាព",
        keywords: ["អប់រំកាយ", "សុខភាព", "កីឡា"]
    },
    {
        title: "បំណិនជីវិត",
        keywords: ["បំណិនជីវិត", "បំណិន"]
    },
    {
        title: "ភាសាបរទេស",
        keywords: ["ភាសាបរទេស", "អង់គ្លេស", "បារាំង", "English", "French"]
    }
];

function groupSubjects(allSubjects) {
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

    // Ensure all 7 defined groups are displayed cleanly even if no sub-subjects exist in sheet
    groups.forEach(g => {
        if (g.subjects.length === 0) {
            const fallbackId = (g.title === "បំណិនជីវិត" ? 24 : (g.title === "ភាសាបរទេស" ? 25 : "g_" + g.title));
            g.subjects.push({ id: fallbackId, name: g.title });
        }
    });

    const resultList = [...groups];
    if (otherGroup.subjects.length > 0) {
        resultList.push(otherGroup);
    }
    return resultList;
}

function renderExportPage() {
    const container = document.getElementById("export-page");
    if (!container) return;

    const allSubjects = JSON.parse(localStorage.getItem(STORAGE.SUBJECTS) || "[]");
    let activeIds = JSON.parse(localStorage.getItem(STORAGE.ACTIVE_SUBJECTS) || "[]");
    const currentConfig = ConfigManager.load() || {};
    const sheetId = currentConfig.spreadsheetId || "";

    let groupsHtml = "";
    const grouped = groupSubjects(allSubjects);
    grouped.forEach((group) => {
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
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; border-bottom: 1px solid var(--border-color); padding-bottom: 8px;">
                    <h3 class="khmer-text text-title" style="font-size: 16px; margin: 0; color: var(--primary-color);">
                        🔹 ${escapeHtml(group.title)}
                    </h3>
                </div>
                <div class="subject-pills" style="display: flex; flex-wrap: wrap; gap: 8px;">
                    ${pillsHtml}
                </div>
            </div>
        `;
    });

    const sheetLink = sheetId ? `https://docs.google.com/spreadsheets/d/${sheetId}/edit` : "#";

    container.innerHTML = `
        <header class="topbar">
            <div class="topbar-title text-title">📥 ទាញយក និងជ្រើសរើសមុខវិជ្ជា</div>
        </header>

        <main class="content">
            <div style="margin-bottom: 12px;">
                <h2 class="khmer-text text-title" style="font-size: 17px; font-weight: 700; margin-bottom: 4px;">📚 ជ្រើសរើសមុខវិជ្ជាសកម្ម (Active Subjects)</h2>
                <p class="khmer-text text-subtitle">រៀបចំជាក្រុមតាម Google Sheet (ចុចលើមុខវិជ្ជាដើម្បី បើក ឬ បិទ)៖</p>
            </div>

            <div id="export-grouped-subjects">
                ${groupsHtml}
            </div>

            <button id="export-save-subjects-btn" class="btn btn-primary full-width khmer-text text-normal" style="margin-bottom: 20px;">
                💾 រក្សាទុកការជ្រើសរើសមុខវិជ្ជា
            </button>

            <div class="card">
                <h3 class="khmer-text text-title" style="font-size: 16px;">📊 ទាញយកសន្លឹកកិច្ចការ (Spreadsheet / Excel)</h3>
                <p class="khmer-text text-subtitle" style="margin-top: 4px; margin-bottom: 14px;">
                    អ្នកអាចបើកមើល ឬ ទាញយកទិន្នន័យពិន្ទុ និងរបាយការណ៍សរុបផ្ទាល់ពី Google Sheets៖
                </p>
                ${sheetId ? `
                    <a href="${sheetLink}" target="_blank" class="btn btn-outline full-width khmer-text text-normal" style="text-decoration: none; display: inline-flex;">
                        🔗 បើកសន្លឹកកិច្ចការ Google Sheets
                    </a>
                ` : `
                    <p class="khmer-text text-muted text-sm">មិនទាន់មាន Spreadsheet ID នៅក្នុងការកំណត់នៅឡើយទេ។</p>
                `}
            </div>
        </main>
    `;

    bindExportPageEvents();
}

function bindExportPageEvents() {
    document.querySelectorAll("#export-grouped-subjects .subject-pill").forEach(pill => {
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

    const saveBtn = document.getElementById("export-save-subjects-btn");
    if (saveBtn) {
        saveBtn.addEventListener("click", async () => {
            const activeIds = JSON.parse(localStorage.getItem(STORAGE.ACTIVE_SUBJECTS) || "[]");
            if (activeIds.length === 0) {
                alert("⚠️ សូមជ្រើសរើសយ៉ាងហោចណាស់មុខវិជ្ជា 1!");
                if (window.triggerHaptic) window.triggerHaptic("warning");
                return;
            }

            const originalText = saveBtn.innerHTML;
            saveBtn.innerHTML = "កំពុងរក្សាទុក... ⏳";
            saveBtn.disabled = true;

            if (window.API && window.API.saveActiveSubjects) {
                try {
                    await window.API.saveActiveSubjects(activeIds);
                } catch (e) {
                    console.warn("Cloud sync error for active subjects:", e);
                }
            }

            saveBtn.innerHTML = originalText;
            saveBtn.disabled = false;
            if (window.triggerHaptic) window.triggerHaptic("success");
            
            const countStr = window.toKhmerNum ? window.toKhmerNum(activeIds.length) : activeIds.length;
            if (window.showToast) {
                window.showToast(`✅ បានរក្សាទុកចំនួន ${countStr} មុខវិជ្ជា!`, 1000);
            } else {
                alert(`✅ រក្សាទុកបាន ${countStr} មុខវិជ្ជា!`);
            }
        });
    }
}
