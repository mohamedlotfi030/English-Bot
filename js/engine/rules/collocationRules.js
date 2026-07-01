"use strict";

/* ==========================================================
   English-Bot
   Collocation Rules v9 (Production Ready)
   - Rule-based architecture
   - Semantic verification for Make/Do/Take/Have
========================================================== */

/**
 * Rule: Make/Do Collocations
 * Validates common verb-noun collocations.
 */
const collocation_make_do_rule = new GrammarRule({
    id: "collocation_make_do_rule",
    name: "Make/Do Collocations",
    category: GrammarCategory.COLLOCATION,
    severity: GrammarSeverity.ERROR,
    priority: 25,
    enabled: true,

    test(text, analysis, tokens) {
        if (!analysis.nouns || analysis.nouns.length === 0) return false;
        
        const tokenList = tokens.map(t => t.lower);
        const hasMake = tokenList.includes("make");
        const hasDo = tokenList.includes("do");
        
        const makeSet = ["decision", "effort", "mistake"];
        const doSet = ["homework", "exercise", "research"];

        return analysis.nouns.some(n => 
            (makeSet.includes(n.lower) && hasDo) || 
            (doSet.includes(n.lower) && hasMake)
        );
    },

    fix(text, analysis, tokens) {
        let newText = text;
        const makeSet = ["decision", "effort", "mistake"];
        const doSet = ["homework", "exercise", "research"];

        analysis.nouns.forEach(n => {
            const noun = n.lower;
            if (makeSet.includes(noun)) {
                newText = newText.replace(/\bdo\b/gi, "make");
            } else if (doSet.includes(noun)) {
                newText = newText.replace(/\bmake\b/gi, "do");
            }
        });

        return {
            text: newText,
            issue: true,
            reason: "Incorrect collocation used. Check if you should use 'make' or 'do'."
        };
    }
});

/**
 * Rule: Take/Have Collocations
 */
const collocation_take_have_rule = new GrammarRule({
    id: "collocation_take_have_rule",
    name: "Take/Have Collocations",
    category: GrammarCategory.COLLOCATION,
    severity: GrammarSeverity.ERROR,
    priority: 25,
    enabled: true,

    test(text, analysis, tokens) {
        if (!analysis.nouns || analysis.nouns.length === 0) return false;
        
        const takeSet = ["break", "photo", "risk"];
        const haveSet = ["lunch", "dinner", "shower"];

        return analysis.nouns.some(n => 
            (takeSet.includes(n.lower) && !tokens.some(t => t.lower === "take")) ||
            (haveSet.includes(n.lower) && !tokens.some(t => t.lower === "have"))
        );
    },

    fix(text, analysis, tokens) {
        // بما أن التصحيح هنا يتطلب إضافة فعل، نعيد النص مع تنبيه
        return {
            text: text,
            issue: true,
            reason: "Missing correct verb for this noun collocation (e.g., take a break, have lunch)."
        };
    }
});

/* ==========================================================
   REGISTRATION
========================================================== */

GrammarEngine.registerRules([
    collocation_make_do_rule,
    collocation_take_have_rule
]);
