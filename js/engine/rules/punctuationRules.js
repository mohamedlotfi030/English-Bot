"use strict";

/* ==========================================================
   English-Bot
   Punctuation Rules v9 (Production Ready)
   - Rule-based structural formatter
   - Handles sentence endings, lists, and punctuation marks
========================================================== */

/**
 * Rule: Sentence Ending Punctuation
 */
const sentence_end_rule = new GrammarRule({
    id: "punct_sentence_end",
    name: "Sentence Ending Punctuation",
    category: GrammarCategory.PUNCTUATION,
    severity: GrammarSeverity.ERROR,
    priority: 80,
    enabled: true,

    test(text, analysis, tokens) {
        const lastChar = text.trim().slice(-1);
        const expected = analysis.sentenceType === "question" ? "?" : 
                         analysis.sentenceType === "exclamation" ? "!" : ".";
        return lastChar !== expected;
    },

    fix(text, analysis, tokens) {
        const expected = analysis.sentenceType === "question" ? "?" : 
                         analysis.sentenceType === "exclamation" ? "!" : ".";
        const newText = text.trim().replace(/[.?!]$/, "") + expected;
        return { text: newText, issue: true, reason: "Incorrect sentence ending punctuation." };
    }
});

/**
 * Rule: Comma in Clauses
 * Ensures introductory or dependent clauses end with a comma.
 */
const clause_comma_rule = new GrammarRule({
    id: "punct_clause_comma",
    name: "Clause Comma",
    category: GrammarCategory.PUNCTUATION,
    severity: GrammarSeverity.WARNING,
    priority: 50,
    enabled: true,

    test(text, analysis, tokens) {
        return analysis.clauses?.some(c => (c.isIntroductory || c.isDependent) && !c.endingComma);
    },

    fix(text, analysis, tokens) {
        return { text, issue: true, reason: "Introductory or dependent clauses usually require a comma." };
    }
});

/**
 * Rule: Apostrophe Usage
 * Validates words that require apostrophes (possessives/contractions).
 */
const apostrophe_rule = new GrammarRule({
    id: "punct_apostrophe",
    name: "Apostrophe Validation",
    category: GrammarCategory.PUNCTUATION,
    severity: GrammarSeverity.ERROR,
    priority: 40,
    enabled: true,

    test(text, analysis, tokens) {
        return tokens.some(t => t.requiresApostrophe && !t.lower.includes("'"));
    },

    fix(text, analysis, tokens) {
        return { text, issue: true, reason: "Missing apostrophe in possessive or contraction." };
    }
});

/* ==========================================================
   REGISTRATION
========================================================== */

GrammarEngine.registerRules([
    sentence_end_rule,
    clause_comma_rule,
    apostrophe_rule
]);
