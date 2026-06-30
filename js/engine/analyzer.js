"use strict";

/* ==========================================================
   English-Bot
   Analyzer (Enhanced & Architecture Fixed)
   Version 5.1
========================================================== */

class Analyzer {
    constructor() {
        this.reset();
        
        // قوائم احتياطية لضمان عمل المحلل حتى لو لم تكن القواميس معقدة
        this.fallbackModals = ["can", "could", "shall", "should", "will", "would", "may", "might", "must", "ought"];
        this.fallbackAuxiliaries = ["am", "is", "are", "was", "were", "be", "been", "being", "have", "has", "had", "do", "does", "did"];
        this.fallbackConjunctions = ["and", "but", "or", "so", "because", "although", "if", "unless", "since", "while"];
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
        if (!tokens || !Array.isArray(tokens) || tokens.length === 0) {
            this.reset();
            return this.buildAnalysis();
        }

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
       Helper: Safe Dictionary Check
    ====================================================== */
    checkVerbProperty(word, property, fallbackList) {
        if (fallbackList.includes(word)) return true;

        if (!window.GrammarEngine) return false;
        const dict = window.GrammarEngine.getDictionary("verbs");
        
        // التحقق الآمن في حال كان القاموس Map وكان يخزن خصائص معقدة
        if (dict && typeof dict.get === 'function') {
            try {
                const verbData = dict.get(word);
                return verbData ? !!verbData[property] : false;
            } catch (e) {
                return false;
            }
        }
        return false;
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
        this.auxiliaries = this.tokens.filter(t => this.checkVerbProperty(t.lower, "auxiliary", this.fallbackAuxiliaries));
    }

    detectModals() {
        this.modals = this.tokens.filter(t => this.checkVerbProperty(t.lower, "modal", this.fallbackModals));
    }

    detectSubject() {
        if (!this.subject) {
            const noun = this.tokens.find(t => t.type === "noun");
            if (noun) this.subject = noun.value;
        }
    }

    detectMainVerb() {
        const verb = this.tokens.find(t => t.type === "verb" && !this.checkVerbProperty(t.lower, "auxiliary", this.fallbackAuxiliaries) && !this.checkVerbProperty(t.lower, "modal", this.fallbackModals));
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
        this.timeExpressions = this.tokens.filter(t => ["yesterday", "today", "tomorrow", "now", "later"].includes(t.lower));
    }

    detectTense() {
        if (this.timeExpressions.some(t => t.lower === "yesterday")) {
            this.tense = "past";
        } else if (this.timeExpressions.some(t => t.lower === "tomorrow") || this.modals.some(t => ["will", "shall"].includes(t.lower))) {
            this.tense = "future";
        } else {
            this.tense = "present"; // افتراضي
        }
    }

    detectVoice() {
        // تم التعديل لتفادي الاعتماد على نوع participle غير الموجود في Tokenizer
        const hasBe = this.auxiliaries.some(t => ["be", "is", "are", "am", "was", "were", "been", "being"].includes(t.lower));
        // نفترض وجود مبني للمجهول إذا وجدنا فعل مساعد be مع فعل رئيسي ينتهي بـ ed أو en (كتقييم مبدئي)
        const hasPastParticiple = this.tokens.some(t => t.type === "verb" && (t.lower.endsWith("ed") || t.lower.endsWith("en")));
        
        if (hasBe && hasPastParticiple) {
            this.voice = "passive";
        }
    }

    detectConditionals() {
        this.conditional = this.tokens.some(t => ["if", "unless"].includes(t.lower));
    }

    detectComplexity() {
        // تم الاعتماد على قائمة احتياطية للروابط نظراً لعدم وجودها في التقطيع
        this.conjunctions = this.tokens.filter(t => this.fallbackConjunctions.includes(t.lower));
        if (this.conjunctions.length > 0) {
            this.complexity = "complex";
        }
    }
}

/* ==========================================================
   Export & Registration
========================================================== */

const analyzerInstance = new Analyzer();
window.analyzer = analyzerInstance;
window.Analyzer = analyzerInstance; // للتوافق مع المحرك الأساسي

if (window.GrammarEngine && typeof window.GrammarEngine.registerManager === 'function') {
    window.GrammarEngine.registerManager("analyzer", analyzerInstance);
} else {
    console.warn("[Analyzer] GrammarEngine is missing! Make sure engine.js is loaded before analyzer.js.");
}
