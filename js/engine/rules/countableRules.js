"use strict";

/* ==========================================================
   English-Bot
   Countable Rules
   Version 5.0
========================================================== */

const countableRules = [];

/* ==========================================================
   Rule Registration
========================================================== */

function addCountableRule({
    description,
    condition,
    correction
}) {
    countableRules.push({
        description,
        condition,
        correction
    });
}

/* ==========================================================
   Articles with Countable Nouns
========================================================== */

addCountableRule({
    description: "Use 'a/an' with singular countable nouns",
    condition: (word, context) => context.isCountable && context.isSingular && !word.hasArticle,
    correction: (word) => (/[aeiou]/.test(word.charAt(0)) ? "an " : "a ") + word
});

/* ==========================================================
   Plural for Countable Nouns
========================================================== */

addCountableRule({
    description: "Add plural -s for countable nouns when needed",
    condition: (word, context) => context.isCountable && context.isPlural && !word.isPluralForm,
    correction: (word) => word + "s"
});

/* ==========================================================
   Much vs Many
========================================================== */

addCountableRule({
    description: "Use 'many' with countable nouns",
    condition: (word, context) => context.isCountable && context.hasQuantifier && context.quantifier === "much",
    correction: () => "many"
});

addCountableRule({
    description: "Use 'much' with uncountable nouns",
    condition: (word, context) => context.isUncountable && context.hasQuantifier && context.quantifier === "many",
    correction: () => "much"
});

/* ==========================================================
   Some/Any Usage
========================================================== */

addCountableRule({
    description: "Use 'some' with plural countable or uncountable nouns in positive sentences",
    condition: (sentence, context) => context.hasQuantifier && context.quantifier === "any" && context.isPositive,
    correction: (sentence) => sentence.replace("any", "some")
});

addCountableRule({
    description: "Use 'any' in negative or question sentences",
    condition: (sentence, context) => context.hasQuantifier && context.quantifier === "some" && (context.isNegative || context.isQuestion),
    correction: (sentence) => sentence.replace("some", "any")
});

/* ==========================================================
   Register Rules
========================================================== */

GrammarEngine.registerRules(
    "countableRules",
    countableRules
);

window.countableRules = countableRules;
