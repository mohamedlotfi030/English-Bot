"use strict";

/* ==========================================================
   English-Bot
   Adverb Rules v9 (Compatible Version)
   - Adheres to current Analyzer/Corrector architecture
   - Uses Array-based lookups (compatible with current state)
   - No external Maps or missing Utilities
========================================================== */

/**
 * Rule 1: Adverb Comparative Placement (Positioning)
 * Warns about typical adverb placement issues.
 */
const adverb_position_rule = new GrammarRule({
    id: "adverb_position_rule",
    name: "Adverb Placement",
    description: "Basic check for adverb placement.",
    category: GrammarCategory.ADVERB,
    severity: GrammarSeverity.WARNING,
    priority: 35,
    enabled: true,

    test(text, analysis, tokens) {
        // نستخدم المصفوفات الموجودة بالفعل في analysis
        return analysis.adverbs && analysis.adverbs.length > 0;
    },

    fix(text, analysis, tokens) {
        // يعيد النص كما هو (الـ Corrector سيتولى المعالجة لاحقاً)
        return {
            text: text,
            issue: true,
            reason: "Review the placement of adverbs for better clarity."
        };
    }
});

/**
 * Rule 2: Frequency Adverb Check
 * Checks for standard frequency adverbs.
 */
const frequency_adverb_rule = new GrammarRule({
    id: "frequency_adverb_rule",
    name: "Frequency Adverb",
    description: "Checks for common frequency adverbs.",
    category: GrammarCategory.ADVERB,
    severity: GrammarSeverity.INFO,
    priority: 40,
    enabled: true,

    test(text, analysis, tokens) {
        const freq = ["always", "usually", "often", "sometimes", "rarely", "never"];
        // فحص مباشر باستخدام token.lower المتاح في المحرك الحالي
        return tokens.some(t => freq.includes(t.lower));
    },

    fix(text, analysis, tokens) {
        return {
            text: text,
            issue: false
        };
    }
});

/**
 * Rule 3: Redundant 'More' with Adverbs
 * (Note: Logic moved here from comparison rules as requested)
 */
const redundant_more_rule = new GrammarRule({
    id: "redundant_more_rule",
    name: "Redundant More",
    description: "Prevents incorrect usage of 'more' with already comparative adverbs.",
    category: GrammarCategory.ADVERB,
    severity: GrammarSeverity.ERROR,
    priority: 30,
    enabled: true,

    test(text, analysis, tokens) {
        for (let i = 0; i < tokens.length - 1; i++) {
            if (tokens[i].lower === "more") {
                const next = tokens[i + 1].lower;
                // فحص بسيط: إذا انتهت الكلمة بـ 'er'
                if (next.endsWith("er")) return true;
            }
        }
        return false;
    },

    fix(text, analysis, tokens) {
        let newText = text;
        for (let i = 0; i < tokens.length - 1; i++) {
            if (tokens[i].lower === "more" && tokens[i+1].lower.endsWith("er")) {
                // إزالة كلمة more وتصحيح النص
                newText = text.replace(new RegExp("\\b" + tokens[i].value + "\\s+", "gi"), "");
                break;
            }
        }
        return {
            text: newText,
            issue: true,
            reason: "Remove redundant 'more' before comparative adverbs."
        };
    }
});

/* ==========================================================
   REGISTRATION
========================================================== */

GrammarEngine.registerRules([
    adverb_position_rule,
    frequency_adverb_rule,
    redundant_more_rule
]);
