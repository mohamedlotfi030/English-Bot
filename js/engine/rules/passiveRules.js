"use strict";

/* ==========================================================
   English-Bot
   Passive Voice Engine v7
   Structural grammar layer
========================================================== */

class PassiveVoiceEngine {

    apply(analysis) {

        if (!analysis) return analysis;

        if (analysis.voice !== "passive") return analysis;

        analysis.structure = analysis.structure || {};

        this.buildPassiveStructure(analysis);

        return analysis;
    }

    /* ======================================================
       CORE PASSIVE STRUCTURE BUILDER
    ====================================================== */

    buildPassiveStructure(a) {

        const tense = a.tense;

        a.structure.voice = "passive";
        a.structure.requiresPastParticiple = true;

        switch (tense) {

            case "present":
                a.structure.auxiliary = this.getBeForm(a, "present");
                break;

            case "past":
                a.structure.auxiliary = this.getBeForm(a, "past");
                break;

            case "future":
                a.structure.auxiliary = ["will", "be"];
                break;

            case "presentPerfect":
                a.structure.auxiliary = this.getHaveForm(a) + ["been"];
                break;

            case "pastPerfect":
                a.structure.auxiliary = ["had", "been"];
                break;
        }

        a.structure.verbForm = "pastParticiple";
    }

    /* ======================================================
       AUXILIARY HELPERS
    ====================================================== */

    getBeForm(a, tense) {

        if (tense === "present") {
            return a.subject?.number === "plural"
                ? ["are"]
                : ["is"];
        }

        if (tense === "past") {
            return a.subject?.number === "plural"
                ? ["were"]
                : ["was"];
        }

        return ["be"];
    }

    getHaveForm(a) {

        return a.subject?.number === "plural"
            ? ["have"]
            : ["has"];
    }
}

/* ==========================================================
   EXPORT
========================================================== */

module.exports = PassiveVoiceEngine;
