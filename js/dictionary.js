/* ==========================================================
   English-Bot
   dictionary.js
   FINAL STABLE VERSION
========================================================== */

"use strict";

/* ==========================================================
   API: ENGLISH DICTIONARY
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
        const definition = meaning?.definitions?.[0]?.definition || "";

        const synonyms = meaning?.synonyms || [];

        const arabic = await translateToArabic(word);

        return {
            success: true,
            data: {
                word: entry.word,
                phonetic: entry.phonetic || "",
                definition,
                synonyms,
                arabic
            }
        };

    } catch (err) {

        console.error("API Error:", err);

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

    } catch (err) {

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
   SEARCH WORD (MAIN FUNCTION)
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

    catch (err) {

        console.error(err);

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
   RENDER RESULT
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
                ${data.phonetic || ""}
            </p>

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
   ENTER SUPPORT
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
