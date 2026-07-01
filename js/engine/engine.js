"use strict";

/* ==========================================================
   English-Bot
   Grammar Engine
   Version 9.0
   Core Architecture
========================================================== */

class GrammarEngineClass {

    constructor() {

        /* ==================================================
           Engine State
        ================================================== */

        this.initialized = false;

        /* ==================================================
           Managers
        ================================================== */

        this.managers = new Map();

        /* ==================================================
           Dictionaries
        ================================================== */

        this.dictionaries = new Map();

        /* ==================================================
           Statistics
        ================================================== */

        this.statistics = {

            loadedRules: 0,

            loadedDictionaries: 0,

            analyzedSentences: 0,

            corrections: 0

        };

    }

    /* ======================================================
       MANAGER SYSTEM
    ====================================================== */

    registerManager(name, manager) {

        if (!name) {

            console.warn("[GrammarEngine] Invalid manager name.");

            return false;

        }

        if (!manager) {

            console.warn(`[GrammarEngine] Manager "${name}" is null.`);

            return false;

        }

        this.managers.set(name, manager);

        console.log(`[GrammarEngine] Manager registered -> ${name}`);

        return true;

    }

    getManager(name) {

        return this.managers.get(name) || null;

    }

    hasManager(name) {

        return this.managers.has(name);

    }

    unregisterManager(name) {

        return this.managers.delete(name);

    }

    /* ======================================================
       DICTIONARY SYSTEM
    ====================================================== */

    registerDictionary(name, dictionary) {

        if (!name) {

            console.warn("[GrammarEngine] Invalid dictionary name.");

            return false;

        }

        if (!dictionary) {

            console.warn(`[GrammarEngine] Dictionary "${name}" is null.`);

            return false;

        }

        this.dictionaries.set(name, dictionary);

        this.statistics.loadedDictionaries =
            this.dictionaries.size;

        console.log(`[GrammarEngine] Dictionary registered -> ${name}`);

        return true;

    }

    getDictionary(name) {

        return this.dictionaries.get(name) || null;

    }

    hasDictionary(name) {

        return this.dictionaries.has(name);

    }

    unregisterDictionary(name) {

        const removed = this.dictionaries.delete(name);

        this.statistics.loadedDictionaries =
            this.dictionaries.size;

        return removed;

    }

    getAllDictionaries() {

        return this.dictionaries;

    }
       /* ======================================================
       RULE SYSTEM
    ====================================================== */

    registerRule(rule) {

        const manager = this.getManager("ruleManager");

        if (!manager) {

            console.warn("[GrammarEngine] RuleManager not ready.");

            return false;

        }

        if (!rule) {

            console.warn("[GrammarEngine] Invalid rule.");

            return false;

        }

        /* ----------------------------------------------
           Convert legacy rule → GrammarRule
        ---------------------------------------------- */

        if (!(rule instanceof GrammarRule)) {

            rule = new GrammarRule({

                id:
                    rule.id ||
                    rule.name ||
                    ("rule_" + Math.random().toString(36).slice(2)),

                name:
                    rule.name ||
                    rule.description ||
                    "Unnamed Rule",

                category:
                    rule.category ||
                    GrammarCategory.GRAMMAR,

                description:
                    rule.description || "",

                priority:
                    Number(rule.priority) || 100,

                severity:
                    rule.severity ||
                    GrammarSeverity.ERROR,

                enabled:
                    rule.enabled !== false,

                test:
                    rule.test ||
                    rule.condition ||
                    (() => false),

                fix:
                    rule.fix ||

                    ((sentence, analysis) => {

                        if (typeof rule.correction === "function") {

                            return {

                                text:
                                    rule.correction(
                                        sentence,
                                        analysis
                                    ),

                                issue: true

                            };

                        }

                        return {

                            text: sentence,

                            issue: false

                        };

                    })

            });

        }

        manager.add(rule);

        this.statistics.loadedRules =
            manager.getRules().length;

        return true;

    }

    /* ======================================================
       Register Multiple Rules
    ====================================================== */

    registerRules(rules) {

        if (!Array.isArray(rules)) {

            console.warn("[GrammarEngine] registerRules expects Array.");

            return false;

        }

        for (const rule of rules) {

            this.registerRule(rule);

        }

        return true;

    }

    /* ======================================================
       Compatibility
    ====================================================== */

    registerMany(rules) {

        return this.registerRules(rules);

    }

