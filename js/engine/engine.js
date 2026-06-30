"use strict";

/* ==========================================================
   English-Bot
   Grammar Engine
   engine.js
   Version 5.1 (Architecture Fixed & Stabilized)
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
        console.log(`[GrammarEngine] Dictionary registered: ${name}`);
    }

    function getDictionary(name) {
        return dictionaries[name];
    }

    /* ======================================================
       Register Manager
    ====================================================== */
    function registerManager(name, manager) {
        managers[name] = manager;
        console.log(`[GrammarEngine] Manager registered: ${name}`);
    }

    /* ======================================================
       Register Rules (✅ Fixes Error #6)
    ====================================================== */
    function registerRule(rule) {
        if (managers.ruleManager) {
            managers.ruleManager.register(rule);
            statistics.loadedRules = managers.ruleManager.getRules ? managers.ruleManager.getRules().length : statistics.loadedRules + 1;
        } else {
            console.warn(`[GrammarEngine] RuleManager not loaded yet. Cannot register rule: ${rule.id}`);
        }
    }

    function registerRules(rulesArray) {
        if (Array.isArray(rulesArray)) {
            rulesArray.forEach(rule => registerRule(rule));
        } else {
            console.error("[GrammarEngine] registerRules expects an Array.");
        }
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
        console.log("[GrammarEngine] Initialized successfully.");
    }

    /* ======================================================
       Analyze
    ====================================================== */
    function analyze(text) {
        const tokens = managers.tokenizer.tokenize(text);
        return managers.analyzer.analyze(tokens);
    }

    /* ======================================================
       Correct (✅ Crash Prevention Added)
    ====================================================== */
    function correct(text) {
        if (!text || text.trim() === "") {
            return { text: "", issues: [], suggestions: [], report: {}, evaluation: {}, helper: {} };
        }

        try {
            if (!initialized) initialize();

            statistics.analyzedSentences++;
            
            // 1. Tokenization & Analysis
            const tokens = managers.tokenizer.tokenize(text);
            const analysis = managers.analyzer.analyze(tokens);

            // 2. RuleManager Execution
            const result = managers.ruleManager.execute(text, analysis, tokens);

            // 3. Corrector Helper
            const correctedByHelper = managers.corrector.correct(text, analysis, tokens);

            statistics.corrections++;

            // 4. Merge Results
            return {
                text: result.text || correctedByHelper.text || text,
                issues: result.issues || [],
                suggestions: result.suggestions || [],
                report: result.report || {},
                evaluation: result.evaluation || {}, 
                helper: correctedByHelper 
            };

        } catch (error) {
            console.error("[GrammarEngine Critical Error]", error.message);
            // إرجاع كائن آمن لمنع انهيار واجهة المستخدم بالكامل
            return {
                text: text,
                issues: [],
                suggestions: [],
                error: true,
                message: `Unable to process grammar rules: ${error.message}`,
                evaluation: {},
                helper: {}
            };
        }
    }

    /* ======================================================
       Statistics
    ====================================================== */
    function getStatistics() {
        // تحديث عدد القواعد فعلياً من الـ RuleManager إن أمكن
        if (managers.ruleManager && typeof managers.ruleManager.getRules === 'function') {
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
        registerRule,   // ✅ تمت الإضافة للـ API
        registerRules,  // ✅ تمت الإضافة للـ API
        getStatistics
    };

})();

window.GrammarEngine = GrammarEngine;
