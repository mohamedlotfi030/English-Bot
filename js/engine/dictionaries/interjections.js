"use strict";

/* ==========================================================
   English-Bot
   Interjections Dictionary
   Version 5.0
========================================================== */

const interjections = new Map();

/* ==========================================================
   Register Interjection
========================================================== */

function addInterjection({
    form,
    emotion // surprise, joy, pain, greeting, hesitation
}) {
    interjections.set(
        form.toLowerCase(),
        {
            form,
            emotion
        }
    );
}

/* ==========================================================
   Surprise
========================================================== */

addInterjection({ form:"oh", emotion:"surprise" });
addInterjection({ form:"wow", emotion:"surprise" });
addInterjection({ form:"oops", emotion:"surprise" });

/* ==========================================================
   Joy
========================================================== */

addInterjection({ form:"yay", emotion:"joy" });
addInterjection({ form:"hooray", emotion:"joy" });
addInterjection({ form:"bravo", emotion:"joy" });

/* ==========================================================
   Pain
========================================================== */

addInterjection({ form:"ouch", emotion:"pain" });
addInterjection({ form:"ow", emotion:"pain" });
addInterjection({ form:"ugh", emotion:"pain" });

/* ==========================================================
   Greeting
========================================================== */

addInterjection({ form:"hey", emotion:"greeting" });
addInterjection({ form:"hi", emotion:"greeting" });
addInterjection({ form:"hello", emotion:"greeting" });

/* ==========================================================
   Hesitation
========================================================== */

addInterjection({ form:"um", emotion:"hesitation" });
addInterjection({ form:"uh", emotion:"hesitation" });
addInterjection({ form:"er", emotion:"hesitation" });

/* ==========================================================
   Register Dictionary
========================================================== */

GrammarEngine.registerDictionary(
    "interjections",
    interjections
);

window.interjections = interjections;
