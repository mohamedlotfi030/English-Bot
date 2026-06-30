"use strict";

/* ==========================================================
   English-Bot
   Prepositions Dictionary
   Version 5.0
========================================================== */

const prepositions = new Map();

/* ==========================================================
   Register Preposition
========================================================== */

function addPreposition({
    form,
    type // place, time, direction, cause, instrument, relation
}) {
    prepositions.set(
        form.toLowerCase(),
        {
            form,
            type
        }
    );
}

/* ==========================================================
   Prepositions of Place
========================================================== */

addPreposition({ form:"in", type:"place" });
addPreposition({ form:"on", type:"place" });
addPreposition({ form:"at", type:"place" });
addPreposition({ form:"under", type:"place" });
addPreposition({ form:"over", type:"place" });
addPreposition({ form:"between", type:"place" });
addPreposition({ form:"among", type:"place" });

/* ==========================================================
   Prepositions of Time
========================================================== */

addPreposition({ form:"at", type:"time" });
addPreposition({ form:"on", type:"time" });
addPreposition({ form:"in", type:"time" });
addPreposition({ form:"since", type:"time" });
addPreposition({ form:"for", type:"time" });
addPreposition({ form:"during", type:"time" });
addPreposition({ form:"until", type:"time" });
addPreposition({ form:"by", type:"time" });

/* ==========================================================
   Prepositions of Direction
========================================================== */

addPreposition({ form:"to", type:"direction" });
addPreposition({ form:"into", type:"direction" });
addPreposition({ form:"onto", type:"direction" });
addPreposition({ form:"towards", type:"direction" });
addPreposition({ form:"through", type:"direction" });
addPreposition({ form:"across", type:"direction" });

/* ==========================================================
   Other Prepositions
========================================================== */

addPreposition({ form:"with", type:"instrument" });
addPreposition({ form:"without", type:"instrument" });
addPreposition({ form:"about", type:"relation" });
addPreposition({ form:"of", type:"relation" });
addPreposition({ form:"by", type:"cause" });
addPreposition({ form:"because of", type:"cause" });
addPreposition({ form:"due to", type:"cause" });

/* ==========================================================
   Register Dictionary
========================================================== */

GrammarEngine.registerDictionary(
    "prepositions",
    prepositions
);

window.prepositions = prepositions;
