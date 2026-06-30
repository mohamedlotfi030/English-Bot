"use strict";

/* ==========================================================
   English-Bot
   Adverb Dictionary
   Version 5.0
========================================================== */

const adverbs = new Map();

/* ==========================================================
   Register Adverb
========================================================== */

function addAdverb({
    base,
    type // manner, time, frequency, degree
}) {
    adverbs.set(
        base.toLowerCase(),
        {
            base,
            type
        }
    );
}

/* ==========================================================
   Common Adverbs of Manner
========================================================== */

addAdverb({ base:"quickly", type:"manner" });
addAdverb({ base:"slowly", type:"manner" });
addAdverb({ base:"carefully", type:"manner" });
addAdverb({ base:"badly", type:"manner" });
addAdverb({ base:"well", type:"manner" });

/* ==========================================================
   Common Adverbs of Time
========================================================== */

addAdverb({ base:"yesterday", type:"time" });
addAdverb({ base:"today", type:"time" });
addAdverb({ base:"tomorrow", type:"time" });
addAdverb({ base:"now", type:"time" });
addAdverb({ base:"soon", type:"time" });
/* ==========================================================
   Common Adverbs of Frequency
========================================================== */

addAdverb({ base:"always", type:"frequency" });
addAdverb({ base:"usually", type:"frequency" });
addAdverb({ base:"often", type:"frequency" });
addAdverb({ base:"sometimes", type:"frequency" });
addAdverb({ base:"rarely", type:"frequency" });
addAdverb({ base:"never", type:"frequency" });

/* ==========================================================
   Common Adverbs of Degree
========================================================== */

addAdverb({ base:"very", type:"degree" });
addAdverb({ base:"quite", type:"degree" });
addAdverb({ base:"too", type:"degree" });
addAdverb({ base:"enough", type:"degree" });
addAdverb({ base:"almost", type:"degree" });
addAdverb({ base:"completely", type:"degree" });

/* ==========================================================
   Register Dictionary
========================================================== */

GrammarEngine.registerDictionary(
    "adverbs",
    adverbs
);

window.adverbs = adverbs;
