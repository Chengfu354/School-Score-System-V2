/* =========================================
   School Score System v2.6
   turbo-mode.js - Turbo Fast Input & Edit Controller
   ========================================= */

"use strict";

window.renderTurboModePage = renderTurboModePage;

let isTurboEditMode = false;

function renderTurboModePage() {
    const container = document.getElementById("turbo-mode-page");
    if (!container) return;

    const students = JSON.parse(localStorage.getItem(STORAGE.STUDENTS) || "[]");
    let activeIds = JSON.parse(localStorage.getItem(STORAGE.ACTIVE_SUBJECTS) || "[]");
    const allSubjects = JSON.parse(localStorage.getItem(STORAGE.SUBJECTS) || "[]");
    const scores = JSON.parse(localStorage.getItem(STORAGE.SCORES) || "{}");
    
    // If activeIds is empty, fallback to all active subjects from allSubjects
    if (activeIds.length === 0 && allSubjects.length > 0) {
        activeIds = allSubjects.filter(s => s.active !== false).map(s => s.id);
    }
    
    if (!SESSION.selectedSubjectId && activeIds.length > 0) {
        SESSION.selectedSubjectId = activeIds[0];
    }
    
    const selectedSubId = SESSION.selectedSubjectId;

    if (students.length === 0) {
        container.innerHTML = `<main class="content"><p class="khmer-text">មិនទាន់មានទិន្នន័យសិស្សនៅឡើយទេ។ (No students found)</p></main>`;
        return;
    }

    let subOptions = "";
    // Build options from activeIds, fallback to allSubjects if none match
    activeIds.forEach(id => {
        let sub = allSubjects.find(s => String(s.id) === String(id));
        if (!sub) {
            if (String(id) === "24" || id === 24) sub = { id: 24, name: "បំណិនជីវិត" };
            else if (String(id) === "25" || id === 25) sub = { id: 25, name: "ភាសាបរទេស" };
            else sub = { id: id, name: String(id) };
        }
        if (sub) {
            const sel = String(id) === String(selectedSubId) ? "selected" : "";
            subOptions += `<option value="${sub.id}" ${sel}>${escapeHtml(sub.name)}</option>`;
        }
    });

    if (!subOptions && allSubjects.length > 0) {
        allSubjects.forEach(sub => {
            const sel = String(sub.id) === String(selectedSubId) ? "selected" : "";
            subOptions += `<option value="${sub.id}" ${sel}>${escapeHtml(sub.name)}</option>`;
        });
    }

    let completed = 0;
    let listHtml = "";
    
    students.forEach((s, idx) => {
        const currentSubScore = (scores[s.id] && scores[s.id][selectedSubId] !== undefined && scores[s.id][selectedSubId] !== "" && scores[s.id][selectedSubId] !== null)
            ? scores[s.id][selectedSubId]
            : "";
            
        if (currentSubScore !== "") completed++;

        const seqNo = s.no ? s.no : (idx + 1);
        const readonlyAttr = isTurboEditMode ? "" : "readonly";

        listHtml += `
            <div class="student-score-card" style="padding: 10px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--border-color);">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <div style="font-weight: 700; width: 28px; color: var(--subtext-color); text-align: center;">${seqNo}.</div>
                    <div>
                        <div class="khmer-text" style="font-weight: 600; font-size: 15px;">${escapeHtml(s.name)}</div>
                    </div>
                </div>
                <div>
                    <input type="number" 
                           step="0.5"
                           min="0" 
                           max="100" 
                           class="score-input turbo-score-input" 
                           data-sid="${s.id}" 
                           data-idx="${idx}"
                           data-original="${currentSubScore}"
                           value="${currentSubScore}"
                           ${readonlyAttr}
                           style="width: 60px; text-align: center; padding: 6px; border-radius: 8px; border: 1px solid var(--border-color); font-weight: 700; font-size: 16px; ${!isTurboEditMode ? 'background: var(--bg-color); color: var(--text-color); cursor: default;' : 'background: var(--card-bg);'}">
                </div>
            </div>
        `;
    });

    const totalStudents = students.length;

    container.innerHTML = `
        <header class="topbar">
            <div class="topbar-title">🚀 Turbo Mode (បញ្ចូលពិន្ទុរហ័ស)</div>
            <div class="topbar-actions">
                <button class="topbar-btn khmer-text" id="turbo-close-btn">✖️ ចាកចេញ</button>
            </div>
        </header>

        <main class="content" style="position: relative;">
            <!-- FROZEN STICKY SUBJECT SELECTOR HEADER -->
            <div class="card" style="position: sticky; top: -16px; z-index: 20; margin-bottom: 14px; padding: 12px 16px; display: flex; justify-content: space-between; align-items: center; background: var(--card-bg); box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08); border-radius: var(--radius-lg);">
                <select id="turbo-subject-select" style="font-weight: 700; color: var(--primary-color); border: none; background: transparent; font-size: 16px; outline: none; flex: 1;" class="khmer-text">
                    ${subOptions}
                </select>
                <div style="font-weight: 700; font-size: 15px; color: ${completed === totalStudents ? 'var(--success-color)' : 'var(--text-color)'};">${completed}/${totalStudents}</div>
            </div>

            <div class="card" style="padding: 0;">
                <div class="student-score-list">
                    ${listHtml}
                </div>
            </div>

            <!-- FLOATING RIGHT-SIDE VIEW / EDIT BUTTON -->
            <button id="floating-turbo-edit-btn" class="btn ${isTurboEditMode ? 'btn-accent' : 'btn-primary'} khmer-text" style="position: fixed; right: 16px; bottom: 85px; z-index: 99; border-radius: 30px; padding: 12px 20px; box-shadow: 0 6px 20px rgba(37, 99, 235, 0.35); display: flex; align-items: center; gap: 6px; font-weight: 700;">
                ${isTurboEditMode ? '👁️ View (មើល)' : '✏️ Edit (កែប្រែ)'}
            </button>
        </main>
    `;

    bindTurboEvents();
}

