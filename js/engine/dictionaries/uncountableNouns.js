"use strict";

/* ==========================================================
   English-Bot
   Uncountable Nouns Dictionary
   Version 5.0
========================================================== */

const uncountableNouns = new Map();

/* ==========================================================
   Register Uncountable Noun
========================================================== */

function addUncountableNoun({
    form,
    category // substance, abstract, collective
}) {
    uncountableNouns.set(
        form.toLowerCase(),
        {
            form,
            category
        }
    );
}

/* ==========================================================
   Substances
========================================================== */

addUncountableNoun({ form:"water", category:"substance" });
addUncountableNoun({ form:"milk", category:"substance" });
addUncountableNoun({ form:"rice", category:"substance" });
addUncountableNoun({ form:"bread", category:"substance" });
addUncountableNoun({ form:"coffee", category:"substance" });
addUncountableNoun({ form:"tea", category:"substance" });
addUncountableNoun({ form:"oil", category:"substance" });
addUncountableNoun({ form:"sugar", category:"substance" });
addUncountableNoun({ form:"salt", category:"substance" });

/* ==========================================================
   Abstract Concepts
========================================================== */

addUncountableNoun({ form:"information", category:"abstract" });
addUncountableNoun({ form:"advice", category:"abstract" });
addUncountableNoun({ form:"knowledge", category:"abstract" });
addUncountableNoun({ form:"education", category:"abstract" });
addUncountableNoun({ form:"music", category:"abstract" });
addUncountableNoun({ form:"news", category:"abstract" });
addUncountableNoun({ form:"progress", category:"abstract" });
addUncountableNoun({ form:"research", category:"abstract" });
addUncountableNoun({ form:"work", category:"abstract" });

/* ==========================================================
   Collective Nouns
========================================================== */

addUncountableNoun({ form:"furniture", category:"collective" });
addUncountableNoun({ form:"equipment", category:"collective" });
addUncountableNoun({ form:"luggage", category:"collective" });
addUncountableNoun({ form:"traffic", category:"collective" });
addUncountableNoun({ form:"machinery", category:"collective" });
addUncountableNoun({ form:"clothing", category:"collective" });

/* ==========================================================
   Register Dictionary
========================================================== */

GrammarEngine.registerDictionary(
    "uncountableNouns",
    uncountableNouns
);

window.uncountableNouns = uncountableNouns;
