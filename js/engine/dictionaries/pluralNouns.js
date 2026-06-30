"use strict";

/* ==========================================================
   English-Bot
   Plural Nouns Dictionary
   Version 5.0
========================================================== */

const pluralNouns = new Map();

/* ==========================================================
   Register Plural Noun
========================================================== */

function addPluralNoun({
    singular,
    plural,
    type // regular, irregular
}) {
    pluralNouns.set(
        singular.toLowerCase(),
        {
            singular,
            plural,
            type
        }
    );
}

/* ==========================================================
   Regular Plurals
========================================================== */

addPluralNoun({ singular:"book", plural:"books", type:"regular" });
addPluralNoun({ singular:"car", plural:"cars", type:"regular" });
addPluralNoun({ singular:"dog", plural:"dogs", type:"regular" });
addPluralNoun({ singular:"cat", plural:"cats", type:"regular" });
addPluralNoun({ singular:"table", plural:"tables", type:"regular" });
addPluralNoun({ singular:"chair", plural:"chairs", type:"regular" });
addPluralNoun({ singular:"computer", plural:"computers", type:"regular" });
addPluralNoun({ singular:"phone", plural:"phones", type:"regular" });

/* ==========================================================
   Irregular Plurals
========================================================== */

addPluralNoun({ singular:"child", plural:"children", type:"irregular" });
addPluralNoun({ singular:"man", plural:"men", type:"irregular" });
addPluralNoun({ singular:"woman", plural:"women", type:"irregular" });
addPluralNoun({ singular:"tooth", plural:"teeth", type:"irregular" });
addPluralNoun({ singular:"foot", plural:"feet", type:"irregular" });
addPluralNoun({ singular:"mouse", plural:"mice", type:"irregular" });
addPluralNoun({ singular:"person", plural:"people", type:"irregular" });
addPluralNoun({ singular:"ox", plural:"oxen", type:"irregular" });
addPluralNoun({ singular:"goose", plural:"geese", type:"irregular" });
addPluralNoun({ singular:"cactus", plural:"cacti", type:"irregular" });
addPluralNoun({ singular:"analysis", plural:"analyses", type:"irregular" });
addPluralNoun({ singular:"crisis", plural:"crises", type:"irregular" });
addPluralNoun({ singular:"phenomenon", plural:"phenomena", type:"irregular" });
addPluralNoun({ singular:"datum", plural:"data", type:"irregular" });

/* ==========================================================
   Register Dictionary
========================================================== */

GrammarEngine.registerDictionary(
    "pluralNouns",
    pluralNouns
);

window.pluralNouns = pluralNouns;
