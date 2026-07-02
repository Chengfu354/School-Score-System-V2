/* =========================================
   School Score System v2
   config.js - Application Configuration & State
   ========================================= */

"use strict";

const APP = {
    NAME: "School Score System",
    VERSION: "2.6.0"
};

const STORAGE = {
    LOGIN: "sss_login",
    CONFIG: "sss_config",
    ACTIVE_SUBJECTS: "sss_active_subjects",
    STUDENTS: "sss_students",
    SCORES: "sss_scores",
    SUBJECTS: "sss_subjects",
    TG_BOT_TOKEN: "sss_tg_bot_token",
    TG_CHAT_ID: "sss_tg_chat_id"
};

const SESSION = {
    loggedIn: false,
    selectedSubjectId: null, // Will be subject id instead of name
    config: null,
    tgBotToken: "",
    tgChatId: ""
};

const ConfigManager = {
    load() {
        try {
            const raw = localStorage.getItem(STORAGE.CONFIG);
            if (raw) {
                SESSION.config = JSON.parse(raw);
                return SESSION.config;
            }
        } catch (e) {
            console.error("Failed to load config", e);
        }
        // Auto-seed empty configuration template
        const defaultConfig = {
            apiUrl: "",
            spreadsheetId: "",
            pin: "1234"
        };
        SESSION.config = defaultConfig;
        return defaultConfig;
    },

    save(apiUrl, spreadsheetId, pin) {
        const config = {
            apiUrl: apiUrl.trim(),
            spreadsheetId: spreadsheetId.trim(),
            pin: pin.trim() || "1234"
        };
        localStorage.setItem(STORAGE.CONFIG, JSON.stringify(config));
        SESSION.config = config;
        return config;
    },
    
    getApiUrl() {
        if (!SESSION.config) this.load();
        // Since we are interacting with GAS, the spreadsheet ID is typically embedded in the API or handled by GAS itself.
        // We will pass spreadsheetId as a parameter if needed, but usually GAS binds to the active spreadsheet. 
        // We'll append it to API calls.
        return SESSION.config ? SESSION.config.apiUrl : "";
    },
    
    getSpreadsheetId() {
        if (!SESSION.config) this.load();
        return SESSION.config ? SESSION.config.spreadsheetId : "";
    },
    
    getPin() {
        if (!SESSION.config) this.load();
        return SESSION.config ? SESSION.config.pin : "1234";
    },

    isValid() {
        this.load();
        return SESSION.config && SESSION.config.apiUrl && SESSION.config.pin;
    }
};