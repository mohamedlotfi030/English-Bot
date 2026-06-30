"use strict";

/* ==========================================================
   English-Bot
   Phrasal Verbs Dictionary
   Version 5.0
========================================================== */

const phrasalVerbs = new Map();

/* ==========================================================
   Register Phrasal Verb
========================================================== */

function addPhrasalVerb({
    phrase,
    meaning,
    type // separable, inseparable
}) {
    phrasalVerbs.set(
        phrase.toLowerCase(),
        {
            phrase,
            meaning,
            type
        }
    );
}

/* ==========================================================
   Common Phrasal Verbs
========================================================== */

addPhrasalVerb({ phrase:"get up", meaning:"to rise from bed", type:"inseparable" });
addPhrasalVerb({ phrase:"wake up", meaning:"to stop sleeping", type:"inseparable" });
addPhrasalVerb({ phrase:"look after", meaning:"to take care of", type:"inseparable" });
addPhrasalVerb({ phrase:"run out", meaning:"to have no more of something", type:"inseparable" });
addPhrasalVerb({ phrase:"give up", meaning:"to stop trying", type:"inseparable" });
addPhrasalVerb({ phrase:"pick up", meaning:"to collect or lift", type:"separable" });
addPhrasalVerb({ phrase:"turn on", meaning:"to activate", type:"separable" });
addPhrasalVerb({ phrase:"turn off", meaning:"to deactivate", type:"separable" });
addPhrasalVerb({ phrase:"put off", meaning:"to postpone", type:"separable" });
addPhrasalVerb({ phrase:"bring up", meaning:"to mention a topic", type:"separable" });
addPhrasalVerb({ phrase:"find out", meaning:"to discover", type:"inseparable" });
addPhrasalVerb({ phrase:"look forward to", meaning:"to anticipate with pleasure", type:"inseparable" });
addPhrasalVerb({ phrase:"carry on", meaning:"to continue", type:"inseparable" });
addPhrasalVerb({ phrase:"set up", meaning:"to arrange or establish", type:"separable" });
addPhrasalVerb({ phrase:"take off", meaning:"to remove or for a plane to leave the ground", type:"inseparable" });

/* ==========================================================
   Register Dictionary
========================================================== */

GrammarEngine.registerDictionary(
    "phrasalVerbs",
    phrasalVerbs
);

window.phrasalVerbs = phrasalVerbs;
