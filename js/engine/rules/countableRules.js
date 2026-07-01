"use strict";

/* ==========================================================
   English-Bot
   Countable Rules v9 (Production Ready)
   - Rule-based architecture
   - Handles Much/Many quantifiers
========================================================== */

/**
 * Rule: Quantifier Agreement (Much/Many)
 */
const quantifier_agreement_rule = new GrammarRule({
    id: "quantifier_agreement_rule",
    name: "Quantifier Agreement",
    category: GrammarCategory.QUANTIFIER,
    severity: GrammarSeverity.ERROR,
    priority: 35,
    enabled: true,

    // Helper: قائمة الأسماء غير المعدودة (يُنصح بنقلها لاحقاً لـ RuleUtils.js)
    isUncountable(noun) {
        const uncountables = ["water", "milk", "rice", "air", "information", "advice", "money", "music"];
        return uncountables.includes(noun.toLowerCase());
    },

    test(text, analysis, tokens) {
        if (!analysis.nouns || analysis.nouns.length === 0) return false;
        
        const tokenList = tokens.map(t => t.lower);
        const hasMuch = tokenList.includes("much");
        const hasMany = tokenList.includes("many");
        
        // التحقق من وجود خطأ في الاستخدام
        return analysis.nouns.some(n => {
            const isUncountable = this.isUncountable(n.lower);
            return (hasMuch && !isUncountable) || (hasMany && isUncountable);
        });
    },

    fix(text, analysis, tokens) {
        let newText = text;
        const hasMuch = tokens.some(t => t.lower === "much");
        
        // تبديل المحدد بناءً على حالة الاسم
        if (hasMuch) {
            newText = text.replace(/\bmuch\b/gi, "many");
        } else {
            newText = text.replace(/\bmany\b/gi, "much");
        }

        return {
            text: newText,
            issue: true,
            reason: "Incorrect quantifier used. Use 'much' for uncountable nouns and 'many' for countable nouns."
        };
    }
});

/* ==========================================================
   REGISTRATION
========================================================== */

GrammarEngine.registerRules([
    quantifier_agreement_rule
]);
