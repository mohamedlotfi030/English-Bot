"use strict";

/* ==========================================================
   English-Bot
   Capitalization Rules
   Version 5.0
========================================================== */

const capitalizationRules = [];

/* ==========================================================
   Rule Registration
========================================================== */

function addCapitalizationRule({
    description,
    condition,
    correction
}) {
    capitalizationRules.push({
        description,
        condition,
        correction
    });
}

/* ==========================================================
   Sentence Start
========================================================== */

addCapitalizationRule({
    description: "Capitalize the first word of a sentence",
    condition: (sentence) => /^[a-z]/.test(sentence),
    correction: (sentence) => sentence.charAt(0).toUpperCase() + sentence.slice(1)
});

/* ==========================================================
   Proper Nouns
========================================================== */

addCapitalizationRule({
    description: "Capitalize proper nouns (names, places, organizations)",
    condition: (word, context) => context.isProperNoun && /^[a-z]/.test(word),
    correction: (word) => word.charAt(0).toUpperCase() + word.slice(1)
});

/* ==========================================================
   Pronoun 'I'
========================================================== */

addCapitalizationRule({
    description: "Always capitalize the pronoun 'I'",
    condition: (word) => word === "i",
    correction: () => "I"
});

/* ==========================================================
   Days and Months
========================================================== */

addCapitalizationRule({
    description: "Capitalize days of the week and months",
    condition: (word, context) => context.isDayOrMonth && /^[a-z]/.test(word),
    correction: (word) => word.charAt(0).toUpperCase() + word.slice(1)
});

/* ==========================================================
   Register Rules
========================================================== */

GrammarEngine.registerRules(
    "capitalizationRules",
    capitalizationRules
);

window.capitalizationRules = capitalizationRules;
