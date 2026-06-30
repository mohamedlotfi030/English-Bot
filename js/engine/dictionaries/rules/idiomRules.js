"use strict";

/* ==========================================================
   English-Bot
   Idiom Rules
   Version 5.0
========================================================== */

const idiomRules = [];

/* ==========================================================
   Rule Registration
========================================================== */

function addIdiomRule({
    description,
    condition,
    correction
}) {
    idiomRules.push({
        description,
        condition,
        correction
    });
}

/* ==========================================================
   Common Idioms
========================================================== */

addIdiomRule({
    description: "Correct idiom 'kick the bucket' (meaning: die)",
    condition: (sentence) => /kick the bucket/i.test(sentence) && !sentence.isCorrectIdiom,
    correction: (sentence) => sentence.fixIdiom("kick the bucket")
});

addIdiomRule({
    description: "Correct idiom 'break the ice' (meaning: start conversation)",
    condition: (sentence) => /break the ice/i.test(sentence) && !sentence.isCorrectIdiom,
    correction: (sentence) => sentence.fixIdiom("break the ice")
});

addIdiomRule({
    description: "Correct idiom 'piece of cake' (meaning: very easy)",
    condition: (sentence) => /piece of cake/i.test(sentence) && !sentence.isCorrectIdiom,
    correction: (sentence) => sentence.fixIdiom("piece of cake")
});

addIdiomRule({
    description: "Correct idiom 'hit the sack' (meaning: go to bed)",
    condition: (sentence) => /hit the sack/i.test(sentence) && !sentence.isCorrectIdiom,
    correction: (sentence) => sentence.fixIdiom("hit the sack")
});

/* ==========================================================
   Idiom Usage
========================================================== */

addIdiomRule({
    description: "Ensure idioms are not translated literally",
    condition: (sentence, context) => context.hasIdiom && sentence.isLiteralTranslation,
    correction: (sentence) => sentence.replaceLiteralWithIdiom()
});

/* ==========================================================
   Register Rules
========================================================== */

GrammarEngine.registerRules(
    "idiomRules",
    idiomRules
);

window.idiomRules = idiomRules;
