"use strict";

/* ==========================================================
   English-Bot
   Analyzer v10 Enterprise
   Part 1 / 8
========================================================== */

class Analyzer {

    constructor() {

        this.version = "10.0";

        this.auxiliaryDictionary = null;
        this.modalDictionary = null;
        this.articleDictionary = null;
        this.pronounDictionary = null;
        this.verbDictionary = null;
        this.nounDictionary = null;
        this.adjectiveDictionary = null;
        this.adverbDictionary = null;
        this.prepositionDictionary = null;
        this.conjunctionDictionary = null;

        this.loadDictionaries();

    }

    /* ======================================================
       LOAD DICTIONARIES
    ====================================================== */

    loadDictionaries() {

        if (!window.GrammarEngine)
            return;

        this.auxiliaryDictionary =
            GrammarEngine.getDictionary("auxiliaryVerbs");

        this.modalDictionary =
            GrammarEngine.getDictionary("modalVerbs");

        this.articleDictionary =
            GrammarEngine.getDictionary("articles");

        this.pronounDictionary =
            GrammarEngine.getDictionary("pronouns");

        this.verbDictionary =
            GrammarEngine.getDictionary("verbs");

        this.nounDictionary =
            GrammarEngine.getDictionary("nouns");

        this.adjectiveDictionary =
            GrammarEngine.getDictionary("adjectives");

        this.adverbDictionary =
            GrammarEngine.getDictionary("adverbs");

        this.prepositionDictionary =
            GrammarEngine.getDictionary("prepositions");

        this.conjunctionDictionary =
            GrammarEngine.getDictionary("conjunctions");

    }

    /* ======================================================
       MAIN ANALYZE
    ====================================================== */

    analyze(tokens = []) {

        this.loadDictionaries();

        const analysis = this.createAnalysis(tokens);

        if (!tokens.length)
            return analysis;

        this.buildMaps(analysis);

        this.collectPartsOfSpeech(analysis);

        this.detectSentenceType(analysis);

        this.detectNegation(analysis);

        this.detectConditional(analysis);

        this.detectSubject(analysis);

        this.detectVerbPhrase(analysis);

        this.detectObjects(analysis);

        this.detectTense(analysis);

        this.detectAspect(analysis);

        this.detectVoice(analysis);

        this.detectMood(analysis);

        this.detectComplexity(analysis);

        this.buildSignals(analysis);

        return analysis;

    }

    /* ======================================================
       CREATE EMPTY ANALYSIS OBJECT
    ====================================================== */

    createAnalysis(tokens) {

        return {

            tokens,

            rawTokens: [...tokens],

            subject: null,

            directObject: null,

            indirectObject: null,

            verbPhrase: null,

            nounPhrases: [],

            verbPhrases: [],

            adjectivePhrases: [],

            adverbPhrases: [],

            prepositionalPhrases: [],

            tense: "unknown",

            aspect: "simple",

            voice: "active",

            mood: "indicative",

            sentenceType: "statement",

            complexity: "simple",

            negative: false,

            conditional: false,

            question: false,

            nounMap: new Map(),

            verbMap: new Map(),

            adjectiveMap: new Map(),

            adverbMap: new Map(),

            articleMap: new Map(),

            pronounMap: new Map(),

            auxiliaryMap: new Map(),

            modalMap: new Map(),

            prepositionMap: new Map(),

            conjunctionMap: new Map(),

            nouns: [],

            verbs: [],

            adjectives: [],

            adverbs: [],

            pronouns: [],

            articles: [],

            auxiliaries: [],

            modals: [],

            prepositions: [],

            conjunctions: [],

            dependencyTree: {},

            grammarSignals: {}

        };

    }
       /* ======================================================
       BUILD FAST MAPS
    ====================================================== */

    buildMaps(a) {

        for (const token of a.tokens) {

            const word = token.lower || token.value.toLowerCase();

            switch (token.type) {

                case "noun":
                    a.nounMap.set(word, token);
                    break;

                case "verb":
                    a.verbMap.set(word, token);
                    break;

                case "adjective":
                    a.adjectiveMap.set(word, token);
                    break;

                case "adverb":
                    a.adverbMap.set(word, token);
                    break;

                case "article":
                    a.articleMap.set(word, token);
                    break;

                case "pronoun":
                    a.pronounMap.set(word, token);
                    break;

                case "preposition":
                    a.prepositionMap.set(word, token);
                    break;

                case "conjunction":
                    a.conjunctionMap.set(word, token);
                    break;

            }

            if (this.isAuxiliary(word)) {

                a.auxiliaryMap.set(word, token);

            }

            if (this.isModal(word)) {

                a.modalMap.set(word, token);

            }

        }

    }

