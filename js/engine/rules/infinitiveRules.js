"use strict";

/* ==========================================================
   English-Bot
   Infinitive Rules
   Version 5.0
========================================================== */

const infinitiveRules = [];

/* ==========================================================
   Rule Registration
========================================================== */

function addInfinitiveRule({
    description,
    condition,
    correction
}) {
    infinitiveRules.push({
        description,
        condition,
        correction
    });
}

/* ==========================================================
   Infinitive after Certain Verbs
========================================================== */

addInfinitiveRule({
    description: "Use infinitive (to + verb) after verbs like want, decide, plan, hope",
    condition: (word, context) => context.afterVerb && ["want","decide","plan","hope"].includes(context.verb) && word.isVerbBase,
    correction: (word) => "to " + word
});

/* ==========================================================
   Infinitive of Purpose
========================================================== */

addInfinitiveRule({
    description: "Use infinitive to express purpose (in order to)",
    condition: (sentence, context) => context.isPurpose && !sentence.hasInfinitive,
    correction: (sentence) => sentence.addInfinitivePurpose()
});

/* ==========================================================
   Infinitive vs Gerund Distinction
========================================================== */

addInfinitiveRule({
    description: "Correct use of infinitive vs gerund depending on verb",
    condition: (word, context) => context.afterVerb && context.requiresInfinitive && word.isGerund,
    correction: (word) => "to " + word.replace("ing","")
});

/* ==========================================================
   Bare Infinitive after Modals
========================================================== */

addInfinitiveRule({
    description: "Use bare infinitive (without 'to') after modal verbs (can, should, must)",
    condition: (word, context) => context.afterModal && word.startsWith("to "),
    correction: (word) => word.replace("to ","")
});

/* ==========================================================
   Register Rules
========================================================== */

GrammarEngine.registerRules(
    "infinitiveRules",
    infinitiveRules
);

window.infinitiveRules = infinitiveRules;
