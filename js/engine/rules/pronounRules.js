"use strict";

/* ==========================================================
   English-Bot
   Pronoun Rules v9 (Production Ready)
   - Rule-based architecture
   - Handles Subject/Object case agreement
========================================================== */

/**
 * Rule: Subject Case Agreement
 * Ensures pronouns used as subjects are in the subjective case.
 */
const subject_pronoun_rule = new GrammarRule({
    id: "pronoun_subject_case",
    name: "Subject Case Agreement",
    category: GrammarCategory.PRONOUN,
    severity: GrammarSeverity.ERROR,
    priority: 15,
    enabled: true,

    // خريطة التحويل (يمكن نقلها لـ RuleUtils.js)
    subjectMap: {
        "me": "I",
        "him": "he",
        "her": "she",
        "us": "we",
        "them": "they"
    },

    test(text, analysis, tokens) {
        const subject = analysis.subject?.toLowerCase();
        return Object.keys(this.subjectMap).includes(subject);
    },

    fix(text, analysis, tokens) {
        const wrong = analysis.subject.toLowerCase();
        const correct = this.subjectMap[wrong];
        const newText = text.replace(new RegExp(`\\b${wrong}\\b`, 'gi'), correct);
        
        return {
            text: newText,
            issue: true,
            reason: `Use '${correct}' instead of '${wrong}' as the subject of the sentence.`
        };
    }
});

/**
 * Rule: Object Case Agreement
 * Validates that pronouns in object positions are in the objective case.
 */
const object_pronoun_rule = new GrammarRule({
    id: "pronoun_object_case",
    name: "Object Case Agreement",
    category: GrammarCategory.PRONOUN,
    severity: GrammarSeverity.ERROR,
    priority: 15,
    enabled: true,

    test(text, analysis, tokens) {
        const validObjects = ["me", "him", "her", "us", "them", "you", "it"];
        const obj = analysis.object?.toLowerCase();
        return obj && !validObjects.includes(obj);
    },

    fix(text, analysis, tokens) {
        return {
            text: text,
            issue: true,
            reason: "Invalid pronoun used in object position."
        };
    }
});

/* ==========================================================
   REGISTRATION
========================================================== */

GrammarEngine.registerRules([
    subject_pronoun_rule,
    object_pronoun_rule
]);
