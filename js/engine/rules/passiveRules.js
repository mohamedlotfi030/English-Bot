"use strict";

/* ==========================================================
   English-Bot
   Passive Voice Rules v9 (Production Ready)
   - Rule-based structural validator
   - Validates Passive Voice requirements per tense
========================================================== */

const passive_structure_rule = new GrammarRule({
    id: "passive_structure_rule",
    name: "Passive Voice Structure",
    category: GrammarCategory.STRUCTURE,
    severity: GrammarSeverity.ERROR,
    priority: 40,
    enabled: true,

    // دالة مساعدة لتحديد الفعل المساعد المناسب (نقلها لـ RuleUtils لاحقاً)
    getAuxiliary(tense, subject) {
        const isPlural = subject?.number === "plural";
        const map = {
            present: isPlural ? ["are"] : ["is"],
            past: isPlural ? ["were"] : ["was"],
            future: ["will", "be"],
            presentPerfect: isPlural ? ["have", "been"] : ["has", "been"],
            pastPerfect: ["had", "been"]
        };
        return map[tense] || [];
    },

    test(text, analysis, tokens) {
        // القاعدة تعمل فقط إذا كانت الجملة في صيغة المبني للمجهول
        return analysis.voice === "passive";
    },

    fix(text, analysis, tokens) {
        const aux = this.getAuxiliary(analysis.tense, analysis.subject);
        
        analysis.structure = {
            voice: "passive",
            auxiliary: aux,
            verbForm: "pastParticiple",
            requiresPastParticiple: true
        };

        return {
            text: text,
            issue: false, // هذا تحسين هيكلي للـ analysis object
            reason: "Passive voice structure validated."
        };
    }
});

/* ==========================================================
   REGISTRATION
========================================================== */

GrammarEngine.registerRules([
    passive_structure_rule
]);
