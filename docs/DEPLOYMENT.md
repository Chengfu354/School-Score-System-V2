# Production Deployment Guide - School Score System V2

Follow this comprehensive deployment guide to set up your Telegram Mini App and Google Apps Script Cloud Backend.

---

## Step 1: Deploy Google Apps Script (Backend)
1. Open your target Google Sheet.
2. Go to **Extensions** ➔ **Apps Script**.
3. Copy and paste the complete content of `gas/Code.gs` into your `Code.gs` script file in the editor.
4. Click **Deploy** ➔ **New deployment**.
5. Select type: **Web app**.
6. Configuration settings:
   - **Description**: `School Score System V2 API`
   - **Execute as**: `Me`
   - **Who has access**: `Anyone` (CRITICAL for Telegram WebApp access without authentication blocks)
7. Click **Deploy**, authorize permissions, and copy the generated **Web App URL** (ends with `/exec`).

---

## Step 2: Configure Telegram Bot Father
1. Open Telegram and search for `@BotFather`.
2. Send command `/newbot` and follow instructions to name your bot (e.g. `SchoolScoreBot`).
3. Copy your **HTTP API Bot Token** (e.g. `6109639827:AA...`).
4. Enable Web App mode:
   - Send `/newapp` to `@BotFather`.
   - Select your bot.
   - Enter title and description.
   - Upload a square icon image.
   - Enter your hosted Web App URL (e.g., GitHub Pages URL or Vercel URL).
   - Set short name for the WebApp link (e.g., `app`).

---

## Step 3: Hosting Frontend App
1. You can host the root directory of this project (`index.html`, `css/`, `js/`) on any HTTPS static web host such as **GitHub Pages**, **Vercel**, or **Netlify**.
2. Example via GitHub Pages:
   - Push repository code to GitHub.
   - Navigate to Repository **Settings** ➔ **Pages**.
   - Select `main` branch and `/root` directory.
   - Save and retrieve your published HTTPS WebApp URL.

---

## Step 4: Final In-App Configuration
1. Open your Telegram Mini App or Web App URL in browser.
2. Enter PIN `1234` to log in.
3. Navigate to **Settings** (⚙️).
4. Paste your **Google Apps Script Web App URL** and **Telegram Bot Token**.
5. Click **Save Settings** (💾 រក្សាទុកការកំណត់).
6. Your system is now production ready! 🎉
