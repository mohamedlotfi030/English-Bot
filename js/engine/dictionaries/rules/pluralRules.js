"use strict";

/* ==========================================================
   English-Bot
   Plural Rules
   Version 5.0
========================================================== */

const pluralRules = [];

/* ==========================================================
   Rule Registration
========================================================== */

function addPluralRule({
    description,
    condition,
    correction
}) {
    pluralRules.push({
        description,
        condition,
        correction
    });
}

/* ==========================================================
   Regular Plurals
========================================================== */

addPluralRule({
    description: "Add -s for regular plural nouns",
    condition: (word, context) => context.isCountable && context.isPlural && !word.isPluralForm,
    correction: (word) => word + "s"
});

/* ==========================================================
   Nouns ending in -y
========================================================== */

addPluralRule({
    description: "Change -y to -ies for nouns ending in consonant + y",
    condition: (word, context) => context.isCountable && context.isPlural && /[^aeiou]y$/.test(word),
    correction: (word) => word.replace(/y$/, "ies")
});

/* ==========================================================
   Nouns ending in -s, -sh, -ch, -x
========================================================== */

addPluralRule({
    description: "Add -es for nouns ending in -s, -sh, -ch, -x",
    condition: (word, context) => context.isCountable && context.isPlural && /(s|sh|ch|x)$/.test(word),
    correction: (word) => word + "es"
});

/* ==========================================================
   Irregular Plurals
========================================================== */

addPluralRule({
    description: "Correct irregular plural forms (man → men, child → children, mouse → mice)",
    condition: (word, context) => context.isCountable && context.isPlural && word.isIrregular,
    correction: (word) => word.irregularPlural
});

/* ==========================================================
   Uncountable Nouns
========================================================== */

addPluralRule({
    description: "Do not pluralize uncountable nouns (information, advice, furniture)",
    condition: (word, context) => context.isUncountable && context.isPlural,
    correction: (word) => word.singularForm
});

/* ==========================================================
   Register Rules
========================================================== */

GrammarEngine.registerRules(
    "pluralRules",
    pluralRules
);

window.pluralRules = pluralRules;
