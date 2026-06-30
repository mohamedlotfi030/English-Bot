"use strict";

/* ==========================================================
   English-Bot
   Grammar Engine
   engine.js
   Version 5.0 (with Writing Evaluation)
========================================================== */

/* ==========================================================
   Grammar Engine
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

    /* ======================================================
       Get Dictionary
    ====================================================== */
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
       Initialize
    ====================================================== */
    function initialize() {
        if (initialized) {
            return;
        }

        if (!managers.ruleManager) {
            throw new Error("RuleManager not loaded.");
        }
        if (!managers.tokenizer) {
            throw new Error("Tokenizer not loaded.");
        }
        if (!managers.analyzer) {
            throw new Error("Analyzer not loaded.");
        }
        if (!managers.corrector) {
            throw new Error("Corrector not loaded.");
        }

        initialized = true;
        console.log("Grammar Engine initialized.");
    }

    /* ======================================================
       Analyze
    ====================================================== */
    function analyze(text) {
        statistics.analyzedSentences++;
        const tokens = managers.tokenizer.tokenize(text);
        return managers.analyzer.analyze(tokens);
    }

    /* ======================================================
       Correct
    ====================================================== */
    function correct(text) {
        if (!initialized) {
            initialize();
        }

        const analysis = analyze(text);

        // ✅ استخدام RuleManager كمحرك أساسي
        const result = managers.ruleManager.execute(text, analysis);

        // ✅ استخدام Corrector كمساعد إضافي
        const correctedByHelper = managers.corrector.correct(text, analysis);

        statistics.corrections++;

        // دمج النتائج: RuleManager هو الأساس، Corrector كمساعد
        return {
            text: result.text || correctedByHelper.text || text,
            issues: result.issues || [],
            suggestions: result.suggestions || [],
            report: result.report || {},
            evaluation: result.evaluation || {}, // ← تقييم الكتابة من RuleManager
            helper: correctedByHelper // ← نتائج LanguageTool أو أي Corrector مساعد
        };
    }

    /* ======================================================
       Statistics
    ====================================================== */
    function getStatistics() {
        return {
            ...statistics
        };
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
        getStatistics
    };

})();

window.GrammarEngine = GrammarEngine;
