"use strict";

/* ==========================================================
   English-Bot
   Negative Rules v7
   - Structural validation only
========================================================== */

class NegativeRules {

    apply(analysis) {

        if (!analysis || !analysis.grammarSignals) return analysis;

        this.detectNegationIssues(analysis);

        return analysis;
    }

    /* ======================================================
       CORE NEGATION LOGIC
    ====================================================== */

    detectNegationIssues(a) {

        const tokens = a.tokens.map(t => t.lower);

        const hasNot = tokens.includes("not");

        const subject = a.subject;

        const tense = a.tense;

        /* ==================================================
           PRESENT SIMPLE DO-SUPPORT CHECK
        ================================================== */

        if (tense === "present" && !a.auxiliaries?.length) {

            if (hasNot) {
                a.grammarSignals.doSupportMissing = true;
            }
        }

        /* ==================================================
           PAST SIMPLE DO-SUPPORT CHECK
        ================================================== */

        if (tense === "past" && !a.auxiliaries?.length) {

            if (hasNot) {
                a.grammarSignals.didSupportMissing = true;
            }
        }

        /* ==================================================
           BE VERB NEGATION STRUCTURE
        ================================================== */

        if (a.verb?.base === "be" && hasNot) {
            a.grammarSignals.beNegationDetected = true;
        }

        /* ==================================================
           MODAL NEGATION STRUCTURE
        ================================================== */

        const modals = a.modals || [];

        if (modals.length > 0 && hasNot) {
            a.grammarSignals.modalNegationDetected = true;
        }

        /* ==================================================
           DOUBLE NEGATION DETECTION
        ================================================== */

        const negativeWords = ["not","never","no","nothing","nobody"];

        const countNeg = tokens.filter(t =>
            negativeWords.includes(t)
        ).length;

        if (countNeg > 1) {
            a.grammarSignals.doubleNegationWarning = true;
        }
    }
}

/* ==========================================================
   EXPORT
========================================================== */

module.exports = NegativeRules;
