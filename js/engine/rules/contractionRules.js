"use strict";

/* ==========================================================
   English-Bot
   Contraction Rules v9 (Production Ready)
   - Rule-based architecture
   - Style/Register aware
========================================================== */

/**
 * Rule: Formal to Informal Contraction
 * Applies contractions based on context.
 */
const contraction_rule = new GrammarRule({
    id: "contraction_rule",
    name: "Contractions",
    category: GrammarCategory.STYLE,
    severity: GrammarSeverity.INFO,
    priority: 50,
    enabled: true,

    test(text, analysis, tokens) {
        // القاعدة تعمل فقط إذا كان السياق غير رسمي (Informal)
        return analysis.context?.isInformal === true;
    },

    fix(text, analysis, tokens) {
        let result = text;

        // تطبيق الـ Mappings
        const contractions = {
            "do not": "don't",
            "cannot": "can't",
            "will not": "won't",
            "I am": "I'm",
            "you are": "you're",
            "he is": "he's",
            "I have": "I've",
            "we have": "we've",
            "they have": "they've"
        };

        for (const [formal, informal] of Object.entries(contractions)) {
            const regex = new RegExp(`\\b${formal}\\b`, 'gi');
            result = result.replace(regex, informal);
        }

        return {
            text: result,
            issue: true,
            reason: "Contractions applied for informal style."
        };
    }
});

/* ==========================================================
   REGISTRATION
========================================================== */

GrammarEngine.registerRules([
    contraction_rule
]);
