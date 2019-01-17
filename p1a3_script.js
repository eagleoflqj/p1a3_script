// ==UserScript==
// @name         1p3a_script
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Avoid clicking '点击查看'
// @author       Liumeo
// @match        https://www.1point3acres.com/bbs/forum.php*
// @grant        none
// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// ==/UserScript==

(function() {
    'use strict';

    let jq=jQuery.noConflict();
    let elements=jq('a:contains("点击查看")')
    for(let i=0;i<elements.length;++i){
        elements[i].onclick();
    }
})();