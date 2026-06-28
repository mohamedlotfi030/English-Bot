/* ==========================================================
   English-Bot
   storage.js
   Version 1.1
========================================================== */

"use strict";

/* ==========================================================
   Storage Keys
========================================================== */

const STORAGE_KEYS = Object.freeze({

    HISTORY: "englishbot_history",

    FAVORITES: "englishbot_favorites",

    SETTINGS: "englishbot_settings",

    VOCABULARY: "englishbot_vocabulary",

    RECENT_SEARCHES: "englishbot_recent_searches"

});

/* ==========================================================
   Generic Storage Functions
========================================================== */

/**
 * Save any value to localStorage
 * @param {string} key
 * @param {*} value
 * @returns {boolean}
 */

function saveData(key, value){

    try{

        localStorage.setItem(

            key,

            JSON.stringify(value)

        );

        return true;

    }

    catch(error){

        console.error("Storage Error:", error);

        return false;

    }

}

/**
 * Load data from localStorage
 * @param {string} key
 * @param {*} defaultValue
 * @returns {*}
 */

function loadData(key, defaultValue = null){

    try{

        const data = localStorage.getItem(key);

        if(data === null){

            return defaultValue;

        }

        return JSON.parse(data);

    }

    catch(error){

        console.error("Storage Error:", error);

        return defaultValue;

    }

}

/**
 * Remove one key
 * @param {string} key
 * @returns {boolean}
 */

function removeData(key){

    try{

        localStorage.removeItem(key);

        return true;

    }

    catch(error){

        console.error("Storage Error:", error);

        return false;

    }

}

/**
 * Clear all English-Bot data
 * @returns {boolean}
 */

function clearAllData(){

    try{

        Object.values(STORAGE_KEYS).forEach(key=>{

            localStorage.removeItem(key);

        });

        return true;

    }

    catch(error){

        console.error("Storage Error:", error);

        return false;

    }

}

/* ==========================================================
   History Functions
========================================================== */

const MAX_HISTORY_ITEMS = 100;

/**
 * Save grammar history
 * @param {string} sentence
 */

function saveHistory(sentence){

    if(typeof sentence !== "string" || !sentence.trim()){

        return false;

    }

    sentence = sentence.trim();

    let history = loadData(

        STORAGE_KEYS.HISTORY,

        []

    );

    history.unshift({

        id: Date.now(),

        text: sentence,

        createdAt: new Date().toISOString()

    });

    if(history.length > MAX_HISTORY_ITEMS){

        history = history.slice(

            0,

            MAX_HISTORY_ITEMS

        );

    }

    return saveData(

        STORAGE_KEYS.HISTORY,

        history

    );

}

/**
 * Get history
 */

function getHistory(){

    return loadData(

        STORAGE_KEYS.HISTORY,

        []

    );

}

/**
 * Clear history
 */

function clearHistory(){

    return removeData(

        STORAGE_KEYS.HISTORY

    );

}
/* ==========================================================
   Favorite Words
========================================================== */

/**
 * Get favorites
 * @returns {Array}
 */

function getFavorites(){

    return loadData(

        STORAGE_KEYS.FAVORITES,

        []

    );

}

/**
 * Check favorite
 * @param {string} word
 * @returns {boolean}
 */

function isFavorite(word){

    if(typeof word !== "string"){

        return false;

    }

    word = word.trim().toLowerCase();

    return getFavorites().some(

        item =>

            typeof item === "string" &&

            item.toLowerCase() === word

    );

}

/**
 * Add favorite
 * @param {string} word
 * @returns {boolean}
 */

function addFavorite(word){

    if(typeof word !== "string" || !word.trim()){

        return false;

    }

    word = word.trim();

    let favorites = getFavorites();

    if(

        !favorites.some(

            item =>

                item.toLowerCase() === word.toLowerCase()

        )

    ){

        favorites.unshift(word);

    }

    return saveData(

        STORAGE_KEYS.FAVORITES,

        favorites

    );

}

/**
 * Remove favorite
 * @param {string} word
 * @returns {boolean}
 */

function removeFavorite(word){

    if(typeof word !== "string"){

        return false;

    }

    word = word.trim().toLowerCase();

    let favorites = getFavorites();

    favorites = favorites.filter(

        item => item.toLowerCase() !== word

    );

    return saveData(

        STORAGE_KEYS.FAVORITES,

        favorites

    );

}

