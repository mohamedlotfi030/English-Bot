"use strict";

/* ==========================================================
   English-Bot
   Comparison Rules
   Version 5.0
========================================================== */

const comparisonRules = [];

/* ==========================================================
   Rule Registration
========================================================== */

function addComparisonRule({
    description,
    condition,
    correction
}) {
    comparisonRules.push({
        description,
        condition,
        correction
    });
}

/* ==========================================================
   Comparative Forms
========================================================== */

addComparisonRule({
    description: "Use -er for short adjectives in comparative",
    condition: (word, context) => context.isComparative && word.isShortAdjective && !word.form.endsWith("er"),
    correction: (word) => word + "er"
});

addComparisonRule({
    description: "Use 'more' for long adjectives in comparative",
    condition: (word, context) => context.isComparative && word.isLongAdjective && !word.form.startsWith("more"),
    correction: (word) => "more " + word
});

/* ==========================================================
   Superlative Forms
========================================================== */

addComparisonRule({
    description: "Use -est for short adjectives in superlative",
    condition: (word, context) => context.isSuperlative && word.isShortAdjective && !word.form.endsWith("est"),
    correction: (word) => word + "est"
});

addComparisonRule({
    description: "Use 'most' for long adjectives in superlative",
    condition: (word, context) => context.isSuperlative && word.isLongAdjective && !word.form.startsWith("most"),
    correction: (word) => "most " + word
});

/* ==========================================================
   As…As Comparisons
========================================================== */

addComparisonRule({
    description: "Use 'as + adjective + as' for equality comparisons",
    condition: (sentence, context) => context.isEqualityComparison && !sentence.includes("as"),
    correction: (sentence, adj) => "as " + adj + " as " + sentence.subject
});

/* ==========================================================
   Than Usage
========================================================== */

addComparisonRule({
    description: "Ensure 'than' is used in comparative sentences",
    condition: (sentence, context) => context.isComparative && !sentence.includes("than"),
    correction: (sentence) => sentence + " than ..."
});

/* ==========================================================
   Register Rules
========================================================== */

GrammarEngine.registerRules(
    "comparisonRules",
    comparisonRules
);

window.comparisonRules = comparisonRules;
