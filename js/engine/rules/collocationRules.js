"use strict";

/* ==========================================================
   English-Bot
   Collocation Rules
   Version 5.0
========================================================== */

const collocationRules = [];

/* ==========================================================
   Rule Registration
========================================================== */

function addCollocationRule({
    description,
    condition,
    correction
}) {
    collocationRules.push({
        description,
        condition,
        correction
    });
}

/* ==========================================================
   Common Collocations
========================================================== */

addCollocationRule({
    description: "Use 'make' with nouns like decision, effort, mistake",
    condition: (verb, noun) => verb.base === "do" && ["decision","effort","mistake"].includes(noun),
    correction: () => "make"
});

addCollocationRule({
    description: "Use 'do' with activities like homework, exercise, research",
    condition: (verb, noun) => verb.base === "make" && ["homework","exercise","research"].includes(noun),
    correction: () => "do"
});

addCollocationRule({
    description: "Use 'take' with nouns like break, photo, risk",
    condition: (verb, noun) => !["take"].includes(verb.base) && ["break","photo","risk"].includes(noun),
    correction: () => "take"
});

addCollocationRule({
    description: "Use 'have' with nouns like lunch, dinner, shower",
    condition: (verb, noun) => !["have"].includes(verb.base) && ["lunch","dinner","shower"].includes(noun),
    correction: () => "have"
});

/* ==========================================================
   Register Rules
========================================================== */

GrammarEngine.registerRules(
    "collocationRules",
    collocationRules
);

window.collocationRules = collocationRules;
