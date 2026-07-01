"use strict";

/* ==========================================================
   English-Bot
   Comparison Rules v9 (Production Ready)
   - Rule-based architecture
   - Handles Comparative, Superlative, and Equality patterns
========================================================== */

/**
 * Rule: Comparative Context ('than')
 */
const comparative_rule = new GrammarRule({
    id: "comp_than_rule",
    name: "Comparative Form",
    category: GrammarCategory.COMPARISON,
    severity: GrammarSeverity.ERROR,
    priority: 25,
    enabled: true,

    test(text, analysis, tokens) {
        if (!tokens.some(t => t.lower === "than")) return false;
        if (!analysis.adjectives || analysis.adjectives.length === 0) return false;

        return analysis.adjectives.some(adj => {
            const word = adj.lower;
            return !word.endsWith("er") && !word.startsWith("more");
        });
    },

    fix(text, analysis, tokens) {
        return {
            text: text,
            issue: true,
            reason: "Use comparative form (e.g., 'taller' or 'more beautiful') before 'than'."
        };
    }
});

/**
 * Rule: Superlative Context ('the' / 'most')
 */
const superlative_rule = new GrammarRule({
    id: "comp_superlative_rule",
    name: "Superlative Form",
    category: GrammarCategory.COMPARISON,
    severity: GrammarSeverity.ERROR,
    priority: 25,
    enabled: true,

    test(text, analysis, tokens) {
        const hasSuperContext = tokens.some(t => t.lower === "most" || t.lower === "the");
        if (!hasSuperContext || !analysis.adjectives) return false;

        return analysis.adjectives.some(adj => {
            const word = adj.lower;
            return !word.endsWith("est") && !word.startsWith("most");
        });
    },

    fix(text, analysis, tokens) {
        return {
            text: text,
            issue: true,
            reason: "Use superlative form (e.g., 'fastest' or 'most popular') in superlative context."
        };
    }
});

/**
 * Rule: Equality Pattern ('as...as')
 */
const equality_rule = new GrammarRule({
    id: "comp_equality_rule",
    name: "Equality Comparison",
    category: GrammarCategory.COMPARISON,
    severity: GrammarSeverity.WARNING,
    priority: 30,
    enabled: true,

    test(text, analysis, tokens) {
        const hasAs = tokens.some(t => t.lower === "as");
        return hasAs && (!analysis.subject || !analysis.adjectives || analysis.adjectives.length === 0);
    },

    fix(text, analysis, tokens) {
        return {
            text: text,
            issue: true,
            reason: "Equality comparison requires a subject and an adjective (e.g., 'as fast as')."
        };
    }
});

/* ==========================================================
   REGISTRATION
========================================================== */

GrammarEngine.registerRules([
    comparative_rule,
    superlative_rule,
    equality_rule
]);
