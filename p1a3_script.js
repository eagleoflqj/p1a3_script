// ==UserScript==
// @name         1p3a_script
// @namespace    https://github.com/eagleoflqj/p1a3_script
// @version      0.4.3
// @description  方便使用一亩三分地
// @author       Liumeo
// @match        https://www.1point3acres.com/bbs/*
// @grant        none
// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @require      https://cdn.bootcss.com/jquery-cookie/1.4.1/jquery.cookie.js
// ==/UserScript==

(function () {
    'use strict';

    let jq = jQuery.noConflict();
    let tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0);
    tomorrow.setMinutes(0);
    tomorrow.setSeconds(0);
    tomorrow = { expires: tomorrow }; //明日0点
    //针对不同页面的操作
    let url = window.location.href;
    if (url === 'https://www.1point3acres.com/bbs/' || url.search('forum.php') > 0) { //可签到、答题的页面
        //自动签到
        if (!jq.cookie('signed')) {
            jq.cookie('signed', 1, tomorrow); //无论是否成功签到，今日不再尝试
            let sign = jq('.wp a:contains("签到领奖")')[0];
            sign && sign.onclick && (sign.onclick() && 0 || setTimeout(() => { //点击签到领奖
                let qiandao = jq('#qiandao');
                if (!qiandao.length) {
                    return;
                }
                let faces = qiandao.find('.qdsmilea>li'); //所有表情
                let selected_face = faces[Math.floor(Math.random() * faces.length)]; //随机选择表情
                selected_face.onclick();
                let todaysay = qiandao.find('#todaysay'); //文字框
                todaysay.val('今天把论坛帖子介绍给好基友了~'); //快速签到的第一句
                let button = qiandao.find('button')[0];
                button.onclick();
            }, 1000)); //保证签到对话框加载
        }
        //自动答题
        if (jq.cookie('signed') && !jq.cookie('answered')) { //今天已（尝试）签到，尚未（尝试）答题
            jq.cookie('answered', 1, tomorrow); //无论是否成功答题，今日不再尝试
            let QA = {
                '【题目】 下面哪个情况，不会消耗你的积分？': '看到干货帖子和精华回复，给作者加分！',
                '【题目】 哪种选校策略最合理？': '根据自己下一步职业和学业目标，参考地里数据和成功率，认真斟酌',
                '【题目】 论坛鼓励如何发面经？': '以上都正确',
            }; //题库
            let dayquestion = jq('#um img[src*=ahome_dayquestion]').parent()[0];
            dayquestion && dayquestion.onclick && (dayquestion.onclick() && 0 || setTimeout(() => {
                let fwin_pop = jq('#fwin_pop form');
                let question = fwin_pop.find('font:contains(【题目】)').text();
                let answer = QA[question];
                if (!answer) { //题库不含此题
                    console.log('尚未收录此题答案。如果您知道答案，请将\n"\n' + question + '\n{您的答案}\n"\n以issue形式提交至https://github.com/eagleoflqj/p1a3_script/issues');
                } else { //自动回答
                    let option = fwin_pop.find('.qs_option:contains(' + answer + ')')[0];
                    option.onclick();
                    let button = fwin_pop.find('button')[0];
                    button.click(); //提交答案
                    console.log(question + '\n答案为：' + answer);
                }
            }, 1000)); //保证答题对话框加载
        }
    }
    if (url.search('viewthread') > 0) { //详情页
        //自动查看学校、三维
        let elements = jq('a:contains(点击查看)');
        for (let element of elements) {
            element.onclick();
        }
    } else if (url.search('forum-82-1') > 0 || url.search('forum.php\\?mod=forumdisplay&fid=82') > 0) { //结果汇报列表页
        //按上次的筛选条件过滤录取结果
        let search_ids = ['planyr', 'planterm', 'planmajor', 'plandegree', 'planfin', 'result', 'country']; //过滤下拉菜单id
        let search_button = jq('#searhsort > div.ptm.cl > button'); //搜索按钮
        if (jq.cookie('searchoption')) { //上次过滤了
            for (let id of search_ids) {
                jq('#' + id).val(jq.cookie(id)); //自动填充下拉菜单
            }
            if (url.search('filter') < 0) { //当前页面没有过滤
                search_button.click(); //自动过滤
                return;
            }
        }
        let expire = { expires: 365 }; //cookie有效期
        search_button.click(() => { //如果不全是默认值，记下当前选项
            for (let id of search_ids) {
                if (jq('#' + id).val() != '0') {
                    jq.cookie('searchoption', 1, expire);
                    break;
                }
            }
            if (jq.cookie('searchoption')) {
                for (let id of search_ids) {
                    jq.cookie(id, jq('#' + id).val(), expire);
                }
            }
        });
        //添加重置按钮
        let reset_button = jq('<button type="button" class="pn pnc"><em>重置</em></button>');
        reset_button.click(() => { //重置、清cookie
            jq.removeCookie('searchoption');
            for (let id of search_ids) {
                jq('#' + id).val('0');
                jq.removeCookie(id);
            }
        });
        search_button.after(reset_button);
        //折叠占空间的提示
        let img = jq('#forum_rules_82_img')[0];
        img && img.src.search('collapsed_no') > 0 && img.onclick();
    }
})();
