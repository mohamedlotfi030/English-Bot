"use strict";

/* ==========================================================
   English-Bot
   GrammarEngine v7.0 (FIXED CORE)
========================================================== */

class GrammarEngineClass {

    constructor() {

        /* =========================
           Core registries
        ========================= */

        this.dictionaries = new Map();
        this.managers = new Map();

        this.initialized = false;
    }

    /* ==========================================================
       INIT
    ========================================================== */

    initialize() {

        // Ensure required modules exist
        if (!window.tokenizer) {
            throw new Error("[GrammarEngine] Missing: tokenizer");
        }

        if (!window.analyzer) {
            throw new Error("[GrammarEngine] Missing: analyzer");
        }

        if (!window.ruleManager) {
            throw new Error("[GrammarEngine] Missing: ruleManager");
        }

        this.initialized = true;

        console.log("[GrammarEngine] Initialized successfully");
    }

    /* ==========================================================
       DICTIONARIES SYSTEM (FIX FOR YOUR ERRORS)
    ========================================================== */

    registerDictionary(name, data) {

        if (!name) return false;

        this.dictionaries.set(name, data);

        return true;
    }

    getDictionary(name) {

        return this.dictionaries.get(name) || null;
    }

    /* ==========================================================
       REGISTER MANAGERS (Tokenizer / Analyzer / RuleManager)
    ========================================================== */

    registerManager(name, instance) {

        this.managers.set(name, instance);

        return true;
    }

    getManager(name) {

        return this.managers.get(name);
    }

    /* ==========================================================
       registerMany (FIX for rules error)
       بعض ملفات rules بتستعملها
    ========================================================== */

    registerMany(input) {

        // Case 1: array of rules
        if (Array.isArray(input)) {

            for (const item of input) {
                this._registerRule(item);
            }

            return true;
        }

        // Case 2: single rule
        return this._registerRule(input);
    }

    _registerRule(rule) {

        if (!rule) return false;

        const rm = this.getManager("ruleManager");

        if (rm && typeof rm.add === "function") {
            return rm.add(rule);
        }

        console.warn("[GrammarEngine] ruleManager not ready");
        return false;
    }

    /* ==========================================================
       CORE PIPELINE
    ========================================================== */

    tokenize(text) {

        return window.tokenizer.tokenize(text);
    }

    analyze(text) {

        const tokens = this.tokenize(text);

        return window.analyzer.analyze(tokens);
    }

    correct(text) {

        const tokens = this.tokenize(text);
        const analysis = this.analyze(text);

        const rm = this.getManager("ruleManager");

        if (!rm) {
            return {
                text,
                issues: [],
                error: "RuleManager not found"
            };
        }

        return rm.execute(text, analysis, tokens);
    }
}

/* ==========================================================
   SINGLETON
========================================================== */

const GrammarEngine = new GrammarEngineClass();

window.GrammarEngine = GrammarEngine;

/* ==========================================================
   AUTO INIT SAFETY
========================================================== */

window.addEventListener("load", () => {
    try {
        GrammarEngine.initialize();
    } catch (err) {
        console.error(err);
    }
});
