"use strict";

/* ==========================================================
   English-Bot
   Quantifiers Dictionary
   Version 5.0
========================================================== */

const quantifiers = new Map();

/* ==========================================================
   Register Quantifier
========================================================== */

function addQuantifier({
    form,
    usage // countable, uncountable, both
}) {
    quantifiers.set(
        form.toLowerCase(),
        {
            form,
            usage
        }
    );
}

/* ==========================================================
   Quantifiers for Countable Nouns
========================================================== */

addQuantifier({ form:"many", usage:"countable" });
addQuantifier({ form:"several", usage:"countable" });
addQuantifier({ form:"a few", usage:"countable" });
addQuantifier({ form:"few", usage:"countable" });
addQuantifier({ form:"each", usage:"countable" });
addQuantifier({ form:"every", usage:"countable" });

/* ==========================================================
   Quantifiers for Uncountable Nouns
========================================================== */

addQuantifier({ form:"much", usage:"uncountable" });
addQuantifier({ form:"a little", usage:"uncountable" });
addQuantifier({ form:"little", usage:"uncountable" });
addQuantifier({ form:"less", usage:"uncountable" });
addQuantifier({ form:"least", usage:"uncountable" });

/* ==========================================================
   Quantifiers for Both
========================================================== */

addQuantifier({ form:"some", usage:"both" });
addQuantifier({ form:"any", usage:"both" });
addQuantifier({ form:"no", usage:"both" });
addQuantifier({ form:"all", usage:"both" });
addQuantifier({ form:"most", usage:"both" });
addQuantifier({ form:"more", usage:"both" });
addQuantifier({ form:"enough", usage:"both" });
addQuantifier({ form:"plenty of", usage:"both" });

/* ==========================================================
   Register Dictionary
========================================================== */

GrammarEngine.registerDictionary(
    "quantifiers",
    quantifiers
);

window.quantifiers = quantifiers;
