"use strict";

/* ==========================================================
   English-Bot
   Corrector Engine
   Version 7.0
========================================================== */

class Corrector {

    constructor() {
        this.lastResult = null;
    }

    /* ======================================================
       MAIN CORRECTION PIPELINE
    ====================================================== */

    correct(text, analysis = {}, tokens = []) {

        const engine = window.GrammarEngine;

        if (!engine) {
            console.warn("[Corrector] GrammarEngine not found.");
            return this.fallback(text);
        }

        const rules = engine.getAllRules?.() || [];

        let issues = [];
        let correctedText = text;

        /* Sort by priority (important in v7) */
        const sortedRules = [...rules].sort(
            (a, b) => (a.priority || 0) - (b.priority || 0)
        );

        for (const rule of sortedRules) {

            try {

                if (rule.test && rule.test(correctedText, analysis)) {

                    const before = correctedText;

                    if (rule.fix) {
                        correctedText = rule.fix(correctedText, analysis, tokens);
                    }

                    if (before !== correctedText) {

                        issues.push({
                            rule: rule.id,
                            description: rule.description,
                            type: rule.type || "general",
                            before,
                            after: correctedText
                        });

                    }
                }

            } catch (err) {
                console.warn("[Rule Error]", rule.id, err);
            }
        }

        const result = {
            text: correctedText,
            original: text,
            issues,
            suggestions: this.buildSuggestions(issues),
            report: this.buildReport(issues),
            evaluation: this.evaluate(issues)
        };

        this.lastResult = result;

        return result;
    }

    /* ======================================================
       Suggestions Builder
    ====================================================== */

    buildSuggestions(issues) {
        return issues.map(i => ({
            rule: i.rule,
            fix: i.after
        }));
    }

    /* ======================================================
       Report
    ====================================================== */

    buildReport(issues) {

        const types = {
            grammar: 0,
            vocabulary: 0,
            punctuation: 0,
            style: 0,
            word_order: 0,
            tense: 0
        };

        for (const issue of issues) {
            if (types[issue.type] !== undefined) {
                types[issue.type]++;
            }
        }

        const total = Math.max(issues.length, 1);

        return {
            grammarPercent: ((types.grammar / total) * 100).toFixed(1) + "%",
            vocabularyPercent: ((types.vocabulary / total) * 100).toFixed(1) + "%",
            punctuationPercent: ((types.punctuation / total) * 100).toFixed(1) + "%",
            stylePercent: ((types.style / total) * 100).toFixed(1) + "%",
            wordOrderPercent: ((types.word_order / total) * 100).toFixed(1) + "%",
            tensePercent: ((types.tense / total) * 100).toFixed(1) + "%",
            totalIssues: issues.length
        };
    }

    /* ======================================================
       Evaluation Score
    ====================================================== */

    evaluate(issues) {
        return {
            score: Math.max(100 - issues.length * 5, 0),
            level:
                issues.length === 0 ? "Excellent" :
                issues.length < 3 ? "Good" :
                issues.length < 6 ? "Fair" : "Weak"
        };
    }

    /* ======================================================
       Fallback Mode
    ====================================================== */

    fallback(text) {
        return {
            text,
            original: text,
            issues: [],
            suggestions: [],
            report: {},
            evaluation: {
                score: 0,
                level: "No Engine"
            }
        };
    }
}

/* ==========================================================
   SINGLETON
========================================================== */

const corrector = new Corrector();

/* ==========================================================
   EXPORT
========================================================== */

window.corrector = corrector;
window.Corrector = Corrector;

/* ==========================================================
   REGISTER TO GRAMMAR ENGINE
========================================================== */

if (
    window.GrammarEngine &&
    typeof window.GrammarEngine.registerManager === "function"
) {

    window.GrammarEngine.registerManager(
        "corrector",
        corrector
    );

    console.log("[Corrector] Registered successfully.");

} else {

    console.warn("[Corrector] GrammarEngine is not available.");

}
