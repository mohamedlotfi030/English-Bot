"use strict";

/* ==========================================================
   English-Bot
   Preposition Rules
   Version 5.0
========================================================== */

const prepositionRules = [];

/* ==========================================================
   Rule Registration
========================================================== */

function addPrepositionRule({
    description,
    condition,
    correction
}) {
    prepositionRules.push({
        description,
        condition,
        correction
    });
}

/* ==========================================================
   Time Prepositions
========================================================== */

addPrepositionRule({
    description: "Use 'at' with specific times",
    condition: (prep, context) => context.type === "time" && context.isSpecific && prep !== "at",
    correction: () => "at"
});

addPrepositionRule({
    description: "Use 'on' with days and dates",
    condition: (prep, context) => context.type === "time" && context.isDayOrDate && prep !== "on",
    correction: () => "on"
});

addPrepositionRule({
    description: "Use 'in' with months, years, centuries, long periods",
    condition: (prep, context) => context.type === "time" && context.isLongPeriod && prep !== "in",
    correction: () => "in"
});

/* ==========================================================
   Place Prepositions
========================================================== */

addPrepositionRule({
    description: "Use 'in' for enclosed spaces or countries/cities",
    condition: (prep, context) => context.type === "place" && context.isEnclosed && prep !== "in",
    correction: () => "in"
});

addPrepositionRule({
    description: "Use 'on' for surfaces",
    condition: (prep, context) => context.type === "place" && context.isSurface && prep !== "on",
    correction: () => "on"
});

addPrepositionRule({
    description: "Use 'at' for specific points or addresses",
    condition: (prep, context) => context.type === "place" && context.isPoint && prep !== "at",
    correction: () => "at"
});

/* ==========================================================
   Direction Prepositions
========================================================== */

addPrepositionRule({
    description: "Use 'to' for movement toward a destination",
    condition: (prep, context) => context.type === "direction" && context.isDestination && prep !== "to",
    correction: () => "to"
});

addPrepositionRule({
    description: "Use 'into' for movement inside an enclosed space",
    condition: (prep, context) => context.type === "direction" && context.isEnclosed && prep !== "into",
    correction: () => "into"
});

addPrepositionRule({
    description: "Use 'onto' for movement onto a surface",
    condition: (prep, context) => context.type === "direction" && context.isSurface && prep !== "onto",
    correction: () => "onto"
});

/* ==========================================================
   Register Rules
========================================================== */

GrammarEngine.registerRules(
    "prepositionRules",
    prepositionRules
);

window.prepositionRules = prepositionRules;
