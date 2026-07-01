"use strict";

/* ==========================================================
   English-Bot
   Countable Rules v7
   - Signal-based validation only
========================================================== */

class CountableRules {

    apply(analysis) {

        if (!analysis || !analysis.grammarSignals) return analysis;

        this.validateQuantifiers(analysis);

        return analysis;
    }

    /* ======================================================
       QUANTIFIER VALIDATION ONLY
    ====================================================== */

    validateQuantifiers(a) {

        const tokens = a.tokens.map(t => t.lower || t.toLower?.() || t);

        const hasMuch = tokens.includes("much");
        const hasMany = tokens.includes("many");

        const nouns = a.nouns || [];

        for (const noun of nouns) {

            const isUncountable = this.isUncountable(noun);

            /* ==================================================
               MUCH vs MANY SIGNAL
            ================================================== */

            if (hasMuch && !isUncountable) {
                a.grammarSignals.countableIssue = true;
            }

            if (hasMany && isUncountable) {
                a.grammarSignals.countableIssue = true;
            }
        }

        /* ==================================================
           ARTICLE SIGNAL (a/an misuse detection only)
        ================================================== */

        if (a.articles && a.articles.length > 0 && nouns.length > 0) {

            const article = a.articles[0].lower;
            const noun = nouns[0].lower;

            const startsWithVowel = /^[aeiou]/.test(noun);

            if (article === "a" && startsWithVowel) {
                a.grammarSignals.articleIssue = true;
            }

            if (article === "an" && !startsWithVowel) {
                a.grammarSignals.articleIssue = true;
            }
        }
    }

    /* ======================================================
       BASIC LEXICON (minimal fallback)
    ====================================================== */

    isUncountable(noun) {

        const uncountables = [
            "water","milk","rice","air","information",
            "advice","money","music"
        ];

        return uncountables.includes(noun.lower || noun);
    }
}

/* ==========================================================
   EXPORT
========================================================== */

module.exports = CountableRules;
