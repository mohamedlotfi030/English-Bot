"use strict";

/* ==========================================================
   English-Bot
   Conditional Rules v7
   - Signal-based architecture
========================================================== */

class ConditionalRules {

    apply(analysis) {

        if (!analysis || !analysis.grammarSignals) return analysis;

        this.validateConditionalStructure(analysis);

        return analysis;
    }

    /* ======================================================
       CORE CONDITIONAL DETECTION
    ====================================================== */

    validateConditionalStructure(a) {

        const tokens = a.tokens.map(t => t.lower || t.toLower?.() || t);

        const hasIf = tokens.includes("if");

        if (!hasIf) return;

        /* ==================================================
           BASIC STRUCTURAL CHECK ONLY
        ================================================== */

        const hasPast = this.containsPastMarkers(tokens);
        const hasFuture = tokens.includes("will");

        const hasHave = tokens.includes("had");

        /* ==================================================
           ZERO / FIRST / SECOND / THIRD (heuristic only)
        ================================================== */

        if (hasIf) {

            // weak heuristic classification

            if (hasHave && hasPast) {
                a.grammarSignals.conditionalIssue = true;
                return;
            }

            if (hasPast && hasFuture) {
                a.grammarSignals.conditionalIssue = true;
                return;
            }

            if (hasIf && !a.subject) {
                a.grammarSignals.conditionalIssue = true;
                return;
            }
        }
    }

    /* ======================================================
       SIMPLE PAST DETECTION (heuristic)
    ====================================================== */

    containsPastMarkers(tokens) {

        const pastMarkers = [
            "was","were","did","had",
            "went","ate","saw","took"
        ];

        return tokens.some(t => pastMarkers.includes(t));
    }
}

/* ==========================================================
   EXPORT
========================================================== */

module.exports = ConditionalRules;
