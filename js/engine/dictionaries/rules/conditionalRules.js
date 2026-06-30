"use strict";

/* ==========================================================
   English-Bot
   Conditional Rules
   Version 5.0
========================================================== */

const conditionalRules = [];

/* ==========================================================
   Rule Registration
========================================================== */

function addConditionalRule({
    description,
    condition,
    correction
}) {
    conditionalRules.push({
        description,
        condition,
        correction
    });
}

/* ==========================================================
   Zero Conditional
========================================================== */

addConditionalRule({
    description: "Zero conditional: If + present simple, present simple",
    condition: (sentence, context) => context.type === "zeroConditional" && !sentence.isCorrectZeroConditional,
    correction: (sentence) => sentence.toZeroConditional()
});

/* ==========================================================
   First Conditional
========================================================== */

addConditionalRule({
    description: "First conditional: If + present simple, will + base verb",
    condition: (sentence, context) => context.type === "firstConditional" && !sentence.isCorrectFirstConditional,
    correction: (sentence) => sentence.toFirstConditional()
});

/* ==========================================================
   Second Conditional
========================================================== */

addConditionalRule({
    description: "Second conditional: If + past simple, would + base verb",
    condition: (sentence, context) => context.type === "secondConditional" && !sentence.isCorrectSecondConditional,
    correction: (sentence) => sentence.toSecondConditional()
});

/* ==========================================================
   Third Conditional
========================================================== */

addConditionalRule({
    description: "Third conditional: If + past perfect, would have + past participle",
    condition: (sentence, context) => context.type === "thirdConditional" && !sentence.isCorrectThirdConditional,
    correction: (sentence) => sentence.toThirdConditional()
});

/* ==========================================================
   Mixed Conditional
========================================================== */

addConditionalRule({
    description: "Mixed conditional: If + past perfect, would + base verb (present result)",
    condition: (sentence, context) => context.type === "mixedConditional" && !sentence.isCorrectMixedConditional,
    correction: (sentence) => sentence.toMixedConditional()
});

/* ==========================================================
   Register Rules
========================================================== */

GrammarEngine.registerRules(
    "conditionalRules",
    conditionalRules
);

window.conditionalRules = conditionalRules;
