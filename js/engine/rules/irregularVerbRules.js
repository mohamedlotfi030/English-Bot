"use strict";

/* ==========================================================
   English-Bot
   Irregular Verb Rules
   Version 5.0
========================================================== */

const irregularVerbRules = [];

/* ==========================================================
   Rule Registration
========================================================== */

function addIrregularVerbRule({
    description,
    condition,
    correction
}) {
    irregularVerbRules.push({
        description,
        condition,
        correction
    });
}

/* ==========================================================
   Past Simple Forms
========================================================== */

addIrregularVerbRule({
    description: "Use stored past form for irregular verbs",
    condition: (verb, tense) => tense === "past" && verb.type === "irregular" && verb.form !== verb.past,
    correction: (verb) => verb.past
});

/* ==========================================================
   Past Participle Forms
========================================================== */

addIrregularVerbRule({
    description: "Use stored past participle form for irregular verbs",
    condition: (verb, tense) => ["presentPerfect","pastPerfect","futurePerfect"].includes(tense) && verb.type === "irregular" && verb.form !== verb.pastParticiple,
    correction: (verb) => verb.pastParticiple
});

/* ==========================================================
   Continuous Forms
========================================================== */

addIrregularVerbRule({
    description: "Use -ing form for continuous tenses",
    condition: (verb, tense) => tense.includes("Continuous") && !verb.form.endsWith("ing"),
    correction: (verb) => verb.toIngForm()
});

/* ==========================================================
   Register Rules
========================================================== */

GrammarEngine.registerRules(
    "irregularVerbRules",
    irregularVerbRules
);

window.irregularVerbRules = irregularVerbRules;
