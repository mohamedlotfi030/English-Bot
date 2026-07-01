"use strict";

/* ==========================================================
   English-Bot
   Idiom Rules v7
   - Lexical detection only (NOT grammar correction)
========================================================== */

class IdiomRules {

    constructor() {

        this.idioms = new Set([
            "kick the bucket",
            "break the ice",
            "piece of cake",
            "hit the sack"
        ]);

    }

    apply(analysis) {

        if (!analysis || !analysis.grammarSignals) return analysis;

        this.detectIdioms(analysis);

        return analysis;
    }

    /* ======================================================
       IDIOM DETECTION ONLY
    ====================================================== */

    detectIdioms(a) {

        const text = a.tokens.map(t => t.lower).join(" ");

        let foundIdiom = false;

        for (const idiom of this.idioms) {

            if (text.includes(idiom)) {

                foundIdiom = true;

                a.grammarSignals.idiomDetected = true;
                a.grammarSignals.lexicalPhrase = idiom;
            }
        }

        /* ==================================================
           LITERAL TRANSLATION RISK (VERY WEAK HEURISTIC)
        ================================================== */

        if (foundIdiom && text.split(" ").length < 5) {
            a.grammarSignals.idiomRisk = true;
        }
    }
}

/* ==========================================================
   EXPORT
========================================================== */

module.exports = IdiomRules;
