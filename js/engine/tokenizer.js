```javascript
"use strict";

/* ==========================================================
   English-Bot
   Tokenizer
   Version 4.0
========================================================== */

class Tokenizer {

    constructor() {

        this.wordPattern = /[A-Za-z]+(?:'[A-Za-z]+)?/g;

        this.punctuationPattern = /[.,!?;:()"]/g;

    }

    /* ======================================================
       Tokenize
    ====================================================== */

    tokenize(text) {

        if (!text || typeof text !== "string") {

            return [];

        }

        const tokens = [];

        const parts = text.match(/[A-Za-z]+(?:'[A-Za-z]+)?|[0-9]+|[.,!?;:()"]/g);

        if (!parts) {

            return [];

        }

        let index = 0;

        for (const part of parts) {

            tokens.push(

                this.createToken(

                    part,

                    index++

                )

            );

        }

        return tokens;

    }

    /* ======================================================
       Create Token
    ====================================================== */

    createToken(word, position) {

        return {

            value: word,

            lower: word.toLowerCase(),

            position,

            type: this.detectType(word),

            length: word.length,

            isWord: /^[A-Za-z]/.test(word),

            isNumber: /^[0-9]+$/.test(word),

            isPunctuation: /^[.,!?;:()"]$/.test(word)

        };

    }

    /* ======================================================
       Detect Token Type
    ====================================================== */

    detectType(word) {

        const lower = word.toLowerCase();

        if (/^[0-9]+$/.test(word)) {

            return "number";

        }

        if (/^[.,!?;:()"]$/.test(word)) {

            return "punctuation";

        }

        const verbs = GrammarEngine.getDictionary("verbs");

        if (verbs && verbs.has(lower)) {

            return "verb";

        }

        const nouns = GrammarEngine.getDictionary("nouns");

        if (nouns && nouns.has(lower)) {

            return "noun";

        }

        const adjectives = GrammarEngine.getDictionary("adjectives");

        if (adjectives && adjectives.has(lower)) {

            return "adjective";

        }

        const adverbs = GrammarEngine.getDictionary("adverbs");

        if (adverbs && adverbs.has(lower)) {

            return "adverb";

        }

        const articles = GrammarEngine.getDictionary("articles");

        if (articles && articles.has(lower)) {

            return "article";

        }

        const pronouns = GrammarEngine.getDictionary("pronouns");

        if (pronouns && pronouns.has(lower)) {

            return "pronoun";

        }

        const prepositions = GrammarEngine.getDictionary("prepositions");

        if (prepositions && prepositions.has(lower)) {

            return "preposition";

        }

        return "word";

    }

    /* ======================================================
       Get Words Only
    ====================================================== */

    words(tokens) {

        return tokens.filter(

            token => token.isWord

        );

    }

    /* ======================================================
       Get Punctuation
    ====================================================== */

    punctuation(tokens) {

        return tokens.filter(

            token => token.isPunctuation

        );

    }

    /* ======================================================
       Count Words
    ====================================================== */

    count(tokens) {

        return this.words(tokens).length;

    }

}

const tokenizer = new Tokenizer();

window.tokenizer = tokenizer;

GrammarEngine.registerManager(

    "tokenizer",

    tokenizer

);
```
