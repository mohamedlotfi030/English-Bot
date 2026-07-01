"use strict";

/* ==========================================================
   English-Bot
   Pronoun Rules (v7 - Analyzer Compatible)
========================================================== */

class PronounRules {

    apply(analysis) {

        if (!analysis || !analysis.grammarSignals) return analysis;

        this.fixSubjectPronouns(analysis);
        this.fixObjectConfusion(analysis);
        this.validatePronounRole(analysis);

        return analysis;
    }

    /* ======================================================
       1. SUBJECT PRONOUN FIXES
    ====================================================== */

    fixSubjectPronouns(a) {

        const subject = a.subject?.toLowerCase?.() || a.subject;

        if (!subject) return;

        switch (subject) {

            case "me":
                a.subject = "I";
                a.grammarSignals.pronounIssue = true;
                break;

            case "him":
                a.subject = "he";
                a.grammarSignals.pronounIssue = true;
                break;

            case "her":
                a.subject = "she";
                a.grammarSignals.pronounIssue = true;
                break;

            case "us":
                a.subject = "we";
                a.grammarSignals.pronounIssue = true;
                break;

            case "them":
                a.subject = "they";
                a.grammarSignals.pronounIssue = true;
                break;
        }
    }

    /* ======================================================
       2. OBJECT PRONOUN VALIDATION
    ====================================================== */

    fixObjectConfusion(a) {

        const validObjectPronouns = [
            "me","him","her","us","them","you","it"
        ];

        const obj = a.object?.toLowerCase?.() || a.object;

        if (obj && !validObjectPronouns.includes(obj)) {
            a.grammarSignals.pronounIssue = true;
        }
    }

    /* ======================================================
       3. ROLE VALIDATION (subject vs object confusion)
    ====================================================== */

    validatePronounRole(a) {

        if (!a.subject || !a.verb) return;

        const subject = a.subject.toLowerCase();

        // invalid subject usage detection
        const invalidSubjects = ["me","him","her","us","them"];

        if (invalidSubjects.includes(subject)) {
            a.grammarSignals.pronounIssue = true;
            a.grammarSignals.sentenceIssue = true;
        }
    }
}

/* ==========================================================
   EXPORT
========================================================== */

module.exports = PronounRules;
