"use strict";

/* ==========================================================
   English-Bot
   Grammar Severity
   Version 9.0
========================================================== */

const GrammarSeverity = Object.freeze({

    INFO: "info",

    WARNING: "warning",

    ERROR: "error",

    CRITICAL: "critical"

});

/* ==========================================================
   Numeric Weight
========================================================== */

GrammarSeverity.weight = Object.freeze({

    info: 1,

    warning: 2,

    error: 3,

    critical: 4

});

/* ==========================================================
   Helpers
========================================================== */

GrammarSeverity.exists = function(level) {

    return Object.values(GrammarSeverity).includes(level);

};

GrammarSeverity.getWeight = function(level) {

    return GrammarSeverity.weight[level] || 0;

};

GrammarSeverity.compare = function(a, b) {

    return GrammarSeverity.getWeight(a) -
           GrammarSeverity.getWeight(b);

};

/* ==========================================================
   Export
========================================================== */

window.GrammarSeverity = GrammarSeverity;

console.log("[GrammarSeverity] Ready");
