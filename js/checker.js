/* ==========================================================
   English-Bot
   checker.js
   Version 1.1
========================================================== */

"use strict";

/* ==========================================================
   Main Function
========================================================== */

async function processText(){

    const textarea = document.getElementById(

        "userInput"

    );

    const resultBox = document.getElementById(

        "checkerResult"

    );

    if(!textarea || !resultBox){

        return;

    }

    let input = textarea.value.trim();

    if(!input){

        showToast(

            "Please enter a sentence.",

            "error"

        );

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

    input = applyLogicRules(input);

    try{

        const response = await checkGrammar(input);

        if(!response.success){

            throw new Error(

                response.error ||

                "Grammar request failed."

            );

        }

        renderGrammarResult(

            input,

            response.data

        );

        saveHistory(input);

    }

    catch(error){

        console.error(error);

        showToast(

            "Unable to check grammar.",

            "error"

        );

        resultBox.innerHTML = `

            <p class="text-danger">

                Unable to connect to the grammar service.

            </p>

        `;

    }

    finally{

        hideLoader();

    }

}
/* ==========================================================
   Logic Rules
========================================================== */

/**
 * Apply custom grammar rules
 * before sending text to LanguageTool.
 */

/* ==========================================================
   Smart Grammar Rules
========================================================== */

function applyLogicRules(text){

    let sentence = text.trim();

    // ======================================================
    // Normalize spaces
    // ======================================================

    sentence = sentence.replace(/\s+/g," ");

    // ======================================================
    // Capitalize first letter
    // ======================================================

    sentence =
        sentence.charAt(0).toUpperCase() +
        sentence.slice(1);

    // ======================================================
    // Pronoun I
    // ======================================================

    sentence = sentence.replace(/\bi\b/g,"I");

    // ======================================================
    // Yesterday + Future
    // ======================================================

    sentence = sentence.replace(

        /\bwill\s+go\b(?=.*\byesterday\b)/i,

        "went"

    );

    sentence = sentence.replace(

        /\bwill\s+come\b(?=.*\byesterday\b)/i,

        "came"

    );

    sentence = sentence.replace(

        /\bwill\s+leave\b(?=.*\byesterday\b)/i,

        "left"

    );

    // ======================================================
    // Tomorrow + Past
    // ======================================================

    sentence = sentence.replace(

        /\bwent\b(?=.*\btomorrow\b)/i,

        "will go"

    );

    sentence = sentence.replace(

        /\bcame\b(?=.*\btomorrow\b)/i,

        "will come"

    );

    sentence = sentence.replace(

        /\bleft\b(?=.*\btomorrow\b)/i,

        "will leave"

    );

    // ======================================================
    // Present Perfect
    // ======================================================

    sentence = sentence.replace(

        /\bhave\s+went\b/gi,

        "have gone"

    );

    sentence = sentence.replace(

        /\bhas\s+went\b/gi,

        "has gone"

    );

    sentence = sentence.replace(

        /\bhave\s+ate\b/gi,

        "have eaten"

    );

    sentence = sentence.replace(

        /\bhas\s+ate\b/gi,

        "has eaten"

    );

    // ======================================================
    // Did + Past
    // ======================================================

    sentence = sentence.replace(

        /\bdid\s+went\b/gi,

        "did go"

    );

    sentence = sentence.replace(

        /\bdid\s+came\b/gi,

        "did come"

    );

    sentence = sentence.replace(

        /\bdid\s+ate\b/gi,

        "did eat"

    );

    // ======================================================
    // Does + Verb
    // ======================================================

    sentence = sentence.replace(

        /\bdoes\s+goes\b/gi,

        "does go"

    );

    sentence = sentence.replace(

        /\bdoes\s+likes\b/gi,

        "does like"

    );

    sentence = sentence.replace(

        /\bdoes\s+plays\b/gi,

        "does play"

    );

    // ======================================================
    // Don't / Doesn't
    // ======================================================

    sentence = sentence.replace(

        /\bhe\s+don't\b/gi,

        "He doesn't"

    );

    sentence = sentence.replace(

        /\bshe\s+don't\b/gi,

        "She doesn't"

    );

    sentence = sentence.replace(

        /\bit\s+don't\b/gi,

        "It doesn't"

    );

    // ======================================================
    // Third Person
    // ======================================================

    sentence = sentence.replace(

        /\bhe\s+go\b/gi,

        "He goes"

    );

    sentence = sentence.replace(

        /\bshe\s+go\b/gi,

        "She goes"

    );

    sentence = sentence.replace(

        /\bhe\s+have\b/gi,

        "He has"

    );

    sentence = sentence.replace(

        /\bshe\s+have\b/gi,

        "She has"

    );

    // ======================================================
    // Missing Articles
    // ======================================================

    sentence = sentence.replace(

        /\bI am doctor\b/i,

        "I am a doctor"

    );

    sentence = sentence.replace(

        /\bI am teacher\b/i,

        "I am a teacher"

    );

    sentence = sentence.replace(

        /\bI am engineer\b/i,

        "I am an engineer"

    );

    sentence = sentence.replace(

        /\bHe is doctor\b/i,

        "He is a doctor"

    );

    sentence = sentence.replace(

        /\bShe is doctor\b/i,

        "She is a doctor"

    );

    // ======================================================
    // Irregular Plurals
    // ======================================================

    sentence = sentence.replace(

        /\bchilds\b/gi,

        "children"

    );

    sentence = sentence.replace(

        /\bpeoples\b/gi,

        "people"

    );

    sentence = sentence.replace(

        /\binformations\b/gi,

        "information"

    );

    sentence = sentence.replace(

        /\badvices\b/gi,

        "advice"

    );

    // ======================================================
    // Common Prepositions
    // ======================================================

    sentence = sentence.replace(

        /\bmarried with\b/gi,

        "married to"

    );

    sentence = sentence.replace(

        /\binterested on\b/gi,

        "interested in"

    );

    sentence = sentence.replace(

        /\bgood in\b/gi,

        "good at"

    );

    sentence = sentence.replace(

        /\bdepend of\b/gi,

        "depend on"

    );

    // ======================================================
    // Punctuation
    // ======================================================

    if(!/[.!?]$/.test(sentence)){

        sentence += ".";

    }

    return sentence;

}

/* ==========================================================
   Accuracy Score
========================================================== */

function calculateGrammarScore(matches){

    if(!Array.isArray(matches)){

        return 100;

    }

    return Math.max(

        100 - (matches.length * 10),

        0

    );

}
/* ==========================================================
   Grammar Result
========================================================== */

function renderGrammarResult(original, data){

    const resultBox = document.getElementById(

        "checkerResult"

    );

    if(!resultBox){

        return;

    }

    let corrected = original;

    const matches = Array.isArray(data.matches)

        ? [...data.matches]

        : [];

    matches.sort(

        (a, b) => b.offset - a.offset

    );

    for(const match of matches){

        if(

            Array.isArray(match.replacements) &&

            match.replacements.length

        ){

            corrected =

                corrected.substring(

                    0,

                    match.offset

                )

                +

                match.replacements[0].value

                +

                corrected.substring(

                    match.offset +

                    match.length

                );

        }

    }

    const score = calculateGrammarScore(matches);

    const safeOriginal = escapeHtml(original);

    const safeCorrected = escapeHtml(corrected);

    const speechText = JSON.stringify(corrected);

    resultBox.innerHTML = `

        <h3>

            Grammar Report

        </h3>

        <hr>

        <p>

            <strong>Original:</strong>

            ${safeOriginal}

        </p>

        <br>

        <p>

            <strong>Corrected:</strong>

            ${safeCorrected}

        </p>

        <br>

        <p>

            <strong>Errors:</strong>

            ${matches.length}

        </p>

        <p>

            <strong>Accuracy:</strong>

            ${score}%

        </p>

        <div class="audio-group">

            <button

                class="audio-btn"

                onclick='speak(${speechText},"en-US")'>

                🇺🇸 US

            </button>

            <button

                class="audio-btn"

                onclick='speak(${speechText},"en-GB")'>

                🇬🇧 UK

            </button>

        </div>

    `;

}

/* ==========================================================
   End of checker.js
========================================================== */
