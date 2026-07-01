"use strict";

/* ==========================================================
   English-Bot
   Participle Engine v7
   Structural grammar layer (NOT word replacement)
========================================================== */

class ParticipleEngine {

    apply(analysis) {

        if (!analysis || !analysis.verb) return analysis;

        this.processContinuous(analysis);
        this.processPerfect(analysis);
        this.processPassive(analysis);
        this.processAdjectivalParticiples(analysis);

        return analysis;
    }

    /* ======================================================
       Continuous Tenses
    ====================================================== */

    processContinuous(a) {

        const continuousTenses = [
            "presentContinuous",
            "pastContinuous",
            "futureContinuous"
        ];

        if (!continuousTenses.includes(a.tense)) return;

        a.structure = a.structure || {};

        a.structure.requiresBeAuxiliary = true;
        a.structure.requiresIngForm = true;
    }

    /* ======================================================
       Perfect Tenses
    ====================================================== */

    processPerfect(a) {

        const perfectTenses = [
            "presentPerfect",
            "pastPerfect",
            "futurePerfect"
        ];

        if (!perfectTenses.includes(a.tense)) return;

        a.structure = a.structure || {};

        a.structure.requiresHaveAuxiliary = true;
        a.structure.requiresPastParticiple = true;
    }

    /* ======================================================
       Passive Voice
    ====================================================== */

    processPassive(a) {

        if (!a.voice || a.voice !== "passive") return;

        a.structure = a.structure || {};

        a.structure.requiresBeAuxiliary = true;
        a.structure.requiresPastParticiple = true;
        a.structure.hasAgentOptional = true;
    }

    /* ======================================================
       Adjectival Participles
    ====================================================== */

    processAdjectivalParticiples(a) {

        if (!a.adjectives) return;

        for (const adj of a.adjectives) {

            if (!adj.isDerivedFromVerb) continue;

            adj.participleRole =
                adj.meaning === "active"
                    ? "presentParticiple"
                    : "pastParticiple";
        }
    }
}

/* ==========================================================
   EXPORT
========================================================== */

module.exports = ParticipleEngine;
