"use strict";

/* ==========================================================
   English-Bot
   Loader
   Version 5.0
========================================================== */

const Loader = (() => {

    const groups = {

        utilities: [
            "./js/utils.js",
            "./js/storage.js",
            "./js/speech.js",
            "./js/api.js"
        ],

        engine: [
            "./js/engine/engine.js",
            "./js/engine/grammar.js",
            "./js/engine/tokenizer.js",
            "./js/engine/analyzer.js",
            "./js/engine/corrector.js",
            "./js/engine/ruleManager.js"
        ],

        dictionaries: [

        ],

        rules: [

        ],

        application: [
            "./js/checker.js",
            "./js/dictionary.js",
            "./js/ui.js",
            "./js/app.js"
        ]

    };

    async function loadScript(path){

        return new Promise((resolve,reject)=>{

            const script=document.createElement("script");

            script.src=path;

            script.defer=true;

            script.onload=()=>{

                console.log("Loaded:",path);

                resolve();

            };

            script.onerror=()=>{

                console.error("Failed:",path);

                reject(path);

            };

            document.body.appendChild(script);

        });

    }

    async function loadGroup(group){

        for(const file of group){

            await loadScript(file);

        }

    }

    async function initialize(){

        console.log("Loading English-Bot...");

        await loadGroup(groups.utilities);

        await loadGroup(groups.engine);

        await loadGroup(groups.dictionaries);

        await loadGroup(groups.rules);

        await loadGroup(groups.application);

        console.log("English-Bot Loaded Successfully.");

    }

    return{

        initialize,

        groups

    };

})();
