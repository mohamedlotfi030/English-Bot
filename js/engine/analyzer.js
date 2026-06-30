"use strict";

/* ==========================================================
   English-Bot
   Analyzer
   Version 6.0
   (Completely Rewritten)
========================================================== */

class Analyzer {

    constructor() {

        this.version = "6.0";

    }

    /* ======================================================
       Public Analyze
    ====================================================== */

    analyze(tokens = []) {

        if (!Array.isArray(tokens)) {
            tokens = [];
        }

        const analysis = {

            tokens,

            subject: null,
            object: null,

            verb: null,
            verbForm: null,

            tense: "unknown",
            voice: "active",

            sentenceType: "statement",

            question: false,
            negative: false,
            conditional: false,

            complexity: "simple",

            auxiliaries: [],
            modals: [],
            articles: [],
            pronouns: [],
            nouns: [],
            verbs: [],
            adjectives: [],
            adverbs: [],
            prepositions: [],
            conjunctions: [],
            timeExpressions: []

        };

        if (tokens.length === 0) {
            return analysis;
        }

        this.collectTokens(analysis);

        this.detectSentenceType(analysis);

        this.detectSubject(analysis);

        this.detectVerb(analysis);

        this.detectObject(analysis);

        this.detectTense(analysis);

        this.detectVoice(analysis);

        this.detectComplexity(analysis);

        return analysis;

    }

    /* ======================================================
       Collect Tokens
    ====================================================== */

    collectTokens(analysis) {

        for (const token of analysis.tokens) {

            switch (token.type) {

                case "noun":
                    analysis.nouns.push(token);
                    break;

                case "verb":
                    analysis.verbs.push(token);
                    break;

                case "article":
                    analysis.articles.push(token);
                    break;

                case "pronoun":
                    analysis.pronouns.push(token);
                    break;

                case "adjective":
                    analysis.adjectives.push(token);
                    break;

                case "adverb":
                    analysis.adverbs.push(token);
                    break;

                case "preposition":
                    analysis.prepositions.push(token);
                    break;

            }

        }

    }
       /* ======================================================
       Sentence Type
    ====================================================== */

    detectSentenceType(analysis) {

        const first = analysis.tokens[0]?.lower || "";
        const last = analysis.tokens[analysis.tokens.length - 1]?.value || "";

        if (last === "?") {
            analysis.sentenceType = "question";
            analysis.question = true;
        }

        const auxiliaryQuestions = [
            "am","is","are","was","were",
            "do","does","did",
            "have","has","had",
            "can","could",
            "will","would",
            "shall","should",
            "may","might",
            "must"
        ];

        if (auxiliaryQuestions.includes(first)) {
            analysis.question = true;
            analysis.sentenceType = "question";
        }

    }

    /* ======================================================
       Subject Detection
    ====================================================== */

    detectSubject(analysis) {

        if (analysis.pronouns.length > 0) {
            analysis.subject = analysis.pronouns[0].value;
            return;
        }

        if (analysis.nouns.length > 0) {
            analysis.subject = analysis.nouns[0].value;
        }

    }

    /* ======================================================
       Main Verb Detection
    ====================================================== */

    detectVerb(analysis) {

        const auxiliaries = [
            "am","is","are","was","were",
            "be","been","being",
            "do","does","did",
            "have","has","had"
        ];

        const modals = [
            "can","could",
            "may","might",
            "must",
            "shall","should",
            "will","would"
        ];

        for (const token of analysis.tokens) {

            if (modals.includes(token.lower)) {
                analysis.modals.push(token);
                continue;
            }

            if (auxiliaries.includes(token.lower)) {
                analysis.auxiliaries.push(token);
                continue;
            }

            if (token.type === "verb" && !analysis.verb) {
                analysis.verb = token.value;
                analysis.verbForm = token.lower;
            }

        }

    }

    /* ======================================================
       Object Detection
    ====================================================== */

    detectObject(analysis) {

        if (analysis.nouns.length > 1) {
            analysis.object =
                analysis.nouns[analysis.nouns.length - 1].value;
        }

    }
       /* ======================================================
       Tense Detection
    ====================================================== */

    detectTense(analysis) {

        const words = analysis.tokens.map(t => t.lower);

        if (
            words.includes("will") ||
            words.includes("shall")
        ) {
            analysis.tense = "future";
            return;
        }

        if (
            words.includes("was") ||
            words.includes("were") ||
            words.includes("did") ||
            words.includes("had")
        ) {
            analysis.tense = "past";
            return;
        }

        if (
            words.includes("has") ||
            words.includes("have")
        ) {
            analysis.tense = "presentPerfect";
            return;
        }

        if (
            words.includes("am") ||
            words.includes("is") ||
            words.includes("are") ||
            words.includes("do") ||
            words.includes("does")
        ) {
            analysis.tense = "present";
            return;
        }

        analysis.tense = "unknown";

    }

    /* ======================================================
       Voice Detection
    ====================================================== */

    detectVoice(analysis) {

        const beForms = [
            "am","is","are",
            "was","were",
            "be","been","being"
        ];

        let hasBe = false;
        let hasPastParticiple = false;

        for (const token of analysis.tokens) {

            if (beForms.includes(token.lower)) {
                hasBe = true;
            }

            if (
                token.type === "verb" &&
                (
                    token.lower.endsWith("ed") ||
                    token.lower.endsWith("en")
                )
            ) {
                hasPastParticiple = true;
            }

        }

        analysis.voice =
            (hasBe && hasPastParticiple)
                ? "passive"
                : "active";

    }

    /* ======================================================
       Complexity Detection
    ====================================================== */

    detectComplexity(analysis) {

        const conjunctions = [

            "and",
            "but",
            "or",
            "because",
            "although",
            "though",
            "while",
            "whereas",
            "since",
            "if",
            "unless",
            "when",
            "after",
            "before"

        ];

        analysis.conjunctions = analysis.tokens.filter(
            token => conjunctions.includes(token.lower)
        );

        analysis.complexity =
            analysis.conjunctions.length > 0
                ? "complex"
                : "simple";

    }

    /* ======================================================
       Conditionals
    ====================================================== */

    detectConditionals(analysis) {

        analysis.conditional = analysis.tokens.some(
            token =>
                token.lower === "if" ||
                token.lower === "unless"
        );

    }

    /* ======================================================
       Negatives
    ====================================================== */

    detectNegative(analysis) {

        analysis.negative = analysis.tokens.some(
            token =>
                token.lower === "not" ||
                token.lower === "never" ||
                token.lower === "no"
        );

    }
       /* ======================================================
       Build Analysis
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

}

/* ==========================================================
   Create Singleton
========================================================== */

const analyzer = new Analyzer();

/* ==========================================================
   Export
========================================================== */

window.analyzer = analyzer;

window.Analyzer = Analyzer;

/* ==========================================================
   Register with GrammarEngine
========================================================== */

if (
    window.GrammarEngine &&
    typeof window.GrammarEngine.registerManager === "function"
) {

    window.GrammarEngine.registerManager(
        "analyzer",
        analyzer
    );

} else {

    console.warn(
        "[Analyzer] GrammarEngine not found."
    );

}
