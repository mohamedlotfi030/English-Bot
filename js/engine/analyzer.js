"use strict";

/* ==========================================================
   English-Bot
   Analyzer v7.0 (HYBRID)
   - Combines structural NLP (v6)
   - + Grammar Signals Engine (v2 concept)
========================================================== */

class Analyzer {

    constructor() {
        this.version = "7.0";
    }

    /* ======================================================
       PUBLIC ANALYZE
    ====================================================== */

    analyze(tokens = []) {

        if (!Array.isArray(tokens)) {
            tokens = [];
        }

        const analysis = {

            tokens,

            /* ==================================================
               CORE STRUCTURE (from v6)
            ================================================== */

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

            /* ==================================================
               LEXICAL GROUPS (from v6, cleaned)
            ================================================== */

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
            timeExpressions: [],

            /* ==================================================
               GRAMMAR SIGNALS (NEW - v2 concept)
            ================================================== */

            grammarSignals: {
                agreementViolation: false,
                articleError: false,
                pronounIssue: false,
                tenseMismatch: false,
                verbFormIssue: false,
                sentenceIssue: false
            }

        };

        if (tokens.length === 0) {
            return analysis;
        }

        /* ======================================================
           PIPELINE (v6 structure preserved)
        ====================================================== */

        this.collectTokens(analysis);

        this.detectSentenceType(analysis);

        this.detectConditionals(analysis);

        this.detectNegative(analysis);

        this.detectSubject(analysis);

        this.detectVerb(analysis);

        this.detectObject(analysis);

        this.detectTense(analysis);

        this.detectVoice(analysis);

        this.detectComplexity(analysis);

        /* ======================================================
           GRAMMAR SIGNAL ENGINE (NEW LAYER)
        ====================================================== */

        this.detectAgreementSignals(analysis);

        this.detectArticleSignals(analysis);

        this.detectPronounSignals(analysis);

        this.detectVerbSignals(analysis);

        return analysis;
    }

    /* ======================================================
       TOKEN COLLECTION (v6)
    ====================================================== */

    collectTokens(analysis) {

        const aux = [
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

            const t = token.lower || token.toLowerCase?.() || token;

            if (aux.includes(t)) {
                analysis.auxiliaries.push(token);
            }

            if (modals.includes(t)) {
                analysis.modals.push(token);
            }

            if (t === "a" || t === "an" || t === "the") {
                analysis.articles.push(token);
            }

            if (["i","you","he","she","it","we","they","me","him","her","us","them"].includes(t)) {
                analysis.pronouns.push(token);
            }

            if (token.type === "noun") analysis.nouns.push(token);
            if (token.type === "verb") analysis.verbs.push(token);
            if (token.type === "adjective") analysis.adjectives.push(token);
            if (token.type === "adverb") analysis.adverbs.push(token);
            if (token.type === "preposition") analysis.prepositions.push(token);
            if (token.type === "conjunction") analysis.conjunctions.push(token);
        }
    }

    /* ======================================================
       SENTENCE TYPE
    ====================================================== */

    detectSentenceType(a) {

        const first = a.tokens[0]?.lower || a.tokens[0]?.toLower?.() || "";
        const last = a.tokens[a.tokens.length - 1]?.value || "";

        const questionWords = ["do","does","did","is","are","am","can","could","will","would","shall","should"];

        if (last === "?") {
            a.sentenceType = "question";
            a.question = true;
        }

        if (questionWords.includes(first)) {
            a.sentenceType = "question";
            a.question = true;
        }
    }

    /* ======================================================
       CONDITIONALS
    ====================================================== */

    detectConditionals(a) {

        a.conditional = a.tokens.some(t =>
            (t.lower || t.toLower?.()) === "if" ||
            (t.lower || t.toLower?.()) === "unless"
        );
    }

    /* ======================================================
       NEGATIVES
    ====================================================== */

    detectNegative(a) {

        a.negative = a.tokens.some(t => {
            const w = t.lower || t.toLower?.();
            return w === "not" || w === "never" || w === "no";
        });
    }

