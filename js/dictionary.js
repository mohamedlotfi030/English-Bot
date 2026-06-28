"use strict";

/* ==========================================================
   LOCAL CACHE (FAST WORDS)
========================================================== */

const LOCAL_DB = {
    play: {
        arabic: "يلعب / مسرحية",
        definition: "Engage in activity for enjoyment or entertainment.",
        synonyms: ["game", "perform", "act"]
    },
    book: {
        arabic: "كتاب",
        definition: "A written or printed work consisting of pages.",
        synonyms: ["novel", "text", "volume"]
    },
    car: {
        arabic: "سيارة",
        definition: "A road vehicle with an engine.",
        synonyms: ["vehicle", "automobile", "auto"]
    },
    house: {
        arabic: "منزل",
        definition: "A building for human living.",
        synonyms: ["home", "residence", "dwelling"]
    },
    love: {
        arabic: "حب",
        definition: "An intense feeling of deep affection.",
        synonyms: ["affection", "passion", "adoration"]
    },
    school: {
        arabic: "مدرسة",
        definition: "An institution for education.",
        synonyms: ["academy", "institute", "college"]
    }
};

/* ==========================================================
   API FETCH (Fallback for unknown words)
========================================================== */

async function fetchFromAPI(word) {

    try {

        // English definition API
        const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        const data = await res.json();

        if (!Array.isArray(data)) return null;

        const meanings = data[0]?.meanings?.[0];

        return {
            definition: meanings?.definitions?.[0]?.definition || "",
            synonyms: meanings?.synonyms || []
        };

    } catch (e) {
        return null;
    }
}

/* ==========================================================
   MAIN TRANSLATION ENGINE
========================================================== */

async function getWordData(word) {

    const clean = word.toLowerCase().trim();

    // 1. Local first
    if (LOCAL_DB[clean]) {
        return {
            word: clean,
            arabic: LOCAL_DB[clean].arabic,
            definition: LOCAL_DB[clean].definition,
            synonyms: LOCAL_DB[clean].synonyms
        };
    }

    // 2. API fallback
    const apiData = await fetchFromAPI(clean);

    if (apiData) {
        return {
            word: clean,
            arabic: "لا توجد ترجمة جاهزة",
            definition: apiData.definition,
            synonyms: apiData.synonyms
        };
    }

    // 3. fallback
    return {
        word: clean,
        arabic: "لا توجد ترجمة",
        definition: "No definition found.",
        synonyms: []
    };
}

/* ==========================================================
   SEARCH FUNCTION
========================================================== */

async function searchWord() {

    const input = document.getElementById("dictionaryInput");
    const resultBox = document.getElementById("dictionaryResult");

    const word = input.value.trim();

    if (!word) {
        showToast("Enter a word", "error");
        return;
    }

    resultBox.innerHTML = `<p>Searching...</p>`;
    showLoader();

    const data = await getWordData(word);

    renderDictionary(data);

    hideLoader();
}

/* ==========================================================
   RENDER UI
========================================================== */

function renderDictionary(data) {

    const box = document.getElementById("dictionaryResult");

    box.innerHTML = `
        <div class="dictionary-card">

            <h2>${data.word}</h2>

            <p class="arabic">
                🇸🇦 ${data.arabic}
            </p>

            <p class="definition">
                📘 ${data.definition}
            </p>

            <div class="synonyms">
                <strong>Synonyms:</strong>
                ${data.synonyms.length ? data.synonyms.join(", ") : "None"}
            </div>

        </div>
    `;
}

/* ==========================================================
   ENTER SUPPORT
========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    const input = document.getElementById("dictionaryInput");

    if (input) {
        input.addEventListener("keydown", (e) => {
            if (e.key === "Enter") searchWord();
        });
    }
});
