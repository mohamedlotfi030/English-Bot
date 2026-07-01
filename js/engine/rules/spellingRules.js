"use strict";

/* ==========================================================
   English-Bot
   Spelling Rules v9 (Production Ready)
   - Rule-based architecture
   - Handles morphological and orthographic adjustments
========================================================== */

/**
 * Rule: I before E
 */
const spelling_ie_rule = new GrammarRule({
    id: "spelling_ie",
    name: "I before E Rule",
    category: GrammarCategory.SPELLING,
    severity: GrammarSeverity.WARNING,
    priority: 100,
    enabled: true,

    test(text, analysis, tokens) {
        return tokens.some(t => /cie/i.test(t.text));
    },

    fix(text, analysis, tokens) {
        const newText = text.replace(/cie/gi, "cei");
        return { text: newText, issue: true, reason: "Check 'I before E' rule." };
    }
});

/**
 * Rule: Double Consonant before Suffix
 */
const spelling_double_consonant = new GrammarRule({
    id: "spelling_double_consonant",
    name: "Double Consonant Rule",
    category: GrammarCategory.SPELLING,
    severity: GrammarSeverity.ERROR,
    priority: 90,
    enabled: true,

    test(text, analysis, tokens) {
        // التحقق من أن الكلمة الأخيرة تتبعها لاحقة وأنها تحتاج تضعيف
        return analysis.addingSuffix && /[aeiou][bcdfghjklmnpqrstvwxyz]$/i.test(text);
    },

    fix(text, analysis, tokens) {
        const suffix = analysis.suffix || "";
        const lastChar = text.slice(-1);
        return { 
            text: text + lastChar + suffix, 
            issue: true, 
            reason: "Double consonant before suffix." 
        };
    }
});

/**
 * Rule: Silent E Drop
 */
const spelling_silent_e = new GrammarRule({
    id: "spelling_silent_e",
    name: "Silent E Drop Rule",
    category: GrammarCategory.SPELLING,
    severity: GrammarSeverity.ERROR,
    priority: 85,
    enabled: true,

    test(text, analysis, tokens) {
        return analysis.suffix === "ing" && text.toLowerCase().endsWith("e");
    },

    fix(text, analysis, tokens) {
        return { 
            text: text.slice(0, -1) + "ing", 
            issue: true, 
            reason: "Drop silent 'e' before 'ing'." 
        };
    }
});

/**
 * Rule: Plural Spelling (ies/es)
 */
const spelling_plural_rule = new GrammarRule({
    id: "spelling_plural",
    name: "Plural Spelling Rules",
    category: GrammarCategory.SPELLING,
    severity: GrammarSeverity.ERROR,
    priority: 80,
    enabled: true,

    test(text, analysis, tokens) {
        if (!analysis.isPlural) return false;
        return text.endsWith("y") || /(s|sh|ch|x|z)$/i.test(text);
    },

    fix(text, analysis, tokens) {
        let corrected = text;
        if (text.endsWith("y") && !/[aeiou]y$/i.test(text)) {
            corrected = text.slice(0, -1) + "ies";
        } else if (/(s|sh|ch|x|z)$/i.test(text)) {
            corrected = text + "es";
        }
        return { text: corrected, issue: true, reason: "Incorrect plural spelling." };
    }
});

/* ==========================================================
   REGISTRATION
========================================================== */

GrammarEngine.registerRules([
    spelling_ie_rule,
    spelling_double_consonant,
    spelling_silent_e,
    spelling_plural_rule
]);
