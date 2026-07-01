"use strict";

/* ==========================================================
   English-Bot
   Conditional Rules v9 (Production Ready)
   - Rule-based architecture
   - Handles Conditional Tense mismatch
========================================================== */

/**
 * Rule: Conditional Tense Consistency
 * Detects common mismatches in conditional sentences (e.g., Mixing Past/Future).
 */
const conditional_mismatch_rule = new GrammarRule({
    id: "conditional_mismatch_rule",
    name: "Conditional Tense Consistency",
    category: GrammarCategory.TENSE,
    severity: GrammarSeverity.ERROR,
    priority: 30,
    enabled: true,

    // Helper: دالة فحص علامات الماضي
    containsPastMarkers(tokens) {
        const pastMarkers = ["was", "were", "did", "had", "went", "ate", "saw", "took"];
        return tokens.some(t => pastMarkers.includes(t.lower));
    },

    test(text, analysis, tokens) {
        const tokenList = tokens.map(t => t.lower);
        if (!tokenList.includes("if")) return false;

        const hasPast = this.containsPastMarkers(tokens);
        const hasFuture = tokenList.includes("will");
        const hasHad = tokenList.includes("had");

        // 1. مأزق PastPerfect مع ممارسات خاطئة
        if (hasHad && hasPast && !tokenList.includes("would")) return true;

        // 2. مأزق الخلط بين الماضي والمستقبل في الـ Conditional
        if (hasPast && hasFuture) return true;

        // 3. التحقق من هيكل الجملة (الشرط يتطلب فاعل)
        if (!analysis.subject) return true;

        return false;
    },

    fix(text, analysis, tokens) {
        return {
            text: text,
            issue: true,
            reason: "Check your conditional tense structure (e.g., consistency between 'if' clause and main clause)."
        };
    }
});

/* ==========================================================
   REGISTRATION
========================================================== */

GrammarEngine.registerRules([
    conditional_mismatch_rule
]);
