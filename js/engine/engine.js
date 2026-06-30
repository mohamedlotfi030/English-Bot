"use strict";

/* ==========================================================
   English-Bot
   Grammar Engine
   Version 5.2 (FIXED ARCHITECTURE)
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

    const statistics = {
        loadedRules: 0,
        loadedDictionaries: 0,
        corrections: 0,
        analyzedSentences: 0
    };

    /* ======================================================
       Register Dictionary
    ====================================================== */
    function registerDictionary(name, dictionary) {
        dictionaries[name] = dictionary;
        statistics.loadedDictionaries++;
    }

    function getDictionary(name) {
        return dictionaries[name];
    }

    /* ======================================================
       Register Manager
    ====================================================== */
    function registerManager(name, manager) {
        managers[name] = manager;
    }

    /* ======================================================
       FIXED: Register Rule
    ====================================================== */
    function registerRule(rule) {

        const manager = managers.ruleManager;

        if (!manager) {
            console.warn("[GrammarEngine] RuleManager not ready");
            return;
        }

        if (!rule) return;

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

            // 🔥 IMPORTANT FIX: use add() not register()
            manager.add(grammarRule);

            statistics.loadedRules++;

        } catch (err) {
            console.error("[registerRule Error]", err);
        }
    }

    function registerRules(rulesArray) {
        if (!Array.isArray(rulesArray)) {
            console.error("[GrammarEngine] registerRules expects an Array.");
            return;
        }

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
        console.log("[GrammarEngine] Initialized");
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
            return { text: "", issues: [], suggestions: [], report: {}, evaluation: {}, helper: {} };
        }

        try {

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

        } catch (e) {

            console.error("[GrammarEngine Error]", e);

            return {
                text,
                issues: [],
                suggestions: [],
                error: true,
                message: e.message,
                evaluation: {},
                helper: {}
            };
        }
    }

    /* ======================================================
       Statistics (FIXED)
    ====================================================== */
    function getStatistics() {

        if (managers.ruleManager?.getRules) {
            statistics.loadedRules = managers.ruleManager.getRules().length;
        }

        return { ...statistics };
    }

    /* ======================================================
       Public API
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
