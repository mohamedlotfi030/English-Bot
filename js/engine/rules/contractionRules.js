"use strict";

/* ==========================================================
   English-Bot
   Contraction Rules
   Version 5.0
========================================================== */

const contractionRules = [];

/* ==========================================================
   Rule Registration
========================================================== */

function addContractionRule({
    description,
    condition,
    correction
}) {
    contractionRules.push({
        description,
        condition,
        correction
    });
}

/* ==========================================================
   Negative Contractions
========================================================== */

addContractionRule({
    description: "Use 'don't' instead of 'do not' in informal contexts",
    condition: (phrase, context) => phrase === "do not" && context.isInformal,
    correction: () => "don't"
});

addContractionRule({
    description: "Use 'can't' instead of 'cannot' in informal contexts",
    condition: (phrase, context) => phrase === "cannot" && context.isInformal,
    correction: () => "can't"
});

addContractionRule({
    description: "Use 'won't' instead of 'will not' in informal contexts",
    condition: (phrase, context) => phrase === "will not" && context.isInformal,
    correction: () => "won't"
});

/* ==========================================================
   Pronoun + Verb Contractions
========================================================== */

addContractionRule({
    description: "Use 'I'm' instead of 'I am' in informal contexts",
    condition: (phrase, context) => phrase === "I am" && context.isInformal,
    correction: () => "I'm"
});

addContractionRule({
    description: "Use 'you're' instead of 'you are' in informal contexts",
    condition: (phrase, context) => phrase === "you are" && context.isInformal,
    correction: () => "you're"
});

addContractionRule({
    description: "Use 'he's' instead of 'he is' in informal contexts",
    condition: (phrase, context) => phrase === "he is" && context.isInformal,
    correction: () => "he's"
});

/* ==========================================================
   Auxiliary Verb Contractions
========================================================== */

addContractionRule({
    description: "Use 'I've' instead of 'I have' in informal contexts",
    condition: (phrase, context) => phrase === "I have" && context.isInformal,
    correction: () => "I've"
});

addContractionRule({
    description: "Use 'we've' instead of 'we have' in informal contexts",
    condition: (phrase, context) => phrase === "we have" && context.isInformal,
    correction: () => "we've"
});

addContractionRule({
    description: "Use 'they've' instead of 'they have' in informal contexts",
    condition: (phrase, context) => phrase === "they have" && context.isInformal,
    correction: () => "they've"
});

/* ==========================================================
   Register Rules
========================================================== */

GrammarEngine.registerRules(
    "contractionRules",
    contractionRules
);

window.contractionRules = contractionRules;
