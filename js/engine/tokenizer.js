"use strict";

class Tokenizer {

    constructor() {

        this.patterns = {
            token: /[A-Za-z]+(?:['-][A-Za-z]+)*|\d+(?:\.\d+)?|[.,!?;:()[\]{}"]/g,
            number: /^\d+(?:\.\d+)?$/,
            punctuation: /^[.,!?;:()[\]{}"]$/,
            word: /^[A-Za-z]/
        };

        this.statistics = {
            tokenizedTexts: 0,
            totalTokens: 0,
            words: 0,
            numbers: 0,
            punctuation: 0,
            unknown: 0
        };

        this.cache = {};

        this.refreshCache();
    }

    /* ======================================================
       SAFE CACHE LOADER (FIXED)
    ====================================================== */

    refreshCache() {

        if (!window.GrammarEngine) return;

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

            const dict = GrammarEngine.getDictionary?.(name);

            this.cache[name] = dict || new Set();
        }
    }

    updateCache() {
        this.refreshCache();
    }

    /* ======================================================
       TOKENIZE
    ====================================================== */

    tokenize(text) {

        if (typeof text !== "string" || !text.trim()) return [];

        const matches = text.match(this.patterns.token);
        if (!matches) return [];

        this.statistics.tokenizedTexts++;

        const tokens = [];
        let index = 0;

        for (const value of matches) {

            tokens.push(this.createToken(value, index++));
            this.statistics.totalTokens++;
        }

        return tokens;
    }

    /* ======================================================
       CREATE TOKEN
    ====================================================== */

    createToken(value, position) {

        const lower = value.toLowerCase();
        const type = this.classify(value, lower);

        return {
            value,
            lower,
            position,
            length: value.length,
            type,
            flags: {
                isWord: this.patterns.word.test(value),
                isNumber: this.patterns.number.test(value),
                isPunctuation: this.patterns.punctuation.test(value)
            }
        };
    }

    /* ======================================================
       CLASSIFY
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

        const map = {
            verbs: "verb",
            nouns: "noun",
            adjectives: "adjective",
            adverbs: "adverb",
            articles: "article",
            pronouns: "pronoun",
            prepositions: "preposition"
        };

        for (const [dict, type] of Object.entries(map)) {

            if (this.inDictionary(dict, lower)) {
                this.statistics.words++;
                return type;
            }
        }

        this.statistics.unknown++;
        return "word";
    }

    /* ======================================================
       DICTIONARY CHECK (SAFE)
    ====================================================== */

    inDictionary(name, word) {

        const dict = this.cache[name];
        if (!dict) return false;

        const w = word.toLowerCase();

        if (dict instanceof Set) return dict.has(w);
        if (Array.isArray(dict)) return dict.includes(w);
        if (typeof dict.has === "function") return dict.has(w);

        return false;
    }

    /* ======================================================
       HELPERS
    ====================================================== */

    words(tokens) {
        return tokens.filter(t => t.flags.isWord);
    }

    numbers(tokens) {
        return tokens.filter(t => t.flags.isNumber);
    }

    punctuation(tokens) {
        return tokens.filter(t => t.flags.isPunctuation);
    }

    count(tokens) {
        return this.words(tokens).length;
    }

    unknown(tokens) {
        return tokens.filter(t => t.type === "word");
    }

    getStatistics() {
        return { ...this.statistics };
    }
}

/* ==========================================================
   SINGLETON
========================================================== */

const tokenizer = new Tokenizer();

window.tokenizer = tokenizer;
window.Tokenizer = Tokenizer;

console.log("[Tokenizer] Ready");