/**
 * Toggle favorite
 * @param {string} word
 */

function toggleFavorite(word){

    if(isFavorite(word)){

        return removeFavorite(word);

    }

    return addFavorite(word);

}

/* ==========================================================
   Settings
========================================================== */

const DEFAULT_SETTINGS = Object.freeze({

    theme:"dark",

    pronunciation:"en-US",

    speechRate:1,

    autoSpeak:false,

    saveHistory:true,

    saveFavorites:true

});

/**
 * Save application settings
 * @param {Object} settings
 * @returns {boolean}
 */

function saveSettings(settings){

    if(typeof settings !== "object" || settings === null){

        return false;

    }

    return saveData(

        STORAGE_KEYS.SETTINGS,

        settings

    );

}

/**
 * Load application settings
 * @returns {Object}
 */

function loadSettings(){

    return {

        ...DEFAULT_SETTINGS,

        ...loadData(

            STORAGE_KEYS.SETTINGS,

            {}

        )

    };

}

/* ==========================================================
   Recent Searches
========================================================== */

const MAX_RECENT_SEARCHES = 20;

/**
 * Save searched word
 * @param {string} word
 */

function saveRecentSearch(word){

    if(typeof word !== "string" || !word.trim()){

        return false;

    }

    word = word.trim();

    let searches = loadData(

        STORAGE_KEYS.RECENT_SEARCHES,

        []

    );

    searches = searches.filter(

        item =>

            item.toLowerCase() !== word.toLowerCase()

    );

    searches.unshift(word);

    if(searches.length > MAX_RECENT_SEARCHES){

        searches = searches.slice(

            0,

            MAX_RECENT_SEARCHES

        );

    }

    return saveData(

        STORAGE_KEYS.RECENT_SEARCHES,

        searches

    );

}

/**
 * Get searched words
 */

function getRecentSearches(){

    return loadData(

        STORAGE_KEYS.RECENT_SEARCHES,

        []

    );

}

/**
 * Clear searched words
 */

function clearRecentSearches(){

    return removeData(

        STORAGE_KEYS.RECENT_SEARCHES

    );

}
/* ==========================================================
   Export / Import
========================================================== */

/**
 * Export all English-Bot data
 * @returns {Object}
 */

function exportData(){

    return {

        history: getHistory(),

        favorites: getFavorites(),

        settings: loadSettings(),

        recentSearches: getRecentSearches()

    };

}

/**
 * Import data
 * @param {Object} data
 * @returns {boolean}
 */

function importData(data){

    if(typeof data !== "object" || data === null){

        return false;

    }

    try{

        if(Array.isArray(data.history)){

            saveData(

                STORAGE_KEYS.HISTORY,

                data.history

            );

        }

        if(Array.isArray(data.favorites)){

            saveData(

                STORAGE_KEYS.FAVORITES,

                data.favorites

            );

        }

        if(

            typeof data.settings === "object" &&

            data.settings !== null

        ){

            saveSettings(data.settings);

        }

        if(Array.isArray(data.recentSearches)){

            saveData(

                STORAGE_KEYS.RECENT_SEARCHES,

                data.recentSearches

            );

        }

        return true;

    }

    catch(error){

        console.error("Import Error:", error);

        return false;

    }

}

/* ==========================================================
   Statistics
========================================================== */

/**
 * Get application statistics
 * @returns {Object}
 */

function getStatistics(){

    return {

        history: getHistory().length,

        favorites: getFavorites().length,

        recentSearches: getRecentSearches().length

    };

}

/* ==========================================================
   Storage Helpers
========================================================== */

/**
 * Check if Local Storage is available
 * @returns {boolean}
 */

function isStorageAvailable(){

    try{

        const testKey = "__englishbot_test__";

        localStorage.setItem(testKey, testKey);

        localStorage.removeItem(testKey);

        return true;

    }

    catch(error){

        console.error("Storage Unavailable:", error);

        return false;

    }

}

/* ==========================================================
   Initialize Storage
========================================================== */

(function initializeStorage(){

    if(!isStorageAvailable()){

        console.warn(

            "Local Storage is not available."

        );

        return;

    }

    loadSettings();

})();

/* ==========================================================
   End of storage.js
========================================================== */