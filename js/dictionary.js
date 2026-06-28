"use strict";

/* ==========================================================
   AUTO AI DICTIONARY (NO MANUAL DATA)
========================================================== */

async function searchDictionary(word) {

    try {

        const res = await fetch(
            `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
        );

        const data = await res.json();

        if (!Array.isArray(data)) {
            throw new Error("No data");
        }

        const entry = data[0];

        const meaning = entry?.meanings?.[0];
        const definition = meaning?.definitions?.[0]?.definition || "";

        const synonyms = meaning?.synonyms || [];

        // 🔥 Arabic translation API
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

    } catch (e) {

        return {
            success: false,
            error: "Not found"
        };
    }
}

/* ==========================================================
   TRANSLATION ENGINE (AUTO ARABIC)
========================================================== */

async function translateToArabic(word) {

    try {

        const res = await fetch(
            `https://api.mymemory.translated.net/get?q=${word}&langpair=en|ar`
        );

        const data = await res.json();

        return data?.responseData?.translatedText || "لا توجد ترجمة";

    } catch (e) {
        return "لا توجد ترجمة";
    }
}

/* ==========================================================
   NORMALIZE (KEEP COMPATIBILITY)
========================================================== */

function normalizeDictionaryResponse(data) {

    if (!data) return { success: false };

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
   SEARCH WORD (UI HOOK)
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

    const response = await searchDictionary(word);

    if (!response.success) {
        resultBox.innerHTML = `<p>No definition found</p>`;
        hideLoader();
        return;
    }

    const data = normalizeDictionaryResponse(response.data);

    renderDictionaryResult(data);

    hideLoader();
}

/* ==========================================================
   RENDER
========================================================== */

function renderDictionaryResult(data) {

    const box = document.getElementById("dictionaryResult");

    box.innerHTML = `
        <div class="dictionary-card">

            <h2>${data.word}</h2>

            <p class="arabic">
                🇸🇦 ${data.arabic}
            </p>

            <p class="phonetic">
                ${data.phonetic}
            </p>

            <p class="definition">
                📘 ${data.definition}
            </p>

            <div class="synonyms">
                🔁 ${data.synonyms?.length ? data.synonyms.join(", ") : "None"}
            </div>

        </div>
    `;
}

/* ==========================================================
   INIT
========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    const input = document.getElementById("dictionaryInput");

    input?.addEventListener("keydown", (e) => {
        if (e.key === "Enter") searchWord();
    });

});
