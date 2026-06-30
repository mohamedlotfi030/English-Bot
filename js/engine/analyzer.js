"use strict";

/* ==========================================================
   English-Bot
   Analyzer (Enhanced)
   Version 5.0
========================================================== */

class Analyzer {
    constructor() {
        this.reset();
    }

    /* ======================================================
       Reset Analyzer State
    ====================================================== */
    reset() {
        this.subject = null;
        this.object = null;
        this.mainVerb = null;
        this.verbForm = null;
        this.auxiliaries = [];
        this.modals = [];
        this.prepositions = [];
        this.articles = [];
        this.pronouns = [];
        this.adjectives = [];
        this.adverbs = [];
        this.timeExpressions = [];
        this.conjunctions = [];
        this.tokens = [];
        this.tense = "unknown";
        this.voice = "active";
        this.sentenceType = "statement";
        this.negative = false;
        this.question = false;
        this.conditional = false;
        this.complexity = "simple";
    }

    /* ======================================================
       Analyze Sentence
    ====================================================== */
    analyze(tokens) {
        this.reset();
        this.tokens = tokens;

        this.detectSentenceType();
        this.detectQuestion();
        this.detectNegation();
        this.detectPronouns();
        this.detectArticles();
        this.detectAuxiliaries();
        this.detectModals();
        this.detectSubject();
        this.detectMainVerb();
        this.detectObject();
        this.detectPrepositions();
        this.detectTimeExpressions();
        this.detectTense();
        this.detectVoice();
        this.detectConditionals();
        this.detectComplexity();

        return this.buildAnalysis();
    }

    /* ======================================================
       Build Result
    ====================================================== */
    buildAnalysis() {
        return {
            tokens: this.tokens,
            subject: this.subject,
            object: this.object,
            verb: this.mainVerb,
            verbForm: this.verbForm,
            auxiliaries: this.auxiliaries,
            modals: this.modals,
            prepositions: this.prepositions,
            articles: this.articles,
            pronouns: this.pronouns,
            adjectives: this.adjectives,
            adverbs: this.adverbs,
            timeExpressions: this.timeExpressions,
            conjunctions: this.conjunctions,
            tense: this.tense,
            voice: this.voice,
            sentenceType: this.sentenceType,
            negative: this.negative,
            question: this.question,
            conditional: this.conditional,
            complexity: this.complexity
        };
    }
    /* ======================================================
       Detection Methods
    ====================================================== */

    detectSentenceType() {
        const lastToken = this.tokens[this.tokens.length - 1];
        if (lastToken && lastToken.value === "?") {
            this.sentenceType = "question";
        } else if (lastToken && ["!", "."].includes(lastToken.value)) {
            this.sentenceType = "statement";
        }
    }

    detectQuestion() {
        this.question = this.tokens.some(t => t.lower === "do" || t.lower === "does" || t.lower === "did" || t.value === "?");
    }

    detectNegation() {
        this.negative = this.tokens.some(t => t.lower === "not" || t.lower === "never" || t.lower === "no");
    }

    detectPronouns() {
        this.pronouns = this.tokens.filter(t => t.type === "pronoun");
        if (!this.subject && this.pronouns.length > 0) {
            this.subject = this.pronouns[0].value;
        }
    }

    detectArticles() {
        this.articles = this.tokens.filter(t => t.type === "article");
    }

    detectAuxiliaries() {
        this.auxiliaries = this.tokens.filter(t => t.type === "verb" && GrammarEngine.getDictionary("verbs").get(t.lower)?.auxiliary);
    }

    detectModals() {
        this.modals = this.tokens.filter(t => GrammarEngine.getDictionary("verbs").get(t.lower)?.modal);
    }

    detectSubject() {
        if (!this.subject) {
            const noun = this.tokens.find(t => t.type === "noun");
            if (noun) this.subject = noun.value;
        }
    }

    detectMainVerb() {
        const verb = this.tokens.find(t => t.type === "verb" && !GrammarEngine.getDictionary("verbs").get(t.lower)?.auxiliary);
        if (verb) {
            this.mainVerb = verb.value;
            this.verbForm = verb.type;
        }
    }

    detectObject() {
        const nouns = this.tokens.filter(t => t.type === "noun");
        if (nouns.length > 1) {
            this.object = nouns[nouns.length - 1].value;
        }
    }

    detectPrepositions() {
        this.prepositions = this.tokens.filter(t => t.type === "preposition");
    }

    detectTimeExpressions() {
        this.timeExpressions = this.tokens.filter(t => ["yesterday", "today", "tomorrow"].includes(t.lower));
    }

    detectTense() {
        if (this.timeExpressions.some(t => t.lower === "yesterday")) {
            this.tense = "past";
        } else if (this.timeExpressions.some(t => t.lower === "tomorrow")) {
            this.tense = "future";
        } else {
            this.tense = "present";
        }
    }

    detectVoice() {
        if (this.auxiliaries.some(t => t.lower === "be") && this.tokens.some(t => t.type === "participle")) {
            this.voice = "passive";
        }
    }

    detectConditionals() {
        this.conditional = this.tokens.some(t => ["if", "unless"].includes(t.lower));
    }

    detectComplexity() {
        const conjunctions = this.tokens.filter(t => t.type === "conjunction");
        if (conjunctions.length > 0) {
            this.complexity = "complex";
        }
    }
}

/* ==========================================================
   Export
========================================================== */

const analyzer = new Analyzer();
window.analyzer = analyzer;

GrammarEngine.registerManager("analyzer", analyzer);
