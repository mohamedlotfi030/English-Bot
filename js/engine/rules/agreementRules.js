"use strict";

/* ==========================================================
   English-Bot
   Agreement Rules v9 (Production Ready)
   - Adheres to current Analyzer/Corrector architecture
   - Independent Rule-based logic
========================================================== */

/**
 * Rule: Subject-Verb Agreement (To Be)
 * Checks the agreement between subject and 'to be' verbs (is, am, are)
 */
const subject_verb_agreement_rule = new GrammarRule({
    id: "subject_verb_agreement_rule",
    name: "Subject-Verb Agreement",
    description: "Detects incorrect agreement between subject and verb (is, am, are).",
    category: GrammarCategory.AGREEMENT,
    severity: GrammarSeverity.ERROR,
    priority: 10,
    enabled: true,

    test(text, analysis, tokens) {
        // نعتمد على المتاح في الـ analysis كما هو في المحرك الحالي
        const subject = analysis.subject ? analysis.subject.toLowerCase() : "";
        const verb = analysis.verbForm ? analysis.verbForm.toLowerCase() : "";

        if (!subject || !verb) return false;

        // حالات الخطأ
        if (subject === "i" && (verb === "is" || verb === "are")) return true;
        if (["he", "she", "it"].includes(subject) && verb === "are") return true;
        if (["we", "you", "they"].includes(subject) && (verb === "is" || verb === "am")) return true;

        return false;
    },

    fix(text, analysis, tokens) {
        const subject = analysis.subject ? analysis.subject.toLowerCase() : "";
        let correctedVerb = "";

        // تحديد الفعل الصحيح بناءً على الفاعل
        if (subject === "i") correctedVerb = "am";
        else if (["he", "she", "it"].includes(subject)) correctedVerb = "is";
        else if (["we", "you", "they"].includes(subject)) correctedVerb = "are";

        // الـ Corrector الحالي يحتاج النص كاملاً
        // هنا نقوم بتبديل الفعل الخاطئ بالصحيح في النص
        const regex = new RegExp(`\\b${analysis.verbForm}\\b`, 'i');
        const newText = text.replace(regex, correctedVerb);

        return {
            text: newText,
            issue: true,
            reason: `Subject '${subject}' does not agree with verb '${analysis.verbForm}'.`
        };
    }
});

/* ==========================================================
   REGISTRATION
========================================================== */

GrammarEngine.registerRules([
    subject_verb_agreement_rule
]);