    /* ======================================================
       COLLECT PARTS OF SPEECH
    ====================================================== */

    collectPartsOfSpeech(a) {

        for (const token of a.tokens) {

            const word = token.lower;

            switch (token.type) {

                case "noun":
                    a.nouns.push(token);
                    break;

                case "verb":
                    a.verbs.push(token);
                    break;

                case "adjective":
                    a.adjectives.push(token);
                    break;

                case "adverb":
                    a.adverbs.push(token);
                    break;

                case "article":
                    a.articles.push(token);
                    break;

                case "pronoun":
                    a.pronouns.push(token);
                    break;

                case "preposition":
                    a.prepositions.push(token);
                    break;

                case "conjunction":
                    a.conjunctions.push(token);
                    break;

            }

            if (this.isAuxiliary(word)) {

                a.auxiliaries.push(token);

            }

            if (this.isModal(word)) {

                a.modals.push(token);

            }

        }

    }

    /* ======================================================
       SENTENCE TYPE
    ====================================================== */

    detectSentenceType(a) {

        if (!a.tokens.length)
            return;

        const first = a.tokens[0].lower;

        const last =
            a.tokens[a.tokens.length - 1].value;

        const questionAuxiliaries = [

            "do",
            "does",
            "did",

            "is",
            "are",
            "am",

            "was",
            "were",

            "have",
            "has",
            "had",

            "can",
            "could",

            "will",
            "would",

            "shall",
            "should",

            "may",
            "might",
            "must"

        ];

        if (last === "?") {

            a.question = true;

            a.sentenceType = "question";

            return;

        }

        if (questionAuxiliaries.includes(first)) {

            a.question = true;

            a.sentenceType = "question";

            return;

        }

        a.sentenceType = "statement";

    }

    /* ======================================================
       NEGATION
    ====================================================== */

    detectNegation(a) {

        const negatives = [

            "not",
            "never",
            "no",
            "nothing",
            "nobody",
            "none",
            "nowhere"

        ];

        a.negative =

            a.tokens.some(t =>
                negatives.includes(t.lower)
            );

    }

    /* ======================================================
       CONDITIONAL
    ====================================================== */

    detectConditional(a) {

        const conditionalWords = [

            "if",

            "unless",

            "provided",

            "providing",

            "supposing",

            "assuming"

        ];

        a.conditional =

            a.tokens.some(t =>
                conditionalWords.includes(t.lower)
            );

    }
       /* ======================================================
       SUBJECT DETECTION
    ====================================================== */

    detectSubject(a) {

        if (a.pronouns.length) {

            for (const pronoun of a.pronouns) {

                if (

                    this.isSubjectPronoun(
                        pronoun.lower
                    )

                ) {

                    a.subject = pronoun;

                    return;

                }

            }

        }

        if (!a.nouns.length)
            return;

        for (let i = 0; i < a.tokens.length; i++) {

            const token = a.tokens[i];

            if (token.type !== "noun")
                continue;

            const phrase =
                this.buildNounPhrase(a, i);

            if (phrase) {

                a.subject = phrase;

                return;

            }

        }

    }

    /* ======================================================
       BUILD NOUN PHRASE
    ====================================================== */

    buildNounPhrase(a, nounIndex) {

        const phrase = {

            article: null,

            adjectives: [],

            noun: null,

            start: nounIndex,

            end: nounIndex

        };

        let i = nounIndex;

        phrase.noun = a.tokens[nounIndex];

        while (i > 0) {

            const previous =
                a.tokens[i - 1];

            if (!previous)
                break;

            if (
                previous.type ===
                "adjective"
            ) {

                phrase.adjectives.unshift(
                    previous
                );

                phrase.start = i - 1;

                i--;

                continue;

            }

            if (
                previous.type ===
                "article"
            ) {

                phrase.article = previous;

                phrase.start = i - 1;

                break;

            }

            break;

        }

        a.nounPhrases.push(phrase);

        return phrase;

    }

    /* ======================================================
       VERB PHRASE
    ====================================================== */

