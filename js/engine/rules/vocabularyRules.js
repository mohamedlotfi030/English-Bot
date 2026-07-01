"use strict";

/* ==========================================================
   English-Bot
   Vocabulary Rules
   Version 7.0
========================================================== */

const vocabularyRules = [];

/* ==========================================================
   Affect / Effect
========================================================== */

vocabularyRules.push({
    id: "affect_effect",
    type: "vocabulary",
    priority: 10,

    description: "Distinguish between 'affect' (verb) and 'effect' (noun)",

    test(word, context) {
        return ["affect", "effect"].includes(word.form) && !word.isCorrectUsage;
    },

    fix(word, context) {
        if (context.role === "verb") return "affect";
        if (context.role === "noun") return "effect";
        return word.form;
    }
});

/* ==========================================================
   Their / There / They're
========================================================== */

vocabularyRules.push({
    id: "their_there_theyre",
    type: "vocabulary",
    priority: 20,

    description: "Distinguish between their / there / they’re",

    test(word, context) {
        return ["their", "there", "they’re"].includes(word.form) && !word.isCorrectUsage;
    },

    fix(word, context) {
        if (context.role === "possessive") return "their";
        if (context.role === "location") return "there";
        if (context.role === "contraction") return "they’re";
        return word.form;
    }
});

/* ==========================================================
   Lose / Loose
========================================================== */

vocabularyRules.push({
    id: "lose_loose",
    type: "vocabulary",
    priority: 30,

    description: "Distinguish between 'lose' (verb) and 'loose' (adjective)",

    test(word, context) {
        return ["lose", "loose"].includes(word.form) && !word.isCorrectUsage;
    },

    fix(word, context) {
        if (context.role === "verb") return "lose";
        if (context.role === "adjective") return "loose";
        return word.form;
    }
});

/* ==========================================================
   Formal vs Informal Vocabulary
========================================================== */

vocabularyRules.push({
    id: "formal_informal_academic",
    type: "vocabulary",
    priority: 40,

    description: "Use formal vocabulary in academic contexts",

    test(word, context) {
        return context.isAcademic && word.isInformal;
    },

    fix(word) {
        return word.toFormalEquivalent?.() || word.form;
    }
});

vocabularyRules.push({
    id: "formal_informal_casual",
    type: "vocabulary",
    priority: 50,

    description: "Use informal vocabulary in casual contexts",

    test(word, context) {
        return context.isCasual && word.isFormal;
    },

    fix(word) {
        return word.toInformalEquivalent?.() || word.form;
    }
});

/* ==========================================================
   REGISTER
========================================================== */

GrammarEngine.registerRules("vocabulary", vocabularyRules);

window.vocabularyRules = vocabularyRules;
