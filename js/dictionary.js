/* ==========================================================
   English-Bot
   dictionary.js
   CLEAN VERSION - Stable + Simple + No Bugs
========================================================== */

"use strict";

/* ==========================================================
   SIMPLE ARABIC TRANSLATION (LOCAL ENGINE)
========================================================== */

function getArabicTranslation(word) {

    if (!word) return "لا توجد ترجمة";

    const clean = String(word).toLowerCase().trim();

    const dictionary = {

        play: "يلعب / مسرحية / لعب",
        book: "كتاب",
        car: "سيارة",
        house: "منزل",
        computer: "حاسوب",
        water: "ماء",
        love: "حب",
        school: "مدرسة",
        teacher: "معلم",
        student: "طالب",
        first: "أول / أولاً"

    };

    return dictionary[clean] || "لا توجد ترجمة";
}

/* ==========================================================
   SEARCH WORD FUNCTION
========================================================== */

async function searchWord() {

    const input = document.getElementById("dictionaryInput");
    const resultBox = document.getElementById("dictionaryResult");

    if (!input || !resultBox) return;

    const word = input.value.trim();

    if (!word) {
        showToast("Please enter a word.", "error");
        return;
    }

    // reset UI
    resultBox.classList.remove("hidden");
    resultBox.innerHTML = `<p>Searching...</p>`;

    showLoader();

    try {

        // IMPORTANT: send clean word ONLY
        const response = await searchDictionary(word);

        if (!response || !response.success) {
            resultBox.innerHTML = `<p class="text-danger">No definition found.</p>`;
            return;
        }

        const data = normalizeDictionaryResponse(response.data);

        if (!data || !data.success) {
            resultBox.innerHTML = `<p class="text-danger">No definition found.</p>`;
            return;
        }

        // store original word safely
        data.word = word;

        saveRecentSearch(word);

        renderDictionaryResult(data);

    }

    catch (error) {

        console.error(error);

        showToast("Dictionary error", "error");

        resultBox.innerHTML = `
            <p class="text-danger">
                Service unavailable
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

    const word = escapeHtml(data.word || "");
    const phonetic = escapeHtml(data.phonetic || "N/A");

    const arabic = getArabicTranslation(data.word);

    const favorite = isFavorite(data.word);

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
                    onclick="toggleDictionaryFavorite('${word}')">

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

    data.meanings?.forEach(meaning => {

        html += `
            <div class="meaning-block">

                <h3>${escapeHtml(meaning.partOfSpeech || "Unknown")}</h3>
        `;

        meaning.definitions?.forEach(def => {

            html += `
                <div class="definition">

                    <p>• ${escapeHtml(def.definition || "")}</p>
            `;

            if (def.example) {
                html += `
                    <p class="example">
                        Example: ${escapeHtml(def.example)}
                    </p>
                `;
            }

            html += `</div>`;
        });

        html += `</div>`;
    });

    html += `</div>`;

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
            ? "Added to favorites"
            : "Removed from favorites"
    );
}

/* ==========================================================
   ENTER SUPPORT
========================================================== */

function initializeDictionary() {

    const input = document.getElementById("dictionaryInput");

    if (!input) return;

    input.addEventListener("keydown", (e) => {

        if (e.key === "Enter") {
            e.preventDefault();
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
