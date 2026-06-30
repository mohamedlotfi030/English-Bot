"use strict";

/* ==========================================================
   English-Bot
   Interjection Rules
   Version 5.0
========================================================== */

const interjectionRules = [];

/* ==========================================================
   Rule Registration
========================================================== */

function addInterjectionRule({
    description,
    condition,
    correction
}) {
    interjectionRules.push({
        description,
        condition,
        correction
    });
}

/* ==========================================================
   Surprise Interjections
========================================================== */

addInterjectionRule({
    description: "Use 'oh/wow/oops' to express surprise",
    condition: (interj, context) => context.emotion === "surprise" && !["oh","wow","oops"].includes(interj.form),
    correction: () => "wow"
});

/* ==========================================================
   Joy Interjections
========================================================== */

addInterjectionRule({
    description: "Use 'yay/hooray/bravo' to express joy",
    condition: (interj, context) => context.emotion === "joy" && !["yay","hooray","bravo"].includes(interj.form),
    correction: () => "yay"
});

/* ==========================================================
   Pain Interjections
========================================================== */

addInterjectionRule({
    description: "Use 'ouch/ow/ugh' to express pain",
    condition: (interj, context) => context.emotion === "pain" && !["ouch","ow","ugh"].includes(interj.form),
    correction: () => "ouch"
});

/* ==========================================================
   Greeting Interjections
========================================================== */

addInterjectionRule({
    description: "Use 'hey/hi/hello' for greeting",
    condition: (interj, context) => context.emotion === "greeting" && !["hey","hi","hello"].includes(interj.form),
    correction: () => "hello"
});

/* ==========================================================
   Hesitation Interjections
========================================================== */

addInterjectionRule({
    description: "Use 'um/uh/er' for hesitation",
    condition: (interj, context) => context.emotion === "hesitation" && !["um","uh","er"].includes(interj.form),
    correction: () => "um"
});

/* ==========================================================
   Register Rules
========================================================== */

GrammarEngine.registerRules(
    "interjectionRules",
    interjectionRules
);

window.interjectionRules = interjectionRules;
