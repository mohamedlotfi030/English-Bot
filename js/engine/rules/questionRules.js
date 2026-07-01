"use strict";

/* ==========================================================
   English-Bot
   Question Rules
   Version 7.0 (Clean Compatible)
========================================================== */

const questionRules = [];

/* ==========================================================
   Helper
========================================================== */

function addQuestionRule(rule) {
    questionRules.push(rule);
}

/* ==========================================================
   Yes/No Questions
========================================================== */

addQuestionRule({
    id: "question_yes_no_aux",
    category: "QUESTION",
    priority: 100,

    test(sentence, context) {
        return context.type === "yesNo" && !/^(do|does|did|is|are|was|were|can|will|have)\b/i.test(sentence);
    },

    fix(sentence, context) {
        const aux = context.auxiliary || "do";
        return {
            text: aux + " " + sentence,
            issue: true,
            reason: "Yes/No questions need auxiliary before subject"
        };
    }
});

/* ==========================================================
   Wh-Questions (Start Position)
========================================================== */

addQuestionRule({
    id: "question_wh_order",
    category: "QUESTION",
    priority: 200,

    test(sentence, context) {
        return context.type === "wh" && !/^(what|why|how|when|where|who|which)\b/i.test(sentence);
    },

    fix(sentence, context) {
        const wh = context.whWord || "what";
        return {
            text: wh + " " + sentence,
            issue: true
        };
    }
});

/* ==========================================================
   Wh + Auxiliary Order
========================================================== */

addQuestionRule({
    id: "question_wh_aux",
    category: "QUESTION",
    priority: 180,

    test(sentence, context) {
        return context.type === "wh" && !context.hasAuxiliary;
    },

    fix(sentence, context) {
        const aux = context.auxiliary || "do";
        return {
            text: sentence.replace(/^(what|why|how|when|where|who|which)\s+/i, (m) => m + aux + " "),
            issue: true
        };
    }
});

/* ==========================================================
   Tag Questions
========================================================== */

addQuestionRule({
    id: "question_tag",
    category: "QUESTION",
    priority: 150,

    test(sentence, context) {
        return context.type === "tag" && !context.hasTag;
    },

    fix(sentence, context) {
        const aux = context.auxiliary || "is";
        const pronoun = context.pronoun || "it";

        return {
            text: sentence + ", " + aux + " " + pronoun + "?",
            issue: true
        };
    }
});

/* ==========================================================
   Register Rules
========================================================== */

GrammarEngine.registerMany(questionRules);

window.questionRules = questionRules;
