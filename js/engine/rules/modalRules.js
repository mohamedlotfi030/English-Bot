"use strict";

/* ==========================================================
   English-Bot
   Modal Rules v7
   - Modal-Verb interaction validator only
========================================================== */

class ModalRules {

    apply(analysis) {

        if (!analysis || !analysis.grammarSignals) return analysis;

        this.validateModals(analysis);

        return analysis;
    }

    /* ======================================================
       CORE VALIDATION ONLY
    ====================================================== */

    validateModals(a) {

        const tokens = a.tokens.map(t => t.lower);

        const modals = a.modals || [];

        const verbs = a.verbs || [];

        const modalSet = new Set([
            "can","could",
            "may","might",
            "must","should",
            "shall","will","would"
        ]);

        /* ==================================================
           MODAL + VERB BASE CHECK
        ================================================== */

        for (const m of modals) {

            const modal = m.lower || m;

            const modalIndex = tokens.indexOf(modal);

            const nextToken = tokens[modalIndex + 1];

            if (!nextToken) continue;

            /* ==========================================
               AFTER MODAL MUST BE BASE VERB
            ========================================== */

            if (nextToken.endsWith("ing") || nextToken.startsWith("to ")) {
                a.grammarSignals.modalVerbConflict = true;
            }
        }

        /* ==================================================
           MODAL PRESENCE SIGNAL
        ================================================== */

        if (modals.length > 0) {
            a.grammarSignals.modalDetected = true;
        }

        /* ==================================================
           MULTIPLE MODALS ERROR SIGNAL
        ================================================== */

        if (modals.length > 1) {
            a.grammarSignals.modalStackingError = true;
        }

        /* ==================================================
           MODAL CLASSIFICATION (WEAK SIGNAL ONLY)
        ================================================== */

        const modalTypes = {

            can: "ability",
            could: "ability_past",
            may: "possibility",
            might: "low_possibility",
            must: "necessity",
            should: "advice",
            will: "future",
            would: "conditional"
        };

        for (const m of modals) {

            const modal = m.lower || m;

            if (modalTypes[modal]) {

                a.grammarSignals.modalType = modalTypes[modal];
            }
        }
    }
}

/* ==========================================================
   EXPORT
========================================================== */

module.exports = ModalRules;
