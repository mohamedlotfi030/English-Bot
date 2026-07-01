"use strict";

/* ==========================================================
   English-Bot
   Participle Engine v9 (Production Ready)
   - Rule-based structural validation
   - Handles Tense structures and Adjectival roles
========================================================== */

/**
 * Rule: Tense Structure Constraint
 * Validates auxiliary requirements for Continuous and Perfect tenses.
 */
const tense_structure_rule = new GrammarRule({
    id: "tense_structure_rule",
    name: "Tense Structure Constraint",
    category: GrammarCategory.STRUCTURE,
    severity: GrammarSeverity.INFO,
    priority: 50,
    enabled: true,

    test(text, analysis, tokens) {
        // القاعدة لا تطلق خطأً، بل تضيف قيوداً للتحليل الهيكلي
        return !!analysis.tense;
    },

    fix(text, analysis, tokens) {
        const structure = {};
        const continuous = ["presentContinuous", "pastContinuous", "futureContinuous"];
        const perfect = ["presentPerfect", "pastPerfect", "futurePerfect"];

        if (continuous.includes(analysis.tense)) {
            structure.requiresBeAuxiliary = true;
            structure.requiresIngForm = true;
        } else if (perfect.includes(analysis.tense)) {
            structure.requiresHaveAuxiliary = true;
            structure.requiresPastParticiple = true;
        } else if (analysis.voice === "passive") {
            structure.requiresBeAuxiliary = true;
            structure.requiresPastParticiple = true;
        }

        analysis.structure = structure;
        return { text, issue: false }; // هذا تحسين هيكلي وليس خطأ
    }
});

/**
 * Rule: Adjectival Participle Role
 * Identifies if a participle is acting as an active (ing) or passive (ed) adjective.
 */
const adjectival_participle_rule = new GrammarRule({
    id: "adjective_participle_rule",
    name: "Adjectival Participle Role",
    category: GrammarCategory.MORPHOLOGY,
    severity: GrammarSeverity.INFO,
    priority: 50,
    enabled: true,

    test(text, analysis, tokens) {
        return !!(analysis.adjectives && analysis.adjectives.some(a => a.isDerivedFromVerb));
    },

    fix(text, analysis, tokens) {
        analysis.adjectives.forEach(adj => {
            if (adj.isDerivedFromVerb) {
                adj.participleRole = adj.meaning === "active" ? "presentParticiple" : "pastParticiple";
            }
        });
        return { text, issue: false };
    }
});

/* ==========================================================
   REGISTRATION
========================================================== */

GrammarEngine.registerRules([
    tense_structure_rule,
    adjectiple_participle_rule
]);
