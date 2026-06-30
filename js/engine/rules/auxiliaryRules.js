"use strict";

/* ==========================================================
   English-Bot
   Auxiliary Rules
   Version 5.0
========================================================== */

const auxiliaryRules = [];

/* ==========================================================
   Rule Registration
========================================================== */

function addAuxiliaryRule({
    description,
    condition,
    correction
}) {
    auxiliaryRules.push({
        description,
        condition,
        correction
    });
}

/* ==========================================================
   Be Verb Rules
========================================================== */

addAuxiliaryRule({
    description: "Use 'am/is/are' for present continuous",
    condition: (aux, context) => context.tense === "presentContinuous" && aux.base !== "be",
    correction: (subject) => subject.isSingular ? "is" : "are"
});

addAuxiliaryRule({
    description: "Use 'was/were' for past continuous",
    condition: (aux, context) => context.tense === "pastContinuous" && aux.base !== "be",
    correction: (subject) => subject.isSingular ? "was" : "were"
});

/* ==========================================================
   Have Verb Rules
========================================================== */

addAuxiliaryRule({
    description: "Use 'have/has' for present perfect",
    condition: (aux, context) => context.tense === "presentPerfect" && aux.base !== "have",
    correction: (subject) => subject.isSingular ? "has" : "have"
});

addAuxiliaryRule({
    description: "Use 'had' for past perfect",
    condition: (aux, context) => context.tense === "pastPerfect" && aux.base !== "have",
    correction: () => "had"
});

/* ==========================================================
   Do Verb Rules
========================================================== */

addAuxiliaryRule({
    description: "Use 'do/does' for present simple questions/negatives",
    condition: (aux, context) => context.tense === "present" && context.isQuestionOrNegative && aux.base !== "do",
    correction: (subject) => subject.isSingular ? "does" : "do"
});

addAuxiliaryRule({
    description: "Use 'did' for past simple questions/negatives",
    condition: (aux, context) => context.tense === "past" && context.isQuestionOrNegative && aux.base !== "do",
    correction: () => "did"
});

/* ==========================================================
   Register Rules
========================================================== */

GrammarEngine.registerRules(
    "auxiliaryRules",
    auxiliaryRules
);

window.auxiliaryRules = auxiliaryRules;
