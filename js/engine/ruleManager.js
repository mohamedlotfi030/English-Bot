"use strict";

class RuleManager {

    constructor() {
        this.rules = [];
        this.categories = new Map();
    }

    register(rule) {
        return this.add(rule);
    }

    add(rule) {

        if (!(rule instanceof GrammarRule)) {
            console.error("[RuleManager] Invalid Rule");
            return false;
        }

        if (this.rules.some(r => r.id === rule.id)) {
            console.warn(`[RuleManager] Duplicate skipped: ${rule.id}`);
            return false;
        }

        this.rules.push(rule);
        this.sort();

        return true;
    }

    getRules() {
        return this.rules;
    }

    get(id) {
        return this.rules.find(r => r.id === id);
    }

    remove(id) {
        this.rules = this.rules.filter(r => r.id !== id);
    }

    clear() {
        this.rules = [];
        this.categories.clear();
    }

    enable(id) {
        const rule = this.get(id);
        if (rule) rule.enabled = true;
    }

    disable(id) {
        const rule = this.get(id);
        if (rule) rule.enabled = false;
    }

    registerCategory(name) {
        if (!this.categories.has(name)) {
            this.categories.set(name, []);
        }
    }

    addToCategory(category, rule) {
        this.registerCategory(category);
        this.categories.get(category).push(rule);
    }

    sort() {
        this.rules.sort((a, b) => a.priority - b.priority);
    }

    /* ======================================================
       FIXED EXECUTION CORE
    ====================================================== */

    execute(sentence, analysis, tokens = []) {

        let output = sentence;
        const issues = [];
        const suggestions = [];

        for (const rule of this.rules) {

            if (!rule.enabled) continue;

            try {

                const match = rule.test(output, analysis, tokens);

                if (!match) continue;

                const result = rule.fix(output, analysis, tokens);

                if (!result) continue;

                /* 🔥 SAFETY FIX */
                if (typeof result.text === "string") {
                    output = result.text;
                }

                if (result.issue) {
                    issues.push({
                        id: rule.id,
                        name: rule.name,
                        category: rule.category,
                        severity: rule.severity,
                        reason: result.reason || rule.description,
                        explanation: result.explanation || "",
                        correction: result.text || output
                    });
                }

                if (Array.isArray(result.suggestions)) {
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

    generateReport(issues) {
        const report = {};
        for (const issue of issues) {
            report[issue.category] =
                (report[issue.category] || 0) + 1;
        }
        return report;
    }

    statistics() {
        return {
            rules: this.rules.length,
            categories: this.categories.size
        };
    }

    evaluateWriting(text, issues) {

        const grammar = Math.max(100 - issues.length * 10, 0);

        const vocabulary = Math.min(
            100,
            60 + text.split(/\s+/).length * 2
        );

        const naturalness = /[.!?]/.test(text) ? 95 : 85;

        const style = /\b(therefore|however|moreover|consequently)\b/i.test(text)
            ? 95
            : 75;

        return {
            grammar,
            vocabulary,
            naturalness,
            style,
            overall: Math.round((grammar + vocabulary + naturalness + style) / 4)
        };
    }
}

window.RuleManager = RuleManager;
window.ruleManager = new RuleManager();
