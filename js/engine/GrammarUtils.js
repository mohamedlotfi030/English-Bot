"use strict";

/* ==========================================================
   English-Bot
   Grammar Utilities
   Version 9.0
========================================================== */

const GrammarUtils = {};

/* ==========================================================
   TOKEN HELPERS
========================================================== */

GrammarUtils.getTokenText = function (token) {

    if (!token) return "";

    if (typeof token === "string")
        return token;

    return token.value ??
           token.text ??
           token.lower ??
           "";

};

GrammarUtils.getLower = function (token) {

    return GrammarUtils
        .getTokenText(token)
        .toLowerCase();

};

GrammarUtils.isWord = function (token) {

    return /^[A-Za-z]/.test(
        GrammarUtils.getTokenText(token)
    );

};

GrammarUtils.isNumber = function (token) {

    return /^\d+(\.\d+)?$/.test(
        GrammarUtils.getTokenText(token)
    );

};

GrammarUtils.isPunctuation = function (token) {

    return /^[.,!?;:()[\]{}"]$/.test(
        GrammarUtils.getTokenText(token)
    );

};

/* ==========================================================
   SAFE ARRAY HELPERS
========================================================== */

GrammarUtils.previous = function(tokens,index){

    if(index<=0) return null;

    return tokens[index-1];

};

GrammarUtils.next = function(tokens,index){

    if(index>=tokens.length-1) return null;

    return tokens[index+1];

};

GrammarUtils.first=function(tokens){

    return tokens.length
        ? tokens[0]
        : null;

};

GrammarUtils.last=function(tokens){

    return tokens.length
        ? tokens[tokens.length-1]
        : null;

};

/* ==========================================================
   SEARCH
========================================================== */

GrammarUtils.findToken=function(tokens,value){

    value=value.toLowerCase();

    return tokens.find(t=>

        GrammarUtils.getLower(t)===value

    );

};

GrammarUtils.findIndex=function(tokens,value){

    value=value.toLowerCase();

    return tokens.findIndex(t=>

        GrammarUtils.getLower(t)===value

    );

};

GrammarUtils.contains=function(tokens,value){

    return GrammarUtils.findIndex(

        tokens,

        value

    )!==-1;

};

/* ==========================================================
   EXPORT
========================================================== */

window.GrammarUtils = GrammarUtils;

console.log("[GrammarUtils] Part 1 Ready");
"use strict";

/* ==========================================================
   GrammarUtils.js
   Part 2
   Version 9.0
========================================================== */

/* ==========================================================
   STRING HELPERS
========================================================== */

GrammarUtils.capitalize = function (text) {

    if (!text) return "";

    return text.charAt(0).toUpperCase() + text.slice(1);

};

GrammarUtils.lower = function (text) {

    return String(text).toLowerCase();

};

GrammarUtils.upper = function (text) {

    return String(text).toUpperCase();

};

GrammarUtils.trim = function (text) {

    return String(text).trim();

};

GrammarUtils.normalizeSpaces = function (text) {

    return String(text)

        .replace(/\s+/g, " ")

        .trim();

};

GrammarUtils.startsWithVowel = function (word) {

    if (!word) return false;

    return /^[aeiou]/i.test(word);

};

GrammarUtils.endsWithConsonant = function (word) {

    if (!word) return false;

    return /[^aeiou]$/i.test(word);

};

/* ==========================================================
   TOKEN TYPE HELPERS
========================================================== */

GrammarUtils.isArticle = function(token){

    return token?.type === "article";

};

GrammarUtils.isVerb = function(token){

    return token?.type === "verb";

};

GrammarUtils.isNoun = function(token){

    return token?.type === "noun";

};

GrammarUtils.isPronoun = function(token){

    return token?.type === "pronoun";

};

GrammarUtils.isAdjective = function(token){

    return token?.type === "adjective";

};

GrammarUtils.isAdverb = function(token){

    return token?.type === "adverb";

};

