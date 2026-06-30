"use strict";

/* ==========================================================
   English-Bot
   Participle Rules
   Version 5.0
========================================================== */

const participleRules = [];

/* ==========================================================
   Rule Registration
========================================================== */

function addParticipleRule({
    description,
    condition,
    correction
}) {
    participleRules.push({
        description,
        condition,
        correction
    });
}

/* ==========================================================
   Present Participle (-ing)
========================================================== */

addParticipleRule({
    description: "Use present participle (-ing) for continuous tenses",
    condition: (verb, tense) => tense.includes("Continuous") && !verb.form.endsWith("ing"),
    correction: (verb) => verb.toIngForm()
});

/* ==========================================================
   Past Participle
========================================================== */

addParticipleRule({
    description: "Use past participle with perfect tenses",
    condition: (verb, tense) => ["presentPerfect","pastPerfect","futurePerfect"].includes(tense) && verb.form !== verb.pastParticiple,
    correction: (verb) => verb.pastParticiple
});

/* ==========================================================
   Passive Voice
========================================================== */

addParticipleRule({
    description: "Use past participle in passive voice constructions",
    condition: (verb, context) => context.isPassive && verb.form !== verb.pastParticiple,
    correction: (verb) => verb.pastParticiple
});

/* ==========================================================
   Adjective Use
========================================================== */

addParticipleRule({
    description: "Use participles as adjectives (e.g., interesting, broken)",
    condition: (word, context) => context.role === "adjective" && !word.isParticiple,
    correction: (word) => word.toParticipleForm()
});

/* ==========================================================
   Register Rules
========================================================== */

GrammarEngine.registerRules(
    "participleRules",
    participleRules
);

window.participleRules = participleRules;
