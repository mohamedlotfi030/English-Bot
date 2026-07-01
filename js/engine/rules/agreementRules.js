"use strict";

/* ==========================================================
   English-Bot
   Agreement Rules v7
   - Signal-based architecture
========================================================== */

class AgreementRules {

    apply(analysis) {

        if (!analysis || !analysis.grammarSignals) return analysis;

        this.detectSubjectVerbAgreement(analysis);

        return analysis;
    }

    /* ======================================================
       CORE AGREEMENT LOGIC (single unified engine)
    ====================================================== */

    detectSubjectVerbAgreement(a) {

        const subject = a.subject?.toLowerCase?.() || a.subject;
        const verb = a.verbForm?.toLowerCase?.() || "";

        if (!subject || !verb) return;

        /* ==================================================
           I + am
        ================================================== */

        if (subject === "i") {
            if (verb === "is" || verb === "are") {
                a.grammarSignals.agreementViolation = true;
                a.grammarSignals.sentenceIssue = true;
                return;
            }
        }

        /* ==================================================
           HE / SHE / IT + is
        ================================================== */

        if (["he","she","it"].includes(subject)) {
            if (verb === "are") {
                a.grammarSignals.agreementViolation = true;
                a.grammarSignals.sentenceIssue = true;
                return;
            }
        }

        /* ==================================================
           WE / YOU / THEY + are
        ================================================== */

        if (["we","you","they"].includes(subject)) {
            if (verb === "is" || verb === "am") {
                a.grammarSignals.agreementViolation = true;
                a.grammarSignals.sentenceIssue = true;
                return;
            }
        }
    }
}

/* ==========================================================
   EXPORT
========================================================== */

module.exports = AgreementRules;
