"use strict";

/* ==========================================================
   English-Bot
   Agreement Rules
   Version 5.0
========================================================== */

const agreementRules = [];

/* ==========================================================
   Rule Registration
========================================================== */

function addAgreementRule({
    description,
    condition,
    correction
}) {
    agreementRules.push({
        description,
        condition,
        correction
    });
}

/* ==========================================================
   Singular vs. Plural Subjects
========================================================== */

addAgreementRule({
    description: "Singular subject takes singular verb",
    condition: (subject, verb) => subject.isSingular && !verb.isSingular,
    correction: (verb) => verb.toSingular()
});

addAgreementRule({
    description: "Plural subject takes plural verb",
    condition: (subject, verb) => subject.isPlural && !verb.isPlural,
    correction: (verb) => verb.toPlural()
});

/* ==========================================================
   Third Person Singular
========================================================== */

addAgreementRule({
    description: "Third person singular subject requires -s verb form",
    condition: (subject, verb) => subject.person === 3 && subject.isSingular && !verb.endsWith("s"),
    correction: (verb) => verb.addS()
});

/* ==========================================================
   'Be' Verb Agreement
========================================================== */

addAgreementRule({
    description: "Use 'is' with singular subject",
    condition: (subject, verb) => subject.isSingular && verb.base === "be" && verb.form !== "is",
    correction: () => "is"
});

addAgreementRule({
    description: "Use 'are' with plural subject",
    condition: (subject, verb) => subject.isPlural && verb.base === "be" && verb.form !== "are",
    correction: () => "are"
});

/* ==========================================================
   Register Rules
========================================================== */

GrammarEngine.registerRules(agreementRules);

window.agreementRules = agreementRules;
