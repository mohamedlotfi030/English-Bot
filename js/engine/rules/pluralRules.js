"use strict";

/* ==========================================================
   English-Bot
   Plural Rules v9 (Production Ready)
   - Rule-based architecture
   - Handles Agreement and Uncountable constraints
========================================================== */

/**
 * Rule: Uncountable Noun Constraint
 * Flags attempts to pluralize nouns that cannot be pluralized.
 */
const uncountable_plural_rule = new GrammarRule({
    id: "uncountable_plural_rule",
    name: "Uncountable Noun Constraint",
    category: GrammarCategory.MORPHOLOGY,
    severity: GrammarSeverity.ERROR,
    priority: 20,
    enabled: true,

    test(text, analysis, tokens) {
        if (!analysis.nouns) return false;
        return analysis.nouns.some(n => n.isUncountable && n.number === "plural");
    },

    fix(text, analysis, tokens) {
        return {
            text: text,
            issue: true,
            reason: "Uncountable nouns should not be pluralized."
        };
    }
});

/**
 * Rule: Plural Agreement
 * Validates that plural nouns trigger plural agreement in the sentence.
 */
const plural_agreement_rule = new GrammarRule({
    id: "plural_agreement_rule",
    name: "Plural Agreement",
    category: GrammarCategory.SYNTAX,
    severity: GrammarSeverity.INFO,
    priority: 25,
    enabled: true,

    test(text, analysis, tokens) {
        if (!analysis.nouns) return false;
        // التحقق مما إذا كان هناك اسم جمع يحتاج لاتفاق (Agreement)
        return analysis.nouns.some(n => n.number === "plural" && n.isCountable);
    },

    fix(text, analysis, tokens) {
        // هذه القاعدة إعلامية لضبط حالة الجملة، لا تحتاج لتغيير نصي مباشر إلا في سياق الجمع
        return {
            text: text,
            issue: false,
            reason: "Plural noun detected; ensure subject-verb agreement."
        };
    }
});

/* ==========================================================
   REGISTRATION
========================================================== */

GrammarEngine.registerRules([
    uncountable_plural_rule,
    plural_agreement_rule
]);
