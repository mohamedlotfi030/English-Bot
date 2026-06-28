/* ==========================================================
   English-Bot
   dictionary.js
   ULTIMATE FIX - No Cache + Always Fresh + Arabic Stable
========================================================== */

"use strict";

/* ==========================================================
   Arabic Translation Engine
========================================================== */

function getArabicTranslation(word) {

    if (!word) return "لا توجد ترجمة";

    const clean = String(word).toLowerCase().trim();

    const map = {

        play: "يلعب / مسرحية / لعب",
        book: "كتاب",
        car: "سيارة",
        house: "منزل",
        computer: "حاسوب",
        water: "ماء",
        love: "حب",
        school: "مدرسة",
        teacher: "معلم",
        student: "طالب"

    };

    return map[clean] || "لا توجد ترجمة";
}

/* ==========================================================
   SEARCH WORD (ULTIMATE FIX)
========================================================== */

async function searchWord() {

    const input = document.getElementById("dictionaryInput");
    const resultBox = document.getElementById("dictionaryResult");

    if (!input || !resultBox) return;

    // 🔥 ALWAYS FRESH VALUE
    const word = String(input.value || "").trim();

    if (!word) {
        showToast("Please enter a word.", "error");
        return;
    }

    // 🔥 HARD RESET UI (prevent stale render)
    resultBox.innerHTML = "";
    resultBox.classList.remove("hidden");

    showLoader();

    try {

        // 🔥 FORCE CACHE BYPASS
        const response = await searchDictionary(word + "_" + Date.now());

        if (!response || !response.success) {
            resultBox.innerHTML = `<p class="text-danger">No definition found.</p>`;
            return;
        }

        const dictionary = normalizeDictionaryResponse(response.data);

        if (!dictionary || !dictionary.success) {
            resultBox.innerHTML = `<p class="text-danger">No definition found.</p>`;
            return;
        }

        // 🔥 FORCE OVERRIDE WITH CURRENT INPUT
        dictionary.word = word;
        dictionary.userWord = word;

        saveRecentSearch(word);

        renderDictionaryResult(dictionary);

    }

    catch (error) {

        console.error(error);

        showToast("Dictionary error.", "error");

        resultBox.innerHTML = `
            <p class="text-danger">
                Dictionary service is unavailable.
            </p>
        `;
    }

    finally {
        hideLoader();
    }
}

/* ==========================================================
   RENDER RESULT
========================================================== */

function renderDictionaryResult(data) {

    const resultBox = document.getElementById("dictionaryResult");
    if (!resultBox) return;

    const word = escapeHtml(data.word);
    const phonetic = escapeHtml(data.phonetic || "N/A");
    const favorite = isFavorite(data.word);

    // 🔥 ALWAYS USE FRESH WORD
    const arabic = getArabicTranslation(data.userWord || data.word);

    let html = `
        <div class="dictionary-card">

            <div class="dictionary-header">

                <div>

                    <h2>${word}</h2>

                    <p class="arabic-translation">
                        🇸🇦 ${escapeHtml(arabic)}
                    </p>

                    <p class="phonetic">
                        ${phonetic}
                    </p>

                </div>

                <button
                    class="favorite-btn"
                    onclick="toggleDictionaryFavorite('${escapeHtml(data.word)}')"
                    title="Favorite">

                    ${favorite ? "❤️" : "🤍"}

                </button>

            </div>

            <div class="audio-group">

                <button class="audio-btn"
                    onclick='speak(${JSON.stringify(data.word)},"en-US")'>
                    🇺🇸 US
                </button>

                <button class="audio-btn"
                    onclick='speak(${JSON.stringify(data.word)},"en-GB")'>
                    🇬🇧 UK
                </button>

            </div>
    `;

    data.meanings.forEach(function (meaning) {

        html += `
            <div class="meaning-block">

                <h3>
                    ${escapeHtml(meaning.partOfSpeech || "Unknown")}
                </h3>
        `;

        meaning.definitions.forEach(function (definition) {

            html += `
                <div class="definition">

                    <p>
                        • ${escapeHtml(definition.definition || "")}
                    </p>
            `;

            if (definition.example) {

                html += `
                    <p class="example">
                        Example: ${escapeHtml(definition.example)}
                    </p>
                `;
            }

            html += `
                </div>
            `;
        });

        html += `
            </div>
        `;
    });

    html += `
        </div>
    `;

    resultBox.innerHTML = html;
}

/* ==========================================================
   FAVORITES
========================================================== */

function toggleDictionaryFavorite(word) {

    if (!word) return;

    toggleFavorite(word);

    showToast(
        isFavorite(word)
            ? "Added to favorites."
            : "Removed from favorites."
    );

    const input = document.getElementById("dictionaryInput");

    if (
        input &&
        input.value.trim().toLowerCase() === word.toLowerCase()
    ) {
        searchWord();
    }
}

/* ==========================================================
   CLEAR
========================================================== */

function clearDictionaryResult() {

    const resultBox = document.getElementById("dictionaryResult");

    if (!resultBox) return;

    resultBox.innerHTML = "";
    resultBox.classList.add("hidden");
}

/* ==========================================================
   ENTER KEY
========================================================== */

function initializeDictionary() {

    const input = document.getElementById("dictionaryInput");

    if (!input) return;

    input.addEventListener("keydown", function (event) {

        if (event.key === "Enter") {
            event.preventDefault();
            searchWord();
        }

    });
}

/* ==========================================================
   AUTO INIT
========================================================== */

document.addEventListener("DOMContentLoaded", initializeDictionary);

/* ==========================================================
   END
========================================================== */
