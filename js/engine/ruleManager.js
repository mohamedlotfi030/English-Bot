"use strict";

/* ==========================================================
   English-Bot
   RuleManager
   Version 9.0
========================================================== */

class RuleManager {

    constructor() {

        /* ==========================================
           Storage
        ========================================== */

        this.rules = [];

        this.categories = new Map();

    }

    /* ======================================================
       ADD RULE
    ====================================================== */

    add(rule) {

        if (!rule) return false;

        /* ------------------------------------------
           Convert Legacy Rule
        ------------------------------------------ */

        if (!(rule instanceof GrammarRule)) {

            rule = new GrammarRule({

                id:
                    rule.id ??
                    ("rule_" + Math.random().toString(36).slice(2)),

                name:
                    rule.name ??
                    rule.description ??
                    "Unnamed Rule",

                category:
                    rule.category ??
                    GrammarCategory.GRAMMAR,

                description:
                    rule.description ?? "",

                priority:
                    Number(rule.priority ?? 100),

                severity:
                    rule.severity ??
                    GrammarSeverity.ERROR,

                enabled:
                    rule.enabled !== false,

                test:
                    rule.test ??
                    rule.condition ??
                    (() => false),

                fix:

                    rule.fix ??

                    ((text, analysis, tokens) => {

                        if (typeof rule.correction === "function") {

                            const result =
                                rule.correction(
                                    text,
                                    analysis,
                                    tokens
                                );

                            return {

                                text: result ?? text,

                                issue:
                                    result !== text

                            };

                        }

                        return {

                            text,

                            issue: false

                        };

                    })

            });

        }

        /* ------------------------------------------
           Duplicate Check
        ------------------------------------------ */

        if (this.rules.some(r => r.id === rule.id)) {

            console.warn(

                `[RuleManager] Duplicate rule skipped: ${rule.id}`

            );

            return false;

        }

        this.rules.push(rule);

        this.addToCategory(rule.category, rule);

        this.sort();

        return true;

    }

    register(rule) {

        return this.add(rule);

    }

    registerMany(rules) {

        if (!Array.isArray(rules)) return false;

        for (const rule of rules) {

            this.add(rule);

        }

        return true;

    }

    /* ======================================================
       CATEGORY
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
       SORT
    ====================================================== */

    sort() {

        this.rules.sort(

            (a, b) =>

                (a.priority || 100) -

                (b.priority || 100)

        );

    }
       /* ======================================================
       REMOVE RULE
    ====================================================== */

    remove(id) {

        const index = this.rules.findIndex(rule => rule.id === id);

        if (index === -1) {

            return false;

        }

        const rule = this.rules[index];

        this.rules.splice(index, 1);

        if (this.categories.has(rule.category)) {

            const list = this.categories.get(rule.category);

            const i = list.findIndex(r => r.id === id);

            if (i !== -1) {

                list.splice(i, 1);

            }

        }

        return true;

    }

    /* ======================================================
       ENABLE / DISABLE
    ====================================================== */

    enable(id) {

        const rule = this.get(id);

        if (!rule) return false;

        rule.enabled = true;

        return true;

    }

    disable(id) {

        const rule = this.get(id);

        if (!rule) return false;

        rule.enabled = false;

        return true;

    }

    enableAll() {

        for (const rule of this.rules) {

            rule.enabled = true;

        }

    }

    disableAll() {

        for (const rule of this.rules) {

            rule.enabled = false;

        }

    }

    /* ======================================================
       GETTERS
    ====================================================== */

    get(id) {

        return this.rules.find(rule => rule.id === id) || null;

    }

    getRules() {

        return [...this.rules];

    }

    getByCategory(category) {

        if (!this.categories.has(category)) {

            return [];

        }

        return [...this.categories.get(category)];

    }

    has(id) {

        return this.rules.some(rule => rule.id === id);

    }

    count() {

        return this.rules.length;

    }

    /* ======================================================
       CLEAR
    ====================================================== */

    clear() {

        this.rules = [];

        this.categories.clear();

    }

    /* ======================================================
       STATISTICS
    ====================================================== */

