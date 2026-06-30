"use strict";

/* ==========================================================
   English-Bot
   Word Order Rules
   Version 5.0
========================================================== */

const wordOrderRules = [];

/* ==========================================================
   Rule Registration
========================================================== */

function addWordOrderRule({
    description,
    condition,
    correction
}) {
    wordOrderRules.push({
        description,
        condition,
        correction
    });
}

/* ==========================================================
   Basic Sentence Order
========================================================== */

addWordOrderRule({
    description: "Ensure Subject + Verb + Object order in statements",
    condition: (sentence, context) => context.type === "statement" && !sentence.isSVO,
    correction: (sentence) => sentence.toSVO()
});

/* ==========================================================
   Question Order
========================================================== */

addWordOrderRule({
    description: "Invert subject and auxiliary in questions",
    condition: (sentence, context) => context.type === "question" && !context.isInverted,
    correction: (sentence) => sentence.invertSubjectAuxiliary()
});

/* ==========================================================
   Adverb Placement
========================================================== */

addWordOrderRule({
    description: "Place frequency adverbs before main verb but after auxiliary",
    condition: (sentence, context) => context.hasFrequencyAdverb && !sentence.isCorrectAdverbPlacement,
    correction: (sentence) => sentence.fixAdverbPlacement()
});

/* ==========================================================
   Negative Placement
========================================================== */

addWordOrderRule({
    description: "Place 'not' after auxiliary verb",
    condition: (sentence, context) => context.isNegative && !sentence.hasNotAfterAuxiliary,
    correction: (sentence) => sentence.fixNegativePlacement()
});

/* ==========================================================
   Register Rules
========================================================== */

GrammarEngine.registerRules(
    "wordOrderRules",
    wordOrderRules
);

window.wordOrderRules = wordOrderRules;