    detectVerbPhrase(a) {

        const phrase = {

            auxiliaries: [],

            modal: null,

            mainVerb: null,

            start: -1,

            end: -1

        };

        for (let i = 0; i < a.tokens.length; i++) {

            const token = a.tokens[i];

            const word = token.lower;

            if (this.isModal(word)) {

                phrase.modal = token;

                if (phrase.start === -1)
                    phrase.start = i;

                phrase.end = i;

                continue;

            }

            if (this.isAuxiliary(word)) {

                phrase.auxiliaries.push(token);

                if (phrase.start === -1)
                    phrase.start = i;

                phrase.end = i;

                continue;

            }

            if (token.type === "verb") {

                phrase.mainVerb = token;

                if (phrase.start === -1)
                    phrase.start = i;

                phrase.end = i;

                break;

            }

        }

        if (phrase.mainVerb) {

            a.verbPhrase = phrase;

            a.verbPhrases.push(phrase);

        }

    }
       /* ======================================================
       OBJECT DETECTION
    ====================================================== */

    detectObjects(a) {

        if (!a.verbPhrase)
            return;

        const start =
            a.verbPhrase.end + 1;

        let foundDirect = false;

        for (let i = start; i < a.tokens.length; i++) {

            const token = a.tokens[i];

            if (!foundDirect) {

                if (
                    token.type === "pronoun" &&
                    this.isObjectPronoun(token.lower)
                ) {

                    a.directObject = token;

                    foundDirect = true;

                    continue;

                }

                if (token.type === "noun") {

                    a.directObject =
                        this.buildNounPhrase(a, i);

                    foundDirect = true;

                    continue;

                }

            }

            else {

                if (token.type === "noun") {

                    a.indirectObject =
                        this.buildNounPhrase(a, i);

                    break;

                }

            }

        }

    }

    /* ======================================================
       TENSE DETECTION
    ====================================================== */

    detectTense(a) {

        if (!a.verbPhrase)
            return;

        const aux =

            a.verbPhrase.auxiliaries.map(
                t => t.lower
            );

        const modal =
            a.verbPhrase.modal?.lower;

        if (modal === "will") {

            a.tense = "future";

            return;

        }

        if (
            aux.includes("had")
        ) {

            a.tense = "pastPerfect";

            return;

        }

        if (
            aux.includes("has") ||
            aux.includes("have")
        ) {

            a.tense = "presentPerfect";

            return;

        }

        if (
            aux.includes("was") ||
            aux.includes("were")
        ) {

            a.tense = "past";

            return;

        }

        if (
            aux.includes("am") ||
            aux.includes("is") ||
            aux.includes("are") ||
            aux.includes("do") ||
            aux.includes("does")
        ) {

            a.tense = "present";

            return;

        }

        a.tense = "unknown";

    }

    /* ======================================================
       ASPECT DETECTION
    ====================================================== */

    detectAspect(a) {

        if (!a.verbPhrase)
            return;

        const aux =

            a.verbPhrase.auxiliaries.map(
                t => t.lower
            );

        const verb =

            a.verbPhrase.mainVerb.lower;

        if (

            (
                aux.includes("has") ||
                aux.includes("have") ||
                aux.includes("had")
            )

            &&

            verb.endsWith("ing")

        ) {

            a.aspect =
                "perfectContinuous";

            return;

        }

        if (

            aux.some(v =>
                ["am","is","are","was","were"]
                    .includes(v)
            )

            &&

            verb.endsWith("ing")

        ) {

            a.aspect =
                "continuous";

            return;

        }

        if (

            aux.includes("has") ||
            aux.includes("have") ||
            aux.includes("had")

        ) {

            a.aspect =
                "perfect";

            return;

        }

        a.aspect =
            "simple";

    }
       /* ======================================================
       VOICE DETECTION
    ====================================================== */

    detectVoice(a) {

        if (!a.verbPhrase)
            return;

        const aux =
            a.verbPhrase.auxiliaries.map(
                t => t.lower
            );

        const verb =
            a.verbPhrase.mainVerb.lower;

        const beForms = [

            "am",
            "is",
            "are",
            "was",
            "were",
            "be",
            "been",
            "being"

        ];

        if (

            aux.some(v => beForms.includes(v))

            &&

            (
                verb.endsWith("ed") ||
                verb.endsWith("en")
            )

        ) {

            a.voice = "passive";

            return;

        }

        a.voice = "active";

    }

    /* ======================================================
       MOOD DETECTION
    ====================================================== */

    detectMood(a) {

        if (a.question) {

            a.mood = "interrogative";

            return;

        }

        if (a.tokens.length) {

            const first =
                a.tokens[0].lower;

            if (

                first === "please" ||

                (
                    a.verbPhrase &&
                    a.verbPhrase.start === 0
                )

            ) {

                a.mood = "imperative";

                return;

            }

        }

        if (a.conditional) {

            a.mood = "conditional";

            return;

        }

        a.mood = "indicative";

    }

