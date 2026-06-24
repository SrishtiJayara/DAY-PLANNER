# 🌌 Aero Life Planner

An elegant, premium glassmorphic productivity dashboard designed to organize your daily schedule, track habits, plan meals, manage shopping lists, and listen to focus music in one private place.

---

## ✨ Features

### 👥 Real-Time User Registry & Counter
* **Navbar Badge**: A live, synced badge displaying the total number of registered users.
* **Database-Driven**: Increments dynamically and strictly upon new user registration (no duplicate counts, no login/refresh increments).
* **Multi-Tab Synchronization**: Instantly syncs the live counter across multiple open browser tabs in real-time.

### 🗓️ Interactive Calendar & Upcoming Timeline
* **Month Grid**: View and interact with a full monthly grid. Click on any day to instantly schedule or assign due dates.
* **Timeline Feed**: Categorized lists showing tasks scheduled for *Today*, *Tomorrow*, and the *Next 7 Days*.

### 📋 Notion-Style Task Board
* **Tab Filters**: Filter tasks dynamically by category list (Work, Personal, Shopping, Health, Workout, Journal, etc.).
* **Flexible Sorting**: Sort tasks on-the-fly by Creation Date, Due Date, Priority, or Alphabetically.
* **Details Drawer**: Slide-out panel to edit titles, write descriptions, assign priorities, set times, and manage subtask check-lists.

### 🎵 Ambient Audio Player
* **Spotify Integration**: Embeds curated Spotify playlists directly into your dashboard.
* **Custom Music Streamer**: Search for focus tracks, lo-fi beats, or ambient sounds from public streaming presets and add them to your personal favorites library.

### 🥗 Habits, Groceries & Meal Planners
* **Habits Tracker**: Interactive checklists displaying a completion percentage progress bar.
* **Shopping List**: Quick-action checklists to manage items.
* **Meal Planner**: Daily inputs to record your breakfast, lunch, and snack ideas.

---

## 🛠️ Technology Stack

* **Frontend**: HTML5, Vanilla CSS3 (Custom Glassmorphism Variables)
* **Logic**: Vanilla JavaScript (ES6 Modules, Local Storage State Persistence)
* **Animations**: GSAP (GreenSock Animation Platform)
* **Bundler & Dev Server**: Vite

---

## 🚀 How to Run Locally

### 1. Install Dependencies
Ensure you have [Node.js](https://nodejs.org/) installed. Run the following command in the project root to install Vite:
```bash
npm install
```

### 2. Start Dev Server
Spin up the local developer server:
```bash
npm run dev
```
Open the local server URL (usually `http://localhost:5173`) in your web browser.

---

## 📦 Building for Production

To bundle, compile, and minify the assets into clean production-ready files:
```bash
npm run build
```
The output files will be compiled into the `dist/` directory, ready to be hosted on platforms like GitHub Pages, Vercel, or Netlify.

---

## 🔒 License
This project is fully protected under copyright. See the [LICENSE](LICENSE) file for usage terms.
