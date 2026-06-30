"use strict";

/* ==========================================================
   English-Bot
   Modal Verbs Dictionary
   Version 5.0
========================================================== */

const modalVerbs = new Map();

/* ==========================================================
   Register Modal Verb
========================================================== */

function addModalVerb({
    form,
    functionType // ability, possibility, necessity, obligation, prediction
}) {
    modalVerbs.set(
        form.toLowerCase(),
        {
            form,
            functionType
        }
    );
}

/* ==========================================================
   Ability
========================================================== */

addModalVerb({ form:"can", functionType:"ability" });
addModalVerb({ form:"could", functionType:"ability" });

/* ==========================================================
   Possibility
========================================================== */

addModalVerb({ form:"may", functionType:"possibility" });
addModalVerb({ form:"might", functionType:"possibility" });

/* ==========================================================
   Necessity / Obligation
========================================================== */

addModalVerb({ form:"must", functionType:"necessity" });
addModalVerb({ form:"shall", functionType:"obligation" });
addModalVerb({ form:"should", functionType:"obligation" });

/* ==========================================================
   Prediction / Future
========================================================== */

addModalVerb({ form:"will", functionType:"prediction" });
addModalVerb({ form:"would", functionType:"prediction" });

/* ==========================================================
   Register Dictionary
========================================================== */

GrammarEngine.registerDictionary(
    "modalVerbs",
    modalVerbs
);

window.modalVerbs = modalVerbs;
