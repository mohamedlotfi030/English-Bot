"use strict";

/* ==========================================================
   English-Bot
   Collocation Rules v7
   - Semantic + signal-based architecture
========================================================== */

class CollocationRules {

    apply(analysis) {

        if (!analysis || !analysis.grammarSignals) return analysis;

        this.validateMakeDoPairs(analysis);
        this.validateTakeHavePairs(analysis);

        return analysis;
    }

    /* ======================================================
       1. MAKE / DO PAIRS
    ====================================================== */

    validateMakeDoPairs(a) {

        const tokens = a.tokens.map(t => t.lower || t.toLower?.() || t);

        const hasMake = tokens.includes("make");
        const hasDo = tokens.includes("do");

        const nouns = a.nouns.map(n => n.lower || n.toLower?.() || n);

        const makeSet = ["decision","effort","mistake"];
        const doSet = ["homework","exercise","research"];

        for (const noun of nouns) {

            if (makeSet.includes(noun) && hasDo) {
                a.grammarSignals.collocationIssue = true;
            }

            if (doSet.includes(noun) && hasMake) {
                a.grammarSignals.collocationIssue = true;
            }
        }
    }

    /* ======================================================
       2. TAKE / HAVE PAIRS
    ====================================================== */

    validateTakeHavePairs(a) {

        const tokens = a.tokens.map(t => t.lower || t.toLower?.() || t);

        const nouns = a.nouns.map(n => n.lower || n.toLower?.() || n);

        const takeSet = ["break","photo","risk"];
        const haveSet = ["lunch","dinner","shower"];

        const hasTake = tokens.includes("take");
        const hasHave = tokens.includes("have");

        for (const noun of nouns) {

            if (takeSet.includes(noun) && !hasTake) {
                a.grammarSignals.collocationIssue = true;
            }

            if (haveSet.includes(noun) && !hasHave) {
                a.grammarSignals.collocationIssue = true;
            }
        }
    }
}

/* ==========================================================
   EXPORT
========================================================== */

module.exports = CollocationRules;
