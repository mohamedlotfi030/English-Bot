"use strict";

/* ==========================================================
   English-Bot
   Adverb Rules v7
   - Signal-based architecture
========================================================== */

class AdverbRules {

    apply(analysis) {

        if (!analysis || !analysis.grammarSignals) return analysis;

        this.validatePositionIssues(analysis);
        this.validateFrequencyAdverbs(analysis);
        this.validateTimeAdverbs(analysis);
        this.validateDegreeForms(analysis);

        return analysis;
    }

    /* ======================================================
       1. POSITION VALIDATION
    ====================================================== */

    validatePositionIssues(a) {

        if (!a.adverbs || a.adverbs.length === 0) return;

        const adverbs = a.adverbs.map(x => x.lower || x.toLower?.() || x);

        for (const adv of adverbs) {

            // naive position heuristic replaced with signal
            if (adv) {
                a.grammarSignals.adverbIssue = true;
            }
        }
    }

    /* ======================================================
       2. FREQUENCY ADVERBS
    ====================================================== */

    validateFrequencyAdverbs(a) {

        const frequency = [
            "always","usually","often","sometimes","rarely","never"
        ];

        const tokens = a.tokens.map(t => t.lower || t.toLower?.());

        const hasFrequency = tokens.some(t => frequency.includes(t));

        if (!hasFrequency) return;

        // rely on structure instead of position guessing
        if (!a.subject || !a.verb) {
            a.grammarSignals.adverbIssue = true;
        }
    }

    /* ======================================================
       3. TIME ADVERBS
    ====================================================== */

    validateTimeAdverbs(a) {

        const timeWords = [
            "today","tomorrow","yesterday",
            "now","later","soon"
        ];

        const tokens = a.tokens.map(t => t.lower || t.toLower?.());

        const hasTime = tokens.some(t => timeWords.includes(t));

        if (hasTime) {
            // placeholder structural validation
            if (a.complexity === "unknown") {
                a.grammarSignals.adverbIssue = true;
            }
        }
    }

    /* ======================================================
       4. DEGREE (comparative / superlative)
    ====================================================== */

    validateDegreeForms(a) {

        const tokens = a.tokens.map(t => t.lower || t.toLower?.());

        const hasComparativeContext = tokens.includes("more") || tokens.includes("than");
        const hasSuperlativeContext = tokens.includes("most") || tokens.includes("the");

        if (hasComparativeContext || hasSuperlativeContext) {

            const adverbs = a.adverbs || [];

            for (const adv of adverbs) {

                const word = adv.lower || adv.toLower?.() || adv;

                if (hasComparativeContext) {
                    if (!word.endsWith("er") && !word.startsWith("more")) {
                        a.grammarSignals.adverbIssue = true;
                    }
                }

                if (hasSuperlativeContext) {
                    if (!word.endsWith("est") && !word.startsWith("most")) {
                        a.grammarSignals.adverbIssue = true;
                    }
                }
            }
        }
    }
}

/* ==========================================================
   EXPORT
========================================================== */

module.exports = AdverbRules;
