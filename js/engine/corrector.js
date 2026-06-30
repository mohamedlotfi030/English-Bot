"use strict";

/* ==========================================================
   English-Bot
   Corrector
   Version 6.0
========================================================== */

class Corrector {

    constructor() {
        this.corrections = [];
    }

    /* ======================================================
       Correct Sentence
    ====================================================== */

    correct(text, analysis, tokens = []) {

        this.corrections = [];

        let result = {
            text,
            issues: [],
            suggestions: [],
            report: {},
            evaluation: {}
        };

        if (
            window.ruleManager &&
            typeof window.ruleManager.execute === "function"
        ) {

            result = window.ruleManager.execute(
                text,
                analysis,
                tokens
            );

        }

        this.corrections = result.issues || [];

        return {

            text: result.text || text,

            original: text,

            corrected: result.text || text,

            issues: result.issues || [],

            suggestions: result.suggestions || [],

            report: result.report || {},

            evaluation: result.evaluation || {},

            statistics: this.generateStatistics(
                result.issues || []
            )

        };

    }

    /* ======================================================
       Statistics
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

            switch (issue.category) {

                case GrammarCategory.GRAMMAR:
                    stats.grammar++;
                    break;

                case GrammarCategory.VOCABULARY:
                    stats.vocabulary++;
                    break;

                case GrammarCategory.PUNCTUATION:
                    stats.punctuation++;
                    break;

                case GrammarCategory.STYLE:
                    stats.style++;
                    break;

            }

        }

        return stats;

    }

    /* ======================================================
       Report
    ====================================================== */

    generateReport(stats) {

        const total =
            Math.max(stats.total, 1);

        return {

            grammarPercent:
                ((stats.grammar / total) * 100).toFixed(1) + "%",

            vocabularyPercent:
                ((stats.vocabulary / total) * 100).toFixed(1) + "%",

            punctuationPercent:
                ((stats.punctuation / total) * 100).toFixed(1) + "%",

            stylePercent:
                ((stats.style / total) * 100).toFixed(1) + "%",

            overallScore:
                Math.max(
                    100 - stats.total * 5,
                    0
                ) + "%"

        };

    }

    /* ======================================================
       Alternatives
    ====================================================== */

    getAlternativeCorrections(suggestions) {

        const alternatives = [];

        for (const suggestion of suggestions) {

            if (Array.isArray(suggestion.options)) {

                alternatives.push(
                    ...suggestion.options
                );

            }

        }

        return alternatives;

    }

}

/* ==========================================================
   Singleton
========================================================== */

const corrector = new Corrector();

window.corrector = corrector;

window.Corrector = Corrector;

/* ==========================================================
   Register
========================================================== */

if (
    window.GrammarEngine &&
    typeof GrammarEngine.registerManager === "function"
) {

    GrammarEngine.registerManager(
        "corrector",
        corrector
    );

} else {

    console.warn(
        "[Corrector] GrammarEngine not found."
    );

}
