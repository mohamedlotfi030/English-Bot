"use strict";

/* ==========================================================
   English-Bot
   checker.js
   Version 3.0 (v7 Compatible)
========================================================== */

/* ==========================================================
   Main Function
========================================================== */

async function processText() {

    const textarea = document.getElementById("userInput");
    const resultBox = document.getElementById("checkerResult");

    if (!textarea || !resultBox) return;

    let input = textarea.value.trim();

    if (!input) {
        showToast("Please enter a sentence.", "error");
        return;
    }

    showLoader();

    resultBox.classList.remove("hidden");
    resultBox.innerHTML = `<p>Checking grammar...</p>`;

    try {

        /* ==================================================
           Logic Rules (basic formatting only)
        ================================================== */
        input = applyLogicRules(input);

        /* ==================================================
           CORE ENGINE (v7 single source of truth)
        ================================================== */
        const response = GrammarEngine.correct(input);

        /* ==================================================
           Render Results
        ================================================== */
        renderGrammarResult(input, response);

        renderWritingEvaluation(response);

        saveHistory(response.text);

    } catch (error) {

        console.error(error);

        showToast("Unable to process grammar rules.", "error");

        resultBox.innerHTML = `
            <p class="text-danger">
                Unable to process grammar rules.
            </p>
        `;

    } finally {
        hideLoader();
    }
}

/* ==========================================================
   Logic Rules (Basic Formatting Only)
========================================================== */

function applyLogicRules(text) {

    let sentence = text.trim();

    sentence = sentence.replace(/\s+/g, " ");

    sentence = sentence.charAt(0).toUpperCase() + sentence.slice(1);

    sentence = sentence.replace(/\bi\b/g, "I");

    if (!/[.!?]$/.test(sentence)) {
        sentence += ".";
    }

    return sentence;
}

/* ==========================================================
   Grammar Score
========================================================== */

function calculateGrammarScore(issues) {

    if (!Array.isArray(issues)) return 100;

    return Math.max(100 - issues.length * 10, 0);
}

/* ==========================================================
   Render Grammar Result
========================================================== */

function renderGrammarResult(original, data) {

    const resultBox = document.getElementById("checkerResult");
    if (!resultBox) return;

    const corrected = data.text || original;
    const issues = Array.isArray(data.issues) ? data.issues : [];

    const score = calculateGrammarScore(issues);

    const safeOriginal = escapeHtml(original);
    const safeCorrected = escapeHtml(corrected);
    const speechText = JSON.stringify(corrected);

    resultBox.innerHTML = `
        <h3>Grammar Report</h3>
        <hr>

        <p><strong>Original:</strong> ${safeOriginal}</p>
        <p><strong>Corrected:</strong> ${safeCorrected}</p>

        <p><strong>Errors:</strong> ${issues.length}</p>
        <p><strong>Accuracy:</strong> ${score}%</p>

        <div class="audio-group">
            <button class="audio-btn" onclick='speak(${speechText},"en-US")'>🇺🇸 US</button>
            <button class="audio-btn" onclick='speak(${speechText},"en-GB")'>🇬🇧 UK</button>
            <button class="audio-btn" onclick='speakWord("${corrected}","en-US")'>🔊 Word US</button>
            <button class="audio-btn" onclick='speakWord("${corrected}","en-GB")'>🔊 Word UK</button>
        </div>

        <hr>

        <h4>Details:</h4>
        <ul>
            ${issues.map(issue => `
                <li>
                    <strong>${escapeHtml(issue.name || "")}</strong>
                    (${escapeHtml(issue.category || "")}) →
                    ${escapeHtml(issue.reason || "")}
                    <br>
                    <em>Correction:</em> ${escapeHtml(issue.correction || "")}
                </li>
            `).join("")}
        </ul>
    `;
}

/* ==========================================================
   Writing Evaluation
========================================================== */

function calculateWritingEvaluation(data) {

    const grammarScore = calculateGrammarScore(data.issues);

    const vocabularyScore = evaluateVocabulary(data.text);

    const naturalnessScore = evaluateNaturalness(data.text);

    const styleScore = evaluateStyle(data.text);

    const overallScore = Math.round(
        (grammarScore + vocabularyScore + naturalnessScore + styleScore) / 4
    );

    return {
        grammar: grammarScore,
        vocabulary: vocabularyScore,
        naturalness: naturalnessScore,
        style: styleScore,
        overall: overallScore
    };
}

/* ==========================================================
   Render Writing Evaluation
========================================================== */

function renderWritingEvaluation(data) {

    const resultBox = document.getElementById("checkerResult");
    if (!resultBox) return;

    const evaluation = calculateWritingEvaluation(data);

    resultBox.innerHTML += `
        <hr>
        <h3>Writing Evaluation</h3>

        <p><strong>Grammar:</strong> ${evaluation.grammar}%</p>
        <p><strong>Vocabulary:</strong> ${evaluation.vocabulary}%</p>
        <p><strong>Naturalness:</strong> ${evaluation.naturalness}%</p>
        <p><strong>Style:</strong> ${evaluation.style}%</p>
        <p><strong>Overall:</strong> ${evaluation.overall}%</p>
    `;
}

/* ==========================================================
   Evaluation Helpers
========================================================== */

function evaluateVocabulary(text) {

    const words = text.split(/\s+/).length;

    return Math.min(100, 50 + words * 2);
}

function evaluateNaturalness(text) {

    return /[.!?]/.test(text) ? 95 : 80;
}

function evaluateStyle(text) {

    return /\b(therefore|however|moreover)\b/i.test(text) ? 90 : 75;
}

/* ==========================================================
   End of checker.js
========================================================== */
