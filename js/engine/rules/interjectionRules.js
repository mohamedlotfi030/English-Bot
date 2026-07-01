"use strict";

/* ==========================================================
   English-Bot
   Interjection Rules v9 (Production Ready)
   - Rule-based architecture
   - Discourse emotion and hesitation detection
========================================================== */

/**
 * Rule: Interjection Detection
 * Flags interjections and hesitation markers (um, uh).
 */
const interjection_rule = new GrammarRule({
    id: "interjection_detection_rule",
    name: "Interjection & Hesitation Detection",
    category: GrammarCategory.LEXICAL,
    severity: GrammarSeverity.INFO,
    priority: 70, // أولوية منخفضة جداً
    enabled: true,

    test(text, analysis, tokens) {
        const knownInterjections = [
            "oh", "wow", "oops", "yay", "hooray", "bravo",
            "ouch", "ow", "ugh", "hey", "hi", "hello", "um", "uh", "er"
        ];
        
        return tokens.some(t => knownInterjections.includes(t.lower));
    },

    fix(text, analysis, tokens) {
        // لا نقوم بالتعديل التلقائي هنا لأنها تعبيرات اختيارية، 
        // لكننا نقدم نصيحة للمستخدم في حال رغب في تنقيح النص (مثلاً لإزالة الحشو)
        return {
            text: text,
            issue: true,
            reason: "Interjections or filler words detected. Consider removing them if writing formally."
        };
    }
});

/* ==========================================================
   REGISTRATION
========================================================== */

GrammarEngine.registerRules([
    interjection_rule
]);
