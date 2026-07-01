"use strict";

/* ==========================================================
   English-Bot
   Preposition Rules v9 (Production Ready)
   - Rule-based architecture
   - Handles Temporal, Spatial, and Directional logic
========================================================== */

/**
 * Rule: Temporal Preposition Resolver
 */
const temporal_preposition_rule = new GrammarRule({
    id: "prep_temporal_rule",
    name: "Temporal Preposition",
    category: GrammarCategory.PREPOSITION,
    severity: GrammarSeverity.INFO,
    priority: 40,
    enabled: true,

    test(text, analysis) {
        return !!(analysis.timeExpressions && analysis.timeExpressions.length > 0);
    },

    fix(text, analysis) {
        analysis.timeExpressions.forEach(t => {
            if (t.isSpecificTime) t.preposition = "at";
            else if (t.isDay || t.isDate) t.preposition = "on";
            else if (t.isLongPeriod) t.preposition = "in";
        });
        return { text, issue: false };
    }
});

/**
 * Rule: Spatial Preposition Resolver
 */
const spatial_preposition_rule = new GrammarRule({
    id: "prep_spatial_rule",
    name: "Spatial Preposition",
    category: GrammarCategory.PREPOSITION,
    severity: GrammarSeverity.INFO,
    priority: 40,
    enabled: true,

    test(text, analysis) {
        return !!(analysis.nouns && analysis.nouns.some(n => n.isLocation));
    },

    fix(text, analysis) {
        analysis.nouns.filter(n => n.isLocation).forEach(p => {
            if (p.isEnclosedSpace) p.preposition = "in";
            else if (p.isSurface) p.preposition = "on";
            else if (p.isPointLocation) p.preposition = "at";
        });
        return { text, issue: false };
    }
});

/**
 * Rule: Directional Preposition Resolver
 */
const directional_preposition_rule = new GrammarRule({
    id: "prep_directional_rule",
    name: "Directional Preposition",
    category: GrammarCategory.PREPOSITION,
    severity: GrammarSeverity.INFO,
    priority: 40,
    enabled: true,

    test(text, analysis) {
        return !!(analysis.verbs && analysis.verbs.some(v => v.isMotionVerb));
    },

    fix(text, analysis) {
        analysis.verbs.filter(v => v.isMotionVerb).forEach(v => {
            if (v.target?.isEnclosedSpace) v.preposition = "into";
            else if (v.target?.isSurface) v.preposition = "onto";
            else v.preposition = "to";
        });
        return { text, issue: false };
    }
});

/* ==========================================================
   REGISTRATION
========================================================== */

GrammarEngine.registerRules([
    temporal_preposition_rule,
    spatial_preposition_rule,
    directional_preposition_rule
]);
