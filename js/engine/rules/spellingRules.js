"use strict";

/* ==========================================================
   English-Bot
   Spelling Rules
   Version 7.0 (Clean Compatible)
========================================================== */

const spellingRules = [];

/* ==========================================================
   Helper
========================================================== */

function addSpellingRule(rule) {
    spellingRules.push(rule);
}

/* ==========================================================
   I before E Rule (Fixed Safe Version)
========================================================== */

addSpellingRule({
    id: "spelling_ie_rule",
    category: "SPELLING",
    priority: 100,

    test(word) {
        return typeof word === "string" && /cie/.test(word);
    },

    fix(word) {
        return {
            text: word.replace(/cie/g, "cei"),
            issue: true,
            reason: "I before E rule correction"
        };
    }
});

/* ==========================================================
   Double Consonant Rule
========================================================== */

addSpellingRule({
    id: "spelling_double_consonant",
    category: "SPELLING",
    priority: 90,

    test(word, context) {
        return context?.addingSuffix &&
               /[aeiou][bcdfghjklmnpqrstvwxyz]$/.test(word);
    },

    fix(word, context) {

        const suffix = context?.suffix || "";

        return {
            text: word + word.slice(-1) + suffix,
            issue: true,
            reason: "Double consonant before suffix"
        };
    }
});

/* ==========================================================
   Silent E Drop Rule
========================================================== */

addSpellingRule({
    id: "spelling_silent_e",
    category: "SPELLING",
    priority: 85,

    test(word, context) {
        return context?.suffix === "ing" && word.endsWith("e");
    },

    fix(word) {
        return {
            text: word.slice(0, -1) + "ing",
            issue: true
        };
    }
});

/* ==========================================================
   Plural Rules
========================================================== */

addSpellingRule({
    id: "spelling_plural_ies",
    category: "SPELLING",
    priority: 80,

    test(word, context) {
        return context?.isPlural &&
               word.endsWith("y") &&
               !/[aeiou]y$/.test(word);
    },

    fix(word) {
        return {
            text: word.slice(0, -1) + "ies",
            issue: true
        };
    }
});


addSpellingRule({
    id: "spelling_plural_es",
    category: "SPELLING",
    priority: 70,

    test(word, context) {
        return context?.isPlural && /(s|sh|ch|x|z)$/.test(word);
    },

    fix(word) {
        return {
            text: word + "es",
            issue: true
        };
    }
});

/* ==========================================================
   Register Rules
========================================================== */

GrammarEngine.registerMany(spellingRules);

window.spellingRules = spellingRules;
