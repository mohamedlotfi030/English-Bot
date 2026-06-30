"use strict";

/* ==========================================================
   English-Bot
   Loader
   Version 5.0
========================================================== */

const Loader = (() => {

    async function loadScript(path) {

        return new Promise((resolve, reject) => {

            const script = document.createElement("script");

            script.src = path;

            script.defer = true;

            script.onload = () => {

                console.log("Loaded:", path);

                resolve();

            };

            script.onerror = () => {

                console.error("Failed:", path);

                reject(path);

            };

            document.body.appendChild(script);

        });

    }

    return {

        loadScript

    };

})();
