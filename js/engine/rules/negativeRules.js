"use strict";

/* ==========================================================
   English-Bot
   Negative Rules
   Version 5.0
========================================================== */

const negativeRules = [];

/* ==========================================================
   Rule Registration
========================================================== */

function addNegativeRule({
    description,
    condition,
    correction
}) {
    negativeRules.push({
        description,
        condition,
        correction
    });
}

/* ==========================================================
   Present Simple Negatives
========================================================== */

addNegativeRule({
    description: "Use 'do not/don’t' with plural subjects in present simple",
    condition: (verb, context) => context.tense === "present" && context.isPlural && !context.isNegative,
    correction: () => "do not"
});

addNegativeRule({
    description: "Use 'does not/doesn’t' with singular third-person subjects in present simple",
    condition: (verb, context) => context.tense === "present" && context.isThirdPersonSingular && !context.isNegative,
    correction: () => "does not"
});

/* ==========================================================
   Past Simple Negatives
========================================================== */

addNegativeRule({
    description: "Use 'did not/didn’t' for past simple negatives",
    condition: (verb, context) => context.tense === "past" && !context.isNegative,
    correction: () => "did not"
});

/* ==========================================================
   Be Verb Negatives
========================================================== */

addNegativeRule({
    description: "Use 'is not/isn’t' with singular present subjects",
    condition: (verb, context) => verb.base === "be" && context.tense === "present" && context.isSingular && !context.isNegative,
    correction: () => "is not"
});

addNegativeRule({
    description: "Use 'are not/aren’t' with plural present subjects",
    condition: (verb, context) => verb.base === "be" && context.tense === "present" && context.isPlural && !context.isNegative,
    correction: () => "are not"
});

addNegativeRule({
    description: "Use 'was not/wasn’t' with singular past subjects",
    condition: (verb, context) => verb.base === "be" && context.tense === "past" && context.isSingular && !context.isNegative,
    correction: () => "was not"
});

addNegativeRule({
    description: "Use 'were not/weren’t' with plural past subjects",
    condition: (verb, context) => verb.base === "be" && context.tense === "past" && context.isPlural && !context.isNegative,
    correction: () => "were not"
});

/* ==========================================================
   Modal Verb Negatives
========================================================== */

addNegativeRule({
    description: "Use 'cannot/can’t' for negative ability",
    condition: (verb, context) => verb.base === "can" && !context.isNegative,
    correction: () => "cannot"
});

addNegativeRule({
    description: "Use 'will not/won’t' for negative future",
    condition: (verb, context) => verb.base === "will" && !context.isNegative,
    correction: () => "will not"
});

/* ==========================================================
   Register Rules
========================================================== */

GrammarEngine.registerRules(
    "negativeRules",
    negativeRules
);

window.negativeRules = negativeRules;
