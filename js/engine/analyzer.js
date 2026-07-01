"use strict";

/* ==========================================================
   English-Bot
   Analyzer v7.0 (BROWSER FIXED)
========================================================== */

class Analyzer {

    constructor() {
        this.version = "7.0";
    }

    /* ======================================================
       MAIN ANALYZE
    ====================================================== */

    analyze(tokens = []) {

        if (!Array.isArray(tokens)) tokens = [];

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

            grammarSignals: {
                agreementViolation: false,
                articleError: false,
                pronounIssue: false,
                tenseMismatch: false,
                verbFormIssue: false,
                sentenceIssue: false
            }
        };

        if (tokens.length === 0) return analysis;

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

        this.detectAgreementSignals(analysis);
        this.detectArticleSignals(analysis);
        this.detectPronounSignals(analysis);

        return analysis;
    }

    /* ======================================================
       TOKEN COLLECTION
    ====================================================== */

    collectTokens(a) {

        const aux = ["am","is","are","was","were","be","been","being","do","does","did","have","has","had"];
        const modals = ["can","could","may","might","must","shall","should","will","would"];

        for (const t of a.tokens) {

            const w = t.lower || t.value?.toLowerCase?.() || "";

            if (aux.includes(w)) a.auxiliaries.push(t);
            if (modals.includes(w)) a.modals.push(t);

            if (["a","an","the"].includes(w)) a.articles.push(t);

            if (["i","you","he","she","it","we","they","me","him","her","us","them"].includes(w)) {
                a.pronouns.push(t);
            }

            if (t.type === "noun") a.nouns.push(t);
            if (t.type === "verb") a.verbs.push(t);
            if (t.type === "adjective") a.adjectives.push(t);
            if (t.type === "adverb") a.adverbs.push(t);
            if (t.type === "preposition") a.prepositions.push(t);
            if (t.type === "conjunction") a.conjunctions.push(t);
        }
    }

    /* ======================================================
       SENTENCE TYPE
    ====================================================== */

    detectSentenceType(a) {

        const first = a.tokens[0]?.lower;
        const last = a.tokens[a.tokens.length - 1]?.value;

        const qWords = ["do","does","did","is","are","am","can","could","will","would","shall","should"];

        if (last === "?") {
            a.sentenceType = "question";
            a.question = true;
        }

        if (qWords.includes(first)) {
            a.sentenceType = "question";
            a.question = true;
        }
    }

    /* ======================================================
       CONDITIONAL / NEGATIVE
    ====================================================== */

    detectConditionals(a) {
        a.conditional = a.tokens.some(t => (t.lower || "").includes("if"));
    }

    detectNegative(a) {
        a.negative = a.tokens.some(t =>
            ["not","never","no"].includes(t.lower || "")
        );
    }

    /* ======================================================
       SUBJECT
    ====================================================== */

    detectSubject(a) {

        const p = a.pronouns[0]?.lower;
        if (p) {
            a.subject = p;
            return;
        }

        const noun = a.nouns[0];
        if (noun) a.subject = noun.value;
    }

    /* ======================================================
       VERB
    ====================================================== */

    detectVerb(a) {

        const aux = ["am","is","are","was","were","be","been","being","do","does","did","have","has","had"];

        for (const t of a.tokens) {

            const w = t.lower;

            if (aux.includes(w)) continue;

            if (t.type === "verb" && !a.verb) {
                a.verb = t.value;
                a.verbForm = w;
            }
        }
    }

    /* ======================================================
       OBJECT
    ====================================================== */

    detectObject(a) {
        if (a.nouns.length > 1) {
            a.object = a.nouns[a.nouns.length - 1].value;
        }
    }

    /* ======================================================
       TENSE
    ====================================================== */

    detectTense(a) {

        const w = a.tokens.map(t => t.lower);

        if (w.includes("will")) return a.tense = "future";
        if (["was","were","did","had"].some(x => w.includes(x))) return a.tense = "past";
        if (["has","have"].some(x => w.includes(x))) return a.tense = "presentPerfect";
        if (["am","is","are","do","does"].some(x => w.includes(x))) return a.tense = "present";
    }

    /* ======================================================
       VOICE
    ====================================================== */

    detectVoice(a) {

        const be = ["am","is","are","was","were","be","been","being"];

        let hasBe = false;
        let hasPast = false;

        for (const t of a.tokens) {

            const w = t.lower;

            if (be.includes(w)) hasBe = true;

            if (t.type === "verb" && (w?.endsWith("ed") || w?.endsWith("en"))) {
                hasPast = true;
            }
        }

        a.voice = (hasBe && hasPast) ? "passive" : "active";
    }

    /* ======================================================
       COMPLEXITY
    ====================================================== */

    detectComplexity(a) {

        const conj = ["and","but","or","because","although","if","while","since"];

        a.conjunctions = a.tokens.filter(t =>
            conj.includes(t.lower)
        );

        a.complexity = a.conjunctions.length ? "complex" : "simple";
    }

    /* ======================================================
       SIGNALS
    ====================================================== */

    detectAgreementSignals(a) {

        if (!a.subject || !a.verbForm) return;

        const s = a.subject.toLowerCase();
        const v = a.verbForm;

        if (["we","they"].includes(s) && ["is","am"].includes(v)) {
            a.grammarSignals.agreementViolation = true;
        }

        if (["he","she","it"].includes(s) && ["are","were"].includes(v)) {
            a.grammarSignals.agreementViolation = true;
        }
    }

    detectArticleSignals(a) {

        const words = a.tokens.map(t => t.lower);

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
        a.grammarSignals.pronounIssue = false;
    }
}

/* ==========================================================
   CREATE INSTANCE
========================================================== */

const analyzer = new Analyzer();

/* ==========================================================
   EXPORT
========================================================== */

window.analyzer = analyzer;
window.Analyzer = Analyzer;

/* ==========================================================
   REGISTER TO GRAMMAR ENGINE
========================================================== */

if (
    window.GrammarEngine &&
    typeof window.GrammarEngine.registerManager === "function"
) {

    window.GrammarEngine.registerManager(
        "analyzer",
        analyzer
    );

    console.log("[Analyzer] Registered successfully.");

} else {

    console.warn("[Analyzer] GrammarEngine is not available.");

}