GrammarUtils.isAuxiliary = function(token){

    return token?.type === "auxiliary";

};

GrammarUtils.isModal = function(token){

    return token?.type === "modal";

};

GrammarUtils.isPreposition = function(token){

    return token?.type === "preposition";

};

GrammarUtils.isConjunction = function(token){

    return token?.type === "conjunction";

};

GrammarUtils.isPunctuationToken=function(token){

    return token?.type==="punctuation";

};

/* ==========================================================
   SAFE ACCESS
========================================================== */

GrammarUtils.safeValue=function(token){

    if(!token) return "";

    return token.value ?? "";

};

GrammarUtils.safeLower=function(token){

    if(!token) return "";

    return (token.lower ??

        token.value ??

        "").toLowerCase();

};

GrammarUtils.safeType=function(token){

    if(!token) return "";

    return token.type ?? "";

};

/* ==========================================================
   TOKEN SEARCH
========================================================== */

GrammarUtils.findPreviousWord=function(tokens,index){

    for(let i=index-1;i>=0;i--){

        if(GrammarUtils.isWord(tokens[i]))

            return tokens[i];

    }

    return null;

};

GrammarUtils.findNextWord=function(tokens,index){

    for(let i=index+1;i<tokens.length;i++){

        if(GrammarUtils.isWord(tokens[i]))

            return tokens[i];

    }

    return null;

};

GrammarUtils.findPreviousType=function(tokens,index,type){

    for(let i=index-1;i>=0;i--){

        if(tokens[i].type===type)

            return tokens[i];

    }

    return null;

};

GrammarUtils.findNextType=function(tokens,index,type){

    for(let i=index+1;i<tokens.length;i++){

        if(tokens[i].type===type)

            return tokens[i];

    }

    return null;

};

/* ==========================================================
   INDEX HELPERS
========================================================== */

GrammarUtils.isFirst=function(tokens,index){

    return index===0;

};

GrammarUtils.isLast=function(tokens,index){

    return index===tokens.length-1;

};

GrammarUtils.inRange=function(tokens,index){

    return index>=0 && index<tokens.length;

};

console.log("[GrammarUtils] Part 2 Ready");
/* ==========================================================
   PATCH HELPERS
========================================================== */

GrammarUtils.createPatch = function (
    start,
    end,
    replacement,
    reason = ""
) {

    return {
        start,
        end,
        replacement,
        reason
    };

};

GrammarUtils.replacePatch = function (
    token,
    replacement,
    reason = ""
) {

    return {

        start: token.start,

        end: token.end,

        replacement,

        reason

    };

};

GrammarUtils.deletePatch = function (
    token,
    reason = ""
) {

    return {

        start: token.start,

        end: token.end,

        replacement: "",

        reason

    };

};

GrammarUtils.insertPatch = function (
    position,
    value,
    reason = ""
) {

    return {

        start: position,

        end: position,

        replacement: value,

        reason

    };

};

/* ==========================================================
   PATCH APPLY
========================================================== */

GrammarUtils.applyPatch = function (
    text,
    patch
) {

    return text.slice(0, patch.start)

        +

        patch.replacement

        +

        text.slice(patch.end);

};

GrammarUtils.applyPatches = function (
    text,
    patches
) {

    if (!patches.length)
        return text;

    patches.sort((a, b) =>

        b.start - a.start

    );

    let result = text;

    for (const patch of patches) {

        result = GrammarUtils.applyPatch(

            result,

            patch

        );

    }

    return result;

};

/* ==========================================================
   TOKEN REPLACEMENT
========================================================== */

GrammarUtils.replaceToken = function (
    token,
    replacement
) {

    return GrammarUtils.replacePatch(

        token,

        replacement

    );

};

GrammarUtils.removeToken = function (
    token
) {

    return GrammarUtils.deletePatch(token);

};

GrammarUtils.insertBefore = function (
    token,
    value
) {

    return GrammarUtils.insertPatch(

        token.start,

        value + " "

    );

};

