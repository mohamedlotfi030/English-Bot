"use strict";

/* ==========================================================
   English-Bot
   Tokenizer
   Version 6.0 (Core Architecture)
========================================================== */

class Tokenizer {

    constructor() {

        /* ===============================================
           Patterns
        =============================================== */

        this.patterns = {

            token:
                /[A-Za-z]+(?:['-][A-Za-z]+)*|\d+(?:\.\d+)?|[.,!?;:()[\]{}"]/g,

            number:
                /^\d+(?:\.\d+)?$/,

            punctuation:
                /^[.,!?;:()[\]{}"]$/,

            word:
                /^[A-Za-z]/

        };

        /* ===============================================
           Statistics
        =============================================== */

        this.statistics = {

            tokenizedTexts: 0,

            totalTokens: 0,

            words: 0,

            numbers: 0,

            punctuation: 0,

            unknown: 0

        };

        /* ===============================================
           Dictionary Cache
        =============================================== */

        this.cache = {};

        this.refreshCache();

    }

    /* ======================================================
       Refresh Dictionaries
    ====================================================== */

    refreshCache() {

        if (!window.GrammarEngine) {

            return;

        }

        const names = [

            "verbs",

            "nouns",

            "adjectives",

            "adverbs",

            "articles",

            "pronouns",

            "prepositions"

        ];

        for (const name of names) {

            this.cache[name] =

                GrammarEngine.getDictionary(name);

        }

    }

    /* ======================================================
       Tokenize
    ====================================================== */

    tokenize(text) {

        if (typeof text !== "string") {

            return [];

        }

        if (!text.trim()) {

            return [];

        }

        const matches =

            text.match(this.patterns.token);

        if (!matches) {

            return [];

        }

        this.statistics.tokenizedTexts++;

        const tokens = [];

        let index = 0;

        for (const value of matches) {

            const token =

                this.createToken(

                    value,

                    index++

                );

            tokens.push(token);

            this.statistics.totalTokens++;

        }

        return tokens;

    }

    /* ======================================================
       Create Token
    ====================================================== */

    createToken(value, position) {

        const lower = value.toLowerCase();

        const type =

            this.classify(

                value,

                lower

            );

        return {

            value,

            lower,

            position,

            length: value.length,

            type,

            flags: {

                isWord:

                    this.patterns.word.test(value),

                isNumber:

                    this.patterns.number.test(value),

                isPunctuation:

                    this.patterns.punctuation.test(value)

            }

        };

    }
       /* ======================================================
       Classify Token
    ====================================================== */

    classify(word, lower) {

        if (this.patterns.number.test(word)) {

            this.statistics.numbers++;

            return "number";

        }

        if (this.patterns.punctuation.test(word)) {

            this.statistics.punctuation++;

            return "punctuation";

        }

        const dictionaryMap = {

            verbs: "verb",

            nouns: "noun",

            adjectives: "adjective",

            adverbs: "adverb",

            articles: "article",

            pronouns: "pronoun",

            prepositions: "preposition"

        };

        for (const [dictionary, type] of Object.entries(dictionaryMap)) {

            if (this.inDictionary(dictionary, lower)) {

                this.statistics.words++;

                return type;

            }

        }

        this.statistics.words++;

        this.statistics.unknown++;

        return "word";

    }

    /* ======================================================
       Dictionary Lookup
    ====================================================== */

    inDictionary(name, word) {

        const dict = this.cache[name];

        if (!dict) {

            return false;

        }

        if (dict instanceof Set) {

            return dict.has(word);

        }

        if (Array.isArray(dict)) {

            return dict.includes(word);

        }

        if (typeof dict.has === "function") {

            return dict.has(word);

        }

        return false;

    }

    /* ======================================================
       Get Words
    ====================================================== */

    words(tokens) {

        return tokens.filter(

            token => token.flags.isWord

        );

    }

    /* ======================================================
       Get Numbers
    ====================================================== */

    numbers(tokens) {

        return tokens.filter(

            token => token.flags.isNumber

        );

    }

    /* ======================================================
       Get Punctuation
    ====================================================== */

    punctuation(tokens) {

        return tokens.filter(

            token => token.flags.isPunctuation

        );

    }

    /* ======================================================
       Count Words
    ====================================================== */

    count(tokens) {

        return this.words(tokens).length;

    }

    /* ======================================================
       Unknown Words
    ====================================================== */

    unknown(tokens) {

        return tokens.filter(

            token => token.type === "word"

        );

    }

    /* ======================================================
       Statistics
    ====================================================== */

    getStatistics() {

        return {

            ...this.statistics

        };

    }
   }

/* ==========================================================
   Create Singleton
========================================================== */

const tokenizer = new Tokenizer();

/* ==========================================================
   Export
========================================================== */

window.tokenizer = tokenizer;
window.Tokenizer = Tokenizer;

/* ==========================================================
   Register With GrammarEngine
========================================================== */

if (
    window.GrammarEngine &&
    typeof GrammarEngine.registerManager === "function"
) {

    GrammarEngine.registerManager(
        "tokenizer",
        tokenizer
    );

}

/* ==========================================================
   Debug Helpers
========================================================== */

tokenizer.debug = function (text) {

    const tokens = this.tokenize(text);

    console.table(tokens);

    return tokens;

};

/* ==========================================================
   Ready
========================================================== */

console.log(
    "[Tokenizer] Ready"
);
