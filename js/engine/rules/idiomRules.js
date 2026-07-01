"use strict";

/* ==========================================================
   English-Bot
   Idiom Rules v9 (Production Ready)
   - Rule-based architecture
   - Idiomatic pattern detection
========================================================== */

/**
 * Rule: Idiom Detection
 * Identifies common English idioms and flags potential literal translation risks.
 */
const idiom_detection_rule = new GrammarRule({
    id: "idiom_detection_rule",
    name: "Idiom Detection",
    category: GrammarCategory.LEXICAL,
    severity: GrammarSeverity.INFO,
    priority: 60, // أولوية منخفضة لأنها ليست خطأً نحوياً
    enabled: true,

    test(text, analysis, tokens) {
        const idioms = ["kick the bucket", "break the ice", "piece of cake", "hit the sack"];
        const fullText = tokens.map(t => t.lower).join(" ");
        
        return idioms.some(idiom => fullText.includes(idiom));
    },

    fix(text, analysis, tokens) {
        // بما أنها ليست قاعدة نحوية، التصحيح هنا مجرد رسالة توضيحية
        return {
            text: text,
            issue: true,
            reason: "Idiomatic expression detected. Ensure the figurative meaning is intended."
        };
    }
});

/* ==========================================================
   REGISTRATION
========================================================== */

GrammarEngine.registerRules([
    idiom_detection_rule
]);
