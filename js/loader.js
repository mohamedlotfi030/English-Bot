"use strict";

/* ==========================================================
   English-Bot
   Loader
   Version 1.0
========================================================== */

const Loader = (() => {

    let initialized = false;

    async function initialize() {

        if (initialized) {

            return;

        }

        console.log("Loading English-Bot...");

        if (!window.GrammarEngine) {

            throw new Error("GrammarEngine is missing.");

        }

        if (!window.tokenizer) {

            throw new Error("Tokenizer is missing.");

        }

        if (!window.analyzer) {

            throw new Error("Analyzer is missing.");

        }

        if (!window.corrector) {

            throw new Error("Corrector is missing.");

        }

        if (!window.ruleManager) {

            throw new Error("RuleManager is missing.");

        }

        GrammarEngine.initialize();

        initialized = true;

        console.log("English-Bot initialized successfully.");

    }

    return {

        initialize

    };

})();

window.Loader = Loader;
