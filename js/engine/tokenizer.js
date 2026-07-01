"use strict";

/* ==========================================================
   English-Bot
   Tokenizer v10
   Enterprise Edition
   Compatible with GrammarEngine v9
========================================================== */

class Tokenizer {

    constructor() {

        /* ==========================================
           Regex
        ========================================== */

        this.tokenRegex =
            /[A-Za-z]+(?:['’-][A-Za-z]+)*|\d+(?:\.\d+)?|[.,!?;:()[\]{}"]/g;

        /* ==========================================
           Contraction Expansion
        ========================================== */

        this.expansions = {

            "i'm": ["i", "am"],
            "i've": ["i", "have"],
            "i'd": ["i", "would"],
            "i'll": ["i", "will"],

            "you're": ["you", "are"],
            "you've": ["you", "have"],
            "you'll": ["you", "will"],

            "he's": ["he", "is"],
            "he'll": ["he", "will"],

            "she's": ["she", "is"],
            "she'll": ["she", "will"],

            "it's": ["it", "is"],

            "we're": ["we", "are"],
            "we've": ["we", "have"],

            "they're": ["they", "are"],
            "they've": ["they", "have"],

            "can't": ["can", "not"],
            "won't": ["will", "not"],

            "don't": ["do", "not"],
            "doesn't": ["does", "not"],
            "didn't": ["did", "not"],

            "isn't": ["is", "not"],
            "aren't": ["are", "not"],
            "wasn't": ["was", "not"],
            "weren't": ["were", "not"],

            "hasn't": ["has", "not"],
            "haven't": ["have", "not"],
            "hadn't": ["had", "not"],

            "shouldn't": ["should", "not"],
            "wouldn't": ["would", "not"],
            "couldn't": ["could", "not"],
            "mustn't": ["must", "not"],

            "let's": ["let", "us"]
        };

        /* ==========================================
           Cached Dictionaries
        ========================================== */

        this.dictionaries = {};

        this.refreshDictionaries();

    }

    /* ======================================================
       Refresh Dictionaries
    ====================================================== */

    refreshDictionaries() {

        if (!window.GrammarEngine)
            return;

        const names = [

            "articles",

            "verbs",

            "nouns",

            "pronouns",

            "adjectives",

            "adverbs",

            "prepositions",

            "determiners",

            "conjunctions",

            "auxiliaryVerbs",

            "modalVerbs"

        ];

        for (const name of names) {

            this.dictionaries[name] =

                GrammarEngine.getDictionary(name);

        }

    }

    /* ======================================================
       Normalize
    ====================================================== */

    normalize(text) {

        return text

            .replace(/[‘’]/g, "'")

            .replace(/[“”]/g, '"')

            .replace(/\s+/g, " ")

            .trim();

    }

    /* ======================================================
       Reset Regex
    ====================================================== */

    resetRegex() {

        this.tokenRegex.lastIndex = 0;

    }

}
/* ======================================================
   Tokenize
====================================================== */

tokenize(text = "") {

    text = this.normalize(text);

    if (!text.length)
        return [];

    this.resetRegex();

    const rawTokens = this.buildRawTokens(text);

    return this.buildLogicalTokens(rawTokens);

}

/* ======================================================
   Build Raw Tokens
====================================================== */

buildRawTokens(text) {

    const tokens = [];

    let match;

    let tokenIndex = 0;

    let sentenceIndex = 0;

    while ((match = this.tokenRegex.exec(text)) !== null) {

        const value = match[0];

        const lower = value.toLowerCase();

        const start = match.index;

        const end = start + value.length;

        const punctuation = /^[.!?]$/.test(value);

        tokens.push({

            index: tokenIndex++,

            sentence: sentenceIndex,

            value,

            lower,

            start,

            end,

            length: value.length,

            expanded: false,

            origin: null,

            isWord: /^[A-Za-z]/.test(value),

            isNumber: /^\d/.test(value),

            isPunctuation: /^[.,!?;:()[\]{}"]$/.test(value)

        });

        if (punctuation)
            sentenceIndex++;

    }

    return tokens;

}

/* ======================================================
   Build Logical Tokens
====================================================== */

buildLogicalTokens(rawTokens) {

    const logical = [];

    let logicalIndex = 0;

    for (const raw of rawTokens) {

        const expansion = this.expansions[raw.lower];

        if (expansion) {

            for (const word of expansion) {

                const info = this.classify(word);

                logical.push({

                    index: logicalIndex++,

                    sentence: raw.sentence,

                    value: word,

                    lower: word,

                    lemma: info.lemma,

                    type: info.type,

                    entry: info.entry,

                    start: raw.start,

                    end: raw.end,

                    origin: raw,

                    expanded: true,

                    flags: {

                        isWord: true,

                        isExpanded: true,

                        isNumber: false,

                        isPunctuation: false,

                        isSentenceStart: false,

                        isSentenceEnd: false,

                        isCapitalized: false

                    }

                });

            }

        }

        else {

            const info = this.classify(raw.lower);

            logical.push({

                index: logicalIndex++,

                sentence: raw.sentence,

                value: raw.value,

                lower: raw.lower,

                lemma: info.lemma,

                type: info.type,

                entry: info.entry,

                start: raw.start,

                end: raw.end,

                origin: raw,

                expanded: false,

                flags: {

                    isWord: raw.isWord,

                    isExpanded: false,

                    isNumber: raw.isNumber,

                    isPunctuation: raw.isPunctuation,

                    isSentenceStart: false,

                    isSentenceEnd: false,

                    isCapitalized:

                        /^[A-Z]/.test(raw.value)

                }

            });

        }

    }

    this.markSentenceBoundaries(logical);

    return logical;

}
/* ======================================================
   Classify Token
====================================================== */

classify(word) {

    if (/^\d/.test(word)) {

        return {

            type: "number",

            lemma: word,

            entry: null

        };

    }

    if (/^[.,!?;:()[\]{}"]$/.test(word)) {

        return {

            type: "punctuation",

            lemma: word,

            entry: null

        };

    }

    const dictionaries = [

        ["articles", "article"],

        ["pronouns", "pronoun"],

        ["determiners", "determiner"],

        ["modalVerbs", "modal"],

        ["auxiliaryVerbs", "auxiliary"],

        ["verbs", "verb"],

        ["nouns", "noun"],

        ["adjectives", "adjective"],

        ["adverbs", "adverb"],

        ["prepositions", "preposition"],

        ["conjunctions", "conjunction"]

    ];

    for (const [dictName, type] of dictionaries) {

        const dict = this.dictionaries[dictName];

        if (!dict)
            continue;

        let entry = null;

        if (dict instanceof Map) {

            entry = dict.get(word);

        }

        else if (dict instanceof Set) {

            if (dict.has(word))
                entry = {};

        }

        else if (Array.isArray(dict)) {

            if (dict.includes(word))
                entry = {};

        }

        if (entry !== null && entry !== undefined) {

            return {

                type,

                lemma: entry.lemma || word,

                entry

            };

        }

    }

    return {

        type: "word",

        lemma: word,

        entry: null

    };

}

/* ======================================================
   Sentence Boundaries
====================================================== */

markSentenceBoundaries(tokens) {

    if (!tokens.length)
        return;

    tokens[0].flags.isSentenceStart = true;

    for (let i = 1; i < tokens.length; i++) {

        if (tokens[i].sentence !== tokens[i - 1].sentence) {

            tokens[i].flags.isSentenceStart = true;

            tokens[i - 1].flags.isSentenceEnd = true;

        }

    }

    tokens[tokens.length - 1].flags.isSentenceEnd = true;

}

/* ======================================================
   Helpers
====================================================== */

getWords(tokens) {

    return tokens.filter(t => t.flags.isWord);

}

getNumbers(tokens) {

    return tokens.filter(t => t.flags.isNumber);

}

getPunctuation(tokens) {

    return tokens.filter(t => t.flags.isPunctuation);

}

findToken(tokens, index) {

    return tokens[index] || null;

}

refresh() {

    this.refreshDictionaries();

}

/* ======================================================
   Statistics
====================================================== */

getStatistics() {

    return {

        dictionaries: Object.keys(this.dictionaries).length,

        contractions: Object.keys(this.expansions).length,

        version: "10.0"

    };

}

}

/* ==========================================================
   Singleton
========================================================== */

const tokenizer = new Tokenizer();

/* ==========================================================
   Export
========================================================== */

window.Tokenizer = Tokenizer;
window.tokenizer = tokenizer;

/* ==========================================================
   Register
========================================================== */

if (window.GrammarEngine) {

    window.GrammarEngine.registerManager(
        "tokenizer",
        tokenizer
    );

    console.log("[Tokenizer] Registered successfully.");

}
