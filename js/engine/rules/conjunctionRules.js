"use strict";

/* ==========================================================
   English-Bot
   Conjunction Rules v9 (Production Ready)
   - Rule-based architecture
   - Handles conjunction usage and sentence complexity
========================================================== */

/**
 * Rule: Conjunction Usage & Complexity
 * Monitors conjunctions and flags overly complex sentence structures.
 */
const conjunction_rule = new GrammarRule({
    id: "conjunction_rule",
    name: "Conjunctions and Complexity",
    category: GrammarCategory.CONJUNCTION,
    severity: GrammarSeverity.INFO,
    priority: 40,
    enabled: true,

    test(text, analysis, tokens) {
        const connectors = ["and", "but", "or", "because", "if"];
        const tokenList = tokens.map(t => t.lower);
        
        // التحقق من وجود روابط معينة (يمكن توسيع هذا المنطق حسب الحاجة)
        const conjunctionCount = connectors.filter(c => tokenList.includes(c)).length;
        
        // التحذير إذا كانت الجملة مركبة بشكل مفرط
        return conjunctionCount > 2;
    },

    fix(text, analysis, tokens) {
        return {
            text: text,
            issue: true,
            reason: "This sentence is quite complex; consider breaking it into shorter sentences for better readability."
        };
    }
});

/* ==========================================================
   REGISTRATION
========================================================== */

GrammarEngine.registerRules([
    conjunction_rule
]);
