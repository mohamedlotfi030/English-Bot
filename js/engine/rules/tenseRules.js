"use strict";

/* ==========================================================
   English-Bot
   Tense Rules v9 (Production Ready)
   - Rule-based architecture
   - Handles temporal consistency and tense correction
========================================================== */

/**
 * قاعدة عامة للأزمنة (Tense Rule Template)
 * نقوم بإنشاء مصفوفة من القواعد بناءً على أنواع الأزمنة المدعومة.
 */
const tenseConfigs = [
    { id: "present_simple", check: "isHabitOrFact", target: "isPresentSimple", fix: "toPresentSimple" },
    { id: "present_continuous", check: "isActionNow", target: "isPresentContinuous", fix: "toPresentContinuous" },
    { id: "past_simple", check: "isCompletedPast", target: "isPastSimple", fix: "toPastSimple" },
    { id: "past_continuous", check: "isOngoingPast", target: "isPastContinuous", fix: "toPastContinuous" },
    { id: "future_simple", check: "isFuturePrediction", target: "isFutureSimple", fix: "toFutureSimple" },
    { id: "future_continuous", check: "isFutureOngoing", target: "isFutureContinuous", fix: "toFutureContinuous" },
    { id: "present_perfect", check: "isPresentRelevance", target: "isPresentPerfect", fix: "toPresentPerfect" },
    { id: "past_perfect", check: "isPastBeforePast", target: "isPastPerfect", fix: "toPastPerfect" },
    { id: "future_perfect", check: "isFutureBeforeFuture", target: "isFuturePerfect", fix: "toFuturePerfect" }
];

const tenseRules = tenseConfigs.map(cfg => new GrammarRule({
    id: `tense_${cfg.id}`,
    name: `Tense Correction: ${cfg.id}`,
    category: GrammarCategory.TENSE,
    severity: GrammarSeverity.ERROR,
    priority: 50,
    enabled: true,

    test(text, analysis, tokens) {
        // التحقق مما إذا كان السياق يتطلب زمناً مختلفاً عما هو موجود
        return analysis[cfg.check] && !analysis[cfg.target];
    },

    fix(text, analysis, tokens) {
        // استخدام وظائف المحرك لتحويل الصيغة (مثلاً toPresentSimple)
        const transformedText = analysis[cfg.fix]?.() || text;
        return {
            text: transformedText,
            issue: true,
            reason: `Use ${cfg.id.replace('_', ' ')} for the current context.`
        };
    }
}));

/* ==========================================================
   REGISTRATION
========================================================== */

GrammarEngine.registerRules(tenseRules);
