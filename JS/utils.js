/* ==========================================================
   English-Bot
   utils.js
   Version 1.1
========================================================== */

"use strict";

/* ==========================================================
   Escape HTML
========================================================== */

/**
 * Prevent HTML Injection
 * @param {string} text
 * @returns {string}
 */

function escapeHtml(text){

    if(text === null || text === undefined){

        return "";

    }

    return String(text)
        .replace(/&/g,"&amp;")
        .replace(/</g,"&lt;")
        .replace(/>/g,"&gt;")
        .replace(/"/g,"&quot;")
        .replace(/'/g,"&#039;");

}

/* ==========================================================
   Capitalize
========================================================== */

function capitalize(text){

    if(typeof text !== "string" || !text.trim()){

        return "";

    }

    text = text.trim();

    return text.charAt(0).toUpperCase() + text.slice(1);

}

/* ==========================================================
   Generate Random ID
========================================================== */

function generateId(){

    if(window.crypto?.randomUUID){

        return crypto.randomUUID();

    }

    return Date.now().toString(36) +

        Math.random()

            .toString(36)

            .substring(2,10);

}

/* ==========================================================
   Current Date
========================================================== */

function getCurrentDate(locale = "en-US"){

    return new Date().toLocaleString(locale);

}

/* ==========================================================
   Format Date
========================================================== */

function formatDate(date, locale = "en-US"){

    const value = new Date(date);

    if(isNaN(value.getTime())){

        return "";

    }

    return value.toLocaleString(

        locale,

        {

            dateStyle:"medium",

            timeStyle:"short"

        }

    );

}

/* ==========================================================
   Clipboard
========================================================== */

/**
 * Copy text to clipboard
 * @param {string} text
 */

async function copyToClipboard(text){

    try{

        await navigator.clipboard.writeText(String(text));

        showToast("Copied to clipboard.");

        return true;

    }

    catch(error){

        console.error(error);

        showToast("Copy failed.","error");

        return false;

    }

}
/* ==========================================================
   Debounce
========================================================== */

/**
 * Prevent repeated function calls
 */

function debounce(callback, delay = 300){

    let timer;

    return function(...args){

        clearTimeout(timer);

        timer = setTimeout(() => {

            callback.apply(this, args);

        }, delay);

    };

}

/* ==========================================================
   Sleep
========================================================== */

function sleep(ms){

    return new Promise(resolve => setTimeout(resolve, ms));

}

/* ==========================================================
   Download JSON
========================================================== */

function downloadJSON(filename, data){

    try{

        const json = JSON.stringify(data, null, 2);

        const blob = new Blob(

            [json],

            {

                type:"application/json"

            }

        );

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");

        link.href = url;

        link.download = filename;

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);

        URL.revokeObjectURL(url);

        return true;

    }

    catch(error){

        console.error(error);

        showToast("Download failed.","error");

        return false;

    }

}

/* ==========================================================
   Read JSON File
========================================================== */

function readJSON(file){

    return new Promise((resolve, reject)=>{

        if(!(file instanceof File)){

            reject(new Error("Invalid file."));

            return;

        }

        const reader = new FileReader();

        reader.onload = event=>{

            try{

                resolve(

                    JSON.parse(event.target.result)

                );

            }

            catch(error){

                reject(error);

            }

        };

        reader.onerror = ()=>{

            reject(new Error("Failed to read file."));

        };

        reader.readAsText(file);

    });

}

/* ==========================================================
   Toast Notifications
========================================================== */

function showToast(message, type = "success"){

    let toast = document.getElementById("toast");

    if(!toast){

        toast = document.createElement("div");

        toast.id = "toast";

        toast.className = "toast";

        document.body.appendChild(toast);

    }

    toast.textContent = String(message);

    toast.className = `toast ${type} show`;

    clearTimeout(toast.timer);

    toast.timer = setTimeout(hideToast, 3000);

}

function hideToast(){

    const toast = document.getElementById("toast");

    if(toast){

        toast.classList.remove("show");

    }

}

/* ==========================================================
   Loader
========================================================== */

function showLoader(){

    const loader = document.getElementById("loader");

    if(loader){

        loader.classList.remove("hidden");

        loader.style.display = "flex";

    }

}

function hideLoader(){

    const loader = document.getElementById("loader");

    if(loader){

        loader.classList.add("hidden");

        loader.style.display = "none";

    }

}

/* ==========================================================
   Scroll
========================================================== */

function scrollToTop(){

    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

}

/* ==========================================================
   Network
========================================================== */

function isOnline(){

    return navigator.onLine;

}

/* ==========================================================
   Browser Information
========================================================== */

function getBrowserLanguage(){

    return navigator.language || "en-US";

}

/* ==========================================================
   End of utils.js
========================================================== */