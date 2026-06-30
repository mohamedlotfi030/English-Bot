"use strict";

/* ==========================================================
   English-Bot
   Rule Manager
   Version 6.1 (Architecture Optimized)
========================================================== */

class RuleManager {
    constructor() {
        this.rules = [];
        this.categories = new Map();
    }

    add(rule) {
        if (!(rule instanceof GrammarRule)) {
            console.error("[RuleManager] Invalid Grammar Rule object:", rule);
            return;
        }
        this.rules.push(rule);
        this.sort();
    }

    // إضافة دعم للحصول على القواعد الحالية (تستخدم في engine.js)
    getRules() {
        return this.rules;
    }

    remove(id) {
        this.rules = this.rules.filter(rule => rule.id !== id);
    }

    enable(id) {
        const rule = this.get(id);
        if (rule) rule.enabled = true;
    }

    disable(id) {
        const rule = this.get(id);
        if (rule) rule.enabled = false;
    }

    get(id) {
        return this.rules.find(rule => rule.id === id);
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
       Execute Rules (Core Pipeline)
    ====================================================== */
    execute(sentence, analysis, tokens) {
        let output = sentence;
        const issues = [];
        const suggestions = [];

        for (const rule of this.rules) {
            if (!rule.enabled) continue;

            // تمرير tokens المقطعة لتحسين الأداء
            if (rule.test(output, analysis, tokens)) {
                const result = rule.fix(output, analysis, tokens);

                if (result?.text) output = result.text;

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

    generateReport(issues) {
        const report = {};
        for (const issue of issues) {
            report[issue.category] = (report[issue.category] || 0) + 1;
        }
        return report;
    }

    /* ======================================================
       Writing Evaluation Logic
    ====================================================== */
    evaluateWriting(text, issues) {
        return {
            grammar: Math.max(100 - (issues.length * 10), 0),
            vocabulary: Math.min(100, 60 + (text.split(/\s+/).length * 2)),
            naturalness: /[.!?]/.test(text) ? 95 : 85,
            style: /\b(therefore|however|moreover|consequently)\b/i.test(text) ? 95 : 75,
            overall: 0 // سيتم حسابه في الأسفل
        };
    }
}

// إنشاء النسخة
const ruleManager = new RuleManager();
window.ruleManager = ruleManager;

// تسجيل المدير في المحرك الأساسي
if (window.GrammarEngine) {
    window.GrammarEngine.registerManager("ruleManager", ruleManager);
}

/* ======================================================
   Bridge: Register Legacy/External Rules
====================================================== */
window.registerRules = function(category, rulesArray) {
    if (!Array.isArray(rulesArray)) return;
    
    rulesArray.forEach(r => {
        const grammarRule = new GrammarRule({
            id: r.id || `${category}_${Math.random().toString(36).substr(2, 9)}`,
            name: r.name || r.description,
            category: category,
            description: r.description,
            priority: r.priority || 100,
            severity: r.severity || "error",
            test: r.test || r.condition, // التوافق مع الكود القديم
            fix: r.fix || ((s, a) => ({ text: r.correction(s, a), issue: true }))
        });
        ruleManager.add(grammarRule);
        ruleManager.addToCategory(category, grammarRule);
    });
};
