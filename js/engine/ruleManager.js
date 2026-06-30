"use strict";

/* ==========================================================
   English-Bot
   Rule Manager
   Version 6.2 (Engine Compatible)
========================================================== */

class RuleManager {

    constructor() {
        this.rules = [];
        this.categories = new Map();
    }

    /* ======================================================
       Register (Required by GrammarEngine)
    ====================================================== */

    register(rule) {
        this.add(rule);
    }

    /* ======================================================
       Add Rule
    ====================================================== */

    add(rule) {

        if (!(rule instanceof GrammarRule)) {
            console.error("[RuleManager] Invalid Grammar Rule:", rule);
            return;
        }

        this.rules.push(rule);
        this.sort();
    }

    /* ======================================================
       Get All Rules
    ====================================================== */

    getRules() {
        return this.rules;
    }

    /* ======================================================
       Remove Rule
    ====================================================== */

    remove(id) {
        this.rules = this.rules.filter(rule => rule.id !== id);
    }

    /* ======================================================
       Enable / Disable
    ====================================================== */

    enable(id) {
        const rule = this.get(id);
        if (rule) rule.enabled = true;
    }

    disable(id) {
        const rule = this.get(id);
        if (rule) rule.enabled = false;
    }

    /* ======================================================
       Get Rule
    ====================================================== */

    get(id) {
        return this.rules.find(rule => rule.id === id);
    }

    /* ======================================================
       Categories
    ====================================================== */

    registerCategory(name) {
        if (!this.categories.has(name)) {
            this.categories.set(name, []);
        }
    }

    addToCategory(category, rule) {
        this.registerCategory(category);
        this.categories.get(category).push(rule);
    }

    /* ======================================================
       Sort
    ====================================================== */

    sort() {
        this.rules.sort((a, b) => a.priority - b.priority);
    }

    /* ======================================================
       Execute Rules
    ====================================================== */

    execute(sentence, analysis, tokens = []) {

        let output = sentence;

        const issues = [];

        const suggestions = [];

        for (const rule of this.rules) {

            if (!rule.enabled) continue;

            if (rule.test(output, analysis, tokens)) {

                const result = rule.fix(output, analysis, tokens);

                if (result?.text) {
                    output = result.text;
                }

                if (result?.issue) {

                    issues.push({

                        id: rule.id,

                        name: rule.name,

                        category: rule.category,

                        severity: rule.severity,

                        reason: result.reason || rule.description,

                        explanation: result.explanation || "",

                        correction: result.text || ""

                    });

                }

                if (result?.suggestions) {

                    suggestions.push({

                        rule: rule.name,

                        options: result.suggestions

                    });

                }

            }

        }

        return {

            text: output,

            issues,

            suggestions,

            report: this.generateReport(issues),

            evaluation: this.evaluateWriting(output, issues)

        };

    }

    /* ======================================================
       Report
    ====================================================== */

    generateReport(issues) {

        const report = {};

        for (const issue of issues) {

            report[issue.category] = (report[issue.category] || 0) + 1;

        }

        return report;

    }

    /* ======================================================
       Writing Evaluation
    ====================================================== */

    evaluateWriting(text, issues) {

        const grammar =
            Math.max(100 - issues.length * 10, 0);

        const vocabulary =
            Math.min(
                100,
                60 + text.split(/\s+/).length * 2
            );

        const naturalness =
            /[.!?]/.test(text)
                ? 95
                : 85;

        const style =
            /\b(therefore|however|moreover|consequently)\b/i.test(text)
                ? 95
                : 75;

        const overall = Math.round(

            (

                grammar +

                vocabulary +

                naturalness +

                style

            ) / 4

        );

        return {

            grammar,

            vocabulary,

            naturalness,

            style,

            overall

        };

    }

}

/* ==========================================================
   Create Instance
========================================================== */

const ruleManager = new RuleManager();

window.ruleManager = ruleManager;

/* ==========================================================
   Register Manager
========================================================== */

if (window.GrammarEngine) {

    GrammarEngine.registerManager(

        "ruleManager",

        ruleManager

    );

}

/* ==========================================================
   Legacy registerRules
========================================================== */

window.registerRules = function (category, rulesArray) {

    if (!Array.isArray(rulesArray)) return;

    rulesArray.forEach(r => {

        const grammarRule = new GrammarRule({

            id:
                r.id ||
                `${category}_${Math.random().toString(36).slice(2, 10)}`,

            name:
                r.name ||
                r.description,

            category,

            description:
                r.description,

            priority:
                r.priority || 100,

            severity:
                r.severity || GrammarSeverity.ERROR,

            enabled: true,

            test:
                r.test || r.condition,

            fix:
                r.fix ||
                ((sentence, analysis) => {

                    return {

                        text:
                            r.correction(sentence, analysis),

                        issue: true,

                        reason:
                            r.description,

                        explanation:
                            "",

                        correction:
                            r.correction(sentence, analysis)

                    };

                })

        });

        ruleManager.add(grammarRule);

        ruleManager.addToCategory(

            category,

            grammarRule

        );

    });

};
