"use strict";

/* ==========================================================
   English-Bot
   Comparison Rules v7
   - Signal-based architecture
========================================================== */

class ComparisonRules {

    apply(analysis) {

        if (!analysis || !analysis.grammarSignals) return analysis;

        this.validateComparativeContext(analysis);
        this.validateSuperlativeContext(analysis);
        this.validateEqualityPatterns(analysis);

        return analysis;
    }

    /* ======================================================
       1. COMPARATIVE VALIDATION
    ====================================================== */

    validateComparativeContext(a) {

        const tokens = a.tokens.map(t => t.lower || t.toLower?.() || t);

        const hasThan = tokens.includes("than");

        if (hasThan) {

            const adjectives = a.adjectives || [];

            for (const adj of adjectives) {

                const word = adj.lower || adj.toLower?.() || adj;

                // very basic morphology check (no generation)
                const isComparativeForm =
                    word.endsWith("er") || word.startsWith("more");

                if (!isComparativeForm) {
                    a.grammarSignals.comparisonIssue = true;
                }
            }
        }
    }

    /* ======================================================
       2. SUPERLATIVE VALIDATION
    ====================================================== */

    validateSuperlativeContext(a) {

        const tokens = a.tokens.map(t => t.lower || t.toLower?.() || t);

        const hasSuperlativeContext =
            tokens.includes("most") || tokens.includes("the");

        if (hasSuperlativeContext) {

            const adjectives = a.adjectives || [];

            for (const adj of adjectives) {

                const word = adj.lower || adj.toLower?.() || adj;

                const isSuperlativeForm =
                    word.endsWith("est") || word.startsWith("most");

                if (!isSuperlativeForm) {
                    a.grammarSignals.comparisonIssue = true;
                }
            }
        }
    }

    /* ======================================================
       3. EQUALITY COMPARISON (AS...AS)
    ====================================================== */

    validateEqualityPatterns(a) {

        const tokens = a.tokens.map(t => t.lower || t.toLower?.() || t);

        const hasAsPattern =
            tokens.includes("as");

        if (hasAsPattern) {

            // structural check only
            if (!a.subject || !a.adjectives || a.adjectives.length === 0) {
                a.grammarSignals.comparisonIssue = true;
            }
        }
    }
}

/* ==========================================================
   EXPORT
========================================================== */

module.exports = ComparisonRules;
