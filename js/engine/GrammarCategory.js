"use strict";

/* ==========================================================
   English-Bot
   Grammar Categories
   Version 9.0
========================================================== */

const GrammarCategory = Object.freeze({

    /* ==============================
       General
    ============================== */

    GENERAL: "general",

    /* ==============================
       Parts of Speech
    ============================== */

    NOUN: "noun",

    VERB: "verb",

    ADJECTIVE: "adjective",

    ADVERB: "adverb",

    ARTICLE: "article",

    PRONOUN: "pronoun",

    PREPOSITION: "preposition",

    CONJUNCTION: "conjunction",

    DETERMINER: "determiner",

    INTERJECTION: "interjection",

    AUXILIARY: "auxiliary",

    MODAL: "modal",

    PARTICIPLE: "participle",

    /* ==============================
       Grammar
    ============================== */

    AGREEMENT: "agreement",

    TENSE: "tense",

    VOICE: "voice",

    MOOD: "mood",

    ASPECT: "aspect",

    NEGATION: "negation",

    QUESTION: "question",

    WORD_ORDER: "word_order",

    SENTENCE: "sentence",

    CLAUSE: "clause",

    /* ==============================
       Vocabulary
    ============================== */

    VOCABULARY: "vocabulary",

    SPELLING: "spelling",

    COLLOCATION: "collocation",

    IDIOM: "idiom",

    PHRASAL_VERB: "phrasal_verb",

    /* ==============================
       Writing
    ============================== */

    PUNCTUATION: "punctuation",

    CAPITALIZATION: "capitalization",

    STYLE: "style",

    REGISTER: "register"

});

/* ==========================================================
   Helpers
========================================================== */

GrammarCategory.exists = function(category) {

    return Object.values(GrammarCategory).includes(category);

};

GrammarCategory.values = function() {

    return Object.values(GrammarCategory);

};

GrammarCategory.keys = function() {

    return Object.keys(GrammarCategory);

};

/* ==========================================================
   Export
========================================================== */

window.GrammarCategory = GrammarCategory;

console.log("[GrammarCategory] Ready");
