"use strict";

/* ==========================================================
   English-Bot
   Plural Engine v7
   Structural number system (NOT word mutation)
========================================================== */

class PluralEngine {

    apply(analysis) {

        if (!analysis || !analysis.nouns) return analysis;

        this.validateNumberFeatures(analysis);

        return analysis;
    }

    /* ======================================================
       CORE NUMBER VALIDATION
    ====================================================== */

    validateNumberFeatures(a) {

        for (const noun of a.nouns || []) {

            this.applyPluralConstraints(noun, a);
        }
    }

    /* ======================================================
       PLURAL CONSTRAINTS
    ====================================================== */

    applyPluralConstraints(noun, a) {

        /* ==================================================
           IRREGULAR NOUNS
        ================================================== */

        if (noun.isIrregular && noun.number === "plural") {

            noun.form = noun.irregularPlural;
            return;
        }

        /* ==================================================
           REGULAR PLURAL MARKING (STRUCTURAL ONLY)
        ================================================== */

        if (noun.number === "plural" && noun.isCountable) {

            noun.features = noun.features || {};
            noun.features.requiresPluralAgreement = true;
        }

        /* ==================================================
           UNCOUNTABLE NOUNS BLOCKING
        ================================================== */

        if (noun.isUncountable && noun.number === "plural") {

            noun.grammarWarnings = noun.grammarWarnings || [];

            noun.grammarWarnings.push(
                "Uncountable noun should not be pluralized"
            );
        }
    }
}

/* ==========================================================
   EXPORT
========================================================== */

module.exports = PluralEngine;
