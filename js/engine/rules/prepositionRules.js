"use strict";

/* ==========================================================
   English-Bot
   Preposition Engine v7
   Relational grammar system (NOT word replacement)
========================================================== */

class PrepositionEngine {

    apply(analysis) {

        if (!analysis) return analysis;

        this.resolveTemporalRelations(analysis);
        this.resolveSpatialRelations(analysis);
        this.resolveDirectionalRelations(analysis);

        return analysis;
    }

    /* ======================================================
       TEMPORAL SYSTEM
    ====================================================== */

    resolveTemporalRelations(a) {

        const time = a.timeExpressions || [];

        for (const t of time) {

            if (t.isSpecificTime) {
                t.preposition = "at";
            }

            else if (t.isDay || t.isDate) {
                t.preposition = "on";
            }

            else if (t.isLongPeriod) {
                t.preposition = "in";
            }
        }
    }

    /* ======================================================
       SPATIAL SYSTEM
    ====================================================== */

    resolveSpatialRelations(a) {

        const places = a.nouns?.filter(n => n.isLocation) || [];

        for (const p of places) {

            if (p.isEnclosedSpace) {
                p.preposition = "in";
            }

            else if (p.isSurface) {
                p.preposition = "on";
            }

            else if (p.isPointLocation) {
                p.preposition = "at";
            }
        }
    }

    /* ======================================================
       DIRECTIONAL SYSTEM
    ====================================================== */

    resolveDirectionalRelations(a) {

        const verbs = a.verbs || [];

        for (const v of verbs) {

            if (v.isMotionVerb) {

                v.preposition = this.resolveMotionPreposition(v);
            }
        }
    }

    resolveMotionPreposition(verb) {

        if (verb.target?.isEnclosedSpace) return "into";
        if (verb.target?.isSurface) return "onto";
        return "to";
    }
}

/* ==========================================================
   EXPORT
========================================================== */

module.exports = PrepositionEngine;
