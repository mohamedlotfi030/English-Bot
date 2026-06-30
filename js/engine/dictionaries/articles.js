"use strict";

/* ==========================================================
   English-Bot
   Articles Dictionary
   Version 5.0
========================================================== */

const articles = new Map();

/* ==========================================================
   Register Article
========================================================== */

function addArticle({
    form,
    type // definite, indefinite
}) {
    articles.set(
        form.toLowerCase(),
        {
            form,
            type
        }
    );
}

/* ==========================================================
   Articles
========================================================== */

addArticle({ form:"a", type:"indefinite" });
addArticle({ form:"an", type:"indefinite" });
addArticle({ form:"the", type:"definite" });

/* ==========================================================
   Register Dictionary
========================================================== */

GrammarEngine.registerDictionary(
    "articles",
    articles
);

window.articles = articles;
