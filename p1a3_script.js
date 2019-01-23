// ==UserScript==
// @name         1p3a_script
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  方便使用一亩三分地
// @author       Liumeo
// @match        https://www.1point3acres.com/bbs/*
// @grant        none
// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @require      https://cdn.bootcss.com/jquery-cookie/1.4.1/jquery.cookie.js
// ==/UserScript==

(function() {
    'use strict';

    let jq=jQuery.noConflict();
    let url=window.location.href;
    if(url.search('viewthread')>0){ //详情页
        //自动查看学校、三维
        let elements=jq('a:contains("点击查看")');
        for(let element of elements){
            element.onclick();
        }
    }else if(url.search('forum-82-1')>0 || url.search('forum.php\\?mod=forumdisplay&fid=82')>0){ //结果汇报列表页
        //按上次的筛选条件过滤录取结果
        let search_ids=['planyr','planterm','planmajor','plandegree','planfin','result','country']; //过滤下拉菜单id
        let search_button=jq('#searhsort > div.ptm.cl > button'); //搜索按钮
        if(jq.cookie('searchoption')){ //上次过滤了
            for(let id of search_ids){
                jq('#'+id).val(jq.cookie(id)); //自动填充下拉菜单
            }
            if(url.search('filter')<0){ //当前页面没有过滤
                search_button.click(); //自动过滤
                return;
            }
        }
        search_button.click(()=>{ //如果不全是默认值，记下当前选项
            for(let id of search_ids){
                if(jq('#'+id).val()!='0'){
                    jq.cookie('searchoption',1);
                    break;
                }
            }
            if(jq.cookie('searchoption')){
                for(let id of search_ids){
                    jq.cookie(id,jq('#'+id).val());
                }
            }
        });
        //添加重置按钮
        let reset_button=jq('<button type="button" class="pn pnc"><em>重置</em></button>');
        reset_button.click(()=>{ //重置、清cookie
            jq.removeCookie('searchoption');
            for(let id of search_ids){
                jq('#'+id).val('0');
                jq.removeCookie(id);
            }
        });
        search_button.after(reset_button);
        //折叠占空间的提示
        let img=jq('#forum_rules_82_img')[0];
        img&&img.src.search('collapsed_no')>0&&img.onclick();
    }
})();