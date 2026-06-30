"use strict";

/* ==========================================================
   English-Bot
   Tense Rules
   Version 5.0
========================================================== */

const tenseRules = [];

/* ==========================================================
   Rule Registration
========================================================== */

function addTenseRule({
    description,
    condition,
    correction
}) {
    tenseRules.push({
        description,
        condition,
        correction
    });
}

/* ==========================================================
   Present Simple
========================================================== */

addTenseRule({
    description: "Use present simple for habits and facts",
    condition: (sentence, context) => context.isHabitOrFact && !sentence.isPresentSimple,
    correction: (sentence) => sentence.toPresentSimple()
});

/* ==========================================================
   Present Continuous
========================================================== */

addTenseRule({
    description: "Use present continuous for actions happening now",
    condition: (sentence, context) => context.isActionNow && !sentence.isPresentContinuous,
    correction: (sentence) => sentence.toPresentContinuous()
});

/* ==========================================================
   Past Simple
========================================================== */

addTenseRule({
    description: "Use past simple for completed actions in the past",
    condition: (sentence, context) => context.isCompletedPast && !sentence.isPastSimple,
    correction: (sentence) => sentence.toPastSimple()
});

/* ==========================================================
   Past Continuous
========================================================== */

addTenseRule({
    description: "Use past continuous for ongoing actions in the past",
    condition: (sentence, context) => context.isOngoingPast && !sentence.isPastContinuous,
    correction: (sentence) => sentence.toPastContinuous()
});

/* ==========================================================
   Future Simple
========================================================== */

addTenseRule({
    description: "Use future simple (will + verb) for predictions or decisions",
    condition: (sentence, context) => context.isFuturePrediction && !sentence.isFutureSimple,
    correction: (sentence) => sentence.toFutureSimple()
});

/* ==========================================================
   Future Continuous
========================================================== */

addTenseRule({
    description: "Use future continuous for actions in progress at a future time",
    condition: (sentence, context) => context.isFutureOngoing && !sentence.isFutureContinuous,
    correction: (sentence) => sentence.toFutureContinuous()
});

/* ==========================================================
   Present Perfect
========================================================== */

addTenseRule({
    description: "Use present perfect for actions with relevance to the present",
    condition: (sentence, context) => context.isPresentRelevance && !sentence.isPresentPerfect,
    correction: (sentence) => sentence.toPresentPerfect()
});

/* ==========================================================
   Past Perfect
========================================================== */

addTenseRule({
    description: "Use past perfect for actions completed before another past action",
    condition: (sentence, context) => context.isPastBeforePast && !sentence.isPastPerfect,
    correction: (sentence) => sentence.toPastPerfect()
});

/* ==========================================================
   Future Perfect
========================================================== */

addTenseRule({
    description: "Use future perfect for actions completed before a future time",
    condition: (sentence, context) => context.isFutureBeforeFuture && !sentence.isFuturePerfect,
    correction: (sentence) => sentence.toFuturePerfect()
});

/* ==========================================================
   Register Rules
========================================================== */

GrammarEngine.registerRules(
    "tenseRules",
    tenseRules
);

window.tenseRules = tenseRules;
