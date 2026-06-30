"use strict";

/* ==========================================================
   English-Bot
   Conjunction Rules
   Version 5.0
========================================================== */

const conjunctionRules = [];

/* ==========================================================
   Rule Registration
========================================================== */

function addConjunctionRule({
    description,
    condition,
    correction
}) {
    conjunctionRules.push({
        description,
        condition,
        correction
    });
}

/* ==========================================================
   Coordinating Conjunctions
========================================================== */

addConjunctionRule({
    description: "Use 'and' to join similar ideas",
    condition: (conj, context) => conj.form !== "and" && context.isSimilarIdeas,
    correction: () => "and"
});

addConjunctionRule({
    description: "Use 'but' to show contrast",
    condition: (conj, context) => conj.form !== "but" && context.isContrast,
    correction: () => "but"
});

addConjunctionRule({
    description: "Use 'or' to show choice/alternative",
    condition: (conj, context) => conj.form !== "or" && context.isChoice,
    correction: () => "or"
});

/* ==========================================================
   Subordinating Conjunctions
========================================================== */

addConjunctionRule({
    description: "Use 'because' to show reason",
    condition: (conj, context) => conj.form !== "because" && context.isReason,
    correction: () => "because"
});

addConjunctionRule({
    description: "Use 'although/though' to show concession",
    condition: (conj, context) => !["although","though"].includes(conj.form) && context.isConcession,
    correction: () => "although"
});

addConjunctionRule({
    description: "Use 'if/unless' to show condition",
    condition: (conj, context) => !["if","unless"].includes(conj.form) && context.isCondition,
    correction: () => "if"
});

addConjunctionRule({
    description: "Use 'while/whereas' to show contrast in actions",
    condition: (conj, context) => !["while","whereas"].includes(conj.form) && context.isActionContrast,
    correction: () => "while"
});

/* ==========================================================
   Correlative Conjunctions
========================================================== */

addConjunctionRule({
    description: "Use 'either...or' for alternatives",
    condition: (conj, context) => conj.form !== "either...or" && context.isAlternative,
    correction: () => "either...or"
});

addConjunctionRule({
    description: "Use 'neither...nor' for negative alternatives",
    condition: (conj, context) => conj.form !== "neither...nor" && context.isNegativeAlternative,
    correction: () => "neither...nor"
});

addConjunctionRule({
    description: "Use 'not only...but also' for emphasis",
    condition: (conj, context) => conj.form !== "not only...but also" && context.isEmphasis,
    correction: () => "not only...but also"
});

/* ==========================================================
   Register Rules
========================================================== */

GrammarEngine.registerRules(
    "conjunctionRules",
    conjunctionRules
);

window.conjunctionRules = conjunctionRules;
