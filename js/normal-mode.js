/* =========================================
   School Score System v2.6
   normal-mode.js - Normal Scoring Mode (Spreadsheet)
   ========================================= */

"use strict";

window.renderNormalModePage = renderNormalModePage;

let isNormalEditMode = false;
let normalSortByRank = false;

function renderNormalModePage() {
    const container = document.getElementById("normal-mode-page");
    if (!container) return;

    // Save scroll position before rendering to prevent jumping back to left (gender column)
    const scrollContainer = document.getElementById("spreadsheet-container");
    const savedScrollLeft = scrollContainer ? scrollContainer.scrollLeft : 0;
    const savedScrollTop = scrollContainer ? scrollContainer.scrollTop : 0;

    const students = JSON.parse(localStorage.getItem(STORAGE.STUDENTS) || "[]");
    const scores = JSON.parse(localStorage.getItem(STORAGE.SCORES) || "{}");
    const activeIds = JSON.parse(localStorage.getItem(STORAGE.ACTIVE_SUBJECTS) || "[]");
    const allSubjects = JSON.parse(localStorage.getItem(STORAGE.SUBJECTS) || "[]");

    let theadHtml = `<tr style="height: 58px;">
        <th style="min-width: 45px; position: sticky; left: 0; background: var(--card-bg); z-index: 4; top: 0; text-align: left; font-size: 13.5px; padding: 10px 8px;">ល.រ</th>
        <th style="min-width: 130px; position: sticky; left: 45px; background: var(--card-bg); z-index: 4; top: 0; text-align: left; font-size: 13.5px; padding: 10px 8px;">ឈ្មោះ</th>
        <th style="min-width: 55px; position: sticky; top: 0; background: var(--card-bg); z-index: 2; text-align: left; font-size: 13.5px; padding: 10px 8px;">ភេទ</th>
    `;
    activeIds.forEach(id => {
        let sub = allSubjects.find(s => String(s.id) === String(id));
        if (!sub) {
            if (String(id) === "24" || id === 24) sub = { id: 24, name: "បំណិនជីវិត" };
            else if (String(id) === "25" || id === 25) sub = { id: 25, name: "ភាសាបរទេស" };
            else sub = { id: id, name: String(id) };
        }
        if (sub) {
            theadHtml += `<th style="min-width: 75px; position: sticky; top: 0; background: var(--card-bg); z-index: 2; text-align: left; font-size: 13.5px; padding: 10px 8px;">${escapeHtml(sub.name)}</th>`;
        }
    });
    theadHtml += `
        <th style="min-width: 85px; position: sticky; top: 0; background: var(--card-bg); z-index: 2; text-align: left; color: var(--primary-color); font-size: 13.5px; padding: 10px 8px;">ពិន្ទុសរុប</th>
        <th style="min-width: 85px; position: sticky; top: 0; background: var(--card-bg); z-index: 2; text-align: left; color: var(--primary-color); font-size: 13.5px; padding: 10px 8px;">មធ្យមភាគ</th>
        <th id="th-sort-rank" style="min-width: 70px; position: sticky; top: 0; background: var(--card-bg); z-index: 4; text-align: left; cursor: pointer; user-select: none; color: var(--primary-color); font-size: 13.5px; padding: 10px 8px; line-height: 1.2;">
            ចំណាត់ថ្នាក់<br><span style="font-size: 10px; opacity: 0.8;">${normalSortByRank ? "▲" : "⬍"}</span>
        </th>
        <th style="min-width: 70px; position: sticky; top: 0; background: var(--card-bg); z-index: 2; text-align: left; font-size: 13.5px; padding: 10px 8px;">និទ្ទេស</th>
    </tr>`;

    // Sort students by rank if active
    let displayStudents = [...students];
    if (normalSortByRank) {
        displayStudents.sort((a, b) => {
            const rA = parseInt(a.rank) || 9999;
            const rB = parseInt(b.rank) || 9999;
            return rA - rB;
        });
    }

    let tbodyHtml = "";
    displayStudents.forEach((s, rowIdx) => {
        // Serial numbers remain sequential (1 to 36) in visual order, as requested
        const seqNo = rowIdx + 1;
        const readonlyAttr = isNormalEditMode ? "" : "readonly";
        const studentScores = scores[s.id] || {};

        let activeTotal = 0;
        let activeCount = 0;
        activeIds.forEach(id => {
            const val = parseFloat(studentScores[id]);
            if (!isNaN(val)) {
                activeTotal += val;
                activeCount++;
            }
        });

        const displayTotal = activeCount > 0 ? activeTotal : (s.total || 0);
        const displayAvg = activeCount > 0 ? (activeTotal / activeCount).toFixed(2) : (s.average || 0);

        const r = parseInt(s.rank) || 0;
        let rankClass = "rank-badge";
        if (r === 1) rankClass += " rank-1";
        else if (r === 2) rankClass += " rank-2";
        else if (r === 3) rankClass += " rank-3";

        const gradeClass = (s.grade === "F" || s.grade === "E" || s.grade === "ធ្លាក់") ? "grade-fail" : "grade-pass";

        tbodyHtml += `<tr>
            <td style="position: sticky; left: 0; background: var(--card-bg); z-index: 2; text-align: left; font-weight: 600; font-size: 13.5px; padding: 10px 8px;">${seqNo}</td>
            <td style="position: sticky; left: 45px; background: var(--card-bg); z-index: 2; text-align: left; font-size: 13.5px; padding: 10px 8px;" class="khmer-text">${escapeHtml(s.name)}</td>
            <td class="khmer-text" style="font-size: 13.5px; text-align: left; padding: 10px 8px;">${escapeHtml(s.gender || '-')}</td>
        `;
        activeIds.forEach((id, colIdx) => {
            const currentSubScore = (studentScores[id] !== undefined && studentScores[id] !== "" && studentScores[id] !== null)
                ? studentScores[id]
                : "";

            tbodyHtml += `
                <td style="padding: 6px 4px;">
                    <input type="number" 
                           step="0.5" min="0" max="100" 
                           class="score-input normal-score-input" 
                           data-sid="${s.id}" 
                           data-sub-id="${id}"
                           data-row="${rowIdx}"
                           data-col="${colIdx}"
                           data-original="${currentSubScore}"
                           value="${currentSubScore}"
                           ${readonlyAttr}
                           style="width: 100%; text-align: left; padding-left: 4px; border: 1px solid transparent; background: transparent; font-weight: 600; font-size: 13.5px; ${!isNormalEditMode ? 'cursor: default;' : ''}">
                </td>
            `;
        });

        // 4 Read-Only Result Columns (Ensure left-align matching request)
        tbodyHtml += `
            <td id="total-${s.id}" style="background: var(--bg-color); font-weight: 700; color: var(--primary-color); text-align: left; font-size: 13.5px; padding: 10px 8px;"><b>${displayTotal}</b></td>
            <td id="avg-${s.id}" style="background: var(--bg-color); font-weight: 600; text-align: left; font-size: 13.5px; padding: 10px 8px;">${displayAvg}</td>
            <td id="rank-${s.id}" style="background: var(--bg-color); text-align: left; vertical-align: middle; padding: 10px 8px;">
                <span class="${rankClass}" style="margin: 0; display: inline-flex; align-items: center; justify-content: center;">${s.rank || '-'}</span>
            </td>
            <td id="grade-${s.id}" style="background: var(--bg-color); text-align: left; padding: 10px 8px;"><span class="badge ${gradeClass}">${s.grade || '-'}</span></td>
        </tr>`;
    });

    container.innerHTML = `
        <header class="topbar">
            <div class="topbar-title">📝 Normal Mode (តារាងពិន្ទុ)</div>
            <div class="topbar-actions">
                <button class="topbar-btn khmer-text" id="normal-exit-btn">✖️ ចាកចេញ</button>
            </div>
        </header>

        <main class="content" style="padding: 0; display: flex; flex-direction: column; position: relative;">
            <div style="padding: 12px; background: var(--bg-color); border-bottom: 1px solid var(--border-color);">
                <div class="khmer-text" style="font-size: 12px;">បញ្ចូលពិន្ទុ រួចចុច Enter។ ទិន្នន័យរក្សាទុកដោយស្វ័យប្រវត្តិ។</div>
            </div>
            
            <div style="flex: 1; overflow: auto; position: relative; padding-bottom: 100px;" id="spreadsheet-container">
                <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 100px;" class="spreadsheet-table">
                    <thead>
                        ${theadHtml}
                    </thead>
                    <tbody>
                        ${tbodyHtml}
                    </tbody>
                </table>
            </div>

            <!-- FLOATING RIGHT-SIDE VIEW / EDIT BUTTON -->
            <button id="floating-normal-edit-btn" class="btn ${isNormalEditMode ? 'btn-accent' : 'btn-primary'} khmer-text" style="position: fixed; right: 16px; bottom: 85px; z-index: 99; border-radius: 30px; padding: 12px 20px; box-shadow: 0 6px 20px rgba(37, 99, 235, 0.35); display: flex; align-items: center; gap: 6px; font-weight: 700;">
                ${isNormalEditMode ? '👁️ View (មើល)' : '✏️ Edit (កែប្រែ)'}
            </button>
        </main>
    `;

    bindNormalModeEvents();

    // Restore scroll position after innerHTML update to prevent jumping back to left (gender column)
    const newScrollContainer = document.getElementById("spreadsheet-container");
    if (newScrollContainer) {
        newScrollContainer.scrollLeft = savedScrollLeft;
        newScrollContainer.scrollTop = savedScrollTop;
    }
}

