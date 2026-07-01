"use strict";

/* ==========================================================
   English-Bot
   Infinitive Rules v7
   - Constraint detection only
========================================================== */

class InfinitiveRules {

    apply(analysis) {

        if (!analysis || !analysis.grammarSignals) return analysis;

        this.detectInfinitivePatterns(analysis);

        return analysis;
    }

    /* ======================================================
       CORE DETECTION ONLY
    ====================================================== */

    detectInfinitivePatterns(a) {

        const tokens = a.tokens.map(t => t.lower);

        const verbs = a.verbs || [];

        const modals = a.modals || [];

        const triggerVerbs = [
            "want","decide","plan","hope","try","need","agree"
        ];

        /* ==================================================
           AFTER TRIGGER VERB → INFINITIVE EXPECTED
        ================================================== */

        if (tokens.some(t => triggerVerbs.includes(t))) {

            if (!tokens.includes("to")) {
                a.grammarSignals.infinitiveIssue = true;
            }
        }

        /* ==================================================
           MODAL + BARE VERB CHECK
        ================================================== */

        if (modals.length > 0) {

            const hasToAfterModal = tokens.includes("to");

            if (hasToAfterModal) {
                a.grammarSignals.modalInfinitiveError = true;
            }
        }

        /* ==================================================
           GERUND vs INFINITIVE CONFLICT SIGNAL
        ================================================== */

        const hasIng = verbs.some(v =>
            (v.lower || v).endsWith("ing")
        );

        const hasToVerb = tokens.includes("to");

        if (hasIng && hasToVerb) {
            a.grammarSignals.formConflict = true;
        }
    }
}

/* ==========================================================
   EXPORT
========================================================== */

module.exports = InfinitiveRules;
