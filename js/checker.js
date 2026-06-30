/* ==========================================================
   English-Bot
   checker.js
   Version 2.1 (RuleManager + Writing Evaluation)
========================================================== */

"use strict";

/* ==========================================================
   Main Function
========================================================== */

async function processText() {
    const textarea = document.getElementById("userInput");
    const resultBox = document.getElementById("checkerResult");

    if (!textarea || !resultBox) {
        return;
    }

    let input = textarea.value.trim();

    if (!input) {
        showToast("Please enter a sentence.", "error");
        resultBox.classList.remove("hidden");
        resultBox.innerHTML = `
            <p class="text-danger">
                Please enter a sentence.
            </p>
        `;
        return;
    }

    showLoader();
    resultBox.classList.remove("hidden");
    resultBox.innerHTML = `
        <p>
            Checking grammar...
        </p>
    `;

    // تطبيق قواعد التنسيق الأساسية
    input = applyLogicRules(input);

    try {
        // ✅ المحرك الأساسي: RuleManager
        const analysis = GrammarEngine.analyze(input);
        const response = ruleManager.execute(input, analysis);

        // عرض النتائج من RuleManager
        renderGrammarResult(input, response);

        // عرض تقييم الكتابة
        renderWritingEvaluation(response);

        // حفظ النص المصحح في التاريخ
        saveHistory(response.text);

        // 🔥 مساعد إضافي: LanguageTool (اختياري)
        // const ltResponse = await checkGrammar(input);
        // if (ltResponse.success) {
        //     console.log("LanguageTool suggestions:", ltResponse.data);
        // }

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

    // Normalize spaces
    sentence = sentence.replace(/\s+/g, " ");

    // Capitalize first letter
    sentence = sentence.charAt(0).toUpperCase() + sentence.slice(1);

    // Pronoun I
    sentence = sentence.replace(/\bi\b/g, "I");

    // Punctuation at the end
    if (!/[.!?]$/.test(sentence)) {
        sentence += ".";
    }

    return sentence;
}

/* ==========================================================
   Accuracy Score
========================================================== */

function calculateGrammarScore(issues) {
    if (!Array.isArray(issues)) {
        return 100;
    }
    return Math.max(100 - (issues.length * 10), 0);
}

/* ==========================================================
   Grammar Result
========================================================== */

function renderGrammarResult(original, data) {
    const resultBox = document.getElementById("checkerResult");
    if (!resultBox) {
        return;
    }

    // النص المصحح من RuleManager
    const corrected = data.text || original;

    // قائمة الأخطاء
    const issues = Array.isArray(data.issues) ? data.issues : [];

    // حساب الدرجات
    const score = calculateGrammarScore(issues);

    // النصوص الآمنة للعرض
    const safeOriginal = escapeHtml(original);
    const safeCorrected = escapeHtml(corrected);
    const speechText = JSON.stringify(corrected);

    // بناء التقرير
    resultBox.innerHTML = `
        <h3>Grammar Report</h3>
        <hr>
        <p><strong>Original:</strong> ${safeOriginal}</p>
        <br>
        <p><strong>Corrected:</strong> ${safeCorrected}</p>
        <br>
        <p><strong>Errors:</strong> ${issues.length}</p>
        <p><strong>Accuracy:</strong> ${score}%</p>
        <div class="audio-group">
            <button class="audio-btn" onclick='speak(${speechText},"en-US")'>🇺🇸 US</button>
            <button class="audio-btn" onclick='speak(${speechText},"en-GB")'>🇬🇧 UK</button>
            <button class="audio-btn" onclick='speakWord("${data.text}","en-US")'>🔊 Word US</button>
            <button class="audio-btn" onclick='speakWord("${data.text}","en-GB")'>🔊 Word UK</button>
        </div>
        <hr>
        <h4>Details:</h4>
        <ul>
            ${issues.map(issue => `
                <li>
                    <strong>${escapeHtml(issue.name)}</strong> 
                    (${escapeHtml(issue.category)}) → 
                    ${escapeHtml(issue.reason)} 
                    <br>
                    <em>Correction:</em> ${escapeHtml(issue.correction)}
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
   Placeholder Evaluation Functions
   (يمكنك تطويرها لاحقًا باستخدام التحليل اللغوي)
========================================================== */

function evaluateVocabulary(text) {
    // مثال مبسط: كلما زاد طول النص زادت درجة المفردات
    const words = text.split(/\s+/);
    return Math.min(100, 60 + words.length);
}

function evaluateNaturalness(text) {
    // مثال مبسط: يعتمد على وجود علامات ترقيم
    return /[.!?]/.test(text) ? 95 : 85;
}

function evaluateStyle(text) {
    // مثال مبسط: يعتمد على وجود كلمات رسمية
    return /\b(therefore|however|moreover)\b/i.test(text) ? 90 : 80;
}

/* ==========================================================
   End of checker.js
========================================================== */