    statistics() {

        return {

            rules: this.rules.length,

            categories: this.categories.size,

            enabled:

                this.rules.filter(r => r.enabled).length,

            disabled:

                this.rules.filter(r => !r.enabled).length

        };

    }
       /* ======================================================
       EXECUTE RULES
    ====================================================== */

    execute(text, analysis = {}, tokens = []) {

        let currentText = text;

        const issues = [];
        const suggestions = [];

        const activeRules = this.rules
            .filter(rule => rule.enabled !== false)
            .sort((a, b) => (a.priority || 100) - (b.priority || 100));

        for (const rule of activeRules) {

            try {

                let matched = false;

                if (typeof rule.test === "function") {

                    matched = rule.test(
                        currentText,
                        analysis,
                        tokens
                    );

                }

                if (!matched) continue;

                let result = null;

                if (typeof rule.fix === "function") {

                    result = rule.fix(
                        currentText,
                        analysis,
                        tokens
                    );

                }

                /* ==========================================
                   Normalize Result
                ========================================== */

                if (typeof result === "string") {

                    result = {

                        text: result,

                        issue: result !== currentText

                    };

                }

                if (!result || typeof result !== "object") {

                    result = {

                        text: currentText,

                        issue: false

                    };

                }

                if (
                    typeof result.text === "string" &&
                    result.text !== currentText
                ) {

                    currentText = result.text;

                }

                if (result.issue) {

                    issues.push({

                        id: rule.id,

                        name: rule.name,

                        category: rule.category,

                        severity: rule.severity,

                        description:
                            result.reason ||
                            rule.description,

                        before: text,

                        after: currentText

                    });

                }

                if (Array.isArray(result.suggestions)) {

                    suggestions.push({

                        rule: rule.name,

                        options: result.suggestions

                    });

                }

            }

            catch (error) {

                console.error(

                    `[RuleManager] ${rule.id}`,

                    error

                );

            }

        }

        return {

            text: currentText,

            issues,

            suggestions,

            report: this.generateReport(issues),

            evaluation: this.evaluate(currentText, issues)

        };

    }
       /* ======================================================
       REPORT
    ====================================================== */

    generateReport(issues) {

        const report = {

            grammar: 0,
            vocabulary: 0,
            punctuation: 0,
            style: 0,
            spelling: 0,
            tense: 0,
            article: 0,
            agreement: 0,
            total: issues.length

        };

        for (const issue of issues) {

            const category =
                (issue.category || "").toLowerCase();

            switch (category) {

                case "grammar":
                    report.grammar++;
                    break;

                case "vocabulary":
                    report.vocabulary++;
                    break;

                case "punctuation":
                    report.punctuation++;
                    break;

                case "style":
                    report.style++;
                    break;

                case "spelling":
                    report.spelling++;
                    break;

                case "tense":
                    report.tense++;
                    break;

                case "article":
                    report.article++;
                    break;

                case "agreement":
                    report.agreement++;
                    break;

                default:
                    report.grammar++;
                    break;

            }

        }

        return report;

    }

    /* ======================================================
       EVALUATION
    ====================================================== */

    evaluate(text, issues) {

        const grammarScore =
            Math.max(100 - issues.length * 5, 0);

        const words =
            text.trim().split(/\s+/).filter(Boolean).length;

        const vocabularyScore =
            Math.min(100, 50 + words);

        const punctuationScore =
            /[.!?]$/.test(text) ? 100 : 80;

        const overall = Math.round(

            (
                grammarScore +
                vocabularyScore +
                punctuationScore

            ) / 3

        );

        return {

            grammar: grammarScore,

            vocabulary: vocabularyScore,

            punctuation: punctuationScore,

            overall

        };

    }

}

/* ==========================================================
   SINGLETON
========================================================== */

const ruleManager = new RuleManager();

window.RuleManager = RuleManager;
window.ruleManager = ruleManager;

/* ==========================================================
   REGISTER INSIDE ENGINE
========================================================== */

if (window.GrammarEngine) {

    GrammarEngine.registerManager(

        "ruleManager",

        ruleManager

    );

}

console.log("[RuleManager] Ready");
