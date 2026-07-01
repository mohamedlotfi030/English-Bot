"use strict";

class Tokenizer {
    // Regex يدعم الكلمات المركبة (مثل mother-in-law) والترقيم
    static REGEX = /[A-Za-z]+(?:['-][A-Za-z]+)*|\d+(?:\.\d+)?|[.,!?;:()[\]{}"]/g;

    tokenize(text) {
        const tokens = [];
        let match;
        
        // استخدام exec للحصول على المواقع (start, end)
        while ((match = Tokenizer.REGEX.exec(text)) !== null) {
            tokens.push({
                value: match[0],      // القيمة الأصلية (مع Capitalization)
                lower: match[0].toLowerCase(),
                start: match.index,   // الموقع في النص الأصلي
                end: match.index + match[0].length,
                isWord: /^[A-Za-z]/.test(match[0])
            });
        }
        return tokens;
    }
}
class Processor {
    constructor(dictionaryManager) {
        this.dict = dictionaryManager;
        // قاموس التوسيع (Contraction Expansion)
        this.expansions = {
            "i'm": ["i", "am"], "can't": ["can", "not"], 
            "it's": ["it", "is"], "they're": ["they", "are"],
            "he's": ["he", "is"], "i've": ["i", "have"]
        };
    }

    process(rawTokens) {
        const logicalTokens = [];
        
        for (const token of rawTokens) {
            const expansion = this.expansions[token.lower];
            
            if (expansion) {
                // فك الاختصار إلى Tokens منطقية
                expansion.forEach(val => {
                    logicalTokens.push({
                        value: val,
                        origin: token, // رابط للـ Token الأصلي لتصحيح الـ Offsets لاحقاً
                        isExpanded: true,
                        type: this.dict.classify(val)
                    });
                });
            } else {
                logicalTokens.push({
                    value: token.lower,
                    origin: token,
                    isExpanded: false,
                    type: this.dict.classify(token.lower)
                });
            }
        }
        return logicalTokens;
    }
}
/* ==========================================================
   REGISTRATION & INITIALIZATION
========================================================== */

const tokenizer = new Tokenizer();
// سنفترض أن dictionaryManager هو كلاس يقوم بـ classify
const processor = new Processor(window.GrammarEngine.getDictionaryManager());

// تسجيل في المحرك
if (window.GrammarEngine) {
    window.GrammarEngine.registerManager("tokenizer", tokenizer);
    window.GrammarEngine.registerManager("processor", processor);
    console.log("[System] Pipeline initialized successfully.");
}

/**
 * طريقة الاستخدام من قبل الـ Analyzer:
 * 1. const raw = tokenizer.tokenize(text);
 * 2. const logical = processor.process(raw);
 * 3. Analyzer يبدأ العمل على logical، وإذا وجد خطأ، يرجع لـ origin الموجود في كل token.
 */
