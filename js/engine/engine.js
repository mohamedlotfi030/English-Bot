"use strict";

/* ==========================================================
   English-Bot Grammar Engine v7.0
========================================================== */

const GrammarEngine = (() => {

    const managers = {
        tokenizer: null,
        analyzer: null,
        ruleManager: null,
        corrector: null
    };

    let initialized = false;

    function registerManager(name, instance) {
        managers[name] = instance;
    }

    function initialize() {

        if (initialized) return;

        const required = ["tokenizer", "analyzer", "ruleManager"];

        for (const r of required) {
            if (!managers[r]) {
                throw new Error(`[GrammarEngine] Missing: ${r}`);
            }
        }

        initialized = true;
        console.log("[GrammarEngine] v7 initialized");
    }

    function analyze(text) {
        const tokens = managers.tokenizer.tokenize(text);
        return managers.analyzer.analyze(tokens);
    }

    function correct(text) {

        if (!initialized) initialize();

        const tokens = managers.tokenizer.tokenize(text);
        const analysis = managers.analyzer.analyze(tokens);

        const result = managers.ruleManager.execute(text, analysis, tokens);

        return {
            text: result.text,
            issues: result.issues,
            suggestions: result.suggestions,
            report: result.report,
            evaluation: result.evaluation
        };
    }

    function registerRule(rule) {
        managers.ruleManager.add(rule);
    }

    function registerRules(rules = []) {
        if (!Array.isArray(rules)) return;
        rules.forEach(registerRule);
    }

    function getManager(name) {
        return managers[name];
    }

    return {
        registerManager,
        registerRule,
        registerRules,
        analyze,
        correct,
        getManager
    };

})();

window.GrammarEngine = GrammarEngine;
