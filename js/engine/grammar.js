"use strict";

/* ==========================================================
   English-Bot
   Grammar Framework
   Version 5.1
========================================================== */

/* ==========================================================
   Grammar Categories
========================================================== */

const GrammarCategory = {
    GRAMMAR: "grammar",
    TENSE: "tense",
    AGREEMENT: "agreement",
    ARTICLE: "article",
    PRONOUN: "pronoun",
    PREPOSITION: "preposition",
    MODAL: "modal",
    AUXILIARY: "auxiliary",
    QUESTION: "question",
    NEGATIVE: "negative",
    PASSIVE: "passive",
    CONDITIONAL: "conditional",
    REPORTED_SPEECH: "reportedSpeech",
    COMPARISON: "comparison",
    PLURAL: "plural",
    COUNTABLE: "countable",
    WORD_ORDER: "wordOrder",
    CAPITALIZATION: "capitalization",
    PUNCTUATION: "punctuation",
    SPELLING: "spelling",
    STYLE: "style",
    VOCABULARY: "vocabulary",
    COLLOCATION: "collocation",
    IDIOM: "idiom",
    NATURAL_ENGLISH: "naturalEnglish"
};

/* ==========================================================
   Grammar Severity
========================================================== */

const GrammarSeverity = {
    INFO: "info",
    WARNING: "warning",
    ERROR: "error",
    CRITICAL: "critical"
};

/* ==========================================================
   Grammar Rule Base
========================================================== */

class GrammarRule {
    constructor({
        id,
        name,
        category,
        description = "",
        priority = 100,
        severity = GrammarSeverity.ERROR,
        enabled = true,
        test,
        fix
    }) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.description = description;
        this.priority = priority;
        this.severity = severity;
        this.enabled = enabled;
        this.test = test;
        this.fix = fix;
    }
}

/* ==========================================================
   Grammar Correction Object
========================================================== */

class GrammarCorrection {
    constructor({
        issue,
        reason,
        explanation,
        correction,
        suggestions = []
    }) {
        this.issue = issue;
        this.reason = reason;
        this.explanation = explanation;
        this.correction = correction;
        this.suggestions = suggestions;
    }
}

/* ==========================================================
   Export
========================================================== */

window.GrammarCategory = GrammarCategory;
window.GrammarSeverity = GrammarSeverity;
window.GrammarRule = GrammarRule;
window.GrammarCorrection = GrammarCorrection;
