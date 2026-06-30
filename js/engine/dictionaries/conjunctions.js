"use strict";

/* ==========================================================
   English-Bot
   Conjunctions Dictionary
   Version 5.0
========================================================== */

const conjunctions = new Map();

/* ==========================================================
   Register Conjunction
========================================================== */

function addConjunction({
    form,
    type // coordinating, subordinating, correlative
}) {
    conjunctions.set(
        form.toLowerCase(),
        {
            form,
            type
        }
    );
}

/* ==========================================================
   Coordinating Conjunctions
========================================================== */

addConjunction({ form:"and", type:"coordinating" });
addConjunction({ form:"but", type:"coordinating" });
addConjunction({ form:"or", type:"coordinating" });
addConjunction({ form:"nor", type:"coordinating" });
addConjunction({ form:"for", type:"coordinating" });
addConjunction({ form:"yet", type:"coordinating" });
addConjunction({ form:"so", type:"coordinating" });

/* ==========================================================
   Subordinating Conjunctions
========================================================== */

addConjunction({ form:"although", type:"subordinating" });
addConjunction({ form:"because", type:"subordinating" });
addConjunction({ form:"since", type:"subordinating" });
addConjunction({ form:"if", type:"subordinating" });
addConjunction({ form:"unless", type:"subordinating" });
addConjunction({ form:"while", type:"subordinating" });
addConjunction({ form:"whereas", type:"subordinating" });
addConjunction({ form:"though", type:"subordinating" });
addConjunction({ form:"after", type:"subordinating" });
addConjunction({ form:"before", type:"subordinating" });
addConjunction({ form:"until", type:"subordinating" });

/* ==========================================================
   Correlative Conjunctions
========================================================== */

addConjunction({ form:"either...or", type:"correlative" });
addConjunction({ form:"neither...nor", type:"correlative" });
addConjunction({ form:"both...and", type:"correlative" });
addConjunction({ form:"not only...but also", type:"correlative" });
addConjunction({ form:"whether...or", type:"correlative" });

/* ==========================================================
   Register Dictionary
========================================================== */

GrammarEngine.registerDictionary(
    "conjunctions",
    conjunctions
);

window.conjunctions = conjunctions;
