"use strict";

/* ==========================================================
   English-Bot
   Tokenizer v9
   Compatible with GrammarEngine v8+
========================================================== */

class Tokenizer {

    constructor() {

        this.regex =
            /[A-Za-z]+(?:['’-][A-Za-z]+)*|\d+(?:\.\d+)?|[.,!?;:()[\]{}"]/g;

        this.expansions = {

            "i'm": ["i","am"],
            "i've": ["i","have"],
            "i'd": ["i","would"],
            "i'll": ["i","will"],

            "you're": ["you","are"],
            "you've": ["you","have"],

            "he's": ["he","is"],
            "she's": ["she","is"],
            "it's": ["it","is"],

            "we're": ["we","are"],
            "they're": ["they","are"],

            "can't": ["can","not"],
            "won't": ["will","not"],
            "don't": ["do","not"],
            "doesn't": ["does","not"],
            "didn't": ["did","not"],

            "isn't": ["is","not"],
            "aren't": ["are","not"],
            "wasn't": ["was","not"],
            "weren't": ["were","not"],

            "hasn't": ["has","not"],
            "haven't": ["have","not"],
            "hadn't": ["had","not"]
        };

    }

    /* ======================================================
       RAW TOKENIZATION
    ====================================================== */

    tokenize(text = "") {

        if (!text.trim())
            return [];

        const rawTokens = [];

        this.regex.lastIndex = 0;

        let match;

        while ((match = this.regex.exec(text)) !== null) {

            rawTokens.push({

                value: match[0],

                lower: match[0].toLowerCase(),

                start: match.index,

                end: match.index + match[0].length,

                isWord: /^[A-Za-z]/.test(match[0])

            });

        }

        return this.process(rawTokens);

    }

    /* ======================================================
       PROCESS TOKENS
    ====================================================== */

    process(rawTokens) {

        const logical = [];

        for (const token of rawTokens) {

            const expansion = this.expansions[token.lower];

            if (expansion) {

                expansion.forEach(word => {

                    logical.push({

                        value: word,

                        lower: word,

                        start: token.start,

                        end: token.end,

                        origin: token,

                        expanded: true,

                        type: this.classify(word)

                    });

                });

            }

            else {

                logical.push({

                    value: token.value,

                    lower: token.lower,

                    start: token.start,

                    end: token.end,

                    origin: token,

                    expanded: false,

                    type: this.classify(token.lower)

                });

            }

        }

        return logical;

    }

    /* ======================================================
       CLASSIFY
    ====================================================== */

    classify(word) {

        if (/^\d/.test(word))
            return "number";

        if (/^[.,!?;:()[\]{}"]$/.test(word))
            return "punctuation";

        const dictionaries = {

            article: GrammarEngine.getDictionary("articles"),

            noun: GrammarEngine.getDictionary("nouns"),

            verb: GrammarEngine.getDictionary("verbs"),

            adjective: GrammarEngine.getDictionary("adjectives"),

            adverb: GrammarEngine.getDictionary("adverbs"),

            pronoun: GrammarEngine.getDictionary("pronouns"),

            preposition: GrammarEngine.getDictionary("prepositions")

        };

        for (const [type, dict] of Object.entries(dictionaries)) {

            if (!dict)
                continue;

            if (dict instanceof Set && dict.has(word))
                return type;

            if (dict instanceof Map && dict.has(word))
                return type;

            if (Array.isArray(dict) && dict.includes(word))
                return type;

        }

        return "word";

    }

}

/* ==========================================================
   SINGLETON
========================================================== */

const tokenizer = new Tokenizer();

/* ==========================================================
   EXPORT
========================================================== */

window.Tokenizer = Tokenizer;

window.tokenizer = tokenizer;

/* ==========================================================
   REGISTER
========================================================== */

if (window.GrammarEngine) {

    GrammarEngine.registerManager(

        "tokenizer",

        tokenizer

    );

    console.log("[Tokenizer] Registered successfully.");

}
