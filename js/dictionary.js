/* ==========================================================
   English-Bot
   dictionary.js
   FINAL VERSION (FULL FEATURES + PRONUNCIATION FIX)
========================================================== */

"use strict";

/* ==========================================================
   SEARCH DICTIONARY API
========================================================== */

async function searchDictionary(word) {

    try {

        const res = await fetch(
            `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
        );

        const data = await res.json();

        if (!Array.isArray(data)) {
            return { success: false };
        }

        const entry = data[0];

        const meaning = entry?.meanings?.[0];

        const definition =
            meaning?.definitions?.[0]?.definition || "";

        const synonyms =
            meaning?.synonyms || [];

        /* ======================================================
           FIX: PHONETIC PRONUNCIATION (IMPORTANT)
        ====================================================== */

        const phonetic =
            entry?.phonetic ||
            entry?.phonetics?.find(p => p.text)?.text ||
            "";

        /* ======================================================
           ARABIC TRANSLATION (AUTO API)
        ====================================================== */

        const arabic = await translateToArabic(word);

        return {
            success: true,
            data: {
                word: entry.word,
                phonetic: phonetic,
                definition: definition,
                synonyms: synonyms,
                arabic: arabic
            }
        };

    } catch (error) {

        console.error("Dictionary API Error:", error);

        return { success: false };
    }
}

/* ==========================================================
   ARABIC TRANSLATION API
========================================================== */

async function translateToArabic(word) {

    try {

        const res = await fetch(
            `https://api.mymemory.translated.net/get?q=${word}&langpair=en|ar`
        );

        const data = await res.json();

        return data?.responseData?.translatedText || "لا توجد ترجمة";

    } catch (error) {

        return "لا توجد ترجمة";
    }
}

/* ==========================================================
   NORMALIZER
========================================================== */

function normalizeDictionaryResponse(data) {

    if (!data) return null;

    return {
        success: true,
        word: data.word,
        phonetic: data.phonetic,
        definition: data.definition,
        synonyms: data.synonyms,
        arabic: data.arabic
    };
}

/* ==========================================================
   SEARCH FUNCTION (MAIN ENTRY)
========================================================== */

async function searchWord() {

    const input = document.getElementById("dictionaryInput");
    const resultBox = document.getElementById("dictionaryResult");

    if (!input || !resultBox) return;

    const word = input.value.trim();

    if (!word) {
        showToast("Please enter a word", "error");
        return;
    }

    try {

        resultBox.classList.remove("hidden");
        resultBox.innerHTML = `<p>Searching...</p>`;

        showLoader();

        const response = await searchDictionary(word);

        console.log("Dictionary Response:", response);

        if (!response || !response.success) {
            resultBox.innerHTML = `<p>No definition found</p>`;
            return;
        }

        const data = normalizeDictionaryResponse(response.data);

        if (!data) {
            resultBox.innerHTML = `<p>Error processing data</p>`;
            return;
        }

        renderDictionaryResult(data);

    }

    catch (error) {

        console.error(error);

        resultBox.innerHTML = `
            <p style="color:red;">
                Dictionary error occurred
            </p>
        `;
    }

    finally {
        hideLoader();
    }
}

/* ==========================================================
   RENDER RESULT (WITH PRONUNCIATION)
========================================================== */

function renderDictionaryResult(data) {

    const box = document.getElementById("dictionaryResult");

    if (!box) return;

    box.innerHTML = `
        <div class="dictionary-card">

            <h2>${data.word}</h2>

            <p class="arabic">
                🇸🇦 ${data.arabic}
            </p>

            <p class="phonetic">
                🔊 ${data.phonetic || "Not available"}
            </p>

            <button class="audio-btn"
                onclick='speak(${JSON.stringify(data.word)}, "en-US")'>
                ▶ Play Pronunciation
            </button>

            <p class="definition">
                📘 ${data.definition || ""}
            </p>

            <div class="synonyms">
                🔁 ${
                    data.synonyms && data.synonyms.length
                        ? data.synonyms.join(", ")
                        : "None"
                }
            </div>

        </div>
    `;
}

/* ==========================================================
   ENTER KEY SUPPORT
========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    const input = document.getElementById("dictionaryInput");

    if (!input) return;

    input.addEventListener("keydown", (e) => {

        if (e.key === "Enter") {
            e.preventDefault();
            searchWord();
        }

    });
});
