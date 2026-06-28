/* ==========================================================
   English-Bot
   ui.js
   Version 2.0
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

        sidebar: document.querySelector(".sidebar")

    };

    /* ======================================================
       Initialize
    ====================================================== */

    function init(){

        bindEvents();

        loadTheme();

        const settings = loadSettings();

        loadPage(

            settings.lastPage || "home"

        );

    }

    /* ======================================================
       Events
    ====================================================== */

    function bindEvents(){

        elements.navItems.forEach(item=>{

            item.addEventListener(

                "click",

                ()=>{

                    loadPage(

                        item.dataset.page

                    );

                }

            );

        });

        if(elements.themeBtn){

            elements.themeBtn.addEventListener(

                "click",

                toggleTheme

            );

        }

        if(elements.searchBtn){

            elements.searchBtn.addEventListener(

                "click",

                ()=>{

                    showToast(

                        "Global search will be added soon."

                    );

                }

            );

        }

    }

    /* ======================================================
       Theme
    ====================================================== */

    function toggleTheme(){

        document.body.classList.toggle(

            "light"

        );

        const settings = loadSettings();

        settings.theme =

            document.body.classList.contains(

                "light"

            )

            ? "light"

            : "dark";

        saveSettings(settings);

    }

    function loadTheme(){

        const settings = loadSettings();

        if(settings.theme === "light"){

            document.body.classList.add(

                "light"

            );

        }

    }
        /* ======================================================
       Router
    ====================================================== */

    function loadPage(page){

        currentPage = page;

        updateNavigation(page);

        updateTitle(page);

        saveCurrentPage(page);

        renderPage(page);

    }

    /* ======================================================
       Navigation
    ====================================================== */

    function updateNavigation(activePage){

        elements.navItems.forEach(item=>{

            item.classList.toggle(

                "active",

                item.dataset.page === activePage

            );

        });

    }

    /* ======================================================
       Page Title
    ====================================================== */

    function updateTitle(page){

        if(!elements.pageTitle){

            return;

        }

        const titles = {

            home:"Home",

            checker:"Grammar Checker",

            dictionary:"Dictionary",

            vocabulary:"Vocabulary",

            favorites:"Favorites",

            history:"History",

            settings:"Settings"

        };

        elements.pageTitle.textContent =

            titles[page] ||

            capitalize(page);

    }

    /* ======================================================
       Save Current Page
    ====================================================== */

    function saveCurrentPage(page){

        const settings = loadSettings();

        settings.lastPage = page;

        saveSettings(settings);

    }

    /* ======================================================
       Render Pages
    ====================================================== */

    function renderPage(page){

        switch(page){

            case "home":

                renderHomePage();

                break;

            case "checker":

                renderCheckerPage();

                break;

            case "dictionary":

                renderDictionaryPage();

                break;

            case "vocabulary":

                renderVocabularyPage();

                break;

            case "favorites":

                renderFavoritesPage();

                break;

            case "history":

                renderHistoryPage();

                break;

            case "settings":

                renderSettingsPage();

                break;

            default:

                renderNotFoundPage();

        }

    }
        /* ======================================================
       Home Page
    ====================================================== */

    function renderHomePage(){

        elements.content.innerHTML = `

            <section class="card hero">

                <h2>

                    Welcome to English-Bot 👋

                </h2>

                <p>

                    Your complete AI-powered English learning assistant.

                </p>

            </section>

            <section class="dashboard">

                <div class="card">

                    <i class="fa-solid fa-spell-check"></i>

                    <h3>Grammar Checker</h3>

                    <p>

                        Correct grammar and spelling mistakes.

                    </p>

                </div>

                <div class="card">

                    <i class="fa-solid fa-book"></i>

                    <h3>Dictionary</h3>

                    <p>

                        Definitions, pronunciation and examples.

                    </p>

                </div>

                <div class="card">

                    <i class="fa-solid fa-graduation-cap"></i>

                    <h3>Vocabulary</h3>

                    <p>

                        Learn advanced English words.

                    </p>

                </div>

                <div class="card">

                    <i class="fa-solid fa-chart-line"></i>

                    <h3>Progress</h3>

                    <p>

                        Track your English journey.

                    </p>

                </div>

            </section>

        `;

    }

    /* ======================================================
       Grammar Checker Page
    ====================================================== */

    function renderCheckerPage(){

        elements.content.innerHTML = `

            <section class="card">

                <h2>

                    Grammar Checker

                </h2>

                <textarea

                    id="userInput"

                    rows="8"

                    placeholder="Write your English sentence here...">

                </textarea>

                <br><br>

                <button

                    class="btn"

                    id="checkGrammarBtn">

                    Check Grammar

                </button>

                <br><br>

                <div

                    id="checkerResult"

                    class="hidden">

                </div>

            </section>

        `;

        const button = document.getElementById(

            "checkGrammarBtn"

        );

        if(button){

            button.addEventListener(

                "click",

                processText

            );

        }

    }

    /* ======================================================
       Dictionary Page
    ====================================================== */

    function renderDictionaryPage(){

        elements.content.innerHTML = `

            <section class="card">

                <h2>

                    Dictionary

                </h2>

                <input

                    id="dictionaryInput"

                    type="text"

                    placeholder="Enter an English word">

                <br><br>

                <button

                    class="btn"

                    id="dictionarySearchBtn">

                    Search

                </button>

                <br><br>

                <div

                    id="dictionaryResult"

                    class="hidden">

                </div>

            </section>

        `;

        const button = document.getElementById(

            "dictionarySearchBtn"

        );

        if(button){

            button.addEventListener(

                "click",

                searchWord

            );

        }

        initializeDictionary();

    }
        /* ======================================================
       Vocabulary Page
    ====================================================== */

    function renderVocabularyPage(){

        elements.content.innerHTML = `

            <section class="card">

                <h2>

                    Vocabulary

                </h2>

                <p>

                    This section will contain your vocabulary
                    lessons, flashcards and quizzes.

                </p>

                <div class="coming-soon">

                    🚧 Coming Soon

                </div>

            </section>

        `;

    }

    /* ======================================================
       Favorites Page
    ====================================================== */

    function renderFavoritesPage(){

        const favorites = getFavorites();

        let html = `

            <section class="card">

                <h2>

                    Favorite Words ❤️

                </h2>

        `;

        if(favorites.length === 0){

            html += `

                <p>

                    No favorite words yet.

                </p>

            `;

        }

        else{

            html += `

                <div class="word-list">

            `;

            favorites.forEach(word=>{

                html += `

                    <div class="word-chip">

                        ${escapeHtml(word)}

                    </div>

                `;

            });

            html += `

                </div>

            `;

        }

        html += `

            </section>

        `;

        elements.content.innerHTML = html;

    }

    /* ======================================================
       History Page
    ====================================================== */

    function renderHistoryPage(){

        const history = getHistory();

        let html = `

            <section class="card">

                <h2>

                    Grammar History

                </h2>

        `;

        if(history.length === 0){

            html += `

                <p>

                    No history available.

                </p>

            `;

        }

        else{

            history.forEach(item=>{

                html += `

                    <div class="history-item">

                        <p>

                            ${escapeHtml(item.text)}

                        </p>

                        <small>

                            ${formatDate(item.createdAt)}

                        </small>

                    </div>

                    <hr>

                `;

            });

        }

        html += `

            </section>

        `;

        elements.content.innerHTML = html;

    }

    /* ======================================================
       Settings Page
    ====================================================== */

    function renderSettingsPage(){

        const settings = loadSettings();

        elements.content.innerHTML = `

            <section class="card">

                <h2>

                    Settings

                </h2>

                <p>

                    Current Theme:

                    <strong>

                        ${capitalize(settings.theme)}

                    </strong>

                </p>

                <p>

                    Pronunciation:

                    <strong>

                        ${settings.pronunciation}

                    </strong>

                </p>

                <p>

                    Speech Rate:

                    <strong>

                        ${settings.speechRate}

                    </strong>

                </p>

            </section>

        `;

    }

    /* ======================================================
       Page Not Found
    ====================================================== */

    function renderNotFoundPage(){

        elements.content.innerHTML = `

            <section class="card">

                <h2>

                    404

                </h2>

                <p>

                    The requested page could not be found.

                </p>

            </section>

        `;

    }
        /* ======================================================
       Public API
    ====================================================== */

    return {

        init,

        loadPage,

        getCurrentPage(){

            return currentPage;

        }

    };

})();

/* ==========================================================
   Initialize UI
========================================================== */

document.addEventListener(

    "DOMContentLoaded",

    () => {

        UI.init();

    }

);

/* ==========================================================
   End of ui.js
========================================================== */