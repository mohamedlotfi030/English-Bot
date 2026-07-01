"use strict";

/* ==========================================================
   English-Bot
   Punctuation Engine v7
   Discourse structure formatting layer
========================================================== */

class PunctuationEngine {

    apply(analysis) {

        if (!analysis) return analysis;

        this.applySentenceEndPunctuation(analysis);
        this.applyListPunctuation(analysis);
        this.applyClauseBoundaries(analysis);
        this.applyApostrophes(analysis);

        return analysis;
    }

    /* ======================================================
       SENTENCE END MARKS
    ====================================================== */

    applySentenceEndPunctuation(a) {

        a.punctuation = a.punctuation || {};

        switch (a.sentenceType) {

            case "question":
                a.punctuation.end = "?";
                break;

            case "exclamation":
                a.punctuation.end = "!";
                break;

            default:
                a.punctuation.end = ".";
        }
    }

    /* ======================================================
       LIST STRUCTURE
    ====================================================== */

    applyListPunctuation(a) {

        const list = a.listItems || [];

        if (list.length > 1) {

            a.punctuation.listSeparator = ",";
            a.punctuation.listConnector = "and";
        }
    }

    /* ======================================================
       CLAUSE BOUNDARIES
    ====================================================== */

    applyClauseBoundaries(a) {

        const clauses = a.clauses || [];

        for (let i = 0; i < clauses.length - 1; i++) {

            const clause = clauses[i];

            if (clause.isIntroductory) {
                clause.endingComma = true;
            }

            if (clause.isDependent) {
                clause.requiresComma = true;
            }
        }
    }

    /* ======================================================
       APOSTROPHES (STRUCTURAL ONLY)
    ====================================================== */

    applyApostrophes(a) {

        const words = a.tokens || [];

        for (const w of words) {

            if (w.requiresApostrophe) {

                w.features = w.features || {};
                w.features.apostrophe = true;
            }
        }
    }
}

/* ==========================================================
   EXPORT
========================================================== */

module.exports = PunctuationEngine;
