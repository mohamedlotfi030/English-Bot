"use strict";

/* ==========================================================
   English-Bot
   Question Rules v9 (Production Ready)
   - Rule-based architecture
   - Handles Yes/No, Wh-, and Tag questions
========================================================== */

/**
 * Rule: Yes/No Question (Inversion)
 */
const yes_no_question_rule = new GrammarRule({
    id: "question_yes_no_aux",
    name: "Yes/No Question Inversion",
    category: GrammarCategory.QUESTION,
    severity: GrammarSeverity.ERROR,
    priority: 100,
    enabled: true,

    test(text, analysis, tokens) {
        if (analysis.sentenceType !== "yesNo") return false;
        const auxList = /^(do|does|did|is|are|was|were|can|will|have)\b/i;
        return !auxList.test(text);
    },

    fix(text, analysis, tokens) {
        const aux = analysis.auxiliary || "do";
        return {
            text: `${aux} ${text}`,
            issue: true,
            reason: "Yes/No questions require an auxiliary verb at the start."
        };
    }
});

/**
 * Rule: Wh- Question Order
 */
const wh_question_rule = new GrammarRule({
    id: "question_wh_order",
    name: "Wh- Question Structure",
    category: GrammarCategory.QUESTION,
    severity: GrammarSeverity.ERROR,
    priority: 200,
    enabled: true,

    test(text, analysis, tokens) {
        if (analysis.sentenceType !== "wh") return false;
        const whList = /^(what|why|how|when|where|who|which)\b/i;
        return !whList.test(text);
    },

    fix(text, analysis, tokens) {
        const wh = analysis.whWord || "what";
        return {
            text: `${wh} ${text}`,
            issue: true,
            reason: "Wh- questions must start with a wh- word."
        };
    }
});

/**
 * Rule: Tag Question
 */
const tag_question_rule = new GrammarRule({
    id: "question_tag",
    name: "Tag Question Completion",
    category: GrammarCategory.QUESTION,
    severity: GrammarSeverity.WARNING,
    priority: 150,
    enabled: true,

    test(text, analysis, tokens) {
        return analysis.sentenceType === "tag" && !analysis.hasTag;
    },

    fix(text, analysis, tokens) {
        const aux = analysis.auxiliary || "is";
        const pronoun = analysis.pronoun || "it";
        return {
            text: `${text}, ${aux} ${pronoun}?`,
            issue: true,
            reason: "Tag question incomplete."
        };
    }
});

/* ==========================================================
   REGISTRATION
========================================================== */

GrammarEngine.registerRules([
    yes_no_question_rule,
    wh_question_rule,
    tag_question_rule
]);
