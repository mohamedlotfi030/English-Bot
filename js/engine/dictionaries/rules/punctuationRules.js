"use strict";

/* ==========================================================
   English-Bot
   Punctuation Rules
   Version 5.0
========================================================== */

const punctuationRules = [];

/* ==========================================================
   Rule Registration
========================================================== */

function addPunctuationRule({
    description,
    condition,
    correction
}) {
    punctuationRules.push({
        description,
        condition,
        correction
    });
}

/* ==========================================================
   Periods
========================================================== */

addPunctuationRule({
    description: "Use a period at the end of declarative sentences",
    condition: (sentence, context) => context.type === "statement" && !sentence.endsWith("."),
    correction: (sentence) => sentence + "."
});

/* ==========================================================
   Question Marks
========================================================== */

addPunctuationRule({
    description: "Use a question mark at the end of interrogative sentences",
    condition: (sentence, context) => context.type === "question" && !sentence.endsWith("?"),
    correction: (sentence) => sentence + "?"
});

/* ==========================================================
   Exclamation Marks
========================================================== */

addPunctuationRule({
    description: "Use an exclamation mark for strong emotions or commands",
    condition: (sentence, context) => context.type === "exclamation" && !sentence.endsWith("!"),
    correction: (sentence) => sentence + "!"
});

/* ==========================================================
   Commas
========================================================== */

addPunctuationRule({
    description: "Use commas to separate items in a list",
    condition: (sentence, context) => context.hasList && !sentence.includes(","),
    correction: (sentence) => sentence.replace(/(\w+)\s(\w+)/, "$1, $2")
});

addPunctuationRule({
    description: "Use commas after introductory phrases",
    condition: (sentence, context) => context.hasIntro && !sentence.includes(","),
    correction: (sentence) => sentence.replace(/^(.*?)\s/, "$1, ")
});

/* ==========================================================
   Apostrophes
========================================================== */

addPunctuationRule({
    description: "Use apostrophes for contractions and possessives",
    condition: (word, context) => context.requiresApostrophe && !word.includes("'"),
    correction: (word) => word.addApostrophe()
});

/* ==========================================================
   Register Rules
========================================================== */

GrammarEngine.registerRules(
    "punctuationRules",
    punctuationRules
);

window.punctuationRules = punctuationRules;
