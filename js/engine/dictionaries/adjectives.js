"use strict";

/* ==========================================================
   English-Bot
   Adjective Dictionary
   Version 5.0
========================================================== */

const adjectives = new Map();

/* ==========================================================
   Register Adjective
========================================================== */

function addAdjective({
    base,
    comparative,
    superlative,
    gradable = true
}) {
    adjectives.set(
        base.toLowerCase(),
        {
            base,
            comparative,
            superlative,
            gradable
        }
    );
}

/* ==========================================================
   Common Adjectives (Gradable)
========================================================== */

addAdjective({ base:"big", comparative:"bigger", superlative:"biggest" });
addAdjective({ base:"small", comparative:"smaller", superlative:"smallest" });
addAdjective({ base:"fast", comparative:"faster", superlative:"fastest" });
addAdjective({ base:"slow", comparative:"slower", superlative:"slowest" });
addAdjective({ base:"happy", comparative:"happier", superlative:"happiest" });
addAdjective({ base:"sad", comparative:"sadder", superlative:"saddest" });
addAdjective({ base:"young", comparative:"younger", superlative:"youngest" });
addAdjective({ base:"old", comparative:"older", superlative:"oldest" });
addAdjective({ base:"long", comparative:"longer", superlative:"longest" });
addAdjective({ base:"short", comparative:"shorter", superlative:"shortest" });
/* ==========================================================
   Non-Gradable Adjectives
========================================================== */

addAdjective({ base:"perfect", comparative:"perfect", superlative:"perfect", gradable:false });
addAdjective({ base:"unique", comparative:"unique", superlative:"unique", gradable:false });
addAdjective({ base:"dead", comparative:"dead", superlative:"dead", gradable:false });
addAdjective({ base:"married", comparative:"married", superlative:"married", gradable:false });
addAdjective({ base:"single", comparative:"single", superlative:"single", gradable:false });
addAdjective({ base:"empty", comparative:"empty", superlative:"empty", gradable:false });
addAdjective({ base:"full", comparative:"full", superlative:"full", gradable:false });

/* ==========================================================
   Register Dictionary
========================================================== */

GrammarEngine.registerDictionary(
    "adjectives",
    adjectives
);

window.adjectives = adjectives;
