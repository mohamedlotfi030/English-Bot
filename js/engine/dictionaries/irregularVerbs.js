"use strict";

/* ==========================================================
   English-Bot
   Irregular Verb Dictionary
   Version 5.0
========================================================== */

const irregularVerbs = new Map();

/* ==========================================================
   Register Irregular Verb
========================================================== */

function addIrregularVerb({
    base,
    past,
    participle
}) {
    irregularVerbs.set(
        base.toLowerCase(),
        {
            base,
            past,
            participle
        }
    );
}

/* ==========================================================
   Common Irregular Verbs
========================================================== */

addIrregularVerb({ base:"be", past:"was/were", participle:"been" });
addIrregularVerb({ base:"begin", past:"began", participle:"begun" });
addIrregularVerb({ base:"break", past:"broke", participle:"broken" });
addIrregularVerb({ base:"bring", past:"brought", participle:"brought" });
addIrregularVerb({ base:"buy", past:"bought", participle:"bought" });
addIrregularVerb({ base:"choose", past:"chose", participle:"chosen" });
addIrregularVerb({ base:"come", past:"came", participle:"come" });
addIrregularVerb({ base:"do", past:"did", participle:"done" });
addIrregularVerb({ base:"drink", past:"drank", participle:"drunk" });
addIrregularVerb({ base:"eat", past:"ate", participle:"eaten" });
addIrregularVerb({ base:"fall", past:"fell", participle:"fallen" });
addIrregularVerb({ base:"find", past:"found", participle:"found" });
addIrregularVerb({ base:"fly", past:"flew", participle:"flown" });
addIrregularVerb({ base:"forget", past:"forgot", participle:"forgotten" });
addIrregularVerb({ base:"get", past:"got", participle:"got/gotten" });
addIrregularVerb({ base:"give", past:"gave", participle:"given" });
addIrregularVerb({ base:"go", past:"went", participle:"gone" });
addIrregularVerb({ base:"know", past:"knew", participle:"known" });
addIrregularVerb({ base:"leave", past:"left", participle:"left" });
addIrregularVerb({ base:"make", past:"made", participle:"made" });
/* ==========================================================
   More Irregular Verbs
========================================================== */

addIrregularVerb({ base:"meet", past:"met", participle:"met" });
addIrregularVerb({ base:"read", past:"read", participle:"read" });
addIrregularVerb({ base:"run", past:"ran", participle:"run" });
addIrregularVerb({ base:"say", past:"said", participle:"said" });
addIrregularVerb({ base:"see", past:"saw", participle:"seen" });
addIrregularVerb({ base:"sell", past:"sold", participle:"sold" });
addIrregularVerb({ base:"sing", past:"sang", participle:"sung" });
addIrregularVerb({ base:"sit", past:"sat", participle:"sat" });
addIrregularVerb({ base:"sleep", past:"slept", participle:"slept" });
addIrregularVerb({ base:"speak", past:"spoke", participle:"spoken" });
addIrregularVerb({ base:"swim", past:"swam", participle:"swum" });
addIrregularVerb({ base:"take", past:"took", participle:"taken" });
addIrregularVerb({ base:"teach", past:"taught", participle:"taught" });
addIrregularVerb({ base:"tell", past:"told", participle:"told" });
addIrregularVerb({ base:"think", past:"thought", participle:"thought" });
addIrregularVerb({ base:"understand", past:"understood", participle:"understood" });
addIrregularVerb({ base:"wear", past:"wore", participle:"worn" });
addIrregularVerb({ base:"write", past:"wrote", participle:"written" });

/* ==========================================================
   Register Dictionary
========================================================== */

GrammarEngine.registerDictionary(
    "irregularVerbs",
    irregularVerbs
);

window.irregularVerbs = irregularVerbs;
