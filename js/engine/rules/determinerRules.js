"use strict";

/* ==========================================================
   English-Bot
   Determiner Rules v7
   - NP-level validation only
========================================================== */

class DeterminerRules {

    apply(analysis) {

        if (!analysis || !analysis.grammarSignals) return analysis;

        this.validateArticles(analysis);
        this.validateDemonstratives(analysis);
        this.validateQuantifiers(analysis);

        return analysis;
    }

    /* ======================================================
       1. ARTICLE VALIDATION
    ====================================================== */

    validateArticles(a) {

        const articles = a.articles || [];
        const nouns = a.nouns || [];

        if (!articles.length || !nouns.length) return;

        const article = articles[0].lower;
        const noun = nouns[0].lower;

        const startsWithVowel = /^[aeiou]/.test(noun);

        if (article === "a" && startsWithVowel) {
            a.grammarSignals.articleIssue = true;
        }

        if (article === "an" && !startsWithVowel) {
            a.grammarSignals.articleIssue = true;
        }
    }

    /* ======================================================
       2. DEMONSTRATIVE VALIDATION (STRUCTURAL ONLY)
    ====================================================== */

    validateDemonstratives(a) {

        const tokens = a.tokens.map(t => t.lower);

        const hasThis = tokens.includes("this");
        const hasThese = tokens.includes("these");

        const nouns = a.nouns || [];

        if (!nouns.length) return;

        const isPlural = nouns.length > 1;

        if (hasThis && isPlural) {
            a.grammarSignals.determinerIssue = true;
        }

        if (hasThese && !isPlural) {
            a.grammarSignals.determinerIssue = true;
        }
    }

    /* ======================================================
       3. QUANTIFIER VALIDATION (LIGHT WEIGHT)
    ====================================================== */

    validateQuantifiers(a) {

        const tokens = a.tokens.map(t => t.lower);

        const hasMuch = tokens.includes("much");
        const hasMany = tokens.includes("many");

        const nouns = a.nouns || [];

        if (!nouns.length) return;

        const isUncountable = this.isUncountable(nouns[0]);

        if (hasMuch && !isUncountable) {
            a.grammarSignals.countableIssue = true;
        }

        if (hasMany && isUncountable) {
            a.grammarSignals.countableIssue = true;
        }
    }

    /* ======================================================
       MINIMAL LEXICON
    ====================================================== */

    isUncountable(noun) {

        const list = [
            "water","milk","rice","air",
            "information","advice","money"
        ];

        return list.includes(noun.lower || noun);
    }
}

/* ==========================================================
   EXPORT
========================================================== */

module.exports = DeterminerRules;
