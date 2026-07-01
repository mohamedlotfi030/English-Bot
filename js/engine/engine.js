"use strict";

/* ==========================================================
   English-Bot
   Grammar Engine
   Version 8.0
   Core Architecture
========================================================== */

class GrammarEngineClass {

    constructor() {

        /* ==========================================
           Core
        ========================================== */

        this.initialized = false;

        /* ==========================================
           Registries
        ========================================== */

        this.managers = new Map();

        this.dictionaries = new Map();

        /* ==========================================
           Statistics
        ========================================== */

        this.statistics = {

            loadedRules: 0,

            loadedDictionaries: 0,

            analyzedSentences: 0,

            corrections: 0

        };

    }

    /* ======================================================
       Manager System
    ====================================================== */

    registerManager(name, manager) {

        if (!name || !manager) return false;

        this.managers.set(name, manager);

        console.log(`[GrammarEngine] Manager registered: ${name}`);

        return true;

    }

    getManager(name) {

        return this.managers.get(name) || null;

    }

    /* ======================================================
       Dictionary System
    ====================================================== */

    registerDictionary(name, dictionary) {

        if (!name || !dictionary) return false;

        this.dictionaries.set(name, dictionary);

        this.statistics.loadedDictionaries =
            this.dictionaries.size;

        console.log(`[GrammarEngine] Dictionary registered: ${name}`);

        return true;

    }

    getDictionary(name) {

        return this.dictionaries.get(name) || null;

    }

    /* ======================================================
       Rule Registration
    ====================================================== */

    registerRule(rule) {

        const manager = this.getManager("ruleManager");

        if (!manager) {

            console.warn("[GrammarEngine] RuleManager not ready");

            return false;

        }

        manager.add(rule);

        this.statistics.loadedRules =
            manager.getRules().length;

        return true;

    }

    registerRules(rules) {

        if (!Array.isArray(rules)) {

            console.error("[GrammarEngine] registerRules expects Array");

            return false;

        }

        for (const rule of rules) {

            this.registerRule(rule);

        }

        return true;

    }
       /* ======================================================
       Initialize
    ====================================================== */

    initialize() {

        const requiredManagers = [

            "tokenizer",

            "analyzer",

            "ruleManager",

            "corrector"

        ];

        for (const name of requiredManagers) {

            if (!this.getManager(name)) {

                throw new Error(`[GrammarEngine] Missing manager: ${name}`);

            }

        }

        this.initialized = true;

        console.log("[GrammarEngine] Initialized successfully");

        return true;

    }

    /* ======================================================
       Tokenize
    ====================================================== */

    tokenize(text) {

        const tokenizer = this.getManager("tokenizer");

        if (!tokenizer) {

            throw new Error("Tokenizer not registered.");

        }

        return tokenizer.tokenize(text);

    }

    /* ======================================================
       Analyze
    ====================================================== */

    analyze(text) {

        const analyzer = this.getManager("analyzer");

        if (!analyzer) {

            throw new Error("Analyzer not registered.");

        }

        const tokens = this.tokenize(text);

        return analyzer.analyze(tokens);

    }

    /* ======================================================
       Correct
    ====================================================== */

    correct(text) {

        if (!text || !text.trim()) {

            return {

                text: "",

                issues: [],

                suggestions: [],

                report: {},

                evaluation: {},

                helper: {}

            };

        }

        if (!this.initialized) {

            this.initialize();

        }

        this.statistics.analyzedSentences++;

        const tokenizer = this.getManager("tokenizer");

        const analyzer = this.getManager("analyzer");

        const ruleManager = this.getManager("ruleManager");

        const corrector = this.getManager("corrector");

        const tokens = tokenizer.tokenize(text);

        const analysis = analyzer.analyze(tokens);

        const result = ruleManager.execute(

            text,

            analysis,

            tokens

        );

        const helper = corrector.correct(

            text,

            analysis,

            tokens

        );

        this.statistics.corrections++;

        return {

            text:

                result.text ||

                helper.corrected ||

                text,

            issues:

                result.issues || [],

            suggestions:

                result.suggestions || [],

            report:

                result.report || {},

            evaluation:

                result.evaluation || {},

            helper

        };

    }
       /* ======================================================
       Statistics
    ====================================================== */

    getStatistics() {

        const ruleManager = this.getManager("ruleManager");

        if (ruleManager && typeof ruleManager.getRules === "function") {

            this.statistics.loadedRules =
                ruleManager.getRules().length;

        }

        this.statistics.loadedDictionaries =
            this.dictionaries.size;

        return {

            ...this.statistics

        };

    }

    /* ======================================================
       Reset Statistics
    ====================================================== */

    resetStatistics() {

        this.statistics = {

            loadedRules: 0,

            loadedDictionaries: this.dictionaries.size,

            analyzedSentences: 0,

            corrections: 0

        };

    }

    /* ======================================================
       Version
    ====================================================== */

    getVersion() {

        return "8.0";

    }

}
/* ==========================================================
   Singleton
========================================================== */

const GrammarEngine = new GrammarEngineClass();

/* ==========================================================
   Export
========================================================== */

window.GrammarEngine = GrammarEngine;

/* ==========================================================
   Auto Initialize
========================================================== */

window.addEventListener("DOMContentLoaded", () => {

    try {

        if (

            GrammarEngine.getManager("tokenizer") &&

            GrammarEngine.getManager("analyzer") &&

            GrammarEngine.getManager("ruleManager") &&

            GrammarEngine.getManager("corrector")

        ) {

            GrammarEngine.initialize();

        }

    }

    catch (error) {

        console.warn(

            "[GrammarEngine]",

            error.message

        );

    }

});
