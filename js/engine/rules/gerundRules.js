"use strict";

/* ==========================================================
   English-Bot
   Gerund Rules v7
   - Syntax constraint validation only
========================================================== */

class GerundRules {

    apply(analysis) {

        if (!analysis || !analysis.grammarSignals) return analysis;

        this.validateGerundUsage(analysis);

        return analysis;
    }

    /* ======================================================
       GERUND VALIDATION ONLY
    ====================================================== */

    validateGerundUsage(a) {

        const tokens = a.tokens.map(t => t.lower || t.toLower?.() || t);

        const verbs = a.verbs || [];

        const prepositions = a.prepositions || [];

        const triggerVerbs = [
            "enjoy","avoid","suggest","consider","finish","stop","mind"
        ];

        /* ==================================================
           AFTER PREPOSITION → GERUND EXPECTATION
        ================================================== */

        if (prepositions.length > 0 && verbs.length > 0) {

            for (const verb of verbs) {

                const v = verb.lower || verb;

                if (!v.endsWith("ing") && !v.startsWith("to ")) {
                    a.grammarSignals.gerundIssue = true;
                }
            }
        }

        /* ==================================================
           VERB COMPLEMENT PATTERN
        ================================================== */

        const hasTriggerVerb = tokens.some(t =>
            triggerVerbs.includes(t)
        );

        if (hasTriggerVerb) {

            const hasInfinitive = tokens.includes("to");

            if (hasInfinitive) {
                a.grammarSignals.gerundIssue = true;
            }
        }

        /* ==================================================
           SIMPLE HEURISTIC FLAG
        ================================================== */

        const ingCount = verbs.filter(v =>
            (v.lower || v).endsWith("ing")
        ).length;

        if (ingCount > 1) {
            a.grammarSignals.gerundComplexity = true;
        }
    }
}

/* ==========================================================
   EXPORT
========================================================== */

module.exports = GerundRules;
