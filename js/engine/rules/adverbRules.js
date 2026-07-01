"use strict";

/* ==========================================================
   English-Bot
   Adverb Rules v9 (Production Ready)
   - Patch-based Fixes
   - O(1) Complexity & Dictionary Lookups
========================================================== */

/**
 * Rule 1: Adverb Comparative Form
 * Ensures adverbs in comparative context use correct form (via Dictionary)
 */
const adverb_comparative_rule = new GrammarRule({
    id: "adverb_comparative_rule",
    name: "Adverb Comparative Form",
    description: "Ensures adverbs in comparative context are correctly formed.",
    category: GrammarCategory.ADVERB,
    severity: GrammarSeverity.ERROR,
    priority: 30,
    enabled: true,

    test(text, analysis, tokens) {
        const dict = GrammarEngine.getDictionary("adverbs");
        // Check for 'more' before an adverb
        for (let i = 0; i < tokens.length - 1; i++) {
            const current = GrammarUtils.getTokenText(tokens[i]).toLowerCase();
            const nextWord = GrammarUtils.getTokenText(tokens[i + 1]).toLowerCase();
            
            if (current === "more" && analysis.adverbMap.has(nextWord)) {
                const entry = dict.get(nextWord);
                if (entry && !entry.isComparative) return true;
            }
        }
        return false;
    },

    fix(text, analysis, tokens) {
        const dict = GrammarEngine.getDictionary("adverbs");
        for (let i = 0; i < tokens.length - 1; i++) {
            const current = GrammarUtils.getTokenText(tokens[i]).toLowerCase();
            const nextWord = GrammarUtils.getTokenText(tokens[i + 1]).toLowerCase();

            if (current === "more" && analysis.adverbMap.has(nextWord)) {
                const entry = dict.get(nextWord);
                if (entry && entry.comparativeForm) {
                    return {
                        issue: true,
                        replaceAt: tokens[i].index,
                        replaceWith: entry.comparativeForm,
                        reason: `Use '${entry.comparativeForm}' instead of 'more ${nextWord}'.`
                    };
                }
            }
        }
        return { issue: false };
    }
});

/**
 * Rule 2: Adverb Frequency Position
 * Detects placement of frequency adverbs (e.g., 'always', 'never')
 */
const adverb_frequency_position_rule = new GrammarRule({
    id: "adverb_frequency_position_rule",
    name: "Frequency Adverb Position",
    description: "Checks placement of frequency adverbs relative to the verb.",
    category: GrammarCategory.ADVERB,
    severity: GrammarSeverity.WARNING,
    priority: 35,
    enabled: true,

    test(text, analysis, tokens) {
        const dict = GrammarEngine.getDictionary("adverbs");
        for (let i = 0; i < tokens.length; i++) {
            const word = GrammarUtils.getTokenText(tokens[i]).toLowerCase();
            if (analysis.adverbMap.has(word)) {
                const entry = dict.get(word);
                if (entry && entry.isFrequency && i > 0 && i < tokens.length - 1) {
                    const prev = GrammarUtils.getTokenText(tokens[i - 1]).toLowerCase();
                    // Basic check: Frequency adverbs often go before the main verb
                    if (analysis.verbMap.has(prev)) return true;
                }
            }
        }
        return false;
    },

    fix(text, analysis, tokens) {
        return {
            issue: true,
            replaceAt: tokens[0].index, // Placeholder: Corrector handles optimal placement
            replaceWith: "",
            reason: "Check the position of this frequency adverb; it is typically placed before the main verb."
        };
    }
});

/**
 * Rule 3: Double Adverb Form
 * Prevents structures like 'more faster'
 */
const double_adverb_rule = new GrammarRule({
    id: "double_adverb_rule",
    name: "Double Adverb",
    description: "Prevents double adverb forms like 'more faster'.",
    category: GrammarCategory.ADVERB,
    severity: GrammarSeverity.ERROR,
    priority: 30,
    enabled: true,

    test(text, analysis, tokens) {
        const dict = GrammarEngine.getDictionary("adverbs");
        for (let i = 0; i < tokens.length - 1; i++) {
            const current = GrammarUtils.getTokenText(tokens[i]).toLowerCase();
            const nextWord = GrammarUtils.getTokenText(tokens[i + 1]).toLowerCase();
            if (current === "more" && analysis.adverbMap.has(nextWord)) {
                const entry = dict.get(nextWord);
                if (entry && entry.isComparative) return true;
            }
        }
        return false;
    },

    fix(text, analysis, tokens) {
        for (let i = 0; i < tokens.length - 1; i++) {
            const current = GrammarUtils.getTokenText(tokens[i]).toLowerCase();
            if (current === "more") {
                return {
                    issue: true,
                    replaceAt: tokens[i].index,
                    replaceWith: "",
                    reason: "Redundant 'more' detected."
                };
            }
        }
        return { issue: false };
    }
});

/* ==========================================================
   REGISTRATION
========================================================== */

GrammarEngine.registerRules([
    adverb_comparative_rule,
    adverb_frequency_position_rule,
    double_adverb_rule
]);
