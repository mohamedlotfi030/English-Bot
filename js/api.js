/* ==========================================================
   English-Bot
   api.js
   Version 1.1
========================================================== */

"use strict";

/* ==========================================================
   API Endpoints
========================================================== */

const API = Object.freeze({

    grammar:
        "https://api.languagetool.org/v2/check",

    dictionary:
        "https://api.dictionaryapi.dev/api/v2/entries/en/",

    translation:
        "https://api.mymemory.translated.net/get"

});

/* ==========================================================
   Timeout Wrapper
========================================================== */

async function fetchWithTimeout(

    url,

    options = {},

    timeout = 10000

){

    const controller = new AbortController();

    const timer = setTimeout(

        () => controller.abort(),

        timeout

    );

    try{

        const response = await fetch(

            url,

            {

                ...options,

                signal: controller.signal

            }

        );

        return response;

    }

    finally{

        clearTimeout(timer);

    }

}

/* ==========================================================
   Safe API Request
========================================================== */

async function safeRequest(callback){

    try{

        return {

            success: true,

            data: await callback()

        };

    }

    catch(error){

        console.error(error);

        return {

            success: false,

            error: error.message || "Unknown error"

        };

    }

}

/* ==========================================================
   Grammar Checker
========================================================== */

async function checkGrammar(text){

    if(typeof text !== "string" || !text.trim()){

        return {

            success:false,

            error:"Invalid text."

        };

    }

    return safeRequest(async()=>{

        const response = await fetchWithTimeout(

            API.grammar,

            {

                method:"POST",

                headers:{

                    "Content-Type":

                    "application/x-www-form-urlencoded"

                },

                body:new URLSearchParams({

                    text:text.trim(),

                    language:"en-US",

                    level:"picky"

                })

            }

        );

        if(!response.ok){

            throw new Error(

                "LanguageTool request failed."

            );

        }

        return await response.json();

    });

}
/* ==========================================================
   Dictionary
========================================================== */

async function searchDictionary(word){

    if(typeof word !== "string" || !word.trim()){

        return {

            success:false,

            error:"Invalid word."

        };

    }

    return safeRequest(async()=>{

        const response = await fetchWithTimeout(

            API.dictionary +

            encodeURIComponent(word.trim())

        );

        if(!response.ok){

            throw new Error(

                "Dictionary request failed."

            );

        }

        return await response.json();

    });

}

/* ==========================================================
   Translation
========================================================== */

async function translateText(text){

    if(typeof text !== "string" || !text.trim()){

        return {

            success:false,

            error:"Invalid text."

        };

    }

    return safeRequest(async()=>{

        const url =

            API.translation +

            "?q=" +

            encodeURIComponent(text.trim()) +

            "&langpair=en|ar";

        const response = await fetchWithTimeout(url);

        if(!response.ok){

            throw new Error(

                "Translation request failed."

            );

        }

        const data = await response.json();

        return {

            translatedText:

                data.responseData?.translatedText || ""

        };

    });

}

/* ==========================================================
   Health Check
========================================================== */

async function isApiAvailable(url){

    try{

        const response = await fetchWithTimeout(

            url,

            {

                method:"HEAD"

            },

            5000

        );

        return response.ok;

    }

    catch{

        return false;

    }

}

/* ==========================================================
   Normalize Grammar Response
========================================================== */

function normalizeGrammarResponse(data){

    if(

        !data ||

        typeof data !== "object"

    ){

        return {

            success:false,

            correctedText:"",

            errors:[],

            score:0

        };

    }

    return {

        success:true,

        correctedText:

            data.correctedText || "",

        errors:

            data.matches || [],

        score:Math.max(

            100 -

            ((data.matches || []).length * 10),

            0

        )

    };

}
/* ==========================================================
   Normalize Dictionary Response
========================================================== */

function normalizeDictionaryResponse(data){

    if(

        !Array.isArray(data) ||

        data.length === 0

    ){

        return {

            success:false,

            word:"",

            phonetic:"",

            meanings:[]

        };

    }

    const entry = data[0];

    return {

        success:true,

        word:entry.word || "",

        phonetic:entry.phonetic || "",

        meanings:Array.isArray(entry.meanings)

            ? entry.meanings

            : [],

        source:entry.sourceUrls || []

    };

}

/* ==========================================================
   Normalize Translation Response
========================================================== */

function normalizeTranslationResponse(data){

    if(

        !data ||

        typeof data !== "object"

    ){

        return {

            success:false,

            text:""

        };

    }

    return {

        success:true,

        text:

            data.translatedText ||

            data.text ||

            ""

    };

}

/* ==========================================================
   Generic JSON Request
========================================================== */

/**
 * Fetch JSON safely
 * @param {string} url
 * @param {Object} options
 * @returns {Promise<Object>}
 */

async function fetchJson(url, options = {}){

    const response = await fetchWithTimeout(

        url,

        options

    );

    if(!response.ok){

        throw new Error(

            `HTTP ${response.status}`

        );

    }

    return await response.json();

}

/* ==========================================================
   API Information
========================================================== */

function getApiInfo(){

    return {

        grammar:API.grammar,

        dictionary:API.dictionary,

        translation:API.translation

    };

}

/* ==========================================================
   End of api.js
========================================================== */
