"use strict";

/* ==========================================================
   English-Bot
   Article Rules v7
   - Signal-based + phonology-aware heuristic
========================================================== */

class ArticleRules {

    apply(analysis) {

        if (!analysis || !analysis.grammarSignals) return analysis;

        this.detectArticleErrors(analysis);

        return analysis;
    }

    /* ======================================================
       CORE ARTICLE VALIDATION
    ====================================================== */

    detectArticleErrors(a) {

        const tokens = a.tokens.map(t => t.lower || t.toLower?.() || t);

        for (let i = 0; i < tokens.length - 1; i++) {

            const current = tokens[i];
            const next = tokens[i + 1];

            if (!current || !next) continue;

            /* ==================================================
               RULE 1: a + vowel sound heuristic
            ================================================== */

            if (current === "a") {

                if (this.startsWithVowelSound(next)) {
                    a.grammarSignals.articleError = true;
                }
            }

            /* ==================================================
               RULE 2: an + consonant sound heuristic
            ================================================== */

            if (current === "an") {

                if (!this.startsWithVowelSound(next)) {
                    a.grammarSignals.articleError = true;
                }
            }
        }
    }

    /* ======================================================
       PHONOLOGY APPROXIMATION LAYER
       (IMPORTANT: not dictionary-based)
    ====================================================== */

    startsWithVowelSound(word) {

        if (!word) return false;

        const w = word.toLowerCase();

        /* ==================================================
           SPECIAL CASES (sound-based exceptions)
        ================================================== */

        const vowelSoundExceptions = [
            "hour",
            "honest",
            "honor",
            "heir"
        ];

        const consonantSoundExceptions = [
            "university",
            "user",
            "unit",
            "use",
            "european"
        ];

        if (vowelSoundExceptions.includes(w)) return true;
        if (consonantSoundExceptions.includes(w)) return false;

        /* ==================================================
           DEFAULT RULE (letter-based approximation)
        ================================================== */

        return /^[aeiou]/.test(w);
    }
}

/* ==========================================================
   EXPORT
========================================================== */

module.exports = ArticleRules;
