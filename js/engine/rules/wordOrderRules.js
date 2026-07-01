"use strict";

/* ==========================================================
   English-Bot
   Word Order Rules v9 (Production Ready)
   - Rule-based architecture
   - Handles SVO, Inversion, and Adverb/Negative placement
========================================================== */

/**
 * Rule: SVO Order Consistency
 */
const svo_order_rule = new GrammarRule({
    id: "order_svo",
    name: "SVO Order",
    category: GrammarCategory.WORD_ORDER,
    severity: GrammarSeverity.ERROR,
    priority: 10,
    enabled: true,

    test(text, analysis, tokens) {
        return analysis.sentenceType === "statement" && !analysis.isSVO;
    },

    fix(text, analysis, tokens) {
        return {
            text: analysis.toSVO?.() || text,
            issue: true,
            reason: "Standard English statements follow Subject-Verb-Object order."
        };
    }
});

/**
 * Rule: Question Inversion
 */
const question_inversion_rule = new GrammarRule({
    id: "order_question_inversion",
    name: "Question Inversion",
    category: GrammarCategory.WORD_ORDER,
    severity: GrammarSeverity.ERROR,
    priority: 20,
    enabled: true,

    test(text, analysis, tokens) {
        return analysis.sentenceType === "question" && !analysis.isInverted;
    },

    fix(text, analysis, tokens) {
        return {
            text: analysis.invertSubjectAuxiliary?.() || text,
            issue: true,
            reason: "Questions require inversion of subject and auxiliary."
        };
    }
});

/**
 * Rule: Adverb Placement
 */
const adverb_placement_rule = new GrammarRule({
    id: "order_adverb",
    name: "Adverb Placement",
    category: GrammarCategory.WORD_ORDER,
    severity: GrammarSeverity.WARNING,
    priority: 30,
    enabled: true,

    test(text, analysis, tokens) {
        return analysis.hasFrequencyAdverb && !analysis.isCorrectAdverbPlacement;
    },

    fix(text, analysis, tokens) {
        return {
            text: analysis.fixAdverbPlacement?.() || text,
            issue: true,
            reason: "Adverbs of frequency usually go before the main verb and after the auxiliary."
        };
    }
});

/**
 * Rule: Negative Placement
 */
const negative_placement_rule = new GrammarRule({
    id: "order_negative",
    name: "Negative Placement",
    category: GrammarCategory.WORD_ORDER,
    severity: GrammarSeverity.ERROR,
    priority: 40,
    enabled: true,

    test(text, analysis, tokens) {
        return analysis.isNegative && !analysis.hasNotAfterAuxiliary;
    },

    fix(text, analysis, tokens) {
        return {
            text: analysis.fixNegativePlacement?.() || text,
            issue: true,
            reason: "Place 'not' immediately after the auxiliary verb."
        };
    }
});

/* ==========================================================
   REGISTRATION
========================================================== */

GrammarEngine.registerRules([
    svo_order_rule,
    question_inversion_rule,
    adverb_placement_rule,
    negative_placement_rule
]);
