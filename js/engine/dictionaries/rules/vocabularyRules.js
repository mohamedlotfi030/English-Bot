"use strict";

/* ==========================================================
   English-Bot
   Vocabulary Rules
   Version 5.0
========================================================== */

const vocabularyRules = [];

/* ==========================================================
   Rule Registration
========================================================== */

function addVocabularyRule({
    description,
    condition,
    correction
}) {
    vocabularyRules.push({
        description,
        condition,
        correction
    });
}

/* ==========================================================
   Commonly Confused Words
========================================================== */

addVocabularyRule({
    description: "Distinguish between 'affect' (verb) and 'effect' (noun)",
    condition: (word, context) => ["affect","effect"].includes(word.form) && !word.isCorrectUsage,
    correction: (word, context) => context.role === "verb" ? "affect" : "effect"
});

addVocabularyRule({
    description: "Distinguish between 'their', 'there', and 'they’re'",
    condition: (word, context) => ["their","there","they’re"].includes(word.form) && !word.isCorrectUsage,
    correction: (word, context) => {
        if (context.role === "possessive") return "their";
        if (context.role === "location") return "there";
        if (context.role === "contraction") return "they’re";
    }
});

addVocabularyRule({
    description: "Distinguish between 'lose' (verb) and 'loose' (adjective)",
    condition: (word, context) => ["lose","loose"].includes(word.form) && !word.isCorrectUsage,
    correction: (word, context) => context.role === "verb" ? "lose" : "loose"
});

/* ==========================================================
   Formal vs Informal Vocabulary
========================================================== */

addVocabularyRule({
    description: "Use formal vocabulary in academic contexts",
    condition: (word, context) => context.isAcademic && word.isInformal,
    correction: (word) => word.toFormalEquivalent()
});

addVocabularyRule({
    description: "Use informal vocabulary in casual contexts",
    condition: (word, context) => context.isCasual && word.isFormal,
    correction: (word) => word.toInformalEquivalent()
});

/* ==========================================================
   Register Rules
========================================================== */

GrammarEngine.registerRules(
    "vocabularyRules",
    vocabularyRules
);

window.vocabularyRules = vocabularyRules;
