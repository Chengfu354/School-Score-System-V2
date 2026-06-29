/*
=========================================
School Score System v2
score.js - Score Management & Data Entry
=========================================
*/

"use strict";

document.addEventListener("DOMContentLoaded", () => {
    initScoreModule();
});

function initScoreModule() {
    window.renderScorePage = renderScorePage;
}

function renderScorePage() {
    const container = $("score-page");
    if (!container) return;

    const month = localStorage.getItem(STORAGE.MONTH) || "Jan";
    const students = JSON.parse(localStorage.getItem(STORAGE.STUDENTS) || "[]");
    const scores = JSON.parse(localStorage.getItem(STORAGE.SCORES) || "{}");
    const monthScores = scores[month] || {};

    let html = `
        <header class="topbar">
            <h2>📝 Score Entry (${month})</h2>
        </header>

        <main class="content">
            <div class="card subject-selector-card">
                <label for="score-subject-select"><b>Select Subject:</b></label>
                <select id="score-subject-select" class="form-select">
    `;

    SUBJECT_GROUPS.forEach(group => {
        html += `<optgroup label="${group.title}">`;
        group.subjects.forEach(sub => {
            const selected = sub === SESSION.selectedSubject ? "selected" : "";
            html += `<option value="${sub}" ${selected}>${sub}</option>`;
        });
        html += `</optgroup>`;
    });

    html += `
                </select>
            </div>

            <div class="card sync-card">
                <div class="sync-info">
                    <span><b>Google Cloud Sync:</b></span>
                    <span id="sync-status-badge" class="badge badge-info">Local Ready</span>
                </div>
                <button id="sync-google-btn" class="btn btn-sm btn-secondary">
                    ☁️ Sync to Google Sheets
                </button>
            </div>

            <div class="card-header-flex">
                <h3>Students (${students.length})</h3>
                <button id="add-student-btn" class="btn btn-sm btn-primary">+ Add Student</button>
            </div>

            <div class="student-score-list">
    `;

    if (students.length === 0) {
        html += `<p class="empty-state">No students found. Click "+ Add Student" to start.</p>`;
    } else {
        students.forEach(s => {
            const currentSubScore = (monthScores[s.id] && monthScores[s.id][SESSION.selectedSubject] !== undefined)
                ? monthScores[s.id][SESSION.selectedSubject]
                : "";

            html += `
                <div class="student-score-card" data-student-id="${s.id}">
                    <div class="student-info">
                        <span class="avatar">${s.gender === 'F' ? '👧' : '👦'}</span>
                        <div>
                            <div class="student-name">${escapeHtml(s.name)}</div>
                            <div class="student-id-sub">${s.id}</div>
                        </div>
                    </div>
                    <div class="score-input-wrapper">
                        <input type="number" 
                               min="0" 
                               max="100" 
                               placeholder="0-100" 
                               class="score-input" 
                               data-student-id="${s.id}" 
                               value="${currentSubScore}">
                        <button class="btn-save-score" data-student-id="${s.id}">Save</button>
                    </div>
                </div>
            `;
        });
    }

    html += `
        </main>
    `;

    container.innerHTML = html;
    bindScorePageEvents();
}

function bindScorePageEvents() {
    const subjectSelect = $("score-subject-select");
    if (subjectSelect) {
        subjectSelect.addEventListener("change", (e) => {
            SESSION.selectedSubject = e.target.value;
            renderScorePage();
            triggerHaptic("light");
        });
    }

    const addBtn = $("add-student-btn");
    if (addBtn) {
        addBtn.addEventListener("click", promptAddStudent);
    }

    const syncBtn = $("sync-google-btn");
    if (syncBtn) {
        syncBtn.addEventListener("click", syncScoresToGoogle);
    }

    document.querySelectorAll(".score-input").forEach(input => {
        input.addEventListener("change", (e) => {
            const studentId = e.target.getAttribute("data-student-id");
            const val = parseFloat(e.target.value);
            saveStudentScore(studentId, SESSION.selectedSubject, isNaN(val) ? null : val);
        });
    });

    document.querySelectorAll(".btn-save-score").forEach(btn => {
        btn.addEventListener("click", async (e) => {
            const studentId = e.target.getAttribute("data-student-id");
            const input = document.querySelector(`.score-input[data-student-id="${studentId}"]`);
            if (input) {
                const val = parseFloat(input.value);
                saveStudentScore(studentId, SESSION.selectedSubject, isNaN(val) ? null : val);
                triggerHaptic("success");
                btn.textContent = "⏳ Syncing...";
                await syncStudentToGoogle(studentId);
                btn.textContent = "✓ Saved";
                setTimeout(() => btn.textContent = "Save", 2000);
            }
        });
    });
}

