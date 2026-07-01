"use strict";

/* ==========================================================
   English-Bot
   Engine v7 (Stable Fix Version)
========================================================== */

(function () {

    const dictionaries = {};
    const managers = {};

    const GrammarEngine = {

        /* ================================
           INIT
        ================================ */
        initialize() {
            console.log("[GrammarEngine] v7 Initialized");
        },

        /* ================================
           CORE CORRECTION PIPELINE
        ================================ */
        correct(text) {
            try {

                if (!managers.tokenizer || !managers.ruleManager) {
                    throw new Error("Missing core modules");
                }

                const tokens = managers.tokenizer.tokenize(text);
                const analysis = managers.analyzer
                    ? managers.analyzer.analyze(tokens)
                    : {};

                const result = managers.ruleManager.execute(text, analysis, tokens);

                return {
                    text: result.text || text,
                    issues: result.issues || [],
                    suggestions: result.suggestions || [],
                    report: result.report || {},
                    evaluation: result.evaluation || {}
                };

            } catch (err) {
                console.error("[GrammarEngine Error]", err);

                return {
                    text,
                    issues: [],
                    suggestions: [],
                    report: {},
                    evaluation: {},
                    error: true
                };
            }
        },

        /* ================================
           ANALYZE ONLY
        ================================ */
        analyze(text) {
            if (!managers.tokenizer || !managers.analyzer) return {};
            const tokens = managers.tokenizer.tokenize(text);
            return managers.analyzer.analyze(tokens);
        },

        /* ================================
           MANAGERS
        ================================ */
        registerManager(name, instance) {
            managers[name] = instance;
        },

        registerDictionary(name, data) {
            dictionaries[name] = data;
        },

        getDictionary(name) {
            return dictionaries[name] || null;
        },

        /* ================================
           DEBUG
        ================================ */
        _debug() {
            return { managers, dictionaries };
        }
    };

    window.GrammarEngine = GrammarEngine;

})();
