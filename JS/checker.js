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

function applyLogicRules(text){

    let sentence = text.trim();

    const rules = [

        {
            pattern:/\bwent\b/i,
            time:/\btomorrow\b/i,
            replace:"will go"
        },

        {
            pattern:/\bleft\b/i,
            time:/\btomorrow\b/i,
            replace:"will leave"
        },

        {
            pattern:/\bcame\b/i,
            time:/\btomorrow\b/i,
            replace:"will come"
        },

        {
            pattern:/\bgo\b/i,
            time:/\byesterday\b/i,
            replace:"went"
        },

        {
            pattern:/\bcome\b/i,
            time:/\byesterday\b/i,
            replace:"came"
        },

        {
            pattern:/\bleave\b/i,
            time:/\byesterday\b/i,
            replace:"left"
        }

    ];

    for(const rule of rules){

        if(

            rule.pattern.test(sentence) &&

            rule.time.test(sentence)

        ){

            sentence = sentence.replace(

                rule.pattern,

                rule.replace

            );

        }

    }

    sentence = sentence

        .replace(/\s+/g, " ")

        .replace(/\s+([.,!?])/g, "$1")

        .trim();

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