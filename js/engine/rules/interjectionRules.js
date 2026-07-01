"use strict";

/* ==========================================================
   English-Bot
   Interjection Signals v7
   - Discourse/emotion detection only
========================================================== */

class InterjectionRules {

    apply(analysis) {

        if (!analysis || !analysis.grammarSignals) return analysis;

        this.detectInterjections(analysis);

        return analysis;
    }

    /* ======================================================
       DETECTION ONLY (NO CORRECTION)
    ====================================================== */

    detectInterjections(a) {

        const tokens = a.tokens.map(t => t.lower);

        const knownInterjections = [
            "oh","wow","oops",
            "yay","hooray","bravo",
            "ouch","ow","ugh",
            "hey","hi","hello",
            "um","uh","er"
        ];

        const found = tokens.filter(t =>
            knownInterjections.includes(t)
        );

        if (found.length > 0) {

            a.grammarSignals.interjectionDetected = true;
            a.grammarSignals.interjections = found;
        }

        /* ==================================================
           DISCOURSE POSITION SIGNAL
        ================================================== */

        if (found.includes("um") || found.includes("uh")) {
            a.grammarSignals.hesitationMarker = true;
        }

        if (found.includes("wow") || found.includes("oh")) {
            a.grammarSignals.emphasisMarker = true;
        }
    }
}

/* ==========================================================
   EXPORT
========================================================== */

module.exports = InterjectionRules;
