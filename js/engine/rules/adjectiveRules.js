"use strict";

/* ==========================================================
   English-Bot
   Adjective Rules v9 (Production Ready)
   - strictly Browser Only
   - Patch-based Fixes
   - O(1) Complexity & Dictionary Lookups
========================================================== */

/**
 * Rule 1: Double Comparative
 * Example: "more better" -> "better"
 */
const double_comparative_rule = new GrammarRule({
    id: "double_comparative_rule",
    name: "Double Comparative",
    description: "Detects incorrect double comparatives like 'more better'.",
    category: GrammarCategory.ADJECTIVE,
    severity: GrammarSeverity.ERROR,
    priority: 30,
    enabled: true,
    
    test(text, analysis, tokens) {
        const dict = GrammarEngine.getDictionary("adjectives");
        
        for (let i = 0; i < tokens.length - 1; i++) {
            const current = GrammarUtils.getTokenText(tokens[i]).toLowerCase();
            const nextWord = GrammarUtils.getTokenText(tokens[i+1]).toLowerCase();

            if (current === "more" && analysis.adjectiveMap.has(nextWord)) {
                const dictEntry = dict.get(nextWord);
                if (dictEntry && dictEntry.isComparative) return true;
            }
        }
        return false;
    },
    
    fix(text, analysis, tokens) {
        const dict = GrammarEngine.getDictionary("adjectives");

        for (let i = 0; i < tokens.length - 1; i++) {
            const current = GrammarUtils.getTokenText(tokens[i]).toLowerCase();
            const nextWord = GrammarUtils.getTokenText(tokens[i+1]).toLowerCase();
            
            if (current === "more" && analysis.adjectiveMap.has(nextWord)) {
                const dictEntry = dict.get(nextWord);
                if (dictEntry && dictEntry.isComparative) {
                    return {
                        issue: true,
                        replaceAt: tokens[i].index,
                        replaceWith: "", 
                        reason: `Avoid double comparatives. The word '${nextWord}' is already comparative.`
                    };
                }
            }
        }
        return { issue: false };
    }
});

/**
 * Rule 2: Double Superlative
 * Example: "most fastest" -> "fastest"
 */
const double_superlative_rule = new GrammarRule({
    id: "double_superlative_rule",
    name: "Double Superlative",
    description: "Detects incorrect double superlatives like 'most fastest'.",
    category: GrammarCategory.ADJECTIVE,
    severity: GrammarSeverity.ERROR,
    priority: 31,
    enabled: true,
    
    test(text, analysis, tokens) {
        const dict = GrammarEngine.getDictionary("adjectives");
        
        for (let i = 0; i < tokens.length - 1; i++) {
            const current = GrammarUtils.getTokenText(tokens[i]).toLowerCase();
            const nextWord = GrammarUtils.getTokenText(tokens[i+1]).toLowerCase();

            if (current === "most" && analysis.adjectiveMap.has(nextWord)) {
                const dictEntry = dict.get(nextWord);
                if (dictEntry && dictEntry.isSuperlative) return true;
            }
        }
        return false;
    },
    
    fix(text, analysis, tokens) {
        const dict = GrammarEngine.getDictionary("adjectives");

        for (let i = 0; i < tokens.length - 1; i++) {
            const current = GrammarUtils.getTokenText(tokens[i]).toLowerCase();
            const nextWord = GrammarUtils.getTokenText(tokens[i+1]).toLowerCase();
            
            if (current === "most" && analysis.adjectiveMap.has(nextWord)) {
                const dictEntry = dict.get(nextWord);
                if (dictEntry && dictEntry.isSuperlative) {
                    return {
                        issue: true,
                        replaceAt: tokens[i].index,
                        replaceWith: "", 
                        reason: `Avoid double superlatives. The word '${nextWord}' is already superlative.`
                    };
                }
            }
        }
        return { issue: false };
    }
});

/**
 * Rule 3: Comparative Adjectives Before 'Than'
 * Example: "He is tall than me" -> "He is taller than me"
 */
