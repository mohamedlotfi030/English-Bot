"use strict";

/* ==========================================================
   English-Bot
   Auxiliary Verbs Dictionary
   Version 5.0
========================================================== */

const auxiliaryVerbs = new Map();

/* ==========================================================
   Register Auxiliary Verb
========================================================== */

function addAuxiliaryVerb({
    form,
    base,
    functionType // be, have, do
}) {
    auxiliaryVerbs.set(
        form.toLowerCase(),
        {
            form,
            base,
            functionType
        }
    );
}

/* ==========================================================
   Forms of "Be"
========================================================== */

addAuxiliaryVerb({ form:"am", base:"be", functionType:"be" });
addAuxiliaryVerb({ form:"is", base:"be", functionType:"be" });
addAuxiliaryVerb({ form:"are", base:"be", functionType:"be" });
addAuxiliaryVerb({ form:"was", base:"be", functionType:"be" });
addAuxiliaryVerb({ form:"were", base:"be", functionType:"be" });
addAuxiliaryVerb({ form:"be", base:"be", functionType:"be" });
addAuxiliaryVerb({ form:"been", base:"be", functionType:"be" });
addAuxiliaryVerb({ form:"being", base:"be", functionType:"be" });

/* ==========================================================
   Forms of "Have"
========================================================== */

addAuxiliaryVerb({ form:"have", base:"have", functionType:"have" });
addAuxiliaryVerb({ form:"has", base:"have", functionType:"have" });
addAuxiliaryVerb({ form:"had", base:"have", functionType:"have" });
addAuxiliaryVerb({ form:"having", base:"have", functionType:"have" });

/* ==========================================================
   Forms of "Do"
========================================================== */

addAuxiliaryVerb({ form:"do", base:"do", functionType:"do" });
addAuxiliaryVerb({ form:"does", base:"do", functionType:"do" });
addAuxiliaryVerb({ form:"did", base:"do", functionType:"do" });
addAuxiliaryVerb({ form:"done", base:"do", functionType:"do" });
addAuxiliaryVerb({ form:"doing", base:"do", functionType:"do" });

/* ==========================================================
   Register Dictionary
========================================================== */

GrammarEngine.registerDictionary(
    "auxiliaryVerbs",
    auxiliaryVerbs
);

window.auxiliaryVerbs = auxiliaryVerbs;
