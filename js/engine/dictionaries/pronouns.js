"use strict";

/* ==========================================================
   English-Bot
   Pronoun Dictionary
   Version 5.0
========================================================== */

const pronouns = new Map();

/* ==========================================================
   Register Pronoun
========================================================== */

function addPronoun({
    form,
    type // subject, object, possessive, reflexive
}) {
    pronouns.set(
        form.toLowerCase(),
        {
            form,
            type
        }
    );
}

/* ==========================================================
   Subject Pronouns
========================================================== */

addPronoun({ form:"I", type:"subject" });
addPronoun({ form:"you", type:"subject" });
addPronoun({ form:"he", type:"subject" });
addPronoun({ form:"she", type:"subject" });
addPronoun({ form:"it", type:"subject" });
addPronoun({ form:"we", type:"subject" });
addPronoun({ form:"they", type:"subject" });

/* ==========================================================
   Object Pronouns
========================================================== */

addPronoun({ form:"me", type:"object" });
addPronoun({ form:"you", type:"object" });
addPronoun({ form:"him", type:"object" });
addPronoun({ form:"her", type:"object" });
addPronoun({ form:"it", type:"object" });
addPronoun({ form:"us", type:"object" });
addPronoun({ form:"them", type:"object" });

/* ==========================================================
   Possessive Pronouns
========================================================== */

addPronoun({ form:"my", type:"possessive" });
addPronoun({ form:"your", type:"possessive" });
addPronoun({ form:"his", type:"possessive" });
addPronoun({ form:"her", type:"possessive" });
addPronoun({ form:"its", type:"possessive" });
addPronoun({ form:"our", type:"possessive" });
addPronoun({ form:"their", type:"possessive" });
addPronoun({ form:"mine", type:"possessive" });
addPronoun({ form:"yours", type:"possessive" });
addPronoun({ form:"hers", type:"possessive" });
addPronoun({ form:"ours", type:"possessive" });
addPronoun({ form:"theirs", type:"possessive" });

/* ==========================================================
   Reflexive Pronouns
========================================================== */

addPronoun({ form:"myself", type:"reflexive" });
addPronoun({ form:"yourself", type:"reflexive" });
addPronoun({ form:"himself", type:"reflexive" });
addPronoun({ form:"herself", type:"reflexive" });
addPronoun({ form:"itself", type:"reflexive" });
addPronoun({ form:"ourselves", type:"reflexive" });
addPronoun({ form:"yourselves", type:"reflexive" });
addPronoun({ form:"themselves", type:"reflexive" });

/* ==========================================================
   Register Dictionary
========================================================== */

GrammarEngine.registerDictionary(
    "pronouns",
    pronouns
);

window.pronouns = pronouns;
