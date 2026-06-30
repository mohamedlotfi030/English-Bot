"use strict";

/* ==========================================================
   English-Bot
   Agreement Rules
   Version 6.0
========================================================== */

const agreementRules = [];

/* ==========================================================
   Helper
========================================================== */

function addAgreementRule(rule) {

    agreementRules.push(rule);

}

/* ==========================================================
   I + am
========================================================== */

addAgreementRule({

    id: "agreement_i_am",

    name: "I takes am",

    category: GrammarCategory.AGREEMENT,

    description: "Use am with I",

    priority: 10,

    test(sentence, analysis) {

        return /^i\s+is\b/i.test(sentence);

    },

    fix(sentence) {

        return {

            text: sentence.replace(/^i\s+is\b/i, "I am"),

            issue: true,

            reason: "I must use am."

        };

    }

});

/* ==========================================================
   He / She / It + is
========================================================== */

addAgreementRule({

    id: "agreement_is",

    name: "Singular be",

    category: GrammarCategory.AGREEMENT,

    description: "Singular subject takes is",

    priority: 20,

    test(sentence) {

        return /^(he|she|it)\s+are\b/i.test(sentence);

    },

    fix(sentence) {

        return {

            text: sentence.replace(

                /^(he|she|it)\s+are\b/i,

                "$1 is"

            ),

            issue: true,

            reason: "Singular subject requires is."

        };

    }

});

/* ==========================================================
   We / You / They + are
========================================================== */

addAgreementRule({

    id: "agreement_are",

    name: "Plural be",

    category: GrammarCategory.AGREEMENT,

    description: "Plural subject takes are",

    priority: 30,

    test(sentence) {

        return /^(we|you|they)\s+is\b/i.test(sentence);

    },

    fix(sentence) {

        return {

            text: sentence.replace(

                /^(we|you|they)\s+is\b/i,

                "$1 are"

            ),

            issue: true,

            reason: "Plural subject requires are."

        };

    }

});

/* ==========================================================
   Register
========================================================== */

GrammarEngine.registerRules(

    agreementRules

);

window.agreementRules = agreementRules;
