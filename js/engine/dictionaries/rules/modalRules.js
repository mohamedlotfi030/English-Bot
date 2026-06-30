"use strict";

/* ==========================================================
   English-Bot
   Modal Rules
   Version 5.0
========================================================== */

const modalRules = [];

/* ==========================================================
   Rule Registration
========================================================== */

function addModalRule({
    description,
    condition,
    correction
}) {
    modalRules.push({
        description,
        condition,
        correction
    });
}

/* ==========================================================
   Ability (can/could)
========================================================== */

addModalRule({
    description: "Use 'can' for present ability",
    condition: (modal, tense) => modal.form === "can" && tense !== "present",
    correction: () => "can"
});

addModalRule({
    description: "Use 'could' for past ability or polite requests",
    condition: (modal, tense) => modal.form === "could" && tense !== "past",
    correction: () => "could"
});

/* ==========================================================
   Possibility (may/might)
========================================================== */

addModalRule({
    description: "Use 'may' for formal possibility",
    condition: (modal) => modal.form === "may" && modal.context !== "formal",
    correction: () => "may"
});

addModalRule({
    description: "Use 'might' for less certain possibility",
    condition: (modal) => modal.form === "might" && modal.context !== "uncertain",
    correction: () => "might"
});

/* ==========================================================
   Necessity / Obligation (must/should/shall)
========================================================== */

addModalRule({
    description: "Use 'must' for strong necessity",
    condition: (modal) => modal.form === "must" && modal.context !== "necessity",
    correction: () => "must"
});

addModalRule({
    description: "Use 'should' for advice or mild obligation",
    condition: (modal) => modal.form === "should" && modal.context !== "advice",
    correction: () => "should"
});

addModalRule({
    description: "Use 'shall' for formal obligation or future (rare in modern English)",
    condition: (modal) => modal.form === "shall" && modal.context !== "formal",
    correction: () => "shall"
});

/* ==========================================================
   Prediction / Future (will/would)
========================================================== */

addModalRule({
    description: "Use 'will' for future certainty",
    condition: (modal, tense) => modal.form === "will" && tense !== "future",
    correction: () => "will"
});

addModalRule({
    description: "Use 'would' for hypothetical or polite future",
    condition: (modal, tense) => modal.form === "would" && tense !== "conditional",
    correction: () => "would"
});

/* ==========================================================
   Register Rules
========================================================== */

GrammarEngine.registerRules(
    "modalRules",
    modalRules
);

window.modalRules = modalRules;