    /* ======================================================
       COMPLEXITY
    ====================================================== */

    detectComplexity(a) {

        const clauses =

            a.conjunctions.length +

            a.prepositions.filter(p =>
                p.lower === "that"
            ).length;

        if (clauses === 0) {

            a.complexity = "simple";

        }

        else if (clauses === 1) {

            a.complexity = "compound";

        }

        else {

            a.complexity = "complex";

        }

    }

    /* ======================================================
       BUILD SIGNALS
    ====================================================== */

    buildSignals(a) {

        a.grammarSignals = {

            agreementViolation: false,

            articleError: false,

            articleMissing: false,

            articleRedundant: false,

            pronounIssue: false,

            pronounReferenceIssue: false,

            verbFormIssue: false,

            auxiliaryIssue: false,

            modalIssue: false,

            tenseMismatch: false,

            passiveIssue: false,

            wordOrderIssue: false,

            objectMissing: false,

            subjectMissing: false,

            adjectiveOrderIssue: false,

            adverbPlacementIssue: false,

            prepositionIssue: false,

            conjunctionIssue: false,

            punctuationIssue: false,

            capitalizationIssue: false,

            spellingIssue: false,

            sentenceFragment: false,

            runOnSentence: false,

            duplicateWord: false,

            doubleNegative: false,

            comparisonIssue: false,

            quantifierIssue: false,

            determinerIssue: false,

            collocationIssue: false,

            idiomIssue: false,

            sentenceIssue: false

        };

        this.evaluateSignals(a);

    }

    /* ======================================================
       SIGNAL EVALUATION
    ====================================================== */

    evaluateSignals(a) {

        if (!a.subject) {

            a.grammarSignals.subjectMissing = true;

        }

        if (

            a.subject &&

            !a.verbPhrase

        ) {

            a.grammarSignals.verbFormIssue = true;

        }

        if (

            a.verbPhrase &&

            !a.directObject &&

            this.isTransitiveVerb(
                a.verbPhrase.mainVerb?.lower
            )

        ) {

            a.grammarSignals.objectMissing = true;

        }

    }
       /* ======================================================
       AUXILIARY CHECK
    ====================================================== */

    isAuxiliary(word) {

        if (!word)
            return false;

        if (!this.auxiliaryDictionary)
            return false;

        if (this.auxiliaryDictionary instanceof Set)
            return this.auxiliaryDictionary.has(word);

        if (this.auxiliaryDictionary instanceof Map)
            return this.auxiliaryDictionary.has(word);

        if (Array.isArray(this.auxiliaryDictionary))
            return this.auxiliaryDictionary.includes(word);

        return false;

    }

    /* ======================================================
       MODAL CHECK
    ====================================================== */

    isModal(word) {

        if (!word)
            return false;

        if (!this.modalDictionary)
            return false;

        if (this.modalDictionary instanceof Set)
            return this.modalDictionary.has(word);

        if (this.modalDictionary instanceof Map)
            return this.modalDictionary.has(word);

        if (Array.isArray(this.modalDictionary))
            return this.modalDictionary.includes(word);

        return false;

    }

    /* ======================================================
       SUBJECT PRONOUN
    ====================================================== */

    isSubjectPronoun(word) {

        return [

            "i",
            "you",
            "he",
            "she",
            "it",
            "we",
            "they"

        ].includes(word);

    }

    /* ======================================================
       OBJECT PRONOUN
    ====================================================== */

    isObjectPronoun(word) {

        return [

            "me",
            "you",
            "him",
            "her",
            "it",
            "us",
            "them"

        ].includes(word);

    }

    /* ======================================================
       TRANSITIVE VERB
    ====================================================== */

    isTransitiveVerb(word) {

        if (!word)
            return false;

        if (!this.verbDictionary)
            return false;

        if (this.verbDictionary instanceof Map) {

            const entry =
                this.verbDictionary.get(word);

            if (entry?.transitive === true)
                return true;

            if (entry?.type === "transitive")
                return true;

        }

        return false;

    }

    /* ======================================================
       FIND TOKEN
    ====================================================== */

    findToken(tokens, lower) {

        return tokens.find(
            t => t.lower === lower
        ) || null;

    }

    /* ======================================================
       HAS TOKEN
    ====================================================== */

    hasToken(tokens, lower) {

        return tokens.some(
            t => t.lower === lower
        );

    }