GrammarUtils.insertAfter = function (
    token,
    value
) {

    return GrammarUtils.insertPatch(

        token.end,

        " " + value

    );

};

/* ==========================================================
   SWAP
========================================================== */

GrammarUtils.swapTokens = function (
    tokenA,
    tokenB
) {

    return [

        GrammarUtils.replacePatch(

            tokenA,

            tokenB.value

        ),

        GrammarUtils.replacePatch(

            tokenB,

            tokenA.value

        )

    ];

};

console.log("[GrammarUtils] Part 3 Ready");
/* ==========================================================
   DICTIONARY HELPERS
========================================================== */

GrammarUtils.getDictionary = function (name) {

    if (!window.GrammarEngine) return null;

    return GrammarEngine.getDictionary(name);

};

GrammarUtils.inDictionary = function (dictionary, word) {

    if (!dictionary || !word)
        return false;

    word = word.toLowerCase();

    if (dictionary instanceof Set)
        return dictionary.has(word);

    if (dictionary instanceof Map)
        return dictionary.has(word);

    if (Array.isArray(dictionary))
        return dictionary.includes(word);

    return false;

};

GrammarUtils.getDictionaryEntry = function (dictionary, word) {

    if (!dictionary || !word)
        return null;

    word = word.toLowerCase();

    if (dictionary instanceof Map)
        return dictionary.get(word);

    return null;

};

/* ==========================================================
   PART OF SPEECH HELPERS
========================================================== */

GrammarUtils.isKnownVerb = function (word) {

    return GrammarUtils.inDictionary(

        GrammarUtils.getDictionary("verbs"),

        word

    );

};

GrammarUtils.isKnownNoun = function (word) {

    return GrammarUtils.inDictionary(

        GrammarUtils.getDictionary("nouns"),

        word

    );

};

GrammarUtils.isKnownAdjective = function (word) {

    return GrammarUtils.inDictionary(

        GrammarUtils.getDictionary("adjectives"),

        word

    );

};

GrammarUtils.isKnownAdverb = function (word) {

    return GrammarUtils.inDictionary(

        GrammarUtils.getDictionary("adverbs"),

        word

    );

};

GrammarUtils.isKnownArticle = function (word) {

    return GrammarUtils.inDictionary(

        GrammarUtils.getDictionary("articles"),

        word

    );

};

GrammarUtils.isKnownPronoun = function (word) {

    return GrammarUtils.inDictionary(

        GrammarUtils.getDictionary("pronouns"),

        word

    );

};

GrammarUtils.isKnownPreposition = function (word) {

    return GrammarUtils.inDictionary(

        GrammarUtils.getDictionary("prepositions"),

        word

    );

};

GrammarUtils.isKnownModal = function (word) {

    return GrammarUtils.inDictionary(

        GrammarUtils.getDictionary("modalVerbs"),

        word

    );

};

GrammarUtils.isKnownAuxiliary = function (word) {

    return GrammarUtils.inDictionary(

        GrammarUtils.getDictionary("auxiliaryVerbs"),

        word

    );

};

/* ==========================================================
   MORPHOLOGY HELPERS
========================================================== */

GrammarUtils.isPluralWord = function (word) {

    const noun = GrammarUtils.getDictionaryEntry(

        GrammarUtils.getDictionary("nouns"),

        word

    );

    return noun?.plural === true;

};

GrammarUtils.isSingularWord = function (word) {

    return !GrammarUtils.isPluralWord(word);

};

GrammarUtils.isComparative = function (word) {

    const adj = GrammarUtils.getDictionaryEntry(

        GrammarUtils.getDictionary("adjectives"),

        word

    );

    return adj?.isComparative === true;

};

GrammarUtils.isSuperlative = function (word) {

    const adj = GrammarUtils.getDictionaryEntry(

        GrammarUtils.getDictionary("adjectives"),

        word

    );

    return adj?.isSuperlative === true;

};

