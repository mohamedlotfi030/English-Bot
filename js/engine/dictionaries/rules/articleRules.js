"use strict";

/* ==========================================================
   English-Bot
   Article Rules
   Version 5.0
========================================================== */

const articleRules = [];

/* ==========================================================
   Rule Registration
========================================================== */

function addArticleRule({
    description,
    condition,
    correction
}) {
    articleRules.push({
        description,
        condition,
        correction
    });
}

/* ==========================================================
   Indefinite Articles (a/an)
========================================================== */

addArticleRule({
    description: "Use 'a' before words starting with consonant sounds",
    condition: (article, context) => context.type === "indefinite" && context.word.startsWithConsonant && article !== "a",
    correction: () => "a"
});

addArticleRule({
    description: "Use 'an' before words starting with vowel sounds",
    condition: (article, context) => context.type === "indefinite" && context.word.startsWithVowel && article !== "an",
    correction: () => "an"
});

/* ==========================================================
   Definite Article (the)
========================================================== */

addArticleRule({
    description: "Use 'the' for specific or unique nouns",
    condition: (article, context) => context.type === "definite" && !article,
    correction: () => "the"
});

/* ==========================================================
   Zero Article
========================================================== */

addArticleRule({
    description: "No article with plural or uncountable nouns in general sense",
    condition: (article, context) => context.isGeneral && (context.isPlural || context.isUncountable) && article,
    correction: () => ""
});

/* ==========================================================
   Register Rules
========================================================== */

GrammarEngine.registerRules(
    "articleRules",
    articleRules
);

window.articleRules = articleRules;
