"use strict";

/* ==========================================================
   English-Bot
   Grammar Framework
   Version 7.0 (ENGINE COMPATIBLE)
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
    PLURAL: "plural",
    WORD_ORDER: "wordOrder",
    PUNCTUATION: "punctuation",
    SPELLING: "spelling",
    STYLE: "style",
    VOCABULARY: "vocabulary",
    IDIOM: "idiom"
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
   Grammar Rule (FIXED)
========================================================== */

class GrammarRule {

    constructor(options = {}) {

        this.id = options.id || "";
        this.name = options.name || "";
        this.category = options.category || GrammarCategory.GRAMMAR;
        this.description = options.description || "";
        this.priority = options.priority ?? 100;
        this.severity = options.severity || GrammarSeverity.ERROR;
        this.enabled = options.enabled !== false;

        /* 🔥 FIX 1: unify condition system */
        this.test = typeof options.test === "function"
            ? options.test
            : typeof options.condition === "function"
                ? options.condition
                : () => false;

        /* 🔥 FIX 2: unified fix output */
        this.fix = typeof options.fix === "function"
            ? options.fix
            : (sentence, analysis) => {

                if (typeof options.correction === "function") {
                    return {
                        text: options.correction(sentence, analysis),
                        issue: true
                    };
                }

                return {
                    text: sentence,
                    issue: false
                };
            };
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
   Export
========================================================== */

window.GrammarCategory = GrammarCategory;
window.GrammarSeverity = GrammarSeverity;
window.GrammarRule = GrammarRule;
window.GrammarCorrection = GrammarCorrection;
