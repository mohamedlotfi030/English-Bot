"use strict";

/* ==========================================================
   English-Bot
   Pronoun Rules
   Version 6.0
========================================================== */

const pronounRules = [];

/* ==========================================================
   Helper
========================================================== */

function addPronounRule(rule) {
    pronounRules.push(rule);
}

/* ==========================================================
   Me -> I
========================================================== */

addPronounRule({

    id: "pronoun_me_i",

    name: "Use I as subject",

    category: GrammarCategory.PRONOUN,

    description: "Use 'I' instead of 'me' as the subject.",

    priority: 10,

    test(sentence) {
        return /^me\s+/i.test(sentence);
    },

    fix(sentence) {

        return {

            text: sentence.replace(/^me\b/i, "I"),

            issue: true,

            reason: "'I' should be used as the subject."

        };

    }

});

/* ==========================================================
   Him -> He
========================================================== */

addPronounRule({

    id: "pronoun_him_he",

    name: "Use He as subject",

    category: GrammarCategory.PRONOUN,

    description: "Use 'He' instead of 'Him' as the subject.",

    priority: 20,

    test(sentence) {
        return /^him\s+/i.test(sentence);
    },

    fix(sentence) {

        return {

            text: sentence.replace(/^him\b/i, "He"),

            issue: true,

            reason: "'He' should be used as the subject."

        };

    }

});

/* ==========================================================
   Her -> She
========================================================== */

addPronounRule({

    id: "pronoun_her_she",

    name: "Use She as subject",

    category: GrammarCategory.PRONOUN,

    description: "Use 'She' instead of 'Her' as the subject.",

    priority: 30,

    test(sentence) {
        return /^her\s+/i.test(sentence);
    },

    fix(sentence) {

        return {

            text: sentence.replace(/^her\b/i, "She"),

            issue: true,

            reason: "'She' should be used as the subject."

        };

    }

});

/* ==========================================================
   Us -> We
========================================================== */

addPronounRule({

    id: "pronoun_us_we",

    name: "Use We as subject",

    category: GrammarCategory.PRONOUN,

    description: "Use 'We' instead of 'Us' as the subject.",

    priority: 40,

    test(sentence) {
        return /^us\s+/i.test(sentence);
    },

    fix(sentence) {

        return {

            text: sentence.replace(/^us\b/i, "We"),

            issue: true,

            reason: "'We' should be used as the subject."

        };

    }

});

/* ==========================================================
   Them -> They
========================================================== */

addPronounRule({

    id: "pronoun_them_they",

    name: "Use They as subject",

    category: GrammarCategory.PRONOUN,

    description: "Use 'They' instead of 'Them' as the subject.",

    priority: 50,

    test(sentence) {
        return /^them\s+/i.test(sentence);
    },

    fix(sentence) {

        return {

            text: sentence.replace(/^them\b/i, "They"),

            issue: true,

            reason: "'They' should be used as the subject."

        };

    }

});

/* ==========================================================
   Register Rules
========================================================== */

GrammarEngine.registerRules(pronounRules);

window.pronounRules = pronounRules;