function bindTurboEvents() {
    const exitBtn = document.getElementById("turbo-close-btn");
    if (exitBtn) {
        exitBtn.addEventListener("click", () => {
            isTurboEditMode = false;
            if (window.navigateToPage) window.navigateToPage("dashboard-page");
        });
    }

    const subSelect = document.getElementById("turbo-subject-select");
    if (subSelect) {
        subSelect.addEventListener("change", (e) => {
            const val = e.target.value;
            SESSION.selectedSubjectId = isNaN(val) ? val : parseInt(val);
            renderTurboModePage();
        });
    }

    const scrollContainer = document.querySelector("#turbo-mode-page .content");
    const floatingBtn = document.getElementById("floating-turbo-edit-btn");
    if (scrollContainer && floatingBtn) {
        let scrollTimeout;
        scrollContainer.addEventListener("scroll", () => {
            floatingBtn.style.transition = "opacity 0.3s ease, transform 0.3s ease";
            floatingBtn.style.opacity = "0";
            floatingBtn.style.pointerEvents = "none";
            floatingBtn.style.transform = "scale(0.8)";
            
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                floatingBtn.style.opacity = "1";
                floatingBtn.style.pointerEvents = "auto";
                floatingBtn.style.transform = "scale(1)";
            }, 3000);
        });
    }

    if (floatingBtn) {
        floatingBtn.addEventListener("click", () => {
            isTurboEditMode = !isTurboEditMode;
            if (window.triggerHaptic) window.triggerHaptic("medium");

            const inputs = document.querySelectorAll(".turbo-score-input");
            inputs.forEach(inp => {
                if (isTurboEditMode) {
                    inp.removeAttribute("readonly");
                    inp.style.background = "var(--card-bg)";
                } else {
                    inp.setAttribute("readonly", "true");
                    inp.style.background = "var(--bg-color)";
                }
            });

            if (isTurboEditMode) {
                floatingBtn.className = "btn btn-accent khmer-text";
                floatingBtn.innerHTML = "👁️ View (មើល)";
                // Focus first empty input or first input
                const inpArray = Array.from(inputs);
                let targetInput = inpArray.find(inp => inp.value === "");
                if (!targetInput && inpArray.length > 0) targetInput = inpArray[0];
                if (targetInput) {
                    targetInput.scrollIntoView({ behavior: "smooth", block: "center" });
                    targetInput.focus();
                }
            } else {
                floatingBtn.className = "btn btn-primary khmer-text";
                floatingBtn.innerHTML = "✏️ Edit (កែប្រែ)";
                if (document.activeElement) document.activeElement.blur();
            }
        });
    }

    // Attach Enter key logic and Blur logic for Auto Save
    const inputs = document.querySelectorAll(".turbo-score-input");
    inputs.forEach(input => {
        input.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                saveSingleScore(input);
                
                // Focus next
                const currentIdx = parseInt(input.getAttribute("data-idx"));
                const nextInput = document.querySelector(`.turbo-score-input[data-idx="${currentIdx + 1}"]`);
                if (nextInput) {
                    nextInput.scrollIntoView({ behavior: "smooth", block: "center" });
                    nextInput.focus();
                } else {
                    input.blur();
                    alert("🎉 បានដល់សិស្សចុងក្រោយហើយ!");
                    renderTurboModePage(); // Re-render to update progress
                }
            }
        });

        // Also save on blur if changed
        input.addEventListener("blur", () => {
            saveSingleScore(input);
        });
    });
}

function saveSingleScore(input) {
    const newVal = input.value;
    const oldVal = input.getAttribute("data-original");
    
    // If unchanged, do nothing
    if (newVal === oldVal) return;
    
    const sid = input.getAttribute("data-sid");
    const scores = JSON.parse(localStorage.getItem(STORAGE.SCORES) || "{}");
    
    if (!scores[sid]) scores[sid] = {};

    let parsedVal = parseFloat(newVal);
    if (isNaN(parsedVal) || newVal === "") {
        delete scores[sid][SESSION.selectedSubjectId];
        parsedVal = "";
    } else {
        parsedVal = Math.min(100, Math.max(0, parsedVal));
        scores[sid][SESSION.selectedSubjectId] = parsedVal;
    }
    
    input.value = parsedVal;
    input.setAttribute("data-original", parsedVal);
    localStorage.setItem(STORAGE.SCORES, JSON.stringify(scores));
    
    // Resolve names for audit log
    const students    = JSON.parse(localStorage.getItem(STORAGE.STUDENTS) || "[]");
    const allSubjects = JSON.parse(localStorage.getItem(STORAGE.SUBJECTS) || "[]");
    const student    = students.find(s => String(s.id) === String(sid));
    const subject    = allSubjects.find(s => String(s.id) === String(SESSION.selectedSubjectId));
    const studentName = student ? student.name : sid;
    const subjectName = subject ? subject.name : ("Subject_" + SESSION.selectedSubjectId);
    const oldScore    = (oldVal !== undefined && oldVal !== "") ? parseFloat(oldVal) : "";

    // Background sync to API
    if (window.API && window.API.saveScore) {
        window.API.saveScore(sid, SESSION.selectedSubjectId, parsedVal, oldScore, studentName, subjectName);
    }
}
