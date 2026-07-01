"use strict";

/* ==========================================================
   English-Bot
   Grammar Engine
   Version 7.0 (FIXED ARCHITECTURE)
========================================================== */

const GrammarEngine = (() => {

    let initialized = false;

    const managers = {
        tokenizer: null,
        analyzer: null,
        corrector: null,
        ruleManager: null
    };

    const dictionaries = {};
    const ruleSets = {}; // 🔥 NEW: named rule groups

    const statistics = {
        loadedRules: 0,
        loadedRuleSets: 0,
        corrections: 0,
        analyzedSentences: 0
    };

    /* ======================================================
       Managers
    ====================================================== */

    function registerManager(name, manager) {
        managers[name] = manager;
    }

    /* ======================================================
       Dictionaries
    ====================================================== */

    function registerDictionary(name, dictionary) {
        dictionaries[name] = dictionary;
        statistics.loadedDictionaries++;
    }

    function getDictionary(name) {
        return dictionaries[name];
    }

    /* ======================================================
       RULE FIX CORE
    ====================================================== */

    function registerRule(rule) {

        const manager = managers.ruleManager;
        if (!manager || !rule) return;

        try {

            const grammarRule = (rule instanceof GrammarRule)
                ? rule
                : new GrammarRule({
                    id: rule.id || rule.name,
                    name: rule.name || rule.description,
                    category: rule.category || "grammar",
                    description: rule.description || "",
                    priority: rule.priority || 100,
                    severity: rule.severity || GrammarSeverity.ERROR,
                    enabled: true,
                    test: rule.test || rule.condition,
                    fix: rule.fix || ((s, a) => ({
                        text: rule.correction ? rule.correction(s, a) : s,
                        issue: true
                    }))
                });

            manager.add(grammarRule);
            statistics.loadedRules++;

        } catch (err) {
            console.error("[registerRule Error]", err);
        }
    }

    /* ======================================================
       🔥 FIXED: Register Rule Set (NEW)
    ====================================================== */

    function registerRules(name, rulesArray) {

        if (!Array.isArray(rulesArray)) {
            console.error("[GrammarEngine] registerRules expects Array");
            return;
        }

        ruleSets[name] = rulesArray;
        statistics.loadedRuleSets++;

        rulesArray.forEach(registerRule);
    }

    /* ======================================================
       Initialize
    ====================================================== */

    function initialize() {

        if (initialized) return;

        if (!managers.ruleManager) throw new Error("RuleManager not loaded.");
        if (!managers.tokenizer) throw new Error("Tokenizer not loaded.");
        if (!managers.analyzer) throw new Error("Analyzer not loaded.");
        if (!managers.corrector) throw new Error("Corrector not loaded.");

        initialized = true;
        console.log("[GrammarEngine] Initialized v7.0");
    }

    /* ======================================================
       Analyze
    ====================================================== */

    function analyze(text) {
        const tokens = managers.tokenizer.tokenize(text);
        return managers.analyzer.analyze(tokens);
    }

    /* ======================================================
       Correct
    ====================================================== */

    function correct(text) {

        if (!text || !text.trim()) {
            return { text: "", issues: [], suggestions: [] };
        }

        if (!initialized) initialize();

        statistics.analyzedSentences++;

        const tokens = managers.tokenizer.tokenize(text);
        const analysis = managers.analyzer.analyze(tokens);

        const result = managers.ruleManager.execute(text, analysis, tokens);
        const helper = managers.corrector.correct(text, analysis, tokens);

        statistics.corrections++;

        return {
            text: result.text || helper.text || text,
            issues: result.issues || [],
            suggestions: result.suggestions || [],
            report: result.report || {},
            evaluation: result.evaluation || {},
            helper
        };
    }

    /* ======================================================
       Statistics
    ====================================================== */

    function getStatistics() {
        return { ...statistics };
    }

    /* ======================================================
       API
    ====================================================== */

    return {
        initialize,
        correct,
        analyze,
        registerManager,
        registerDictionary,
        getDictionary,
        registerRule,
        registerRules,
        getStatistics
    };

})();

window.GrammarEngine = GrammarEngine;