function bindNormalModeEvents() {
    const exitBtn = document.getElementById("normal-exit-btn");
    if (exitBtn) {
        exitBtn.addEventListener("click", () => {
            isNormalEditMode = false;
            normalSortByRank = false;
            if (window.navigateToPage) window.navigateToPage("dashboard-page");
        });
    }

    const sortRankHeader = document.getElementById("th-sort-rank");
    if (sortRankHeader) {
        sortRankHeader.addEventListener("click", () => {
            normalSortByRank = !normalSortByRank;
            if (window.triggerHaptic) window.triggerHaptic("medium");
            renderNormalModePage();
        });
    }

    // Scroll listener to hide Edit floating button during scrolling and show it after 3s
    const scrollContainer = document.getElementById("spreadsheet-container");
    const floatingBtn = document.getElementById("floating-normal-edit-btn");
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
            isNormalEditMode = !isNormalEditMode;
            if (window.triggerHaptic) window.triggerHaptic("medium");

            const inputs = document.querySelectorAll(".normal-score-input");
            inputs.forEach(inp => {
                if (isNormalEditMode) {
                    inp.removeAttribute("readonly");
                    inp.style.cursor = "text";
                } else {
                    inp.setAttribute("readonly", "true");
                    inp.style.cursor = "default";
                }
            });

            if (isNormalEditMode) {
                floatingBtn.className = "btn btn-accent khmer-text";
                floatingBtn.innerHTML = "👁️ View (មើល)";
                const firstInput = document.querySelector(".normal-score-input");
                if (firstInput) firstInput.focus();
            } else {
                floatingBtn.className = "btn btn-primary khmer-text";
                floatingBtn.innerHTML = "✏️ Edit (កែប្រែ)";
                if (document.activeElement) document.activeElement.blur();
            }
        });
    }

    const inputs = document.querySelectorAll("#normal-mode-page .normal-score-input");
    inputs.forEach(input => {
        // Highlighting
        input.addEventListener("focus", (e) => {
            if (isNormalEditMode) {
                e.target.style.border = "1px solid var(--primary-color)";
                e.target.style.background = "var(--primary-light)";
            }
        });
        
        input.addEventListener("blur", (e) => {
            e.target.style.border = "1px solid transparent";
            e.target.style.background = "transparent";
            saveNormalScore(input);
        });

        // Navigation
        input.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === "ArrowDown") {
                e.preventDefault();
                saveNormalScore(input);
                const row = parseInt(input.getAttribute("data-row"));
                const col = parseInt(input.getAttribute("data-col"));
                const nextInput = document.querySelector(`.normal-score-input[data-row="${row + 1}"][data-col="${col}"]`);
                if (nextInput) {
                    nextInput.focus();
                } else if (e.key === "Enter") {
                    input.blur();
                }
            } else if (e.key === "ArrowUp") {
                e.preventDefault();
                saveNormalScore(input);
                const row = parseInt(input.getAttribute("data-row"));
                const col = parseInt(input.getAttribute("data-col"));
                const prevInput = document.querySelector(`.normal-score-input[data-row="${row - 1}"][data-col="${col}"]`);
                if (prevInput) prevInput.focus();
            } else if (e.key === "ArrowRight") {
                e.preventDefault();
                saveNormalScore(input);
                const row = parseInt(input.getAttribute("data-row"));
                const col = parseInt(input.getAttribute("data-col"));
                const nextInput = document.querySelector(`.normal-score-input[data-row="${row}"][data-col="${col + 1}"]`);
                if (nextInput) nextInput.focus();
            } else if (e.key === "ArrowLeft") {
                e.preventDefault();
                saveNormalScore(input);
                const row = parseInt(input.getAttribute("data-row"));
                const col = parseInt(input.getAttribute("data-col"));
                const nextInput = document.querySelector(`.normal-score-input[data-row="${row}"][data-col="${col - 1}"]`);
                if (nextInput) nextInput.focus();
            }
        });
    });
}

