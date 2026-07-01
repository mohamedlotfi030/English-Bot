"use strict";

/* ==========================================================
   English-Bot
   Negative Rules v9 (Production Ready)
   - Rule-based architecture
   - Handles Do-support and Double Negation
========================================================== */

/**
 * Rule: Do-Support for Negation
 * Ensures 'do/does/did' are used for negations in simple tenses.
 */
const do_support_negation_rule = new GrammarRule({
    id: "do_support_negation_rule",
    name: "Do-Support Negation",
    category: GrammarCategory.NEGATION,
    severity: GrammarSeverity.ERROR,
    priority: 20,
    enabled: true,

    test(text, analysis, tokens) {
        const hasNot = tokens.some(t => t.lower === "not");
        const hasAux = analysis.auxiliaries && analysis.auxiliaries.length > 0;
        
        return hasNot && !hasAux && (analysis.tense === "present" || analysis.tense === "past");
    },

    fix(text, analysis, tokens) {
        const support = analysis.tense === "past" ? "did" : "do"; // تبسيط
        return {
            text: text,
            issue: true,
            reason: `Negation in simple tenses requires auxiliary 'do/does/did' (e.g., 'do not', 'did not').`
        };
    }
});

/**
 * Rule: Double Negation
 * Identifies and flags double negative structures (e.g., "I don't know nothing").
 */
const double_negation_rule = new GrammarRule({
    id: "double_negation_rule",
    name: "Double Negation",
    category: GrammarCategory.NEGATION,
    severity: GrammarSeverity.WARNING,
    priority: 25,
    enabled: true,

    test(text, analysis, tokens) {
        const negativeWords = ["not", "never", "no", "nothing", "nobody"];
        const countNeg = tokens.filter(t => negativeWords.includes(t.lower)).length;
        
        return countNeg > 1;
    },

    fix(text, analysis, tokens) {
        return {
            text: text,
            issue: true,
            reason: "Double negation is generally incorrect in English. Use only one negative per clause."
        };
    }
});

/* ==========================================================
   REGISTRATION
========================================================== */

GrammarEngine.registerRules([
    do_support_negation_rule,
    double_negation_rule
]);
