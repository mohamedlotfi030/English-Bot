"use strict";

/* ==========================================================
   English-Bot
   Reported Speech Rules
   Version 7.0 (Clean Compatible)
========================================================== */

const reportedSpeechRules = [];

/* ==========================================================
   Helper
========================================================== */

function addReportedSpeechRule(rule) {
    reportedSpeechRules.push(rule);
}

/* ==========================================================
   Tense Backshift Rules
========================================================== */

addReportedSpeechRule({
    id: "reported_backshift_present",
    category: "REPORTED_SPEECH",
    priority: 300,

    test(sentence, context) {
        return context.isReported && context.tense === "present";
    },

    fix(verb) {
        return {
            text: verb.toPastForm?.() || verb.form,
            issue: true,
            reason: "Backshift present → past in reported speech"
        };
    }
});


addReportedSpeechRule({
    id: "reported_backshift_continuous",
    category: "REPORTED_SPEECH",
    priority: 290,

    test(sentence, context) {
        return context.isReported && context.tense === "presentContinuous";
    },

    fix(verb) {
        return {
            text: verb.toPastContinuous?.() || verb.form,
            issue: true
        };
    }
});


addReportedSpeechRule({
    id: "reported_backshift_perfect",
    category: "REPORTED_SPEECH",
    priority: 280,

    test(sentence, context) {
        return context.isReported && context.tense === "presentPerfect";
    },

    fix(verb) {
        return {
            text: verb.toPastPerfect?.() || verb.form,
            issue: true
        };
    }
});

/* ==========================================================
   Pronoun Shift
========================================================== */

addReportedSpeechRule({
    id: "reported_pronouns",
    category: "REPORTED_SPEECH",
    priority: 260,

    test(word, context) {
        return context.isReported && word.isPronoun;
    },

    fix(word) {
        return {
            text: word.toReportedForm?.() || word.form,
            issue: true,
            reason: "Pronoun shift in reported speech"
        };
    }
});

/* ==========================================================
   Time & Place Shift
========================================================== */

addReportedSpeechRule({
    id: "reported_time_expressions",
    category: "REPORTED_SPEECH",
    priority: 250,

    test(word, context) {
        return context.isReported && word.isTimeExpression;
    },

    fix(word) {
        return {
            text: word.toReportedTime?.() || word.form,
            issue: true
        };
    }
});

addReportedSpeechRule({
    id: "reported_here_there",
    category: "REPORTED_SPEECH",
    priority: 240,

    test(word, context) {
        return context.isReported && word.form === "here";
    },

    fix() {
        return {
            text: "there",
            issue: true
        };
    }
});

/* ==========================================================
   Questions → Reported Speech
========================================================== */

addReportedSpeechRule({
    id: "reported_yesno_question",
    category: "REPORTED_SPEECH",
    priority: 220,

    test(sentence, context) {
        return context.isReported && context.type === "yesNoQuestion";
    },

    fix(sentence) {
        return {
            text: "if " + (sentence.toStatementForm?.() || sentence),
            issue: true,
            reason: "Yes/No question → if clause"
        };
    }
});

addReportedSpeechRule({
    id: "reported_wh_question",
    category: "REPORTED_SPEECH",
    priority: 210,

    test(sentence, context) {
        return context.isReported && context.type === "whQuestion";
    },

    fix(sentence) {
        return {
            text: sentence.toStatementForm?.() || sentence,
            issue: true,
            reason: "Wh-question → statement form"
        };
    }
});

/* ==========================================================
   Register Rules
========================================================== */

GrammarEngine.registerMany(reportedSpeechRules);

window.reportedSpeechRules = reportedSpeechRules;
