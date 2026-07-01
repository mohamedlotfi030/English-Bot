"use strict";

/* ==========================================================
   English-Bot
   Vocabulary Rules v9 (Production Ready)
   - Rule-based architecture
   - Handles homophones and register-specific vocabulary
========================================================== */

/**
 * Rule: Homophone Correction (Affect/Effect, Lose/Loose, There/Their/They're)
 */
const homophone_rule = new GrammarRule({
    id: "vocab_homophones",
    name: "Homophone Correction",
    category: GrammarCategory.VOCABULARY,
    severity: GrammarSeverity.ERROR,
    priority: 30,
    enabled: true,

    test(text, analysis, tokens) {
        // التحقق من وجود كلمات يكثر الخلط بينها في الـ analysis
        return analysis.homophonesDetected === true;
    },

    fix(text, analysis, tokens) {
        // المحرك يقوم بتمرير الكلمات التي تحتاج تصحيح ضمن الـ analysis
        analysis.corrections.forEach(c => {
            text = text.replace(new RegExp(`\\b${c.wrong}\\b`, 'gi'), c.right);
        });
        return { 
            text: text, 
            issue: true, 
            reason: "Homophone usage check: ensure the word matches the grammatical role." 
        };
    }
});

/**
 * Rule: Register/Tone Consistency (Academic vs. Casual)
 */
const register_rule = new GrammarRule({
    id: "vocab_register",
    name: "Vocabulary Register Consistency",
    category: GrammarCategory.VOCABULARY,
    severity: GrammarSeverity.WARNING,
    priority: 40,
    enabled: true,

    test(text, analysis, tokens) {
        if (analysis.context === "academic") return tokens.some(t => t.isInformal);
        if (analysis.context === "casual") return tokens.some(t => t.isFormal);
        return false;
    },

    fix(text, analysis, tokens) {
        let newText = text;
        tokens.forEach(t => {
            if (analysis.context === "academic" && t.isInformal) {
                newText = newText.replace(t.text, t.toFormalEquivalent());
            } else if (analysis.context === "casual" && t.isFormal) {
                newText = newText.replace(t.text, t.toInformalEquivalent());
            }
        });
        return { 
            text: newText, 
            issue: true, 
            reason: "Vocabulary register does not match the formal/casual context." 
        };
    }
});

/* ==========================================================
   REGISTRATION
========================================================== */

GrammarEngine.registerRules([
    homophone_rule,
    register_rule
]);
