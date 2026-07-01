"use strict";

/* ==========================================================
   English-Bot
   Word Order Rules
   Version 7.0
========================================================== */

const wordOrderRules = [];

/* ==========================================================
   Subject + Verb + Object (SVO)
========================================================== */

wordOrderRules.push({
    id: "svo_order",
    type: "word_order",
    priority: 10,

    description: "Ensure Subject + Verb + Object order in statements",

    test(sentence, context) {
        return context.type === "statement" && !context.isSVO;
    },

    fix(sentence) {
        return sentence.toSVO?.() || sentence;
    }
});

/* ==========================================================
   Question Inversion
========================================================== */

wordOrderRules.push({
    id: "question_inversion",
    type: "word_order",
    priority: 20,

    description: "Invert subject and auxiliary in questions",

    test(sentence, context) {
        return context.type === "question" && !context.isInverted;
    },

    fix(sentence) {
        return sentence.invertSubjectAuxiliary?.() || sentence;
    }
});

/* ==========================================================
   Adverb Placement
========================================================== */

wordOrderRules.push({
    id: "adverb_placement",
    type: "word_order",
    priority: 30,

    description: "Place frequency adverbs before main verb but after auxiliary",

    test(sentence, context) {
        return context.hasFrequencyAdverb && !context.isCorrectAdverbPlacement;
    },

    fix(sentence) {
        return sentence.fixAdverbPlacement?.() || sentence;
    }
});

/* ==========================================================
   Negative Placement
========================================================== */

wordOrderRules.push({
    id: "negative_placement",
    type: "word_order",
    priority: 40,

    description: "Place 'not' after auxiliary verb",

    test(sentence, context) {
        return context.isNegative && !context.hasNotAfterAuxiliary;
    },

    fix(sentence) {
        return sentence.fixNegativePlacement?.() || sentence;
    }
});

/* ==========================================================
   REGISTER
========================================================== */

GrammarEngine.registerRules("word_order", wordOrderRules);

window.wordOrderRules = wordOrderRules;