function saveStudentScore(studentId, subject, scoreVal) {
    const month = localStorage.getItem(STORAGE.MONTH) || "Jan";
    const scores = JSON.parse(localStorage.getItem(STORAGE.SCORES) || "{}");

    if (!scores[month]) scores[month] = {};
    if (!scores[month][studentId]) scores[month][studentId] = {};

    if (scoreVal === null || scoreVal === undefined) {
        delete scores[month][studentId][subject];
    } else {
        scores[month][studentId][subject] = Math.min(100, Math.max(0, scoreVal));
    }

    localStorage.setItem(STORAGE.SCORES, JSON.stringify(scores));
    if (window.renderDashboardOverview) window.renderDashboardOverview();
}

function promptAddStudent() {
    const name = prompt("Enter Student Full Name:");
    if (!name || !name.trim()) return;

    const gender = confirm("Click OK for Female (👧), Cancel for Male (👦)") ? "F" : "M";
    const students = JSON.parse(localStorage.getItem(STORAGE.STUDENTS) || "[]");
    const newId = "STU-" + String(students.length + 1).padStart(3, "0");

    students.push({ id: newId, name: name.trim(), gender: gender });
    localStorage.setItem(STORAGE.STUDENTS, JSON.stringify(students));
    renderScorePage();
    if (window.renderDashboardOverview) window.renderDashboardOverview();
    triggerHaptic("success");
}

async function syncStudentToGoogle(studentId) {
    const googleUrl = localStorage.getItem(STORAGE.GOOGLE_URL) || SESSION.googleUrl;
    if (!googleUrl) return;

    const month = localStorage.getItem(STORAGE.MONTH) || "Jan";
    const students = JSON.parse(localStorage.getItem(STORAGE.STUDENTS) || "[]");
    const scores = JSON.parse(localStorage.getItem(STORAGE.SCORES) || "{}");
    const studentObj = students.find(s => s.id === studentId);
    const studentScores = (scores[month] && scores[month][studentId]) ? scores[month][studentId] : {};

    // Map 21 subjects corresponding to Columns E through Y
    const allSubjects = [];
    SUBJECT_GROUPS.forEach(g => allSubjects.push(...g.subjects));
    const scoreArray = allSubjects.map(sub => (studentScores[sub] !== undefined && studentScores[sub] !== null) ? studentScores[sub] : "");

    const payload = {
        studentId: studentId,
        scores: scoreArray
    };

    try {
        const response = await fetch(googleUrl, {
            method: "POST",
            mode: "cors",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
        const resData = await response.json();

        if (resData.result === "success" && resData.calculated) {
            const c = resData.calculated;
            alert(`✨ Live Google Sheets Auto-Calculation ✨\n\n🎓 Student: ${studentObj ? studentObj.name : studentId}\n📊 Total (Col Z): ${c.totalScore}\n⭐ Avg (Col AA): ${c.average}\n🏆 Rank (Col AB): ${c.rank}\n🏅 Grade (Col AC): ${c.grade}`);
            triggerHaptic("success");
        }
    } catch (err) {
        console.error("Google Sync error:", err);
    }
}

async function syncScoresToGoogle() {
    const googleUrl = localStorage.getItem(STORAGE.GOOGLE_URL) || SESSION.googleUrl;
    const badge = $("sync-status-badge");

    if (!googleUrl) {
        alert("Please configure your Google Apps Script Web App URL in the Settings tab first!");
        showPage("settings-page");
        setActiveNavigation("nav-settings");
        return;
    }

    if (badge) {
        badge.className = "badge badge-warning";
        badge.textContent = "Syncing...";
    }

    const month = localStorage.getItem(STORAGE.MONTH) || "Jan";
    const students = JSON.parse(localStorage.getItem(STORAGE.STUDENTS) || "[]");
    const scores = JSON.parse(localStorage.getItem(STORAGE.SCORES) || "{}");

    const allSubjects = [];
    SUBJECT_GROUPS.forEach(g => allSubjects.push(...g.subjects));

    // Sync first student or loop through students
    if (students.length > 0) {
        await syncStudentToGoogle(students[0].id);
    }

    if (badge) {
        badge.className = "badge badge-success";
        badge.textContent = "Synced Live!";
    }
    triggerHaptic("success");
    alert("✅ Successfully synced scores to Google Sheets!");
}
