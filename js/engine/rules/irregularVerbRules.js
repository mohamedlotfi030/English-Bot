"use strict";

/* ==========================================================
   English-Bot
   Irregular Verb Rules v9 (Production Ready)
   - Rule-based architecture
   - Handles Past and Perfect tense irregularities
========================================================== */

/**
 * Rule: Irregular Verb Correction
 * Validates and corrects past and participle forms of irregular verbs.
 */
const irregular_verb_rule = new GrammarRule({
    id: "irregular_verb_rule",
    name: "Irregular Verb Correction",
    category: GrammarCategory.VERB,
    severity: GrammarSeverity.ERROR,
    priority: 10,
    enabled: true,

    // الجدول المرجعي (يمكن نقله لاحقاً إلى RuleUtils.js)
    lexicon: {
        go: { past: "went", pp: "gone" },
        see: { past: "saw", pp: "seen" },
        eat: { past: "ate", pp: "eaten" },
        take: { past: "took", pp: "taken" }
    },

    test(text, analysis, tokens) {
        if (!analysis.verbs || analysis.verbs.length === 0) return false;
        
        return analysis.verbs.some(v => {
            const base = v.base || v.lower;
            const entry = this.lexicon[base];
            if (!entry) return false;

            if (analysis.tense === "past" && v.form !== entry.past) return true;
            if (analysis.tense.includes("Perfect") && v.form !== entry.pp) return true;
            
            return false;
        });
    },

    fix(text, analysis, tokens) {
        let newText = text;
        
        analysis.verbs.forEach(v => {
            const base = v.base || v.lower;
            const entry = this.lexicon[base];
            if (!entry) return;

            let correctForm = "";
            if (analysis.tense === "past") correctForm = entry.past;
            else if (analysis.tense.includes("Perfect")) correctForm = entry.pp;

            if (correctForm) {
                newText = newText.replace(new RegExp(`\\b${v.form}\\b`, 'gi'), correctForm);
            }
        });

        return {
            text: newText,
            issue: true,
            reason: "Incorrect irregular verb form used for the specified tense."
        };
    }
});

/* ==========================================================
   REGISTRATION
========================================================== */

GrammarEngine.registerRules([
    irregular_verb_rule
]);
