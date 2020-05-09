// ==UserScript==
// @name         1p3a_script
// @namespace    https://github.com/eagleoflqj/p1a3_script
// @version      0.8.6
// @description  方便使用一亩三分地
// @author       Liumeo
// @match        https://www.1point3acres.com/bbs/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_getResourceText
// @grant        GM_info
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @require      https://raw.githubusercontent.com/eagleoflqj/p1a3_script/master/QA.js
// @require      https://raw.githubusercontent.com/eagleoflqj/p1a3_script/master/dream-ui.min.js
// @resource     dreamui https://raw.githubusercontent.com/eagleoflqj/p1a3_script/master/dream-ui.css
// @resource     setting https://raw.githubusercontent.com/eagleoflqj/p1a3_script/master/setting.html
// ==/UserScript==

(function () {
    'use strict';

    const jq = jQuery.noConflict();
    const waitUntilElementLoaded = function (element, retryTimes = 20) { // 异步等待元素出现并返回
        return new Promise((resolve, reject) => {
            const check = (ttl) => {
                const e = jq(element);
                if (!e.length && ttl) { // 未加载且未超时
                    setTimeout(check, 1000, ttl - 1);
                } else {
                    resolve(e); // 已加载或超时，返回jQuery对象
                }
            };
            check(retryTimes);
        });
    };
    // 为本地存储添加命名空间
    const getValue = (namespace, name) => GM_getValue(namespace + '::' + name);
    const setValue = (namespace, name, value) => GM_setValue(namespace + '::' + name, value);
    const deleteValue = (namespace, name) => GM_deleteValue(namespace + '::' + name);
    // 可隐藏的模块
    const hideData = [
        { value: '#toptb', text: "开通VIP" },
        { value: '#scbar', text: "搜索栏" },
        { value: '.mn > div.fl.bm:nth-child(1)', text: "小喇叭" },
        { value: '#portal_block_76', text: "水车排行" },
        { value: '#frameLXyXrm', text: "4x3" },
    ];
    const hideList = hideData.map(e => e.value); // 可隐藏的模块选择器列表
    const hide = () => hideList.forEach(selector => jq(selector).css('display', getValue('hide', selector) ? 'none' : 'block')); // 按本地存储隐藏模块
    // 添加设置对话框
    GM_registerMenuCommand('设置', () => {
        UI.dialog({
            title: '设置',
            content: GM_getResourceText('setting'),
            maskClose: true,
            showButton: false
        });
        // 隐藏模块
        const settingHideData = JSON.parse(JSON.stringify(hideData)); // 深拷贝
        settingHideData.forEach(e => getValue('hide', e.value) && (e.checked = true)); // 按本地存储打勾
        UI.checkbox("#dui-hide", {
            change: arg => { // 立即应用勾选
                hideList.forEach(selector => arg.some(e => e === selector) ? setValue('hide', selector, true) : deleteValue('hide', selector));
                hide();
            },
            data: settingHideData
        });
    });
    GM_addStyle(GM_getResourceText('dreamui')); // 加载DreamUI样式
    GM_addStyle('.ui-checkbox {margin-right:20px; margin-top:20px}'); // CSS优先级问题
    hide();
    // 针对不同页面的操作
    const url = window.location.href;
    if (url.search(/https:\/\/www\.1point3acres\.com\/bbs\/((forum|thread|tag).*)?$/) == 0) { // 可签到、答题的页面
        // 自动签到
        const sign = jq('.wp a:contains("签到领奖")')[0];
        sign && sign.onclick && (sign.click() || 1) &&
            (async () => { // 点击签到领奖
                const qiandao = await waitUntilElementLoaded('#qiandao');
                if (!qiandao.length) {
                    return;
                }
                const faces = qiandao.find('.qdsmilea>li'); // 所有表情
                const selected_face = faces[Math.floor(Math.random() * faces.length)]; // 随机选择表情
                selected_face.onclick();
                const todaysay = qiandao.find('#todaysay'); // 文字框
                todaysay.val('今天把论坛帖子介绍给好基友了~'); // 快速签到的第一句
                const button = qiandao.find('button')[0];
                button.onclick();
            })(); // 保证签到对话框加载
        // 签到后自动答题
        const dayquestion = jq('#um img[src*=ahome_dayquestion]').parent()[0];
        !sign && dayquestion && dayquestion.onclick && (dayquestion.click() || 1) &&
            (async () => {
                const fwin_pop = await waitUntilElementLoaded('#fwin_pop form');
                const question = fwin_pop.find('font:contains(【题目】)').text().slice(5).trim();
                const prompt = '尚未收录此题答案。如果您知道答案，请将\n"\n' + question + '\n{您的答案}\n"\n以issue形式提交至https://github.com/eagleoflqj/p1a3_script/issues';
                const answer = QA[question];
                if (!answer) { // 题库不含此题
                    console.log(prompt);
                    return;
                }
                // 自动回答
                const option_list = [];
                const answer_list = typeof answer === 'string' ? [answer] : answer;
                // 答案和选项取交集
                fwin_pop.find('.qs_option').toArray()
                    .forEach(option => answer_list
                        .filter(answer => option.textContent.trim() === answer)
                        .forEach(() => option_list.push(option)));
                if (!option_list.length) {
                    console.log(prompt);
                    return;
                }
                if (option_list.length > 1) {
                    alert('[Warning] 多个选项与题库答案匹配');
                    return;
                }
                option_list[0].onclick();
                jq('#seccodeverify_SA00')[0].focus();
                // fwin_pop.find('button')[0].click(); // 提交答案
                console.log(question + '\n答案为：' + answer);
            })(); // 保证答题对话框加载
        // 新特性通知，不干扰签到、答题
        !sign && dayquestion && !dayquestion.onclick && (() => {
            const currentVersion = GM_info.script.version;
            // 每个版本只通知一次
            getValue('global', 'lastVersion') !== currentVersion && (setValue('global', 'lastVersion', currentVersion) || 1) &&
                UI.notice.success({
                    title: currentVersion + '更新提示',
                    content: '新增主页可隐藏模块：开通VIP、搜索栏',
                    autoClose: 8000
                });
        })();
    }
    if (url.search('thread') > 0) { // 详情页
        // 自动查看学校、三维
        const elements = jq('.typeoption a:contains(点击查看)');
        elements.toArray().forEach(element => element.onclick());
    } else if (url.search('forum-82-1') > 0 || url.search('forum.php\\?mod=forumdisplay&fid=82') > 0) { // 结果汇报列表页
        // 按上次的筛选条件过滤录取结果
        const search_ids = ['planyr', 'planterm', 'planmajor', 'plandegree', 'planfin', 'result', 'country']; // 过滤下拉菜单id
        const search_button = jq('#searhsort > div.ptm.cl > button'); // 搜索按钮
        if (GM_getValue('searchoption')) { // 上次过滤了
            search_ids.forEach(id => jq('#' + id).val(GM_getValue(id)));// 自动填充下拉菜单
            if (url.search('filter') < 0) { // 当前页面没有过滤
                search_button.click(); // 自动过滤
                return;
            }
        }
        search_button.click(() => { // 如果不全是默认值，记下当前选项
            search_ids.some(id => jq('#' + id).val() !== '0') && GM_setValue('searchoption', 1);
            GM_getValue('searchoption') && search_ids.forEach(id => GM_setValue(id, jq('#' + id).val()));
        });
        // 添加重置按钮
        const reset_button = jq('<button type="button" class="pn pnc"><em>重置</em></button>');
        reset_button.click(() => { // 重置、清存储
            GM_deleteValue('searchoption');
            search_ids.forEach(id => {
                jq('#' + id).val('0');
                GM_deleteValue(id);
            });
        });
        search_button.after(reset_button);
        // 折叠占空间的提示
        const img = jq('#forum_rules_82_img')[0];
        img && img.src.search('collapsed_no') > 0 && img.onclick();
    }
})();
