"use strict";

/* ==========================================================
   English-Bot
   Corrector (Enhanced)
   Version 5.0
========================================================== */

class Corrector {
    constructor() {
        this.corrections = [];
    }

    /* ======================================================
       Correct Sentence
    ====================================================== */
    correct(text, analysis) {
        this.corrections = [];

        // تنفيذ القواعد عبر RuleManager
        const result = ruleManager.execute(text, analysis);

        // حفظ التصحيحات
        this.corrections = result.issues;

        // بناء التقرير النهائي
        return this.buildCorrectionResult(text, result.text, result.issues, result.suggestions, result.report);
    }

    /* ======================================================
       Build Correction Result
    ====================================================== */
    buildCorrectionResult(original, corrected, issues, suggestions, report) {
        return {
            original,
            corrected,
            issues,
            suggestions,
            report,
            statistics: this.generateStatistics(issues)
        };
    }

    /* ======================================================
       Generate Statistics
    ====================================================== */
    generateStatistics(issues) {
        const stats = {
            grammar: 0,
            vocabulary: 0,
            punctuation: 0,
            style: 0,
            total: issues.length
        };

        for (const issue of issues) {
            if (issue.category === GrammarCategory.GRAMMAR) stats.grammar++;
            if (issue.category === GrammarCategory.VOCABULARY) stats.vocabulary++;
            if (issue.category === GrammarCategory.PUNCTUATION) stats.punctuation++;
            if (issue.category === GrammarCategory.STYLE) stats.style++;
        }

        return stats;
    }
    /* ======================================================
       Generate Report
    ====================================================== */
    generateReport(stats) {
        const total = stats.total || 1;
        return {
            grammarPercent: ((stats.grammar / total) * 100).toFixed(1) + "%",
            vocabularyPercent: ((stats.vocabulary / total) * 100).toFixed(1) + "%",
            punctuationPercent: ((stats.punctuation / total) * 100).toFixed(1) + "%",
            stylePercent: ((stats.style / total) * 100).toFixed(1) + "%",
            overallScore: (100 - (stats.total * 5)) + "%" // مثال: كل خطأ يقلل 5%
        };
    }

    /* ======================================================
       Alternative Corrections
    ====================================================== */
    getAlternativeCorrections(suggestions) {
        const alternatives = [];
        for (const s of suggestions) {
            alternatives.push(...s.options);
        }
        return alternatives;
    }
}

/* ==========================================================
   Export
========================================================== */

const corrector = new Corrector();
window.corrector = corrector;

GrammarEngine.registerManager("corrector", corrector);
