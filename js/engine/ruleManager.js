"use strict";

/* ==========================================================
   English-Bot
   Rule Manager
   Version 7.0
========================================================== */

class RuleManager {

    constructor() {

        this.rules = [];

        this.categories = new Map();

    }

    /* ======================================================
       Register
    ====================================================== */

    register(rule) {

        return this.add(rule);

    }

    /* ======================================================
       Add Rule
    ====================================================== */

    add(rule) {

        if (!(rule instanceof GrammarRule)) {

            console.error("[RuleManager] Invalid Grammar Rule:", rule);

            return false;

        }

        if (this.rules.some(r => r.id === rule.id)) {

            console.warn(`[RuleManager] Duplicate rule skipped: ${rule.id}`);

            return false;

        }

        this.rules.push(rule);

        this.sort();

        return true;

    }

    /* ======================================================
       Get Rules
    ====================================================== */

    getRules() {

        return this.rules;

    }

    /* ======================================================
       Get Rule
    ====================================================== */

    get(id) {

        return this.rules.find(rule => rule.id === id);

    }

    /* ======================================================
       Remove Rule
    ====================================================== */

    remove(id) {

        this.rules = this.rules.filter(rule => rule.id !== id);

    }

    /* ======================================================
       Clear
    ====================================================== */

    clear() {

        this.rules = [];

        this.categories.clear();

    }

    /* ======================================================
       Enable Rule
    ====================================================== */

    enable(id) {

        const rule = this.get(id);

        if (rule) {

            rule.enabled = true;

        }

    }

    /* ======================================================
       Disable Rule
    ====================================================== */

    disable(id) {

        const rule = this.get(id);

        if (rule) {

            rule.enabled = false;

        }

    }

    /* ======================================================
       Register Category
    ====================================================== */

    registerCategory(name) {

        if (!this.categories.has(name)) {

            this.categories.set(name, []);

        }

    }

    /* ======================================================
       Add To Category
    ====================================================== */

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

            if (!rule.enabled) {

                continue;

            }

            try {

                if (!rule.test(output, analysis, tokens)) {

                    continue;

                }

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

            } catch (err) {

                console.error(`[Rule Error] ${rule.id}`, err);

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
       Generate Report
    ====================================================== */

    generateReport(issues) {

        const report = {};

        for (const issue of issues) {

            report[issue.category] =

                (report[issue.category] || 0) + 1;

        }

        return report;

    }

    /* ======================================================
       Statistics
    ====================================================== */

    statistics() {

        return {

            rules: this.rules.length,

            categories: this.categories.size

        };

    }

    /* ======================================================
       Writing Evaluation
    ====================================================== */

    evaluateWriting(text, issues) {

        const grammar = Math.max(

            100 - issues.length * 10,

            0

        );

        const vocabulary = Math.min(

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

    if (!Array.isArray(rulesArray)) {

        return;

    }

    rulesArray.forEach(r => {

        const grammarRule =

            r instanceof GrammarRule

                ? r

                : new GrammarRule({

                    id:

                        r.id ||

                        `${category}_${Math.random().toString(36).slice(2, 10)}`,

                    name:

                        r.name ||

                        r.description,

                    category:

                        r.category ||

                        category,

                    description:

                        r.description || "",

                    priority:

                        r.priority || 100,

                    severity:

                        r.severity ||

                        GrammarSeverity.ERROR,

                    enabled:

                        r.enabled !== false,

                    test:

                        r.test ||

                        r.condition ||

                        (() => false),

                    fix:

                        r.fix ||

                        ((sentence, analysis, tokens) => ({

                            text:

                                typeof r.correction === "function"

                                    ? r.correction(sentence, analysis, tokens)

                                    : sentence,

                            issue: true,

                            reason:

                                r.description || "",

                            explanation: "",

                            correction:

                                typeof r.correction === "function"

                                    ? r.correction(sentence, analysis, tokens)

                                    : sentence

                        }))

                });

        if (ruleManager.add(grammarRule)) {

            ruleManager.addToCategory(

                grammarRule.category,

                grammarRule

            );

        }

    });

};
