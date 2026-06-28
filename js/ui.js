/* ==========================================================
   English-Bot
   ui.js
   Version 2.1 (Final Fixed Build)
========================================================== */

"use strict";

/* ==========================================================
   UI Module
========================================================== */

const UI = (() => {

    let currentPage = "home";

    const elements = {

        content: document.getElementById("content"),
        pageTitle: document.getElementById("pageTitle"),

        navItems: document.querySelectorAll(".nav-item"),

        themeBtn: document.getElementById("themeBtn"),
        searchBtn: document.getElementById("searchBtn"),

        sidebar: document.querySelector(".sidebar"),

        // Mobile elements
        menuBtn: document.getElementById("menuBtn"),
        overlay: document.getElementById("overlay")

    };

    /* ======================================================
       INIT
    ====================================================== */

    function init() {
        bindEvents();
        loadTheme();

        const settings = loadSettings();
        loadPage(settings.lastPage || "home");
    }

    /* ======================================================
       EVENTS
    ====================================================== */

    function bindEvents() {

        // Navigation
        elements.navItems.forEach(item => {
            item.addEventListener("click", () => {
                loadPage(item.dataset.page);
            });
        });

        // Theme
        elements.themeBtn?.addEventListener("click", toggleTheme);

        // Search
        elements.searchBtn?.addEventListener("click", () => {
            showToast("Global search will be added soon.");
        });

        // Mobile sidebar toggle
        elements.menuBtn?.addEventListener("click", toggleSidebar);
        elements.overlay?.addEventListener("click", closeSidebar);
    }

    /* ======================================================
       SIDEBAR (MOBILE FIX)
    ====================================================== */

    function toggleSidebar() {
        elements.sidebar?.classList.toggle("active");
        elements.overlay?.classList.toggle("active");
    }

    function closeSidebar() {
        elements.sidebar?.classList.remove("active");
        elements.overlay?.classList.remove("active");
    }

    /* ======================================================
       THEME
    ====================================================== */

    function toggleTheme() {

        document.body.classList.toggle("light");

        const settings = loadSettings();

        settings.theme = document.body.classList.contains("light")
            ? "light"
            : "dark";

        saveSettings(settings);
    }

    function loadTheme() {

        const settings = loadSettings();

        if (settings.theme === "light") {
            document.body.classList.add("light");
        }
    }

    /* ======================================================
       ROUTER
    ====================================================== */

    function loadPage(page) {

        currentPage = page;

        updateNavigation(page);
        updateTitle(page);

        saveCurrentPage(page);
        renderPage(page);

        // close sidebar on navigation (mobile UX fix)
        closeSidebar();
    }

    /* ======================================================
       NAVIGATION
    ====================================================== */

    function updateNavigation(activePage) {

        elements.navItems.forEach(item => {
            item.classList.toggle(
                "active",
                item.dataset.page === activePage
            );
        });

    }

    /* ======================================================
       TITLE
    ====================================================== */

    function updateTitle(page) {

        if (!elements.pageTitle) return;

        const titles = {
            home: "Home",
            checker: "Grammar Checker",
            dictionary: "Dictionary",
            vocabulary: "Vocabulary",
            favorites: "Favorites",
            history: "History",
            settings: "Settings"
        };

        elements.pageTitle.textContent =
            titles[page] || capitalize(page);
    }

    /* ======================================================
       SAVE STATE
    ====================================================== */

    function saveCurrentPage(page) {
        const settings = loadSettings();
        settings.lastPage = page;
        saveSettings(settings);
    }

    /* ======================================================
       RENDER CONTROLLER
    ====================================================== */

    function renderPage(page) {

        switch (page) {

            case "home": renderHomePage(); break;
            case "checker": renderCheckerPage(); break;
            case "dictionary": renderDictionaryPage(); break;
            case "vocabulary": renderVocabularyPage(); break;
            case "favorites": renderFavoritesPage(); break;
            case "history": renderHistoryPage(); break;
            case "settings": renderSettingsPage(); break;

            default: renderNotFoundPage();
        }
    }
    /* ======================================================
       HOME PAGE (FIXED INTERACTIVE CARDS)
====================================================== */

    function renderHomePage() {

        elements.content.innerHTML = `
            <section class="card hero">
                <h2>Welcome to English-Bot 👋</h2>
                <p>Your complete AI-powered English learning assistant.</p>
            </section>

            <section class="dashboard">

                <div class="card" data-page="checker">
                    <i class="fa-solid fa-spell-check"></i>
                    <h3>Grammar Checker</h3>
                </div>

                <div class="card" data-page="dictionary">
                    <i class="fa-solid fa-book"></i>
                    <h3>Dictionary</h3>
                </div>

                <div class="card" data-page="vocabulary">
                    <i class="fa-solid fa-graduation-cap"></i>
                    <h3>Vocabulary</h3>
                </div>

                <div class="card" data-page="history">
                    <i class="fa-solid fa-chart-line"></i>
                    <h3>Progress</h3>
                </div>

            </section>
        `;

        setupHomeCards();
    }

    /* ======================================================
       HOME CARDS SYSTEM
    ====================================================== */

    function setupHomeCards() {

        const cards = elements.content.querySelectorAll(".card[data-page]");

        cards.forEach(card => {

            card.addEventListener("click", () => {

                const page = card.dataset.page;

                if (page) {
                    loadPage(page);
                }

            });

        });
    }

    /* ======================================================
       OTHER PAGES
    ====================================================== */

    function renderCheckerPage() {

        elements.content.innerHTML = `
            <section class="card">
                <h2>Grammar Checker</h2>

                <textarea id="userInput" rows="8"
                    placeholder="Write your English sentence here..."></textarea>

                <br><br>

                <button class="btn" id="checkGrammarBtn">
                    Check Grammar
                </button>

                <div id="checkerResult" class="hidden"></div>
            </section>
        `;

        document.getElementById("checkGrammarBtn")
            ?.addEventListener("click", processText);
    }

    function renderDictionaryPage() {

        elements.content.innerHTML = `
            <section class="card">
                <h2>Dictionary</h2>

                <input id="dictionaryInput" type="text"
                    placeholder="Enter an English word">

                <br><br>

                <button class="btn" id="dictionarySearchBtn">
                    Search
                </button>

                <div id="dictionaryResult" class="hidden"></div>
            </section>
        `;

        document.getElementById("dictionarySearchBtn")
            ?.addEventListener("click", searchWord);

        initializeDictionary();
    }

    function renderVocabularyPage() {
        elements.content.innerHTML = `
            <section class="card">
                <h2>Vocabulary</h2>
                <p>Coming Soon 🚧</p>
            </section>
        `;
    }

    function renderFavoritesPage() {

        const favorites = getFavorites();

        let html = `<section class="card"><h2>Favorites ❤️</h2>`;

        if (!favorites.length) {
            html += `<p>No favorites yet.</p>`;
        } else {
            html += `<div class="word-list">`;
            favorites.forEach(w => {
                html += `<div class="word-chip">${escapeHtml(w)}</div>`;
            });
            html += `</div>`;
        }

        html += `</section>`;
        elements.content.innerHTML = html;
    }

    function renderHistoryPage() {

        const history = getHistory();

        let html = `<section class="card"><h2>History</h2>`;

        if (!history.length) {
            html += `<p>No history available.</p>`;
        } else {
            history.forEach(item => {
                html += `
                    <div class="history-item">
                        <p>${escapeHtml(item.text)}</p>
                        <small>${formatDate(item.createdAt)}</small>
                    </div>
                    <hr>
                `;
            });
        }

        html += `</section>`;
        elements.content.innerHTML = html;
    }

    function renderSettingsPage() {

        const settings = loadSettings();

        elements.content.innerHTML = `
            <section class="card">
                <h2>Settings</h2>

                <p>Theme: <strong>${capitalize(settings.theme)}</strong></p>
                <p>Pronunciation: <strong>${settings.pronunciation}</strong></p>
                <p>Speech Rate: <strong>${settings.speechRate}</strong></p>
            </section>
        `;
    }

    function renderNotFoundPage() {
        elements.content.innerHTML = `
            <section class="card">
                <h2>404</h2>
                <p>Page not found.</p>
            </section>
        `;
    }

    /* ======================================================
       EXPORT
    ====================================================== */

    return {
        init,
        loadPage,
        getCurrentPage() {
            return currentPage;
        }
    };

})();

/* ==========================================================
   BOOTSTRAP
========================================================== */

document.addEventListener("DOMContentLoaded", () => {
    UI.init();
});
