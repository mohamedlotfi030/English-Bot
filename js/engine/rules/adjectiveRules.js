"use strict";

/* ==========================================================
   English-Bot
   Adjective Rules v7
   - Signal-based
   - Analyzer v7 compatible
========================================================== */

class AdjectiveRules {

    apply(analysis) {

        if (!analysis || !analysis.grammarSignals) return analysis;

        this.validateAdjectiveOrder(analysis);
        this.validateComparativeForms(analysis);
        this.validateSuperlativeForms(analysis);
        this.validatePositionHints(analysis);

        return analysis;
    }

    /* ======================================================
       1. ADJECTIVE ORDER (soft validation)
    ====================================================== */

    validateAdjectiveOrder(a) {

        if (!a.adjectives || a.adjectives.length <= 1) return;

        // If analyzer later provides ordering metadata
        if (a.grammarSignals.sentenceIssue === false) return;

        // mark only signal, not fix
        a.grammarSignals.adjectiveIssue = true;
    }

    /* ======================================================
       2. COMPARATIVE FORM
    ====================================================== */

    validateComparativeForms(a) {

        const adjectives = a.adjectives || [];

        for (const adj of adjectives) {

            const word = adj.lower || adj.toLower?.() || adj;

            const isComparativeContext =
                a.tokens.some(t => (t.lower || t.toLower?.()) === "than");

            if (isComparativeContext) {

                // placeholder heuristic
                if (!word.endsWith("er") && !word.startsWith("more")) {
                    a.grammarSignals.adjectiveIssue = true;
                }
            }
        }
    }

    /* ======================================================
       3. SUPERLATIVE FORM
    ====================================================== */

    validateSuperlativeForms(a) {

        const tokens = a.tokens.map(t => t.lower || t.toLower?.());

        if (tokens.includes("most") || tokens.includes("the")) {

            const adjectives = a.adjectives || [];

            for (const adj of adjectives) {

                const word = adj.lower || adj.toLower?.() || adj;

                if (!word.endsWith("est") && !word.startsWith("most")) {
                    a.grammarSignals.adjectiveIssue = true;
                }
            }
        }
    }

    /* ======================================================
       4. POSITION RULE (before noun vs predicate)
    ====================================================== */

    validatePositionHints(a) {

        if (!a.adjectives || a.adjectives.length === 0) return;

        // If adjective exists after verb be → OK pattern
        const hasBe = (a.auxiliaries || []).some(v =>
            ["is","are","am","was","were"].includes(v.lower || v)
        );

        if (hasBe) {
            return; // correct structure
        }

        // otherwise mark potential issue
        a.grammarSignals.adjectiveIssue = true;
    }
}

/* ==========================================================
   EXPORT
========================================================== */

module.exports = AdjectiveRules;
