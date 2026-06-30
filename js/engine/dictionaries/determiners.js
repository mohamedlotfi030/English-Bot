"use strict";

/* ==========================================================
   English-Bot
   Determiners Dictionary
   Version 5.0
========================================================== */

const determiners = new Map();

/* ==========================================================
   Register Determiner
========================================================== */

function addDeterminer({
    form,
    type // demonstrative, quantifier, distributive, possessive
}) {
    determiners.set(
        form.toLowerCase(),
        {
            form,
            type
        }
    );
}

/* ==========================================================
   Demonstrative Determiners
========================================================== */

addDeterminer({ form:"this", type:"demonstrative" });
addDeterminer({ form:"that", type:"demonstrative" });
addDeterminer({ form:"these", type:"demonstrative" });
addDeterminer({ form:"those", type:"demonstrative" });

/* ==========================================================
   Quantifiers
========================================================== */

addDeterminer({ form:"some", type:"quantifier" });
addDeterminer({ form:"any", type:"quantifier" });
addDeterminer({ form:"many", type:"quantifier" });
addDeterminer({ form:"much", type:"quantifier" });
addDeterminer({ form:"few", type:"quantifier" });
addDeterminer({ form:"little", type:"quantifier" });
addDeterminer({ form:"several", type:"quantifier" });
addDeterminer({ form:"all", type:"quantifier" });
addDeterminer({ form:"no", type:"quantifier" });

/* ==========================================================
   Distributive Determiners
========================================================== */

addDeterminer({ form:"each", type:"distributive" });
addDeterminer({ form:"every", type:"distributive" });
addDeterminer({ form:"either", type:"distributive" });
addDeterminer({ form:"neither", type:"distributive" });

/* ==========================================================
   Possessive Determiners
========================================================== */

addDeterminer({ form:"my", type:"possessive" });
addDeterminer({ form:"your", type:"possessive" });
addDeterminer({ form:"his", type:"possessive" });
addDeterminer({ form:"her", type:"possessive" });
addDeterminer({ form:"its", type:"possessive" });
addDeterminer({ form:"our", type:"possessive" });
addDeterminer({ form:"their", type:"possessive" });

/* ==========================================================
   Register Dictionary
========================================================== */

GrammarEngine.registerDictionary(
    "determiners",
    determiners
);

window.determiners = determiners;
