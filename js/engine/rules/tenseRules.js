"use strict";

/* ==========================================================
   English-Bot
   Tense Rules
   Version 7.0
========================================================== */

const tenseRules = [];

/* ==========================================================
   Present Simple
========================================================== */

tenseRules.push({
    id: "present_simple",
    type: "tense",
    priority: 10,

    description: "Use present simple for habits and facts",

    test(sentence, context) {
        return context.isHabitOrFact && !context.isPresentSimple;
    },

    fix(sentence) {
        return sentence.toPresentSimple?.() || sentence;
    }
});

/* ==========================================================
   Present Continuous
========================================================== */

tenseRules.push({
    id: "present_continuous",
    type: "tense",
    priority: 20,

    description: "Use present continuous for actions happening now",

    test(sentence, context) {
        return context.isActionNow && !context.isPresentContinuous;
    },

    fix(sentence) {
        return sentence.toPresentContinuous?.() || sentence;
    }
});

/* ==========================================================
   Past Simple
========================================================== */

tenseRules.push({
    id: "past_simple",
    type: "tense",
    priority: 30,

    description: "Use past simple for completed actions in the past",

    test(sentence, context) {
        return context.isCompletedPast && !context.isPastSimple;
    },

    fix(sentence) {
        return sentence.toPastSimple?.() || sentence;
    }
});

/* ==========================================================
   Past Continuous
========================================================== */

tenseRules.push({
    id: "past_continuous",
    type: "tense",
    priority: 40,

    description: "Use past continuous for ongoing actions in the past",

    test(sentence, context) {
        return context.isOngoingPast && !context.isPastContinuous;
    },

    fix(sentence) {
        return sentence.toPastContinuous?.() || sentence;
    }
});

/* ==========================================================
   Future Simple
========================================================== */

tenseRules.push({
    id: "future_simple",
    type: "tense",
    priority: 50,

    description: "Use future simple (will + verb) for predictions or decisions",

    test(sentence, context) {
        return context.isFuturePrediction && !context.isFutureSimple;
    },

    fix(sentence) {
        return sentence.toFutureSimple?.() || sentence;
    }
});

/* ==========================================================
   Future Continuous
========================================================== */

tenseRules.push({
    id: "future_continuous",
    type: "tense",
    priority: 60,

    description: "Use future continuous for actions in progress at a future time",

    test(sentence, context) {
        return context.isFutureOngoing && !context.isFutureContinuous;
    },

    fix(sentence) {
        return sentence.toFutureContinuous?.() || sentence;
    }
});

/* ==========================================================
   Present Perfect
========================================================== */

tenseRules.push({
    id: "present_perfect",
    type: "tense",
    priority: 70,

    description: "Use present perfect for actions with relevance to the present",

    test(sentence, context) {
        return context.isPresentRelevance && !context.isPresentPerfect;
    },

    fix(sentence) {
        return sentence.toPresentPerfect?.() || sentence;
    }
});

/* ==========================================================
   Past Perfect
========================================================== */

tenseRules.push({
    id: "past_perfect",
    type: "tense",
    priority: 80,

    description: "Use past perfect for actions completed before another past action",

    test(sentence, context) {
        return context.isPastBeforePast && !context.isPastPerfect;
    },

    fix(sentence) {
        return sentence.toPastPerfect?.() || sentence;
    }
});

/* ==========================================================
   Future Perfect
========================================================== */

tenseRules.push({
    id: "future_perfect",
    type: "tense",
    priority: 90,

    description: "Use future perfect for actions completed before a future time",

    test(sentence, context) {
        return context.isFutureBeforeFuture && !context.isFuturePerfect;
    },

    fix(sentence) {
        return sentence.toFuturePerfect?.() || sentence;
    }
});

/* ==========================================================
   REGISTER
========================================================== */

GrammarEngine.registerRules("tense", tenseRules);

window.tenseRules = tenseRules;
