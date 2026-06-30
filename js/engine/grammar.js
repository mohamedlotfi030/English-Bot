"use strict";

/* ==========================================================
   English-Bot
   Grammar Framework
   Version 6.0
   (Core Definitions Only)
========================================================== */

/* ==========================================================
   Grammar Categories
========================================================== */

const GrammarCategory = Object.freeze({
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
});

/* ==========================================================
   Grammar Severity
========================================================== */

const GrammarSeverity = Object.freeze({
    INFO: "info",
    WARNING: "warning",
    ERROR: "error",
    CRITICAL: "critical"
});

/* ==========================================================
   Grammar Rule
========================================================== */

class GrammarRule {

    constructor(options = {}) {

        this.id = options.id || "";

        this.name = options.name || "";

        this.category = options.category || GrammarCategory.GRAMMAR;

        this.description = options.description || "";

        this.priority = Number.isFinite(options.priority)
            ? options.priority
            : 100;

        this.severity = options.severity || GrammarSeverity.ERROR;

        this.enabled = options.enabled !== false;

        this.test =
            typeof options.test === "function"
                ? options.test
                : () => false;

        this.fix =
            typeof options.fix === "function"
                ? options.fix
                : (sentence) => ({
                      text: sentence,
                      issue: false
                  });
    }

}

/* ==========================================================
   Grammar Correction
========================================================== */

class GrammarCorrection {

    constructor(options = {}) {

        this.issue = options.issue || "";

        this.reason = options.reason || "";

        this.explanation = options.explanation || "";

        this.correction = options.correction || "";

        this.suggestions = Array.isArray(options.suggestions)
            ? options.suggestions
            : [];

    }

}

/* ==========================================================
   Exports
========================================================== */

window.GrammarCategory = GrammarCategory;

window.GrammarSeverity = GrammarSeverity;

window.GrammarRule = GrammarRule;

window.GrammarCorrection = GrammarCorrection;
