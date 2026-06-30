"use strict";

/* ==========================================================
   English-Bot
   Spelling Rules
   Version 5.0
========================================================== */

const spellingRules = [];

/* ==========================================================
   Rule Registration
========================================================== */

function addSpellingRule({
    description,
    condition,
    correction
}) {
    spellingRules.push({
        description,
        condition,
        correction
    });
}

/* ==========================================================
   I before E Rule
========================================================== */

addSpellingRule({
    description: "Apply 'i before e except after c' rule",
    condition: (word) => /cie/.test(word),
    correction: (word) => word.replace(/cie/, "cei")
});

/* ==========================================================
   Doubling Consonants
========================================================== */

addSpellingRule({
    description: "Double final consonant before adding -ing/-ed if short vowel + consonant",
    condition: (word, context) => context.addingSuffix && /([aeiou][bcdfghjklmnpqrstvwxyz])$/.test(word),
    correction: (word, context) => word + word.slice(-1) + context.suffix
});

/* ==========================================================
   Silent E Rule
========================================================== */

addSpellingRule({
    description: "Drop final 'e' before adding -ing",
    condition: (word, context) => context.suffix === "ing" && word.endsWith("e"),
    correction: (word) => word.slice(0, -1) + "ing"
});

/* ==========================================================
   Plural Formation
========================================================== */

addSpellingRule({
    description: "Change 'y' to 'ies' for plural if preceded by consonant",
    condition: (word, context) => context.isPlural && word.endsWith("y") && !/[aeiou]y$/.test(word),
    correction: (word) => word.slice(0, -1) + "ies"
});

addSpellingRule({
    description: "Add 'es' for plural if word ends with s, sh, ch, x, z",
    condition: (word, context) => context.isPlural && /(s|sh|ch|x|z)$/.test(word),
    correction: (word) => word + "es"
});

/* ==========================================================
   Register Rules
========================================================== */

GrammarEngine.registerRules(
    "spellingRules",
    spellingRules
);

window.spellingRules = spellingRules;
