"use strict";

/* ==========================================================
   English-Bot
   Gerund Rules
   Version 5.0
========================================================== */

const gerundRules = [];

/* ==========================================================
   Rule Registration
========================================================== */

function addGerundRule({
    description,
    condition,
    correction
}) {
    gerundRules.push({
        description,
        condition,
        correction
    });
}

/* ==========================================================
   Gerund as Subject
========================================================== */

addGerundRule({
    description: "Use gerund (-ing) form as subject of sentence",
    condition: (word, context) => context.isSubject && word.isVerbBase,
    correction: (word) => word + "ing"
});

/* ==========================================================
   Gerund after Prepositions
========================================================== */

addGerundRule({
    description: "Use gerund after prepositions",
    condition: (word, context) => context.afterPreposition && word.isVerbBase,
    correction: (word) => word + "ing"
});

/* ==========================================================
   Gerund after Certain Verbs
========================================================== */

addGerundRule({
    description: "Use gerund after verbs like enjoy, avoid, suggest, consider",
    condition: (word, context) => context.afterVerb && ["enjoy","avoid","suggest","consider"].includes(context.verb) && word.isVerbBase,
    correction: (word) => word + "ing"
});

/* ==========================================================
   Distinguish Gerund vs Infinitive
========================================================== */

addGerundRule({
    description: "Correct use of gerund vs infinitive depending on verb",
    condition: (word, context) => context.afterVerb && context.requiresGerund && word.isInfinitive,
    correction: (word) => word.replace("to ", "") + "ing"
});

/* ==========================================================
   Register Rules
========================================================== */

GrammarEngine.registerRules(
    "gerundRules",
    gerundRules
);

window.gerundRules = gerundRules;
