"use strict";

/* ==========================================================
   English-Bot
   Article Rules
   Version 6.0
========================================================== */

const articleRules = [];

/* ==========================================================
   Helper
========================================================== */

function addArticleRule(rule) {
    articleRules.push(rule);
}

/* ==========================================================
   a -> an
========================================================== */

addArticleRule({

    id: "article_a_to_an",

    name: "Use an before vowel sound",

    category: GrammarCategory.ARTICLE,

    description: "Replace 'a' with 'an' before vowel sounds.",

    priority: 10,

    test(sentence) {

        return /\ba\s+(apple|egg|elephant|orange|umbrella|hour|honest)\b/i.test(sentence);

    },

    fix(sentence) {

        return {

            text: sentence.replace(/\ba\b/i, "an"),

            issue: true,

            reason: "Use 'an' before vowel sounds."

        };

    }

});

/* ==========================================================
   an -> a
========================================================== */

addArticleRule({

    id: "article_an_to_a",

    name: "Use a before consonant sound",

    category: GrammarCategory.ARTICLE,

    description: "Replace 'an' with 'a' before consonant sounds.",

    priority: 20,

    test(sentence) {

        return /\ban\s+(book|car|dog|house|teacher|student)\b/i.test(sentence);

    },

    fix(sentence) {

        return {

            text: sentence.replace(/\ban\b/i, "a"),

            issue: true,

            reason: "Use 'a' before consonant sounds."

        };

    }

});

/* ==========================================================
   Register
========================================================== */

GrammarEngine.registerRules(articleRules);

window.articleRules = articleRules;
