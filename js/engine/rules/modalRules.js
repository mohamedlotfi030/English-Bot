"use strict";

/* ==========================================================
   English-Bot
   Modal Rules v9 (Production Ready)
   - Rule-based architecture
   - Handles Modal Verb constraints
========================================================== */

/**
 * Rule: Modal + Base Verb Constraint
 * Modals must be followed by a base form verb (no -ing, no 'to').
 */
const modal_constraint_rule = new GrammarRule({
    id: "modal_constraint_rule",
    name: "Modal Verb Constraint",
    category: GrammarCategory.MODAL,
    severity: GrammarSeverity.ERROR,
    priority: 30,
    enabled: true,

    test(text, analysis, tokens) {
        if (!analysis.modals || analysis.modals.length === 0) return false;

        return analysis.modals.some(m => {
            const modal = m.lower;
            const modalIndex = tokens.findIndex(t => t.lower === modal);
            const nextToken = tokens[modalIndex + 1]?.lower;

            if (!nextToken) return false;
            // التحقق من الخطأ (وجود -ing أو to)
            return nextToken.endsWith("ing") || nextToken === "to";
        });
    },

    fix(text, analysis, tokens) {
        // القاعدة هنا تنبه المستخدم لأن التصحيح يعتمد على سياق الجملة
        return {
            text: text,
            issue: true,
            reason: "Modal verbs (can, must, should...) must be followed by the base form of the verb. Remove 'to' or the '-ing' suffix."
        };
    }
});

/**
 * Rule: Modal Stacking
 * English does not allow stacking multiple modal verbs (e.g., 'might can').
 */
const modal_stacking_rule = new GrammarRule({
    id: "modal_stacking_rule",
    name: "Modal Stacking",
    category: GrammarCategory.MODAL,
    severity: GrammarSeverity.ERROR,
    priority: 30,
    enabled: true,

    test(text, analysis, tokens) {
        return analysis.modals && analysis.modals.length > 1;
    },

    fix(text, analysis, tokens) {
        return {
            text: text,
            issue: true,
            reason: "You cannot use two modal verbs together. Choose one that best fits the intended meaning."
        };
    }
});

/* ==========================================================
   REGISTRATION
========================================================== */

GrammarEngine.registerRules([
    modal_constraint_rule,
    modal_stacking_rule
]);
