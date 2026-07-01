"use strict";

/* ==========================================================
   English-Bot
   Infinitive Rules v9 (Production Ready)
   - Rule-based architecture
   - Handles Trigger Verbs, Modals, and Form Conflicts
========================================================== */

/**
 * Rule: Trigger Verb + Infinitive
 * Ensures verbs like 'want' are followed by 'to'.
 */
const trigger_infinitive_rule = new GrammarRule({
    id: "infinitive_trigger_rule",
    name: "Trigger Verb + Infinitive",
    category: GrammarCategory.INFINITIVE,
    severity: GrammarSeverity.ERROR,
    priority: 30,
    enabled: true,

    test(text, analysis, tokens) {
        const triggerVerbs = ["want", "decide", "plan", "hope", "try", "need", "agree"];
        const tokenList = tokens.map(t => t.lower);
        
        return tokenList.some(t => triggerVerbs.includes(t)) && !tokenList.includes("to");
    },

    fix(text, analysis, tokens) {
        return {
            text: text,
            issue: true,
            reason: "Verbs like 'want', 'decide', or 'plan' usually require an infinitive ('to...')."
        };
    }
});

/**
 * Rule: Modal + Bare Infinitive
 * Modals (can, should, must) should NOT be followed by 'to'.
 */
const modal_infinitive_rule = new GrammarRule({
    id: "modal_infinitive_rule",
    name: "Modal + Bare Infinitive",
    category: GrammarCategory.INFINITIVE,
    severity: GrammarSeverity.ERROR,
    priority: 30,
    enabled: true,

    test(text, analysis, tokens) {
        if (!analysis.modals || analysis.modals.length === 0) return false;
        return tokens.some(t => t.lower === "to");
    },

    fix(text, analysis, tokens) {
        const newText = text.replace(/\bto\b/gi, "");
        return {
            text: newText.replace(/\s\s+/g, ' '), // تنظيف المسافات
            issue: true,
            reason: "Modals (can, should, must) should be followed by a bare infinitive, without 'to'."
        };
    }
});

/* ==========================================================
   REGISTRATION
========================================================== */

GrammarEngine.registerRules([
    trigger_infinitive_rule,
    modal_infinitive_rule
]);
