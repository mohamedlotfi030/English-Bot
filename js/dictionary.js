/* ==========================================================
   English-Bot
   dictionary.js
   FINAL VERSION - Arabic Fix + Stable Logic
========================================================== */

"use strict";

/* ==========================================================
   Arabic Translation Engine
========================================================== */

function getArabicTranslation(word) {

    if (!word) return "لا توجد ترجمة";

    const clean = word.toLowerCase().trim();

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
   Search Word
========================================================== */

async function searchWord() {

    const input = document.getElementById("dictionaryInput");
    const resultBox = document.getElementById("dictionaryResult");

    if (!input || !resultBox) return;

    const word = input.value.trim();

    if (!word) {
        showToast("Please enter a word.", "error");
        input.focus();
        return;
    }

    showLoader();

    resultBox.classList.remove("hidden");
    resultBox.innerHTML = `<p>Searching dictionary...</p>`;

    try {

        const response = await searchDictionary(word);

        if (!response.success) {
            throw new Error(response.error || "Dictionary request failed.");
        }

        const dictionary = normalizeDictionaryResponse(response.data);

        if (!dictionary.success) {
            resultBox.innerHTML = `<p class="text-danger">No definition found.</p>`;
            return;
        }

        saveRecentSearch(word);

        renderDictionaryResult(dictionary);

    }

    catch (error) {

        console.error(error);

        showToast("Unable to search dictionary.", "error");

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
   Render Result
========================================================== */

function renderDictionaryResult(data) {

    const resultBox = document.getElementById("dictionaryResult");
    if (!resultBox) return;

    const word = escapeHtml(data.word);
    const phonetic = escapeHtml(data.phonetic || "N/A");
    const favorite = isFavorite(data.word);

    const arabic = getArabicTranslation(data.word);

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
   Favorite System
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
   Clear Result
========================================================== */

function clearDictionaryResult() {

    const resultBox = document.getElementById("dictionaryResult");

    if (!resultBox) return;

    resultBox.innerHTML = "";
    resultBox.classList.add("hidden");
}

/* ==========================================================
   Enter Key Support
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
   Auto Init
========================================================== */

document.addEventListener("DOMContentLoaded", initializeDictionary);

/* ==========================================================
   End
========================================================== */