    /* ======================================================
       SUBJECT DETECTION (v6 preserved)
    ====================================================== */

    detectSubject(a) {

        const pronouns = ["i","you","he","she","it","we","they"];

        const p = a.pronouns[0]?.lower || a.pronouns[0]?.value;

        if (p) {
            a.subject = p;
            return;
        }

        const noun = a.nouns[0];
        if (noun) {
            a.subject = noun.value;
        }
    }

    /* ======================================================
       VERB DETECTION (v6 preserved)
    ====================================================== */

    detectVerb(a) {

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

        for (const t of a.tokens) {

            const w = t.lower || t.toLower?.();

            if (modals.includes(w)) continue;
            if (auxiliaries.includes(w)) continue;

            if (t.type === "verb" && !a.verb) {
                a.verb = t.value;
                a.verbForm = w;
            }
        }
    }

    /* ======================================================
       OBJECT DETECTION (v6)
    ====================================================== */

    detectObject(a) {

        if (a.nouns.length > 1) {
            a.object = a.nouns[a.nouns.length - 1].value;
        }
    }

    /* ======================================================
       TENSE (v6)
    ====================================================== */

    detectTense(a) {

        const w = a.tokens.map(t => t.lower || t.toLower?.());

        if (w.includes("will") || w.includes("shall")) {
            a.tense = "future";
            return;
        }

        if (w.includes("was") || w.includes("were") || w.includes("did") || w.includes("had")) {
            a.tense = "past";
            return;
        }

        if (w.includes("has") || w.includes("have")) {
            a.tense = "presentPerfect";
            return;
        }

        if (w.includes("am") || w.includes("is") || w.includes("are") || w.includes("do") || w.includes("does")) {
            a.tense = "present";
            return;
        }
    }

    /* ======================================================
       VOICE (v6)
    ====================================================== */

    detectVoice(a) {

        const be = ["am","is","are","was","were","be","been","being"];

        let hasBe = false;
        let hasPart = false;

        for (const t of a.tokens) {

            const w = t.lower || t.toLower?.();

            if (be.includes(w)) hasBe = true;

            if (t.type === "verb" && (w?.endsWith("ed") || w?.endsWith("en"))) {
                hasPart = true;
            }
        }

        a.voice = (hasBe && hasPart) ? "passive" : "active";
    }

    /* ======================================================
       COMPLEXITY (v6)
    ====================================================== */

    detectComplexity(a) {

        const conj = ["and","but","or","because","although","if","while","since","when","before","after"];

        a.conjunctions = a.tokens.filter(t =>
            conj.includes(t.lower || t.toLower?.())
        );

        a.complexity = a.conjunctions.length > 0 ? "complex" : "simple";
    }

    /* ======================================================
       ================= SIGNAL ENGINE ======================
       (NEW LAYER - makes Rules easy)
    ====================================================== */

    detectAgreementSignals(a) {

        if (!a.subject || !a.verb) return;

        const s = a.subject.toLowerCase?.() || a.subject;
        const v = (a.verbForm || "").toLowerCase();

        if (["he","she","it"].includes(s)) {
            if (v === "are" || v === "were") {
                a.grammarSignals.agreementViolation = true;
            }
        }

        if (["we","they"].includes(s)) {
            if (v === "is" || v === "am") {
                a.grammarSignals.agreementViolation = true;
            }
        }
    }

    detectArticleSignals(a) {

        const words = a.tokens.map(t => t.lower || t.toLower?.());

        for (let i = 0; i < words.length - 1; i++) {

            if (words[i] === "a" && /^[aeiou]/.test(words[i + 1])) {
                a.grammarSignals.articleError = true;
            }

            if (words[i] === "an" && !/^[aeiou]/.test(words[i + 1])) {
                a.grammarSignals.articleError = true;
            }
        }
    }

    detectPronounSignals(a) {

        if (a.pronouns.length > 0) {
            a.grammarSignals.pronounIssue = false;
        }
    }

    detectVerbSignals(a) {
        // placeholder for future verb mismatch detection
    }
}

/* ==========================================================
   EXPORT
========================================================== */

module.exports = Analyzer;
