"use strict";

/* ==========================================================
   English-Bot
   Adjective Rules
   Version 5.0
========================================================== */

const adjectiveRules = [];

/* ==========================================================
   Rule Registration
========================================================== */

function addAdjectiveRule({
    description,
    condition,
    correction
}) {
    adjectiveRules.push({
        description,
        condition,
        correction
    });
}

/* ==========================================================
   Position Rules
========================================================== */

addAdjectiveRule({
    description: "Adjective usually comes before the noun",
    condition: (adj, context) => context.position !== "beforeNoun",
    correction: (adj) => adj + " (before noun)"
});

addAdjectiveRule({
    description: "Adjective can come after 'be' verb",
    condition: (adj, context) => context.afterVerb !== "be",
    correction: (adj) => "be " + adj
});

/* ==========================================================
   Comparative and Superlative
========================================================== */

addAdjectiveRule({
    description: "Form comparative by adding -er or using 'more'",
    condition: (adj, context) => context.degree === "comparative" && !adj.isComparative,
    correction: (adj) => adj.isShort ? adj + "er" : "more " + adj
});

addAdjectiveRule({
    description: "Form superlative by adding -est or using 'most'",
    condition: (adj, context) => context.degree === "superlative" && !adj.isSuperlative,
    correction: (adj) => adj.isShort ? adj + "est" : "most " + adj
});

/* ==========================================================
   Order of Adjectives
========================================================== */

addAdjectiveRule({
    description: "Follow adjective order: opinion → size → age → shape → color → origin → material → purpose → noun",
    condition: (adjList, context) => !adjList.isOrdered,
    correction: (adjList) => adjList.sortByStandardOrder()
});

/* ==========================================================
   Register Rules
========================================================== */

GrammarEngine.registerRules(
    "adjectiveRules",
    adjectiveRules
);

window.adjectiveRules = adjectiveRules;
