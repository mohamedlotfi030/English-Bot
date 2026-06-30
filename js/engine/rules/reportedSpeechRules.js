"use strict";

/* ==========================================================
   English-Bot
   Reported Speech Rules
   Version 5.0
========================================================== */

const reportedSpeechRules = [];

/* ==========================================================
   Rule Registration
========================================================== */

function addReportedSpeechRule({
    description,
    condition,
    correction
}) {
    reportedSpeechRules.push({
        description,
        condition,
        correction
    });
}

/* ==========================================================
   Tense Backshift
========================================================== */

addReportedSpeechRule({
    description: "Backshift present simple to past simple in reported speech",
    condition: (verb, context) => context.isReported && verb.tense === "present",
    correction: (verb) => verb.toPastForm()
});

addReportedSpeechRule({
    description: "Backshift present continuous to past continuous",
    condition: (verb, context) => context.isReported && verb.tense === "presentContinuous",
    correction: (verb) => verb.toPastContinuous()
});

addReportedSpeechRule({
    description: "Backshift present perfect to past perfect",
    condition: (verb, context) => context.isReported && verb.tense === "presentPerfect",
    correction: (verb) => verb.toPastPerfect()
});

/* ==========================================================
   Pronoun Changes
========================================================== */

addReportedSpeechRule({
    description: "Change pronouns to match perspective in reported speech",
    condition: (word, context) => context.isReported && word.isPronoun,
    correction: (word) => word.toReportedForm()
});

/* ==========================================================
   Time/Place Changes
========================================================== */

addReportedSpeechRule({
    description: "Change 'today' → 'that day', 'tomorrow' → 'the next day', etc.",
    condition: (word, context) => context.isReported && word.isTimeExpression,
    correction: (word) => word.toReportedTime()
});

addReportedSpeechRule({
    description: "Change 'here' → 'there' in reported speech",
    condition: (word, context) => context.isReported && word.form === "here",
    correction: () => "there"
});

/* ==========================================================
   Questions in Reported Speech
========================================================== */

addReportedSpeechRule({
    description: "Convert yes/no questions to 'if/whether' clauses",
    condition: (sentence, context) => context.isReported && context.type === "yesNoQuestion",
    correction: (sentence) => "if " + sentence.toStatementForm()
});

addReportedSpeechRule({
    description: "Convert wh-questions to statement word order",
    condition: (sentence, context) => context.isReported && context.type === "whQuestion",
    correction: (sentence) => sentence.toStatementForm()
});

/* ==========================================================
   Register Rules
========================================================== */

GrammarEngine.registerRules(
    "reportedSpeechRules",
    reportedSpeechRules
);

window.reportedSpeechRules = reportedSpeechRules;
