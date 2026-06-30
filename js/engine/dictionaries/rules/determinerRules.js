"use strict";

/* ==========================================================
   English-Bot
   Determiner Rules
   Version 5.0
========================================================== */

const determinerRules = [];

/* ==========================================================
   Rule Registration
========================================================== */

function addDeterminerRule({
    description,
    condition,
    correction
}) {
    determinerRules.push({
        description,
        condition,
        correction
    });
}

/* ==========================================================
   Demonstrative Determiners
========================================================== */

addDeterminerRule({
    description: "Use 'this/that' with singular nouns",
    condition: (det, context) => context.type === "demonstrative" && context.isSingular && !["this","that"].includes(det.form),
    correction: () => "this"
});

addDeterminerRule({
    description: "Use 'these/those' with plural nouns",
    condition: (det, context) => context.type === "demonstrative" && context.isPlural && !["these","those"].includes(det.form),
    correction: () => "these"
});

/* ==========================================================
   Quantitative Determiners
========================================================== */

addDeterminerRule({
    description: "Use 'some' with positive plural/uncountable nouns",
    condition: (det, context) => context.type === "quantitative" && context.isPositive && !["some"].includes(det.form),
    correction: () => "some"
});

addDeterminerRule({
    description: "Use 'any' with negatives or questions",
    condition: (det, context) => context.type === "quantitative" && (context.isNegative || context.isQuestion) && det.form !== "any",
    correction: () => "any"
});

addDeterminerRule({
    description: "Use 'few/many' with countable nouns",
    condition: (det, context) => context.type === "quantitative" && context.isCountable && !["few","many"].includes(det.form),
    correction: () => "many"
});

addDeterminerRule({
    description: "Use 'little/much' with uncountable nouns",
    condition: (det, context) => context.type === "quantitative" && context.isUncountable && !["little","much"].includes(det.form),
    correction: () => "much"
});

/* ==========================================================
   Possessive Determiners
========================================================== */

addDeterminerRule({
    description: "Use possessive determiners (my, your, his, her, our, their) before nouns",
    condition: (det, context) => context.type === "possessive" && !det.isPossessive,
    correction: () => "my"
});

/* ==========================================================
   Register Rules
========================================================== */

GrammarEngine.registerRules(
    "determinerRules",
    determinerRules
);

window.determinerRules = determinerRules;
