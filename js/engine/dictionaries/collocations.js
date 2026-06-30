"use strict";

/* ==========================================================
   English-Bot
   Collocations Dictionary
   Version 5.0
========================================================== */

const collocations = new Map();

/* ==========================================================
   Register Collocation
========================================================== */

function addCollocation({
    phrase,
    category // verb+noun, verb+prep, adj+noun, noun+noun
}) {
    collocations.set(
        phrase.toLowerCase(),
        {
            phrase,
            category
        }
    );
}

/* ==========================================================
   Verb + Noun Collocations
========================================================== */

addCollocation({ phrase:"make a decision", category:"verb+noun" });
addCollocation({ phrase:"take a break", category:"verb+noun" });
addCollocation({ phrase:"do homework", category:"verb+noun" });
addCollocation({ phrase:"have lunch", category:"verb+noun" });
addCollocation({ phrase:"catch a cold", category:"verb+noun" });
addCollocation({ phrase:"pay attention", category:"verb+noun" });

/* ==========================================================
   Adjective + Noun Collocations
========================================================== */

addCollocation({ phrase:"strong coffee", category:"adj+noun" });
addCollocation({ phrase:"heavy rain", category:"adj+noun" });
addCollocation({ phrase:"fast food", category:"adj+noun" });
addCollocation({ phrase:"high speed", category:"adj+noun" });
addCollocation({ phrase:"deep sleep", category:"adj+noun" });

/* ==========================================================
   Noun + Noun Collocations
========================================================== */

addCollocation({ phrase:"traffic jam", category:"noun+noun" });
addCollocation({ phrase:"data analysis", category:"noun+noun" });
addCollocation({ phrase:"language barrier", category:"noun+noun" });
addCollocation({ phrase:"job interview", category:"noun+noun" });
addCollocation({ phrase:"customer service", category:"noun+noun" });

/* ==========================================================
   Register Dictionary
========================================================== */

GrammarEngine.registerDictionary(
    "collocations",
    collocations
);

window.collocations = collocations;