GrammarUtils.baseForm = function (word) {

    const verb = GrammarUtils.getDictionaryEntry(

        GrammarUtils.getDictionary("verbs"),

        word

    );

    return verb?.base || word;

};

GrammarUtils.ingForm = function (word) {

    const verb = GrammarUtils.getDictionaryEntry(

        GrammarUtils.getDictionary("verbs"),

        word

    );

    return verb?.ing || word;

};

GrammarUtils.pastForm = function (word) {

    const verb = GrammarUtils.getDictionaryEntry(

        GrammarUtils.getDictionary("verbs"),

        word

    );

    return verb?.past || word;

};

GrammarUtils.participleForm = function (word) {

    const verb = GrammarUtils.getDictionaryEntry(

        GrammarUtils.getDictionary("verbs"),

        word

    );

    return verb?.participle || word;

};

console.log("[GrammarUtils] Part 4 Ready");
/* ==========================================================
   ANALYZER HELPERS
========================================================== */

GrammarUtils.hasType = function (analysis, type) {

    if (!analysis) return false;

    return analysis.tokens.some(t => t.type === type);

};

GrammarUtils.findByType = function (analysis, type) {

    if (!analysis) return [];

    return analysis.tokens.filter(

        t => t.type === type

    );

};

GrammarUtils.firstOfType = function (analysis, type) {

    if (!analysis) return null;

    return analysis.tokens.find(

        t => t.type === type

    ) || null;

};

GrammarUtils.lastOfType = function (analysis, type) {

    if (!analysis) return null;

    const arr = GrammarUtils.findByType(

        analysis,

        type

    );

    return arr.length

        ? arr[arr.length - 1]

        : null;

};

/* ==========================================================
   SENTENCE HELPERS
========================================================== */

GrammarUtils.wordCount = function (tokens) {

    return tokens.filter(

        t => GrammarUtils.isWord(t)

    ).length;

};

GrammarUtils.tokenCount = function (tokens) {

    return tokens.length;

};

GrammarUtils.toSentence = function (tokens) {

    return tokens

        .map(t => GrammarUtils.getTokenText(t))

        .join(" ")

        .replace(/\s+([.,!?;:])/g, "$1");

};

GrammarUtils.startsWithCapital = function (text) {

    return /^[A-Z]/.test(text);

};

GrammarUtils.endsWithPunctuation = function (text) {

    return /[.!?]$/.test(text.trim());

};

/* ==========================================================
   CONTEXT HELPERS
========================================================== */

GrammarUtils.previousWord = function(tokens,index){

    const token = GrammarUtils.findPreviousWord(

        tokens,

        index

    );

    return token

        ? GrammarUtils.getLower(token)

        : "";

};

GrammarUtils.nextWord = function(tokens,index){

    const token = GrammarUtils.findNextWord(

        tokens,

        index

    );

    return token

        ? GrammarUtils.getLower(token)

        : "";

};

GrammarUtils.isBeginning=function(index){

    return index===0;

};

GrammarUtils.isEnding=function(tokens,index){

    return index===tokens.length-1;

};

/* ==========================================================
   AGREEMENT HELPERS
========================================================== */

GrammarUtils.isBeVerb=function(word){

    return [

        "am",

        "is",

        "are",

        "was",

        "were",

        "be",

        "been",

        "being"

    ].includes(

        word.toLowerCase()

    );

};

GrammarUtils.isDoVerb=function(word){

    return [

        "do",

        "does",

        "did"

    ].includes(

        word.toLowerCase()

    );

};

GrammarUtils.isHaveVerb=function(word){

    return [

        "have",

        "has",

        "had"

    ].includes(

        word.toLowerCase()

    );

};

/* ==========================================================
   TENSE HELPERS
========================================================== */

GrammarUtils.isPast=function(word){

    const entry=

        GrammarUtils.getDictionaryEntry(

            GrammarUtils.getDictionary("verbs"),

            word

        );

    return entry?.tense==="past";

};

