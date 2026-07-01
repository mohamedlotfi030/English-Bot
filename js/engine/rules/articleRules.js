"use strict";

/* ==========================================================
   English-Bot
   Article Rules v9 (Production Ready)
   - Phonology-aware heuristics (a/an)
   - Compatible with existing Corrector architecture
========================================================== */

/**
 * Rule: Article Phonology (a/an)
 * Detects article usage errors based on the sound of the following word.
 */
const article_phonology_rule = new GrammarRule({
    id: "article_phonology_rule",
    name: "Article Phonology",
    description: "Ensures correct usage of 'a' and 'an' based on vowel/consonant sounds.",
    category: GrammarCategory.ARTICLE,
    severity: GrammarSeverity.ERROR,
    priority: 20,
    enabled: true,

    // Helper: دالة فحص الصوت (تم دمجها داخل الـ Rule لضمان الاستقلالية)
    startsWithVowelSound(word) {
        const w = word.toLowerCase();
        const vowelSoundExceptions = ["hour", "honest", "honor", "heir"];
        const consonantSoundExceptions = ["university", "user", "unit", "use", "european"];

        if (vowelSoundExceptions.includes(w)) return true;
        if (consonantSoundExceptions.includes(w)) return false;
        return /^[aeiou]/.test(w);
    },

    test(text, analysis, tokens) {
        // نمر على الـ tokens مباشرة
        for (let i = 0; i < tokens.length - 1; i++) {
            const current = tokens[i].lower;
            const next = tokens[i + 1].lower;

            if (current === "a" && this.startsWithVowelSound(next)) return true;
            if (current === "an" && !this.startsWithVowelSound(next)) return true;
        }
        return false;
    },

    fix(text, analysis, tokens) {
        let newText = text;
        
        for (let i = 0; i < tokens.length - 1; i++) {
            const current = tokens[i].lower;
            const next = tokens[i + 1].lower;

            if (current === "a" && this.startsWithVowelSound(next)) {
                // استبدال 'a' بـ 'an'
                newText = text.replace(new RegExp(`\\b${tokens[i].value}\\b`, 'i'), "an");
                break;
            }
            if (current === "an" && !this.startsWithVowelSound(next)) {
                // استبدال 'an' بـ 'a'
                newText = text.replace(new RegExp(`\\b${tokens[i].value}\\b`, 'i'), "a");
                break;
            }
        }

        return {
            text: newText,
            issue: true,
            reason: "The article 'a' or 'an' should match the sound of the following word."
        };
    }
});

/* ==========================================================
   REGISTRATION
========================================================== */

GrammarEngine.registerRules([
    article_phonology_rule
]);
