"use strict";

/* ==========================================================
   English-Bot
   Participles Dictionary
   Version 5.0
========================================================== */

const participles = new Map();

/* ==========================================================
   Register Participle
========================================================== */

function addParticiple({
    base,
    presentParticiple,
    pastParticiple
}) {
    participles.set(
        base.toLowerCase(),
        {
            base,
            presentParticiple,
            pastParticiple
        }
    );
}

/* ==========================================================
   Regular Verbs
========================================================== */

addParticiple({ base:"play", presentParticiple:"playing", pastParticiple:"played" });
addParticiple({ base:"work", presentParticiple:"working", pastParticiple:"worked" });
addParticiple({ base:"talk", presentParticiple:"talking", pastParticiple:"talked" });
addParticiple({ base:"watch", presentParticiple:"watching", pastParticiple:"watched" });
addParticiple({ base:"open", presentParticiple:"opening", pastParticiple:"opened" });

/* ==========================================================
   Irregular Verbs
========================================================== */

addParticiple({ base:"go", presentParticiple:"going", pastParticiple:"gone" });
addParticiple({ base:"eat", presentParticiple:"eating", pastParticiple:"eaten" });
addParticiple({ base:"drink", presentParticiple:"drinking", pastParticiple:"drunk" });
addParticiple({ base:"write", presentParticiple:"writing", pastParticiple:"written" });
addParticiple({ base:"break", presentParticiple:"breaking", pastParticiple:"broken" });
addParticiple({ base:"choose", presentParticiple:"choosing", pastParticiple:"chosen" });
addParticiple({ base:"sing", presentParticiple:"singing", pastParticiple:"sung" });
addParticiple({ base:"swim", presentParticiple:"swimming", pastParticiple:"swum" });

/* ==========================================================
   Register Dictionary
========================================================== */

GrammarEngine.registerDictionary(
    "participles",
    participles
);

window.participles = participles;
