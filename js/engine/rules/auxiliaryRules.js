"use strict";

/* ==========================================================
   English-Bot
   Auxiliary Rules v9 (Production Ready)
   - Rule-based architecture (Be, Have, Do)
   - Compatible with existing Analyzer/Corrector
========================================================== */

/**
 * Rule 1: Be-Verb Agreement
 */
const auxiliary_be_rule = new GrammarRule({
    id: "aux_be_rule",
    name: "Be-Verb Agreement",
    category: GrammarCategory.AUXILIARY,
    severity: GrammarSeverity.ERROR,
    priority: 10,

    test(text, analysis, tokens) {
        const sub = analysis.subject?.toLowerCase();
        const v = analysis.verbForm?.toLowerCase();
        if (!sub || !v) return false;

        if (["he", "she", "it"].includes(sub) && v === "are") return true;
        if (["we", "you", "they"].includes(sub) && v === "is") return true;
        return false;
    },

    fix(text, analysis, tokens) {
        const sub = analysis.subject?.toLowerCase();
        const correctV = ["he", "she", "it"].includes(sub) ? "is" : "are";
        const newText = text.replace(new RegExp(`\\b${analysis.verbForm}\\b`, 'i'), correctV);
        
        return {
            text: newText,
            issue: true,
            reason: `Use '${correctV}' for subject '${sub}'.`
        };
    }
});

/**
 * Rule 2: Perfect Tense Auxiliary (Have/Had)
 */
const auxiliary_perfect_rule = new GrammarRule({
    id: "aux_perfect_rule",
    name: "Perfect Tense Auxiliary",
    category: GrammarCategory.AUXILIARY,
    severity: GrammarSeverity.ERROR,
    priority: 15,

    test(text, analysis, tokens) {
        const wordList = tokens.map(t => t.lower);
        if (analysis.tense === "presentPerfect" && !wordList.includes("have") && !wordList.includes("has")) return true;
        if (analysis.tense === "pastPerfect" && !wordList.includes("had")) return true;
        return false;
    },

    fix(text, analysis, tokens) {
        // في هذا النوع من الأخطاء، التصحيح يتطلب إضافة كلمة، لذا سنشير إلى مكان إضافتها
        return {
            text: text, // المحرك سيقوم بإعادة البناء
            issue: true,
            reason: `Perfect tenses require an auxiliary verb (have/has/had).`
        };
    }
});

/**
 * Rule 3: Do/Does/Did for Questions & Negatives
 */
const auxiliary_do_rule = new GrammarRule({
    id: "aux_do_rule",
    name: "Do Auxiliary",
    category: GrammarCategory.AUXILIARY,
    severity: GrammarSeverity.ERROR,
    priority: 15,

    test(text, analysis, tokens) {
        if (!analysis.question && !analysis.negative) return false;
        const wordList = tokens.map(t => t.lower);
        
        if (analysis.tense === "present" && !wordList.includes("do") && !wordList.includes("does")) return true;
        if (analysis.tense === "past" && !wordList.includes("did")) return true;
        return false;
    },

    fix(text, analysis, tokens) {
        return {
            text: text,
            issue: true,
            reason: "Questions and negatives in simple tenses require the auxiliary 'do/does/did'."
        };
    }
});

/* ==========================================================
   REGISTRATION
========================================================== */

GrammarEngine.registerRules([
    auxiliary_be_rule,
    auxiliary_perfect_rule,
    auxiliary_do_rule
]);
