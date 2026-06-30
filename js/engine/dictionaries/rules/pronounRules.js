"use strict";

/* ==========================================================
   English-Bot
   Pronoun Rules
   Version 5.0
========================================================== */

const pronounRules = [];

/* ==========================================================
   Rule Registration
========================================================== */

function addPronounRule({
    description,
    condition,
    correction
}) {
    pronounRules.push({
        description,
        condition,
        correction
    });
}

/* ==========================================================
   Subject Pronouns
========================================================== */

addPronounRule({
    description: "Use subject pronouns (I, you, he, she, it, we, they) before verbs",
    condition: (word, context) => context.isSubject && !word.isSubjectPronoun,
    correction: (word) => word.toSubjectPronoun()
});

/* ==========================================================
   Object Pronouns
========================================================== */

addPronounRule({
    description: "Use object pronouns (me, you, him, her, it, us, them) after verbs or prepositions",
    condition: (word, context) => context.isObject && !word.isObjectPronoun,
    correction: (word) => word.toObjectPronoun()
});

/* ==========================================================
   Possessive Pronouns
========================================================== */

addPronounRule({
    description: "Use possessive pronouns (mine, yours, his, hers, ours, theirs) correctly",
    condition: (word, context) => context.isPossessive && !word.isPossessivePronoun,
    correction: (word) => word.toPossessivePronoun()
});

/* ==========================================================
   Reflexive Pronouns
========================================================== */

addPronounRule({
    description: "Use reflexive pronouns (myself, yourself, himself, herself, itself, ourselves, themselves) after reflexive verbs",
    condition: (word, context) => context.isReflexive && !word.isReflexivePronoun,
    correction: (word) => word.toReflexivePronoun()
});

/* ==========================================================
   Consistency Check
========================================================== */

addPronounRule({
    description: "Ensure pronoun agrees with antecedent in number and gender",
    condition: (sentence, context) => context.hasPronounMismatch,
    correction: (sentence) => sentence.fixPronounAgreement()
});

/* ==========================================================
   Register Rules
========================================================== */

GrammarEngine.registerRules(
    "pronounRules",
    pronounRules
);

window.pronounRules = pronounRules;
