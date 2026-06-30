"use strict";

/* ==========================================================
   English-Bot
   Verb Dictionary
   Version 5.0
========================================================== */

const verbs = new Map();

/* ==========================================================
   Register Verb
========================================================== */

function addVerb({
    base,
    third,
    past,
    participle,
    ing,
    transitive = true,
    auxiliary = false,
    modal = false
}) {
    verbs.set(
        base.toLowerCase(),
        {
            base,
            third,
            past,
            participle,
            ing,
            transitive,
            auxiliary,
            modal
        }
    );
}

/* ==========================================================
   Core Verbs (Auxiliary + Modal)
========================================================== */

addVerb({
    base:"be",
    third:"is",
    past:"was",
    participle:"been",
    ing:"being",
    transitive:false,
    auxiliary:true
});

addVerb({
    base:"have",
    third:"has",
    past:"had",
    participle:"had",
    ing:"having",
    auxiliary:true
});

addVerb({
    base:"do",
    third:"does",
    past:"did",
    participle:"done",
    ing:"doing",
    auxiliary:true
});

addVerb({
    base:"can",
    third:"can",
    past:"could",
    participle:"could",
    ing:"canning",
    transitive:false,
    modal:true
});

addVerb({
    base:"will",
    third:"will",
    past:"would",
    participle:"would",
    ing:"willing",
    transitive:false,
    modal:true
});
/* ==========================================================
   Common Irregular Verbs
========================================================== */

addVerb({
    base:"go",
    third:"goes",
    past:"went",
    participle:"gone",
    ing:"going",
    transitive:false
});

addVerb({
    base:"come",
    third:"comes",
    past:"came",
    participle:"come",
    ing:"coming",
    transitive:false
});

addVerb({
    base:"eat",
    third:"eats",
    past:"ate",
    participle:"eaten",
    ing:"eating"
});

addVerb({
    base:"drink",
    third:"drinks",
    past:"drank",
    participle:"drunk",
    ing:"drinking"
});

addVerb({
    base:"write",
    third:"writes",
    past:"wrote",
    participle:"written",
    ing:"writing"
});

addVerb({
    base:"read",
    third:"reads",
    past:"read",
    participle:"read",
    ing:"reading"
});

addVerb({
    base:"speak",
    third:"speaks",
    past:"spoke",
    participle:"spoken",
    ing:"speaking"
});

addVerb({
    base:"see",
    third:"sees",
    past:"saw",
    participle:"seen",
    ing:"seeing"
});

addVerb({
    base:"take",
    third:"takes",
    past:"took",
    participle:"taken",
    ing:"taking"
});

addVerb({
    base:"make",
    third:"makes",
    past:"made",
    participle:"made",
    ing:"making"
});
/* ==========================================================
   Common Regular Verbs
========================================================== */

addVerb({
    base:"play",
    third:"plays",
    past:"played",
    participle:"played",
    ing:"playing"
});

addVerb({
    base:"work",
    third:"works",
    past:"worked",
    participle:"worked",
    ing:"working"
});

addVerb({
    base:"study",
    third:"studies",
    past:"studied",
    participle:"studied",
    ing:"studying"
});

addVerb({
    base:"watch",
    third:"watches",
    past:"watched",
    participle:"watched",
    ing:"watching"
});

addVerb({
    base:"call",
    third:"calls",
    past:"called",
    participle:"called",
    ing:"calling"
});

/* ==========================================================
   Register Dictionary
========================================================== */

GrammarEngine.registerDictionary(
    "verbs",
    verbs
);

window.verbs = verbs;
