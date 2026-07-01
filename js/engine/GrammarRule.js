"use strict";

/* ==========================================================
   English-Bot
   Grammar Rule
   Version 9.0
========================================================== */

class GrammarRule {

    constructor(config = {}) {

        if (typeof config !== "object") {
            throw new TypeError("GrammarRule expects an object.");
        }

        this.id = config.id || "";

        this.name = config.name || this.id;

        this.description = config.description || "";

        this.category = config.category || GrammarCategory.GENERAL;

        this.severity = config.severity || GrammarSeverity.INFO;

        this.priority = Number.isFinite(config.priority)
            ? config.priority
            : 100;

        this.enabled = config.enabled !== false;

        this.test =
            typeof config.test === "function"
                ? config.test
                : () => false;

        this.fix =
            typeof config.fix === "function"
                ? config.fix
                : (text) => ({
                    text,
                    issue: false,
                    suggestions: []
                });
    }

    enable() {
        this.enabled = true;
    }

    disable() {
        this.enabled = false;
    }

    toggle() {
        this.enabled = !this.enabled;
    }

    clone() {

        return new GrammarRule({

            id: this.id,

            name: this.name,

            description: this.description,

            category: this.category,

            severity: this.severity,

            priority: this.priority,

            enabled: this.enabled,

            test: this.test,

            fix: this.fix

        });

    }

    toJSON() {

        return {

            id: this.id,

            name: this.name,

            description: this.description,

            category: this.category,

            severity: this.severity,

            priority: this.priority,

            enabled: this.enabled

        };

    }

}

window.GrammarRule = GrammarRule;

console.log("[GrammarRule] Ready");
