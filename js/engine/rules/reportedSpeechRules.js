"use strict";

/* ==========================================================
   English-Bot
   Reported Speech Rules v9 (Production Ready)
   - Rule-based architecture
   - Handles Backshift, Pronoun, and Question conversion
========================================================== */

/**
 * Rule: Tense Backshift (Present -> Past)
 */
const backshift_rule = new GrammarRule({
    id: "reported_backshift",
    name: "Tense Backshift",
    category: GrammarCategory.REPORTED_SPEECH,
    severity: GrammarSeverity.INFO,
    priority: 300,
    enabled: true,

    test(text, analysis, tokens) {
        return analysis.isReported && ["present", "presentContinuous", "presentPerfect"].includes(analysis.tense);
    },

    fix(text, analysis, tokens) {
        // نستخدم وظائف التحويل الموجودة في الـ analysis objects التي يوفرها المحرك
        const verb = analysis.verbs[0];
        const newVerbForm = verb.toPastForm?.() || verb.form; 
        return {
            text: text.replace(verb.form, newVerbForm),
            issue: true,
            reason: "Tense backshift required in reported speech."
        };
    }
});

/**
 * Rule: Pronoun & Deixis Shift (Here -> There)
 */
const deixis_shift_rule = new GrammarRule({
    id: "reported_deixis_shift",
    name: "Deixis Shift",
    category: GrammarCategory.REPORTED_SPEECH,
    severity: GrammarSeverity.INFO,
    priority: 250,
    enabled: true,

    test(text, analysis, tokens) {
        return analysis.isReported && tokens.some(t => ["here", "this"].includes(t.lower));
    },

    fix(text, analysis, tokens) {
        let newText = text;
        tokens.forEach(t => {
            if (t.lower === "here") newText = newText.replace(/\bhere\b/gi, "there");
            if (t.lower === "this") newText = newText.replace(/\bthis\b/gi, "that");
        });
        return { text: newText, issue: true, reason: "Reference shift (here/this) in reported speech." };
    }
});

/**
 * Rule: Question to Statement Conversion
 */
const reported_question_rule = new GrammarRule({
    id: "reported_question_structure",
    name: "Reported Question Structure",
    category: GrammarCategory.REPORTED_SPEECH,
    severity: GrammarSeverity.ERROR,
    priority: 220,
    enabled: true,

    test(text, analysis, tokens) {
        return analysis.isReported && ["yesNoQuestion", "whQuestion"].includes(analysis.type);
    },

    fix(text, analysis, tokens) {
        const prefix = analysis.type === "yesNoQuestion" ? "if " : "";
        const statementForm = analysis.toStatementForm?.() || text;
        return {
            text: `${prefix}${statementForm}`,
            issue: true,
            reason: "Questions in reported speech must be in statement form."
        };
    }
});

/* ==========================================================
   REGISTRATION
========================================================== */

GrammarEngine.registerRules([
    backshift_rule,
    deixis_shift_rule,
    reported_question_rule
]);
