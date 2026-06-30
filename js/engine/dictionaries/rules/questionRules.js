"use strict";

/* ==========================================================
   English-Bot
   Question Rules
   Version 5.0
========================================================== */

const questionRules = [];

/* ==========================================================
   Rule Registration
========================================================== */

function addQuestionRule({
    description,
    condition,
    correction
}) {
    questionRules.push({
        description,
        condition,
        correction
    });
}

/* ==========================================================
   Yes/No Questions
========================================================== */

addQuestionRule({
    description: "Use auxiliary verb before subject in yes/no questions",
    condition: (sentence, context) => context.type === "yesNo" && !sentence.startsWithAuxiliary,
    correction: (sentence, aux) => aux + " " + sentence
});

/* ==========================================================
   Wh-Questions
========================================================== */

addQuestionRule({
    description: "Use wh-word at the beginning of wh-questions",
    condition: (sentence, context) => context.type === "wh" && !sentence.startsWithWhWord,
    correction: (sentence, whWord) => whWord + " " + sentence
});

addQuestionRule({
    description: "Follow wh-word with auxiliary verb",
    condition: (sentence, context) => context.type === "wh" && !sentence.hasAuxiliaryAfterWh,
    correction: (sentence, aux) => sentence.replace(/^(\w+)/, "$1 " + aux)
});

/* ==========================================================
   Question Word Order
========================================================== */

addQuestionRule({
    description: "Invert subject and auxiliary in questions",
    condition: (sentence, context) => context.isQuestion && !context.isInverted,
    correction: (sentence) => sentence.invertSubjectAuxiliary()
});

/* ==========================================================
   Tag Questions
========================================================== */

addQuestionRule({
    description: "Use auxiliary + subject pronoun in tag questions",
    condition: (sentence, context) => context.type === "tag" && !sentence.hasTag,
    correction: (sentence, aux, pronoun) => sentence + ", " + aux + " " + pronoun + "?"
});

/* ==========================================================
   Register Rules
========================================================== */

GrammarEngine.registerRules(
    "questionRules",
    questionRules
);

window.questionRules = questionRules;
