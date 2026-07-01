"use strict";

/* ==========================================================
   Rule Manager v7.0 (Clean Execution Core)
========================================================== */

class RuleManager {

    constructor() {
        this.rules = [];
        this.categories = new Map();
    }

    /* ================================
       Add Rule
    ================================ */

    add(rule) {

        if (!(rule instanceof GrammarRule)) {
            console.warn("[RuleManager] Invalid rule ignored");
            return false;
        }

        if (this.rules.some(r => r.id === rule.id)) {
            console.warn(`[RuleManager] Duplicate rule: ${rule.id}`);
            return false;
        }

        this.rules.push(rule);
        this.sort();

        return true;
    }

    /* ================================
       Execute Rules
    ================================ */

    execute(text, analysis, tokens = []) {

        let output = text;

        const issues = [];
        const suggestions = [];

        for (const rule of this.rules) {

            if (!rule.enabled) continue;

            try {

                // TEST
                const passed = rule.test(output, analysis, tokens);

                if (!passed) continue;

                // FIX
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
                        correction: result.text || output
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
            evaluation: this.evaluate(output, issues)
        };
    }

    /* ================================
       Helpers
    ================================ */

    sort() {
        this.rules.sort((a, b) => a.priority - b.priority);
    }

    getRules() {
        return this.rules;
    }

    get(id) {
        return this.rules.find(r => r.id === id);
    }

    /* ================================
       Reporting
    ================================ */

    generateReport(issues) {

        const report = {};

        for (const issue of issues) {
            report[issue.category] =
                (report[issue.category] || 0) + 1;
        }

        return report;
    }

    evaluate(text, issues) {

        const grammar = Math.max(100 - issues.length * 10, 0);

        const length = text.split(/\s+/).length;

        const vocabulary = Math.min(100, 50 + length * 2);

        const naturalness = /[.!?]/.test(text) ? 95 : 80;

        const overall = Math.round(
            (grammar + vocabulary + naturalness) / 3
        );

        return {
            grammar,
            vocabulary,
            naturalness,
            overall
        };
    }
}

/* ================================
   Singleton
================================ */

const ruleManager = new RuleManager();

window.RuleManager = RuleManager;
window.ruleManager = ruleManager;

/* ================================
   Register with Engine
================================ */

if (window.GrammarEngine) {
    GrammarEngine.registerManager(
        "ruleManager",
        ruleManager
    );
}