    /* ======================================================
       Get Rules
    ====================================================== */

    getAllRules() {

        const manager = this.getManager("ruleManager");

        if (!manager) {

            return [];

        }

        if (typeof manager.getRules === "function") {

            return manager.getRules();

        }

        return [];

    }

    getRule(id) {

        const manager = this.getManager("ruleManager");

        if (!manager) return null;

        if (typeof manager.get === "function") {

            return manager.get(id);

        }

        return null;

    }

    getRuleCount() {

        return this.getAllRules().length;

    }
       /* ======================================================
       INITIALIZATION
    ====================================================== */

    initialize() {

        const required = [

            "tokenizer",

            "analyzer",

            "ruleManager",

            "corrector"

        ];

        for (const manager of required) {

            if (!this.hasManager(manager)) {

                throw new Error(
                    `[GrammarEngine] Missing manager: ${manager}`
                );

            }

        }

        this.initialized = true;

        this.statistics.loadedRules =
            this.getRuleCount();

        this.statistics.loadedDictionaries =
            this.dictionaries.size;

        console.log("[GrammarEngine] Initialized successfully");

        return true;

    }

    /* ======================================================
       TOKENIZE
    ====================================================== */

    tokenize(text) {

        const tokenizer = this.getManager("tokenizer");

        if (!tokenizer) {

            throw new Error(
                "[GrammarEngine] Tokenizer not registered."
            );

        }

        return tokenizer.tokenize(text);

    }

    /* ======================================================
       ANALYZE
    ====================================================== */

    analyze(text) {

        const analyzer = this.getManager("analyzer");

        if (!analyzer) {

            throw new Error(
                "[GrammarEngine] Analyzer not registered."
            );

        }

        const tokens = this.tokenize(text);

        this.statistics.analyzedSentences++;

        return analyzer.analyze(tokens);

    }

    /* ======================================================
       CORRECT
    ====================================================== */

    correct(text) {

        if (typeof text !== "string") {

            text = "";

        }

        text = text.trim();

        if (!text) {

            return {

                text: "",

                issues: [],

                suggestions: [],

                report: {},

                evaluation: {}

            };

        }

        if (!this.initialized) {

            this.initialize();

        }

        const tokenizer =
            this.getManager("tokenizer");

        const analyzer =
            this.getManager("analyzer");

        const ruleManager =
            this.getManager("ruleManager");

        const tokens =
            tokenizer.tokenize(text);

        const analysis =
            analyzer.analyze(tokens);

        const result =
            ruleManager.execute(
                text,
                analysis,
                tokens
            );

        this.statistics.corrections++;

        this.statistics.loadedRules =
            this.getRuleCount();

        return result;

    }
       /* ======================================================
       STATISTICS
    ====================================================== */

    getStatistics() {

        this.statistics.loadedRules =
            this.getRuleCount();

        this.statistics.loadedDictionaries =
            this.dictionaries.size;

        return {

            loadedRules:
                this.statistics.loadedRules,

            loadedDictionaries:
                this.statistics.loadedDictionaries,

            analyzedSentences:
                this.statistics.analyzedSentences,

            corrections:
                this.statistics.corrections

        };

    }

    /* ======================================================
       RESET STATISTICS
    ====================================================== */

    resetStatistics() {

        this.statistics = {

            loadedRules:
                this.getRuleCount(),

            loadedDictionaries:
                this.dictionaries.size,

            analyzedSentences: 0,

            corrections: 0

        };

    }

    /* ======================================================
       VERSION
    ====================================================== */

    getVersion() {

        return "9.0";

    }

}

/* ==========================================================
   SINGLETON
========================================================== */

const GrammarEngine = new GrammarEngineClass();

window.GrammarEngine = GrammarEngine;

/* ==========================================================
   AUTO INITIALIZATION
========================================================== */

window.addEventListener("DOMContentLoaded", () => {

    const managers = {

        tokenizer: window.tokenizer,

        analyzer: window.analyzer,

        corrector: window.corrector,

        ruleManager: window.ruleManager

    };

    for (const [name, manager] of Object.entries(managers)) {

        if (manager && !GrammarEngine.hasManager(name)) {

            GrammarEngine.registerManager(

                name,

                manager

            );

        }

    }

    try {

        GrammarEngine.initialize();

    }

    catch (error) {

        console.warn(

            "[GrammarEngine]",

            error.message

        );

    }

});