function saveNormalScore(input) {
    const newVal = input.value;
    const oldVal = input.getAttribute("data-original");
    
    // If unchanged, do nothing
    if (newVal === oldVal) return;
    
    const sid   = input.getAttribute("data-sid");
    const subId = isNaN(input.getAttribute("data-sub-id")) ? input.getAttribute("data-sub-id") : parseInt(input.getAttribute("data-sub-id"));
    const scores = JSON.parse(localStorage.getItem(STORAGE.SCORES) || "{}");
    
    if (!scores[sid]) scores[sid] = {};

    let parsedVal = parseFloat(newVal);
    if (isNaN(parsedVal) || newVal === "") {
        delete scores[sid][subId];
        parsedVal = "";
    } else {
        parsedVal = Math.min(100, Math.max(0, parsedVal));
        scores[sid][subId] = parsedVal;
    }
    
    input.value = parsedVal;
    input.setAttribute("data-original", parsedVal);
    localStorage.setItem(STORAGE.SCORES, JSON.stringify(scores));
    
    // Update live Total & Avg cells for this student row
    const activeIds = JSON.parse(localStorage.getItem(STORAGE.ACTIVE_SUBJECTS) || "[]");
    const studentScores = scores[sid] || {};
    let activeTotal = 0;
    let activeCount = 0;
    activeIds.forEach(id => {
        const v = parseFloat(studentScores[id]);
        if (!isNaN(v)) {
            activeTotal += v;
            activeCount++;
        }
    });
    const totalEl = document.getElementById(`total-${sid}`);
    const avgEl = document.getElementById(`avg-${sid}`);
    if (totalEl) totalEl.innerHTML = `<b>${activeTotal}</b>`;
    if (avgEl) avgEl.textContent = activeCount > 0 ? (activeTotal / activeCount).toFixed(2) : "0";

    // Resolve names for audit log
    const students    = JSON.parse(localStorage.getItem(STORAGE.STUDENTS) || "[]");
    const allSubjects = JSON.parse(localStorage.getItem(STORAGE.SUBJECTS) || "[]");
    const student    = students.find(s => String(s.id) === String(sid));
    let subject      = allSubjects.find(s => String(s.id) === String(subId));
    if (!subject) {
        if (String(subId) === "24") subject = { id: 24, name: "បំណិនជីវិត" };
        else if (String(subId) === "25") subject = { id: 25, name: "ភាសាបរទេស" };
    }
    const studentName = student ? student.name : sid;
    const subjectName = subject ? subject.name : ("Subject_" + subId);
    const oldScore    = (oldVal !== undefined && oldVal !== "") ? parseFloat(oldVal) : "";

    // Background sync to API
    if (window.API && window.API.saveScore) {
        window.API.saveScore(sid, subId, parsedVal, oldScore, studentName, subjectName);
    }
}
