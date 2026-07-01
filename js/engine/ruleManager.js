"use strict";

/* ==========================================================
   Rule Manager v7.0 (STABLE FIXED)
========================================================== */

class RuleManager {

    constructor() {
        this.rules = [];
        this.categories = new Map();
    }

    /* ================================
       ADD RULE
    ================================ */

    add(rule) {

        if (!rule) return false;

        // قبول GrammarRule أو plain object (FIX مهم)
        if (!(rule instanceof GrammarRule)) {
            console.warn("[RuleManager] Converted plain rule to GrammarRule");

            rule = new GrammarRule(rule);
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
       EXECUTE RULES
    ================================ */

    execute(text, analysis, tokens = []) {

        let output = text;

        const issues = [];
        const suggestions = [];

        for (const rule of this.rules) {

            if (!rule.enabled) continue;

            try {

                const passed = rule.test(output, analysis, tokens);
                if (!passed) continue;

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
       SORT
    ================================ */

    sort() {
        this.rules.sort((a, b) => a.priority - b.priority);
    }

    /* ================================
       GETTERS
    ================================ */

    getRules() {
        return this.rules;
    }

    get(id) {
        return this.rules.find(r => r.id === id);
    }

    /* ================================
       REPORT
    ================================ */

    generateReport(issues) {

        const report = {};

        for (const issue of issues) {
            report[issue.category] =
                (report[issue.category] || 0) + 1;
        }

        return report;
    }

    /* ================================
       EVALUATION (FIXED LOGIC)
    ================================ */

    evaluate(text, issues) {

        const grammar = Math.max(100 - issues.length * 10, 0);

        const length = text.split(/\s+/).filter(Boolean).length;

        const vocabulary = Math.min(100, 50 + length * 2);

        const naturalness = /[.!?]/.test(text) ? 95 : 80;

        const style = /\b(however|therefore|moreover)\b/i.test(text)
            ? 90
            : 75;

        const overall = Math.round(
            (grammar + vocabulary + naturalness + style) / 4
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

/* ================================
   SINGLETON
================================ */

const ruleManager = new RuleManager();

window.RuleManager = RuleManager;
window.ruleManager = ruleManager;

/* ================================
   REGISTER ENGINE
================================ */

if (window.GrammarEngine) {
    GrammarEngine.registerManager(
        "ruleManager",
        ruleManager
    );
}
