"use strict";

/* ==========================================================
   English-Bot
   Capitalization Rules v7
   - Formatting layer (post-processing)
========================================================== */

class CapitalizationRules {

    apply(text) {

        if (!text || typeof text !== "string") return text;

        let result = text;

        result = this.capitalizeFirstLetter(result);
        result = this.capitalizePronounI(result);
        result = this.capitalizeAfterPeriod(result);

        return result;
    }

    /* ======================================================
       1. FIRST LETTER OF SENTENCE
    ====================================================== */

    capitalizeFirstLetter(text) {

        return text.replace(/(^\s*[a-z])/g, (match) => {
            return match.toUpperCase();
        });
    }

    /* ======================================================
       2. PRONOUN "i"
    ====================================================== */

    capitalizePronounI(text) {

        return text.replace(/\bi\b/g, "I");
    }

    /* ======================================================
       3. AFTER PERIOD CAPITALIZATION
    ====================================================== */

    capitalizeAfterPeriod(text) {

        return text.replace(/([.!?]\s*)([a-z])/g, (match, p1, p2) => {
            return p1 + p2.toUpperCase();
        });
    }
}

/* ==========================================================
   EXPORT
========================================================== */

module.exports = CapitalizationRules;