    /* ======================================================
       COUNT TOKEN
    ====================================================== */

    countToken(tokens, lower) {

        let count = 0;

        for (const token of tokens) {

            if (token.lower === lower)
                count++;

        }

        return count;

    }

    /* ======================================================
       GET NEXT TOKEN
    ====================================================== */

    nextToken(tokens, index) {

        if (index + 1 >= tokens.length)
            return null;

        return tokens[index + 1];

    }

    /* ======================================================
       GET PREVIOUS TOKEN
    ====================================================== */

    previousToken(tokens, index) {

        if (index <= 0)
            return null;

        return tokens[index - 1];

    }

}
/* ==========================================================
   SINGLETON
========================================================== */

const analyzer = new Analyzer();

/* ==========================================================
   STATISTICS
========================================================== */

analyzer.statistics = {

    analyzedSentences: 0,

    analyzedTokens: 0,

    subjectsFound: 0,

    verbsFound: 0,

    objectsFound: 0

};

/* ==========================================================
   PUBLIC HELPERS
========================================================== */

analyzer.getStatistics = function () {

    return {

        ...this.statistics,

        version: this.version

    };

};

analyzer.resetStatistics = function () {

    this.statistics.analyzedSentences = 0;

    this.statistics.analyzedTokens = 0;

    this.statistics.subjectsFound = 0;

    this.statistics.verbsFound = 0;

    this.statistics.objectsFound = 0;

};

analyzer.afterAnalyze = function (analysis) {

    this.statistics.analyzedSentences++;

    this.statistics.analyzedTokens += analysis.tokens.length;

    if (analysis.subject)
        this.statistics.subjectsFound++;

    if (analysis.verbPhrase)
        this.statistics.verbsFound++;

    if (analysis.directObject)
        this.statistics.objectsFound++;

};

/* ==========================================================
   QUICK QUERY HELPERS
========================================================== */

analyzer.getSubject = function (analysis) {

    return analysis.subject;

};

analyzer.getVerb = function (analysis) {

    return analysis.verbPhrase;

};

analyzer.getObject = function (analysis) {

    return analysis.directObject;

};

analyzer.getTense = function (analysis) {

    return analysis.tense;

};

analyzer.getVoice = function (analysis) {

    return analysis.voice;

};

analyzer.getMood = function (analysis) {

    return analysis.mood;

};

analyzer.getComplexity = function (analysis) {

    return analysis.complexity;

};

/* ==========================================================
   EXPORT
========================================================== */

window.Analyzer = Analyzer;

window.analyzer = analyzer;

/* ==========================================================
   REGISTER
========================================================== */

if (

    window.GrammarEngine &&

    typeof GrammarEngine.registerManager === "function"

) {

    GrammarEngine.registerManager(

        "analyzer",

        analyzer

    );

    console.log(

        "[Analyzer] Registered successfully."

    );

}

else {

    console.warn(

        "[Analyzer] GrammarEngine is not available."

    );

}
/* ==========================================================
   INITIALIZE
========================================================== */

analyzer.initialize = function () {

    this.articleDictionary =
        GrammarEngine.getDictionary("articles");

    this.nounDictionary =
        GrammarEngine.getDictionary("nouns");

    this.verbDictionary =
        GrammarEngine.getDictionary("verbs");

    this.adjectiveDictionary =
        GrammarEngine.getDictionary("adjectives");

    this.adverbDictionary =
        GrammarEngine.getDictionary("adverbs");

    this.pronounDictionary =
        GrammarEngine.getDictionary("pronouns");

    this.prepositionDictionary =
        GrammarEngine.getDictionary("prepositions");

    this.auxiliaryDictionary =
        GrammarEngine.getDictionary("auxiliaryVerbs");

    this.modalDictionary =
        GrammarEngine.getDictionary("modalVerbs");

    return this;

};

/* ==========================================================
   SAFE ANALYZE WRAPPER
========================================================== */

const originalAnalyze =
    analyzer.analyze.bind(analyzer);

analyzer.analyze = function (tokens = []) {

    if (!this.articleDictionary) {

        this.initialize();

    }

    const result =
        originalAnalyze(tokens);

    this.afterAnalyze(result);

    return result;

};

/* ==========================================================
   ENGINE SHORTCUTS
========================================================== */

if (window.GrammarEngine) {

    GrammarEngine.analyzeTokens = function (tokens) {

        return analyzer.analyze(tokens);

    };

}

/* ==========================================================
   READY
========================================================== */

console.log(

    "[Analyzer] v8 Ready."

);