const comparative_before_than_rule = new GrammarRule({
    id: "comparative_before_than_rule",
    name: "Comparative Before 'Than'",
    description: "Ensures adjectives immediately preceding 'than' are in their comparative form.",
    category: GrammarCategory.ADJECTIVE,
    severity: GrammarSeverity.ERROR,
    priority: 35,
    enabled: true,
    
    test(text, analysis, tokens) {
        const dict = GrammarEngine.getDictionary("adjectives");

        for (let i = 1; i < tokens.length; i++) {
            const current = GrammarUtils.getTokenText(tokens[i]).toLowerCase();
            
            if (current === "than") {
                const prevWord = GrammarUtils.getTokenText(tokens[i-1]).toLowerCase();
                const prevPrevWord = i > 1 ? GrammarUtils.getTokenText(tokens[i-2]).toLowerCase() : "";
                
                if (analysis.adjectiveMap.has(prevWord) && prevPrevWord !== "more" && prevPrevWord !== "less") {
                    const dictEntry = dict.get(prevWord);
                    if (dictEntry && !dictEntry.isComparative) return true;
                }
            }
        }
        return false;
    },
    
    fix(text, analysis, tokens) {
        const dict = GrammarEngine.getDictionary("adjectives");

        for (let i = 1; i < tokens.length; i++) {
            const current = GrammarUtils.getTokenText(tokens[i]).toLowerCase();
            
            if (current === "than") {
                const prevWord = GrammarUtils.getTokenText(tokens[i-1]).toLowerCase();
                const prevPrevWord = i > 1 ? GrammarUtils.getTokenText(tokens[i-2]).toLowerCase() : "";
                
                if (analysis.adjectiveMap.has(prevWord) && prevPrevWord !== "more" && prevPrevWord !== "less") {
                    const dictEntry = dict.get(prevWord);
                    
                    if (dictEntry && !dictEntry.isComparative && dictEntry.comparativeForm) {
                        return {
                            issue: true,
                            replaceAt: tokens[i-1].index,
                            replaceWith: dictEntry.comparativeForm,
                            reason: `Adjectives used with 'than' must be comparative (e.g., '${dictEntry.comparativeForm}').`
                        };
                    }
                }
            }
        }
        return { issue: false };
    }
});

/**
 * Rule 4: Adjective Order
 * Ensures consecutive adjectives follow proper English order (Opinion, Size, Age, etc.)
 */
const adjective_order_rule = new GrammarRule({
    id: "adjective_order_rule",
    name: "Adjective Order",
    description: "Warns if consecutive adjectives do not follow the standard order.",
    category: GrammarCategory.ADJECTIVE,
    severity: GrammarSeverity.WARNING,
    priority: 40,
    enabled: true,
    
    test(text, analysis, tokens) {
        const dict = GrammarEngine.getDictionary("adjectives");

        for (let i = 0; i < tokens.length - 1; i++) {
            const word1 = GrammarUtils.getTokenText(tokens[i]).toLowerCase();
            const word2 = GrammarUtils.getTokenText(tokens[i+1]).toLowerCase();

            if (analysis.adjectiveMap.has(word1) && analysis.adjectiveMap.has(word2)) {
                const entry1 = dict.get(word1);
                const entry2 = dict.get(word2);

                // Assuming dictionary provides a numeric `orderCategory` (1 = Opinion, 2 = Size, etc.)
                if (entry1 && entry2 && entry1.orderCategory > entry2.orderCategory) {
                    return true;
                }
            }
        }
        return false;
    },
    
    fix(text, analysis, tokens) {
        const dict = GrammarEngine.getDictionary("adjectives");

        for (let i = 0; i < tokens.length - 1; i++) {
            const word1 = GrammarUtils.getTokenText(tokens[i]).toLowerCase();
            const word2 = GrammarUtils.getTokenText(tokens[i+1]).toLowerCase();

            if (analysis.adjectiveMap.has(word1) && analysis.adjectiveMap.has(word2)) {
                const entry1 = dict.get(word1);
                const entry2 = dict.get(word2);

                if (entry1 && entry2 && entry1.orderCategory > entry2.orderCategory) {
                    return {
                        issue: true,
                        // Note: A real implementation might return a patch to swap them,
                        // For this warning, we flag the first adjective's index.
                        replaceAt: tokens[i].index,
                        replaceWith: `${word2} ${word1}`,
                        reason: `Adjective order issue: '${word2}' (Category ${entry2.orderCategory}) should usually precede '${word1}' (Category ${entry1.orderCategory}).`
                    };
                }
            }
        }
        return { issue: false };
    }
});

/* ==========================================================
   EXPORT / REGISTRATION
========================================================== */

GrammarEngine.registerRules([
    double_comparative_rule,
    double_superlative_rule,
    comparative_before_than_rule,
    adjective_order_rule
]);
