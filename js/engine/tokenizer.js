"use strict";

/* ==========================================================
   English-Bot
   Tokenizer
   Version 4.1 (Architecture Fixed)
========================================================== */

class Tokenizer {

    constructor() {
        // تم تحسين التعبير القياسي ليدعم الكلمات المركبة بشرطة (Hyphenated words)
        // مثل: "state-of-the-art" أو "up-to-date"
        this.wordPattern = /[A-Za-z]+(?:[-'][A-Za-z]+)*|[0-9]+|[.,!?;:()"]/g;
    }

    /* ======================================================
       Tokenize
    ====================================================== */
    tokenize(text) {
        if (!text || typeof text !== "string") {
            return [];
        }

        const tokens = [];
        const parts = text.match(this.wordPattern);

        if (!parts) {
            return [];
        }

        let index = 0;
        for (const part of parts) {
            tokens.push(this.createToken(part, index++));
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

        if (/^[0-9]+$/.test(word)) return "number";
        if (/^[.,!?;:()"]$/.test(word)) return "punctuation";

        // دالة مساعدة لضمان عدم حدوث خطأ إذا كان القاموس Array وليس Set
        const inDictionary = (category) => {
            if (!window.GrammarEngine) return false;
            const dict = window.GrammarEngine.getDictionary(category);
            if (!dict) return false;
            return typeof dict.has === 'function' ? dict.has(lower) : dict.includes(lower);
        };

        if (inDictionary("verbs")) return "verb";
        if (inDictionary("nouns")) return "noun";
        if (inDictionary("adjectives")) return "adjective";
        if (inDictionary("adverbs")) return "adverb";
        if (inDictionary("articles")) return "article";
        if (inDictionary("pronouns")) return "pronoun";
        if (inDictionary("prepositions")) return "preposition";

        return "word"; // النوع الافتراضي إذا لم يكن في أي قاموس
    }

    /* ======================================================
       Helpers
    ====================================================== */
    words(tokens) {
        return tokens.filter(token => token.isWord);
    }

    punctuation(tokens) {
        return tokens.filter(token => token.isPunctuation);
    }

    count(tokens) {
        return this.words(tokens).length;
    }
}

// 1. إنشاء نسخة واحدة (Singleton)
const tokenizerInstance = new Tokenizer();

// 2. إصلاح الخطأ رقم 3: توفيره على الـ window بالحالتين لضمان عدم تعطل أي ملف آخر
window.tokenizer = tokenizerInstance;
window.Tokenizer = tokenizerInstance; 

// 3. تسجيله بشكل آمن داخل المحرك الأساسي
if (window.GrammarEngine && typeof window.GrammarEngine.registerManager === 'function') {
    window.GrammarEngine.registerManager("tokenizer", tokenizerInstance);
} else {
    console.warn("[Tokenizer] GrammarEngine is missing! Make sure engine.js is loaded before tokenizer.js.");
}
