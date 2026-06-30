"use strict";

/* ==========================================================
   English-Bot
   Contractions Dictionary
   Version 5.0
========================================================== */

const contractions = new Map();

/* ==========================================================
   Register Contraction
========================================================== */

function addContraction({
    short,
    full
}) {
    contractions.set(
        short.toLowerCase(),
        {
            short,
            full
        }
    );
}

/* ==========================================================
   Common Contractions
========================================================== */

addContraction({ short:"I'm", full:"I am" });
addContraction({ short:"you're", full:"you are" });
addContraction({ short:"he's", full:"he is" });
addContraction({ short:"she's", full:"she is" });
addContraction({ short:"it's", full:"it is" });
addContraction({ short:"we're", full:"we are" });
addContraction({ short:"they're", full:"they are" });

addContraction({ short:"I've", full:"I have" });
addContraction({ short:"you've", full:"you have" });
addContraction({ short:"we've", full:"we have" });
addContraction({ short:"they've", full:"they have" });

addContraction({ short:"I'll", full:"I will" });
addContraction({ short:"you'll", full:"you will" });
addContraction({ short:"he'll", full:"he will" });
addContraction({ short:"she'll", full:"she will" });
addContraction({ short:"it'll", full:"it will" });
addContraction({ short:"we'll", full:"we will" });
addContraction({ short:"they'll", full:"they will" });

addContraction({ short:"don't", full:"do not" });
addContraction({ short:"doesn't", full:"does not" });
addContraction({ short:"didn't", full:"did not" });
addContraction({ short:"can't", full:"cannot" });
addContraction({ short:"won't", full:"will not" });
addContraction({ short:"wouldn't", full:"would not" });
addContraction({ short:"shouldn't", full:"should not" });
addContraction({ short:"isn't", full:"is not" });
addContraction({ short:"aren't", full:"are not" });
addContraction({ short:"wasn't", full:"was not" });
addContraction({ short:"weren't", full:"were not" });

/* ==========================================================
   Register Dictionary
========================================================== */

GrammarEngine.registerDictionary(
    "contractions",
    contractions
);

window.contractions = contractions;
