"use strict";

/* ==========================================================
   English-Bot
   Capitalization Rules v9 (Production Ready)
   - Rule-based architecture
   - Independent formatting rules
========================================================== */

/**
 * Rule: Sentence Capitalization
 * Covers: Start of sentence, Pronoun 'I', and post-punctuation capitalization.
 */
const capitalization_rule = new GrammarRule({
    id: "capitalization_rule",
    name: "Capitalization Standard",
    description: "Ensures proper capitalization for sentence starts, pronoun 'I', and after punctuation.",
    category: GrammarCategory.FORMATTING,
    severity: GrammarSeverity.INFO,
    priority: 5, // أولوية عالية جداً لأنها تنسيق أساسي
    enabled: true,

    test(text, analysis, tokens) {
        // فحص سريع إذا كان هناك أي حرف صغير يحتاج لتكبير
        const needsCap = /(^\s*[a-z])|(\bi\b)|([.!?]\s*[a-z])/i.test(text);
        return needsCap;
    },

    fix(text, analysis, tokens) {
        let result = text;

        // 1. First letter
        result = result.replace(/(^\s*[a-z])/g, (m) => m.toUpperCase());
        
        // 2. Pronoun "i"
        result = result.replace(/\bi\b/g, "I");
        
        // 3. After punctuation
        result = result.replace(/([.!?]\s*)([a-z])/g, (m, p1, p2) => p1 + p2.toUpperCase());

        return {
            text: result,
            issue: true,
            reason: "Capitalization issues corrected."
        };
    }
});

/* ==========================================================
   REGISTRATION
========================================================== */

GrammarEngine.registerRules([
    capitalization_rule
]);
