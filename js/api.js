/* =========================================
   School Score System v2
   api.js - Google Sheets Communication (Dynamic)
   ========================================= */

"use strict";

const API = {
    async request(action, method = "GET", payload = null, silentError = false) {
        if (!ConfigManager.isValid()) {
            if (!silentError) this.showError("Invalid Configuration", "សូមកំណត់រចនាសម្ព័ន្ធប្រព័ន្ធមុនពេលបន្ត។");
            throw new Error("Invalid Config");
        }
        
        let url = ConfigManager.getApiUrl();
        if (method === "GET") {
            url += `?action=${action}&t=${Date.now()}`;
        }
        
        try {
            const options = { method };
            if (payload && method === "POST") {
                options.body = JSON.stringify(payload);
            }
            
            const res = await fetch(url, options);
            if (!res.ok) throw new Error("Network response was not ok");
            
            const data = await res.json();
            if (data.result === "error") {
                if (!silentError) this.showError("Google Sheet Error", data.message || "Failed to process request on Google Sheet.");
                throw new Error(data.message);
            }
            
            return data;
        } catch (e) {
            console.error(`API Error (${action}):`, e);
            if (e.message !== "Invalid Config" && !silentError) {
                this.showError("API Offline", "មិនអាចភ្ជាប់ទៅកាន់ម៉ាស៊ីនមេបានទេ។ សូមពិនិត្យអ៊ីនធឺណិតរបស់អ្នក។");
            }
            throw e;
        }
    },

    async ping(silentError = false) {
        return await this.request("ping", "GET", null, silentError);
    },

    async getSubjects(silentError = false) {
        const data = await this.request("getSubjects", "GET", null, silentError);
        if (Array.isArray(data) && data.length > 0) {
            localStorage.setItem(STORAGE.SUBJECTS, JSON.stringify(data));
            const activeIds = data.filter(s => s && s.active !== false).map(s => s.id);
            if (activeIds.length > 0 && !localStorage.getItem(STORAGE.ACTIVE_SUBJECTS)) {
                localStorage.setItem(STORAGE.ACTIVE_SUBJECTS, JSON.stringify(activeIds));
            }
        }
        return data;
    },

    async getStudents(silentError = false) {
        const data = await this.request("getStudents", "GET", null, silentError);
        if (data && Array.isArray(data.students)) {
            localStorage.setItem(STORAGE.STUDENTS, JSON.stringify(data.students));
        }
        if (data && data.scores) {
            localStorage.setItem(STORAGE.SCORES, JSON.stringify(data.scores));
        }
        return data;
    },

    async saveScore(studentId, subjectId, score, oldScore, studentName, subjectName) {
        const payload = {
            action: "saveScore",
            studentId:   studentId,
            subjectId:   subjectId,
            score:       score,
            oldScore:    (oldScore !== undefined && oldScore !== "") ? oldScore : "-",
            studentName: studentName || "Unknown",
            subjectName: subjectName || ("Subject_" + subjectId),
            telegramUser: (SESSION.tgUser
                ? (SESSION.tgUser.first_name || "") + " " + (SESSION.tgUser.last_name || "")
                : "Unknown").trim()
        };

        try {
            // Fire-and-forget for optimistic UI — save happens in background
            fetch(ConfigManager.getApiUrl(), {
                method: "POST",
                body: JSON.stringify(payload)
            }).then(async (res) => {
                const data = await res.json();
                if (data.result === "error") {
                    this.showError("Save Failed", "បរាជ័យក្នុងការរក្សាទុកពិន្ទុ។");
                }
            }).catch(e => {
                console.error("Save score background error:", e);
            });
        } catch (e) {
            console.error("API Error: saveScore", e);
        }
    },


    async saveActiveSubjects(activeIds) {
        const payload = {
            action: "saveActiveSubjects",
            activeIds: activeIds,
            telegramUser: SESSION.tgUser || "Unknown"
        };
        try {
            await this.request("saveActiveSubjects", "POST", payload);
            localStorage.setItem(STORAGE.ACTIVE_SUBJECTS, JSON.stringify(activeIds));
        } catch (e) {
            console.error("API Error: saveActiveSubjects", e);
            this.showError("Save Failed", "មិនអាចរក្សាទុកការកំណត់មុខវិជ្ជាបានទេ។");
            throw e;
        }
    },
    
    showError(title, message) {
        const overlay = document.getElementById("global-error-overlay");
        const titleEl = document.getElementById("global-error-title");
        const msgEl = document.getElementById("global-error-msg");
        
        if (overlay && titleEl && msgEl) {
            titleEl.textContent = title;
            msgEl.textContent = message;
            overlay.classList.remove("hidden");
        } else {
            alert(title + ": " + message);
        }
    }
};

// Expose globally so all scripts can access via window.API
window.API = API;
