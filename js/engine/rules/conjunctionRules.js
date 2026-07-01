"use strict";

/* ==========================================================
   English-Bot
   Conjunction Rules v7
   - Discourse-level signal detection only
========================================================== */

class ConjunctionRules {

    apply(analysis) {

        if (!analysis || !analysis.grammarSignals) return analysis;

        this.detectBasicRelations(analysis);

        return analysis;
    }

    /* ======================================================
       CORE DISCOURSE DETECTION
    ====================================================== */

    detectBasicRelations(a) {

        const tokens = a.tokens.map(t => t.lower || t.toLower?.() || t);

        const hasAnd = tokens.includes("and");
        const hasBut = tokens.includes("but");
        const hasOr = tokens.includes("or");
        const hasBecause = tokens.includes("because");

        const hasIf = tokens.includes("if");

        /* ==================================================
           SIMPLE RELATION SIGNALS
        ================================================== */

        if (hasBut) {
            a.grammarSignals.conjunctionIssue = true;
        }

        if (hasBecause) {
            a.grammarSignals.conjunctionIssue = true;
        }

        if (hasIf) {
            a.grammarSignals.conjunctionIssue = true;
        }

        /* ==================================================
           STRUCTURAL COMPLEXITY SIGNAL
        ================================================== */

        const conjunctionCount =
            ["and","but","or","because","if"].filter(c =>
                tokens.includes(c)
            ).length;

        if (conjunctionCount > 2) {
            a.grammarSignals.complexSentence = true;
        }
    }
}

/* ==========================================================
   EXPORT
========================================================== */

module.exports = ConjunctionRules;
