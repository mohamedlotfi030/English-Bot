"use strict";

/* ==========================================================
   English-Bot
   Contraction Rules v7
   - Style / Register layer (NOT grammar)
========================================================== */

class ContractionRules {

    apply(text, context = {}) {

        if (!text || typeof text !== "string") return text;

        // contractions only apply in informal register
        if (!context.isInformal) return text;

        let result = text;

        result = this.applyNegations(result);
        result = this.applyPronounContractions(result);
        result = this.applyAuxiliaryContractions(result);

        return result;
    }

    /* ======================================================
       1. NEGATIONS
    ====================================================== */

    applyNegations(text) {

        return text
            .replace(/\bdo not\b/g, "don't")
            .replace(/\bcannot\b/g, "can't")
            .replace(/\bwill not\b/g, "won't");
    }

    /* ======================================================
       2. PRONOUN + BE VERB
    ====================================================== */

    applyPronounContractions(text) {

        return text
            .replace(/\bI am\b/g, "I'm")
            .replace(/\byou are\b/g, "you're")
            .replace(/\bhe is\b/g, "he's");
    }

    /* ======================================================
       3. AUXILIARY VERBS
    ====================================================== */

    applyAuxiliaryContractions(text) {

        return text
            .replace(/\bI have\b/g, "I've")
            .replace(/\bwe have\b/g, "we've")
            .replace(/\bthey have\b/g, "they've");
    }
}

/* ==========================================================
   EXPORT
========================================================== */

module.exports = ContractionRules;
