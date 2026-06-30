"use strict";

/* ==========================================================
   English-Bot
   Noun Dictionary
   Version 5.0
========================================================== */

const nouns = new Map();

/* ==========================================================
   Register Noun
========================================================== */

function addNoun({
    singular,
    plural,
    countable = true,
    proper = false
}) {
    nouns.set(
        singular.toLowerCase(),
        {
            singular,
            plural,
            countable,
            proper
        }
    );
}

/* ==========================================================
   Common Nouns
========================================================== */

addNoun({ singular:"book", plural:"books", countable:true });
addNoun({ singular:"car", plural:"cars", countable:true });
addNoun({ singular:"dog", plural:"dogs", countable:true });
addNoun({ singular:"cat", plural:"cats", countable:true });
addNoun({ singular:"house", plural:"houses", countable:true });
addNoun({ singular:"school", plural:"schools", countable:true });
addNoun({ singular:"student", plural:"students", countable:true });
addNoun({ singular:"teacher", plural:"teachers", countable:true });
addNoun({ singular:"child", plural:"children", countable:true });
addNoun({ singular:"man", plural:"men", countable:true });
addNoun({ singular:"woman", plural:"women", countable:true });
/* ==========================================================
   Uncountable Nouns
========================================================== */

addNoun({ singular:"water", plural:"water", countable:false });
addNoun({ singular:"milk", plural:"milk", countable:false });
addNoun({ singular:"rice", plural:"rice", countable:false });
addNoun({ singular:"information", plural:"information", countable:false });
addNoun({ singular:"advice", plural:"advice", countable:false });
addNoun({ singular:"money", plural:"money", countable:false });
addNoun({ singular:"furniture", plural:"furniture", countable:false });
addNoun({ singular:"music", plural:"music", countable:false });
addNoun({ singular:"news", plural:"news", countable:false });

/* ==========================================================
   Proper Nouns
========================================================== */

addNoun({ singular:"Cairo", plural:"Cairo", countable:false, proper:true });
addNoun({ singular:"Egypt", plural:"Egypt", countable:false, proper:true });
addNoun({ singular:"Microsoft", plural:"Microsoft", countable:false, proper:true });
addNoun({ singular:"Google", plural:"Google", countable:false, proper:true });
addNoun({ singular:"Abdulrahman", plural:"Abdulrahman", countable:false, proper:true });
/* ==========================================================
   More Common Nouns
========================================================== */

addNoun({ singular:"city", plural:"cities", countable:true });
addNoun({ singular:"country", plural:"countries", countable:true });
addNoun({ singular:"language", plural:"languages", countable:true });
addNoun({ singular:"computer", plural:"computers", countable:true });
addNoun({ singular:"phone", plural:"phones", countable:true });
addNoun({ singular:"table", plural:"tables", countable:true });
addNoun({ singular:"chair", plural:"chairs", countable:true });
addNoun({ singular:"idea", plural:"ideas", countable:true });
addNoun({ singular:"problem", plural:"problems", countable:true });
addNoun({ singular:"solution", plural:"solutions", countable:true });

/* ==========================================================
   Register Dictionary
========================================================== */

GrammarEngine.registerDictionary(
    "nouns",
    nouns
);

window.nouns = nouns;
