"use strict";

/* ==========================================================
   English-Bot
   Determiner Rules v9 (Production Ready)
   - Rule-based architecture
   - Handles Demonstratives & Quantifiers
========================================================== */

/**
 * Rule: Demonstrative Agreement (This/These)
 */
const demonstrative_rule = new GrammarRule({
    id: "determiner_demonstrative_rule",
    name: "Demonstrative Agreement",
    category: GrammarCategory.DETERMINER,
    severity: GrammarSeverity.ERROR,
    priority: 30,
    enabled: true,

    test(text, analysis, tokens) {
        if (!analysis.nouns || analysis.nouns.length === 0) return false;
        
        const tokenList = tokens.map(t => t.lower);
        const hasThis = tokenList.includes("this");
        const hasThese = tokenList.includes("these");
        const isPlural = analysis.nouns.length > 1;

        return (hasThis && isPlural) || (hasThese && !isPlural);
    },

    fix(text, analysis, tokens) {
        const isPlural = analysis.nouns.length > 1;
        const correct = isPlural ? "these" : "this";
        const wrong = isPlural ? "this" : "these";
        
        const newText = text.replace(new RegExp(`\\b${wrong}\\b`, 'gi'), correct);
        
        return {
            text: newText,
            issue: true,
            reason: `Use '${correct}' with ${isPlural ? 'plural' : 'singular'} nouns.`
        };
    }
});

/**
 * Rule: Quantifier Agreement (Much/Many)
 */
const quantifier_rule = new GrammarRule({
    id: "determiner_quantifier_rule",
    name: "Quantifier Agreement",
    category: GrammarCategory.DETERMINER,
    severity: GrammarSeverity.ERROR,
    priority: 30,
    enabled: true,

    isUncountable(noun) {
        const list = ["water", "milk", "rice", "air", "information", "advice", "money"];
        return list.includes(noun.toLowerCase());
    },

    test(text, analysis, tokens) {
        if (!analysis.nouns || analysis.nouns.length === 0) return false;
        
        const tokenList = tokens.map(t => t.lower);
        const hasMuch = tokenList.includes("much");
        const hasMany = tokenList.includes("many");
        const isUncountable = this.isUncountable(analysis.nouns[0].lower);

        return (hasMuch && !isUncountable) || (hasMany && isUncountable);
    },

    fix(text, analysis, tokens) {
        const hasMuch = tokens.some(t => t.lower === "much");
        const newText = hasMuch ? text.replace(/\bmuch\b/gi, "many") : text.replace(/\bmany\b/gi, "much");
        
        return {
            text: newText,
            issue: true,
            reason: "Use 'much' for uncountable nouns and 'many' for countable nouns."
        };
    }
});

/* ==========================================================
   REGISTRATION
========================================================== */

GrammarEngine.registerRules([
    demonstrative_rule,
    quantifier_rule
]);
