"use strict";

/* ==========================================================
   English-Bot
   Irregular Verb Signals v7
   - Lexical validation only
========================================================== */

class IrregularVerbRules {

    constructor() {

        this.lexicon = {
            go: { past: "went", pp: "gone" },
            see: { past: "saw", pp: "seen" },
            eat: { past: "ate", pp: "eaten" },
            take: { past: "took", pp: "taken" }
        };

    }

    apply(analysis) {

        if (!analysis || !analysis.grammarSignals) return analysis;

        this.validate(analysis);

        return analysis;
    }

    /* ======================================================
       VALIDATION ONLY
    ====================================================== */

    validate(a) {

        const verbs = a.verbs || [];

        const tense = a.tense;

        for (const v of verbs) {

            const base = v.base || v.lower;

            const entry = this.lexicon[base];

            if (!entry) continue;

            /* ==============================================
               PAST CHECK
            ============================================== */

            if (tense === "past") {

                if (v.form !== entry.past) {
                    a.grammarSignals.irregularMismatch = true;
                }
            }

            /* ==============================================
               PERFECT CHECK
            ============================================== */

            if (tense.includes("Perfect")) {

                if (v.form !== entry.pp) {
                    a.grammarSignals.irregularMismatch = true;
                }
            }
        }

        /* ==============================================
           CONTINUOUS SIGNAL ONLY
        ============================================== */

        if (tense.includes("Continuous")) {

            a.grammarSignals.continuousVerbForm = true;
        }
    }
}

/* ==========================================================
   EXPORT
========================================================== */

module.exports = IrregularVerbRules;
