"use strict";

/* ==========================================================
   English-Bot
   Adverb Rules
   Version 5.0
========================================================== */

const adverbRules = [];

/* ==========================================================
   Rule Registration
========================================================== */

function addAdverbRule({
    description,
    condition,
    correction
}) {
    adverbRules.push({
        description,
        condition,
        correction
    });
}

/* ==========================================================
   Position Rules
========================================================== */

addAdverbRule({
    description: "Adverbs of manner usually come after the verb",
    condition: (adv, context) => context.type === "manner" && context.position !== "afterVerb",
    correction: (adv) => adv + " (after verb)"
});

addAdverbRule({
    description: "Frequency adverbs usually come before the main verb but after 'be'",
    condition: (adv, context) => context.type === "frequency" && !context.isCorrectPosition,
    correction: (adv, verb) => verb.base === "be" ? verb.form + " " + adv : adv + " " + verb.form
});

addAdverbRule({
    description: "Time adverbs usually come at the end of the sentence",
    condition: (adv, context) => context.type === "time" && context.position !== "end",
    correction: (adv) => adv + " (end of sentence)"
});

/* ==========================================================
   Comparative and Superlative
========================================================== */

addAdverbRule({
    description: "Form comparative with 'more' or '-er' (for short adverbs)",
    condition: (adv, context) => context.degree === "comparative" && !adv.isComparative,
    correction: (adv) => adv.isShort ? adv + "er" : "more " + adv
});

addAdverbRule({
    description: "Form superlative with 'most' or '-est' (for short adverbs)",
    condition: (adv, context) => context.degree === "superlative" && !adv.isSuperlative,
    correction: (adv) => adv.isShort ? adv + "est" : "most " + adv
});

/* ==========================================================
   Register Rules
========================================================== */

GrammarEngine.registerRules(
    "adverbRules",
    adverbRules
);

window.adverbRules = adverbRules;
