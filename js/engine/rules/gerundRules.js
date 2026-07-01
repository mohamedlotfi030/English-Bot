"use strict";

/* ==========================================================
   English-Bot
   Gerund Rules v9 (Production Ready)
   - Rule-based architecture
   - Handles Preposition+Gerund and Verb+Gerund patterns
========================================================== */

/**
 * Rule: Preposition + Gerund
 * Validates that verbs following prepositions are in gerund (-ing) form.
 */
const preposition_gerund_rule = new GrammarRule({
    id: "prep_gerund_rule",
    name: "Preposition + Gerund",
    category: GrammarCategory.GERUND,
    severity: GrammarSeverity.ERROR,
    priority: 30,
    enabled: true,

    test(text, analysis, tokens) {
        if (!analysis.prepositions || analysis.prepositions.length === 0) return false;
        if (!analysis.verbs || analysis.verbs.length === 0) return false;

        return analysis.verbs.some(v => !v.lower.endsWith("ing"));
    },

    fix(text, analysis, tokens) {
        return {
            text: text, // المحرك سيقوم بتطبيق التصحيح التحويلي
            issue: true,
            reason: "Verbs after prepositions should be in gerund form (ending in -ing)."
        };
    }
});

/**
 * Rule: Verb + Gerund Pattern
 * Detects verbs that require a gerund instead of an infinitive.
 */
const verb_gerund_rule = new GrammarRule({
    id: "verb_gerund_rule",
    name: "Verb + Gerund Pattern",
    category: GrammarCategory.GERUND,
    severity: GrammarSeverity.ERROR,
    priority: 30,
    enabled: true,

    test(text, analysis, tokens) {
        const triggerVerbs = ["enjoy", "avoid", "suggest", "consider", "finish", "stop", "mind"];
        const tokenList = tokens.map(t => t.lower);
        
        const hasTrigger = tokenList.some(t => triggerVerbs.includes(t));
        const hasInfinitive = tokenList.includes("to");

        return hasTrigger && hasInfinitive;
    },

    fix(text, analysis, tokens) {
        return {
            text: text,
            issue: true,
            reason: "This verb is followed by a gerund (-ing), not an infinitive (to...)."
        };
    }
});

/* ==========================================================
   REGISTRATION
========================================================== */

GrammarEngine.registerRules([
    preposition_gerund_rule,
    verb_gerund_rule
]);
