"use strict";

/* ==========================================================
   English-Bot
   Passive Voice Rules
   Version 5.0
========================================================== */

const passiveRules = [];

/* ==========================================================
   Rule Registration
========================================================== */

function addPassiveRule({
    description,
    condition,
    correction
}) {
    passiveRules.push({
        description,
        condition,
        correction
    });
}

/* ==========================================================
   Present Passive
========================================================== */

addPassiveRule({
    description: "Use 'is/are + past participle' for present passive",
    condition: (verb, context) => context.tense === "present" && context.isPassive && !verb.form.includes("is") && !verb.form.includes("are"),
    correction: (verb, subject) => subject.isSingular ? "is " + verb.pastParticiple : "are " + verb.pastParticiple
});

/* ==========================================================
   Past Passive
========================================================== */

addPassiveRule({
    description: "Use 'was/were + past participle' for past passive",
    condition: (verb, context) => context.tense === "past" && context.isPassive && !verb.form.includes("was") && !verb.form.includes("were"),
    correction: (verb, subject) => subject.isSingular ? "was " + verb.pastParticiple : "were " + verb.pastParticiple
});

/* ==========================================================
   Future Passive
========================================================== */

addPassiveRule({
    description: "Use 'will be + past participle' for future passive",
    condition: (verb, context) => context.tense === "future" && context.isPassive && !verb.form.includes("will be"),
    correction: (verb) => "will be " + verb.pastParticiple
});

/* ==========================================================
   Perfect Passive
========================================================== */

addPassiveRule({
    description: "Use 'has/have been + past participle' for present perfect passive",
    condition: (verb, context) => context.tense === "presentPerfect" && context.isPassive && !verb.form.includes("been"),
    correction: (verb, subject) => subject.isSingular ? "has been " + verb.pastParticiple : "have been " + verb.pastParticiple
});

addPassiveRule({
    description: "Use 'had been + past participle' for past perfect passive",
    condition: (verb, context) => context.tense === "pastPerfect" && context.isPassive && !verb.form.includes("been"),
    correction: (verb) => "had been " + verb.pastParticiple
});

/* ==========================================================
   Register Rules
========================================================== */

GrammarEngine.registerRules(
    "passiveRules",
    passiveRules
);

window.passiveRules = passiveRules;