GrammarUtils.isPresent=function(word){

    const entry=

        GrammarUtils.getDictionaryEntry(

            GrammarUtils.getDictionary("verbs"),

            word

        );

    return entry?.tense==="present";

};

GrammarUtils.isFutureMarker=function(word){

    return [

        "will",

        "shall"

    ].includes(

        word.toLowerCase()

    );

};

console.log("[GrammarUtils] Part 5 Ready");
/* ==========================================================
   RULE HELPERS
========================================================== */

GrammarUtils.rulePassed = function () {

    return {
        issue: false
    };

};

GrammarUtils.ruleFailed = function (
    reason = "",
    patches = [],
    suggestions = []
) {

    return {

        issue: true,

        reason,

        patches,

        suggestions

    };

};

GrammarUtils.makeSuggestion = function (

    title,

    replacement

) {

    return {

        title,

        replacement

    };

};

/* ==========================================================
   REPORT HELPERS
========================================================== */

GrammarUtils.createReport = function () {

    return {

        grammar: 0,

        spelling: 0,

        punctuation: 0,

        vocabulary: 0,

        style: 0,

        wordOrder: 0,

        tense: 0,

        article: 0,

        adjective: 0,

        adverb: 0,

        pronoun: 0,

        verb: 0,

        noun: 0,

        preposition: 0,

        determiner: 0

    };

};

GrammarUtils.incrementReport = function (

    report,

    category

) {

    if (!report) return;

    if (!(category in report))

        report[category] = 0;

    report[category]++;

};

/* ==========================================================
   SCORE HELPERS
========================================================== */

GrammarUtils.calculateAccuracy = function (

    totalRules,

    failedRules

) {

    if (totalRules === 0)
        return 100;

    return Math.max(

        0,

        Math.round(

            ((totalRules - failedRules)

                / totalRules) * 100

        )

    );

};

GrammarUtils.grade = function (

    score

) {

    if (score >= 95) return "Excellent";

    if (score >= 90) return "Very Good";

    if (score >= 80) return "Good";

    if (score >= 70) return "Fair";

    if (score >= 60) return "Weak";

    return "Poor";

};

/* ==========================================================
   SEVERITY HELPERS
========================================================== */

GrammarUtils.isCritical = function (rule) {

    return rule.severity ===

        GrammarSeverity.CRITICAL;

};

GrammarUtils.isError = function (rule) {

    return rule.severity ===

        GrammarSeverity.ERROR;

};

GrammarUtils.isWarning = function (rule) {

    return rule.severity ===

        GrammarSeverity.WARNING;

};

GrammarUtils.isInfo = function (rule) {

    return rule.severity ===

        GrammarSeverity.INFO;

};

/* ==========================================================
   PATCH SORTING
========================================================== */

GrammarUtils.sortPatches = function (

    patches

) {

    return patches.sort(

        (a, b) => b.start - a.start

    );

};

/* ==========================================================
   DUPLICATE HELPERS
========================================================== */

GrammarUtils.unique = function (

    array

) {

    return [...new Set(array)];

};

GrammarUtils.uniqueTokens = function (

    tokens

) {

    const seen = new Set();

    return tokens.filter(t => {

        const key =

            t.start +

            "-" +

            t.end +

            "-" +

            GrammarUtils.getTokenText(t);

        if (seen.has(key))
            return false;

        seen.add(key);

        return true;

    });

};

/* ==========================================================
   DEBUG
========================================================== */

GrammarUtils.debug = function (

    title,

    value

) {

    console.log(

        "[GrammarUtils]",

        title,

        value

    );

};

/* ==========================================================
   VERSION
========================================================== */

GrammarUtils.version = "9.0";

Object.freeze(GrammarUtils);

window.GrammarUtils = GrammarUtils;

console.log(

    "[GrammarUtils] Version",

    GrammarUtils.version,

    "Loaded Successfully."

);
