"use strict";

/* ==========================================================
   English-Bot
   Auxiliary Rules v7
   - Signal-based architecture
========================================================== */

class AuxiliaryRules {

    apply(analysis) {

        if (!analysis || !analysis.grammarSignals) return analysis;

        this.validateBeForms(analysis);
        this.validateHaveForms(analysis);
        this.validateDoForms(analysis);

        return analysis;
    }

    /* ======================================================
       1. BE VERB VALIDATION
    ====================================================== */

    validateBeForms(a) {

        const subject = a.subject?.toLowerCase?.() || a.subject;
        const verb = a.verbForm?.toLowerCase?.() || "";

        if (!subject || !verb) return;

        /* present tense mismatch */
        if (["he","she","it"].includes(subject)) {
            if (verb === "are") {
                a.grammarSignals.auxiliaryIssue = true;
                a.grammarSignals.agreementViolation = true;
            }
        }

        if (["we","you","they"].includes(subject)) {
            if (verb === "is") {
                a.grammarSignals.auxiliaryIssue = true;
                a.grammarSignals.agreementViolation = true;
            }
        }
    }

    /* ======================================================
       2. HAVE VERBS (perfect tenses)
    ====================================================== */

    validateHaveForms(a) {

        const tokens = a.tokens.map(t => t.lower || t.toLower?.() || t);

        const hasHave = tokens.includes("have") || tokens.includes("has");

        if (a.tense === "presentPerfect" && !hasHave) {
            a.grammarSignals.auxiliaryIssue = true;
        }

        if (a.tense === "pastPerfect" && !tokens.includes("had")) {
            a.grammarSignals.auxiliaryIssue = true;
        }
    }

    /* ======================================================
       3. DO VERBS (questions / negatives)
    ====================================================== */

    validateDoForms(a) {

        const tokens = a.tokens.map(t => t.lower || t.toLower?.() || t);

        const isQuestionOrNegative =
            a.question === true || a.negative === true;

        if (!isQuestionOrNegative) return;

        if (a.tense === "present") {

            const hasDo = tokens.includes("do") || tokens.includes("does");

            if (!hasDo) {
                a.grammarSignals.auxiliaryIssue = true;
            }
        }

        if (a.tense === "past") {

            if (!tokens.includes("did")) {
                a.grammarSignals.auxiliaryIssue = true;
            }
        }
    }
}

/* ==========================================================
   EXPORT
========================================================== */

module.exports = AuxiliaryRules;
