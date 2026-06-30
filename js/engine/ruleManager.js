"use strict";

/* ==========================================================
   English-Bot
   Rule Manager (Enhanced)
   Version 6.0 (with Writing Evaluation)
========================================================== */

/* ==========================================================
   Grammar Rule Class
========================================================== */

class GrammarRule {
    constructor({
        id,
        name,
        category,
        description = "",
        priority = 100,
        severity = GrammarSeverity.ERROR,
        enabled = true,
        test,
        fix
    }) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.description = description;
        this.priority = priority;
        this.severity = severity;
        this.enabled = enabled;
        this.test = test;
        this.fix = fix;
    }
}

/* ==========================================================
   Rule Manager Class
========================================================== */

class RuleManager {
    constructor() {
        this.rules = [];
        this.categories = new Map();
    }

    /* ======================================================
       Add Rule
    ====================================================== */
    add(rule) {
        if (!(rule instanceof GrammarRule)) {
            throw new Error("Invalid Grammar Rule.");
        }
        this.rules.push(rule);
        this.sort();
    }

    /* ======================================================
       Remove Rule
    ====================================================== */
    remove(id) {
        this.rules = this.rules.filter(rule => rule.id !== id);
    }

    /* ======================================================
       Enable Rule
    ====================================================== */
    enable(id) {
        const rule = this.get(id);
        if (rule) rule.enabled = true;
    }

    /* ======================================================
       Disable Rule
    ====================================================== */
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
       Register Category
    ====================================================== */
    registerCategory(name) {
        if (!this.categories.has(name)) {
            this.categories.set(name, []);
        }
    }

    /* ======================================================
       Add Rule To Category
    ====================================================== */
    addToCategory(category, rule) {
        this.registerCategory(category);
        this.categories.get(category).push(rule);
    }

    /* ======================================================
       Get Category
    ====================================================== */
    getCategory(name) {
        return this.categories.get(name) || [];
    }

    /* ======================================================
       Sort Rules
    ====================================================== */
    sort() {
        this.rules.sort((a, b) => a.priority - b.priority);
    }

    /* ======================================================
       Execute Rules
    ====================================================== */
    execute(sentence, analysis) {
        let output = sentence;
        const issues = [];
        const suggestions = [];

        for (const rule of this.rules) {
            if (!rule.enabled) continue;

            if (rule.test(output, analysis)) {
                const result = rule.fix(output, analysis);

                if (result?.text) output = result.text;

                if (result?.issue) {
                    issues.push({
                        id: rule.id,
                        name: rule.name,
                        category: rule.category,
                        severity: rule.severity,
                        reason: result.reason || "",
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

        // ✅ إضافة تقييم الكتابة هنا
        const evaluation = this.evaluateWriting(output, issues);

        return {
            text: output,
            issues,
            suggestions,
            report: this.generateReport(issues),
            evaluation // ← تقرير الكتابة الكامل
        };
    }

    /* ======================================================
       Generate Report
    ====================================================== */
    generateReport(issues) {
        const report = {};
        for (const issue of issues) {
            if (!report[issue.category]) report[issue.category] = 0;
            report[issue.category]++;
        }
        return report;
    }

    /* ======================================================
       Statistics
    ====================================================== */
    count() {
        return this.rules.length;
    }

    /* ======================================================
       Writing Evaluation
    ====================================================== */
    evaluateWriting(text, issues) {
        const grammarScore = this.calculateGrammarScore(issues);
        const vocabularyScore = this.evaluateVocabulary(text);
        const naturalnessScore = this.evaluateNaturalness(text);
        const styleScore = this.evaluateStyle(text);

        const overallScore = Math.round(
            (grammarScore + vocabularyScore + naturalnessScore + styleScore) / 4
        );

        return {
            grammar: grammarScore,
            vocabulary: vocabularyScore,
            naturalness: naturalnessScore,
            style: styleScore,
            overall: overallScore
        };
    }

    calculateGrammarScore(issues) {
        if (!Array.isArray(issues)) {
            return 100;
        }
        return Math.max(100 - (issues.length * 10), 0);
    }

    evaluateVocabulary(text) {
        const words = text.split(/\s+/);
        return Math.min(100, 60 + words.length);
    }

    evaluateNaturalness(text) {
        return /[.!?]/.test(text) ? 95 : 85;
    }

    evaluateStyle(text) {
        return /\b(therefore|however|moreover)\b/i.test(text) ? 90 : 80;
    }
}

/* ==========================================================
   Export
========================================================== */

const ruleManager = new RuleManager();

window.GrammarRule = GrammarRule;
window.ruleManager = ruleManager;

/* ==========================================================
   Integration with GrammarEngine
========================================================== */
GrammarEngine.registerManager("ruleManager", ruleManager);

/* ==========================================================
   Helper: Register Rules from Files
========================================================== */
window.registerRules = function(category, rulesArray) {
    if (!Array.isArray(rulesArray)) return;
    for (const r of rulesArray) {
        const grammarRule = new GrammarRule({
            id: `${category}_${r.description}`,
            name: r.description,
            category: category,
            description: r.description,
            priority: 100,
            severity: GrammarSeverity.ERROR,
            enabled: true,
            test: r.condition,
            fix: (sentence, analysis) => {
                return {
                    text: r.correction(sentence, analysis),
                    issue: true,
                    reason: r.description,
                    explanation: `Rule applied from ${category}`,
                    correction: r.correction(sentence, analysis)
                };
            }
        });
        ruleManager.add(grammarRule);
        ruleManager.addToCategory(category, grammarRule);
    }
};
