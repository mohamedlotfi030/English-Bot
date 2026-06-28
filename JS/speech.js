/* ==========================================================
   English-Bot
   speech.js
   Version 1.1
========================================================== */

"use strict";

/* ==========================================================
   Speech Synthesis
========================================================== */

let speechVoices = [];

function loadVoices(){

    speechVoices = speechSynthesis.getVoices();

}

if("speechSynthesis" in window){

    loadVoices();

    window.speechSynthesis.onvoiceschanged = loadVoices;

}

/* ==========================================================
   Speak
========================================================== */

/**
 * Speak text
 * @param {string} text
 * @param {string} lang
 * @param {number} rate
 */

function speak(text, lang = "en-US", rate = 1){

    if(

        !("speechSynthesis" in window) ||

        typeof text !== "string" ||

        !text.trim()

    ){

        return false;

    }

    stopSpeaking();

    const utterance = new SpeechSynthesisUtterance(

        text.trim()

    );

    utterance.lang = lang;

    utterance.rate = rate;

    utterance.pitch = 1;

    utterance.volume = 1;

    const voice =

        speechVoices.find(

            v => v.lang === lang

        ) ||

        speechVoices.find(

            v => v.lang.startsWith(

                lang.split("-")[0]

            )

        );

    if(voice){

        utterance.voice = voice;

    }

    speechSynthesis.speak(utterance);

    return true;

}

/* ==========================================================
   Stop Speaking
========================================================== */

function stopSpeaking(){

    if("speechSynthesis" in window){

        speechSynthesis.cancel();

    }

}

/* ==========================================================
   Pause / Resume
========================================================== */

function pauseSpeaking(){

    if(speechSynthesis.speaking){

        speechSynthesis.pause();

    }

}

function resumeSpeaking(){

    if(speechSynthesis.paused){

        speechSynthesis.resume();

    }

}

/* ==========================================================
   Speech Status
========================================================== */

function isSpeaking(){

    return speechSynthesis.speaking;

}
/* ==========================================================
   Speech Recognition
========================================================== */

let recognition = null;

let listening = false;

/**
 * Start speech recognition
 * @param {Function} callback
 * @param {string} lang
 */

function startListening(callback, lang = "en-US"){

    const SpeechRecognition =

        window.SpeechRecognition ||

        window.webkitSpeechRecognition;

    if(!SpeechRecognition){

        showToast(

            "Speech recognition is not supported.",

            "error"

        );

        return false;

    }

    if(listening){

        stopListening();

    }

    recognition = new SpeechRecognition();

    recognition.lang = lang;

    recognition.interimResults = false;

    recognition.maxAlternatives = 1;

    listening = true;

    recognition.onresult = function(event){

        const transcript =

            event.results[0][0].transcript;

        if(typeof callback === "function"){

            callback(transcript);

        }

    };

    recognition.onerror = function(event){

        console.error(event.error);

        listening = false;

        showToast(

            "Speech recognition failed.",

            "error"

        );

    };

    recognition.onend = function(){

        listening = false;

    };

    recognition.start();

    return true;

}

/**
 * Stop speech recognition
 */

function stopListening(){

    if(recognition){

        recognition.stop();

        listening = false;

    }

}

/**
 * Check if recognition is active
 */

function isListening(){

    return listening;

}

/* ==========================================================
   Available Voices
========================================================== */

/**
 * Get available voices
 */

function getAvailableVoices(){

    return [...speechVoices];

}

/**
 * Find voice by language
 * @param {string} lang
 */

function getVoice(lang){

    return speechVoices.find(

        voice => voice.lang === lang

    ) ||

    speechVoices.find(

        voice =>

            voice.lang.startsWith(

                lang.split("-")[0]

            )

    ) ||

    null;

}

/* ==========================================================
   End of speech.js
========================================================== */