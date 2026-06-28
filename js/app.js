/* ==========================================================
   English-Bot
   app.js
   Version 2.0
========================================================== */

"use strict";

/* ==========================================================
   Application
========================================================== */

const App = (() => {

    let initialized = false;

    /* ======================================================
       Initialize
    ====================================================== */

    function init(){

        if(initialized){

            return;

        }

        initialized = true;

        console.log(

            "Starting English-Bot..."

        );

        checkBrowserSupport();

        registerGlobalEvents();

        loadApplicationSettings();

        initializeModules();

        console.log(

            "English-Bot initialized successfully."

        );

    }

    /* ======================================================
       Browser Support
    ====================================================== */

    function checkBrowserSupport(){

        if(typeof Storage === "undefined"){

            showToast(

                "Local Storage is not supported.",

                "error"

            );

        }

        if(typeof fetch === "undefined"){

            showToast(

                "Fetch API is not supported.",

                "error"

            );

        }

        if(!("speechSynthesis" in window)){

            showToast(

                "Speech synthesis is not supported.",

                "warning"

            );

        }

    }
        /* ======================================================
       Global Events
    ====================================================== */

    function registerGlobalEvents(){

        window.addEventListener(

            "online",

            function(){

                showToast(

                    "Internet connection restored."

                );

            }

        );

        window.addEventListener(

            "offline",

            function(){

                showToast(

                    "You are offline.",

                    "warning"

                );

            }

        );

        window.addEventListener(

            "error",

            function(event){

                console.error(

                    "Application Error:",

                    event.error ||

                    event.message

                );

            }

        );

        window.addEventListener(

            "unhandledrejection",

            function(event){

                console.error(

                    "Unhandled Promise:",

                    event.reason

                );

            }

        );

    }

    /* ======================================================
       Settings
    ====================================================== */

    function loadApplicationSettings(){

        const settings = loadSettings();

        console.log(

            "Settings loaded:",

            settings

        );

    }

    /* ======================================================
       Initialize Modules
    ====================================================== */

    function initializeModules(){

        if(

            typeof UI !== "undefined" &&

            typeof UI.init === "function"

        ){

            UI.init();

        }

    }
        /* ======================================================
       Restart Application
    ====================================================== */

    function restart(){

        initialized = false;

        console.clear();

        init();

    }

    /* ======================================================
       Application Info
    ====================================================== */

    function getVersion(){

        return "2.0";

    }

    /* ======================================================
       Public API
    ====================================================== */

    return {

        init,

        restart,

        getVersion

    };

})();

/* ==========================================================
   Start Application
========================================================== */

document.addEventListener(

    "DOMContentLoaded",

    function(){

        App.init();

    }

);

/* ==========================================================
   End of app.js
========================================================== */