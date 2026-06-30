"use strict";

/* ==========================================================
   English-Bot
   Loader (Enhanced with UI Integration)
   Version 1.1
========================================================== */

const Loader = (() => {

    let initialized = false;

    function initialize() {
        if (initialized) return;

        console.log("Loading English-Bot...");

        // 1. التأكد من وجود جميع المكونات
        const dependencies = [
            { name: "GrammarEngine", obj: window.GrammarEngine },
            { name: "Tokenizer", obj: window.tokenizer },
            { name: "Analyzer", obj: window.analyzer },
            { name: "Corrector", obj: window.corrector },
            { name: "RuleManager", obj: window.ruleManager }
        ];

        for (const dep of dependencies) {
            if (!dep.obj) {
                console.error(`[Loader] Missing Dependency: ${dep.name}`);
                throw new Error(`Missing dependency: ${dep.name}`);
            }
        }

        // 2. تشغيل المحرك
        GrammarEngine.initialize();
        initialized = true;

        // 3. تحديث واجهة المستخدم (إخفاء شاشة التحميل)
        const loaderEl = document.getElementById('loader');
        if (loaderEl) {
            loaderEl.classList.add('hidden'); // تأكد أن لديك كلاس hidden في CSS {display: none}
        }

        console.log("English-Bot initialized successfully.");
    }

    return {
        initialize,
        isReady: () => initialized
    };

})();

window.Loader = Loader;
