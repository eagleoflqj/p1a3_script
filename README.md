# p1a3_script
[![Total alerts](https://img.shields.io/lgtm/alerts/g/eagleoflqj/p1a3_script.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/eagleoflqj/p1a3_script/alerts/)
[![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/eagleoflqj/p1a3_script.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/eagleoflqj/p1a3_script/context:javascript)
  
一亩三分地的油猴脚本
# 安装
## 自动（推荐）
0. 安裝[油猴](https://greasyfork.org/)插件
1. 点击油猴图标
2. 管理面板
3. 页面中点击实用工具
4. 在URL文本框输入源码[地址](https://raw.githubusercontent.com/eagleoflqj/p1a3_script/master/p1a3_script.js)，点击导入

![安装過程](https://user-images.githubusercontent.com/14802181/85127126-730c9e00-b261-11ea-885c-6622b760352a.png)

## 手动（不推荐）
点击油猴图标->添加新脚本，粘贴p1a3_script.js的源码，Ctrl+S
## Greasy Fork（不推荐）
为了推广，本项目发布到了Greasy Fork（下称GF），但建议你仍采用上述自动方式安装，原因如下
* 目前题库与业务逻辑分离，业务逻辑需要以外部脚本的方式引用题库
* GF拒绝`raw.githubusercontent.com`的外部脚本，所以我需要将题库作为一个单独的Library发布到GF
* GF有自动同步脚本的功能，只要我push到Github上的脚本版本号更高，GF就会自动拉取（有一定延迟）；但根据我的测试，GF上业务逻辑引用题库的URL需要指定version参数，否则即使题库更新了，业务逻辑也无法引用到新版题库
* 所以为了将Github自动同步到GF，我在更新题库、更新题库版本号之后，还需要更新业务逻辑的引用URL和业务逻辑版本号（为什么不是一次commit更新这4项，因为version参数是GF生成的，必须先更新题库才能获得）
* 模块化是原则，DRY也是原则，GF不是原则；三者冲突时，舍弃GF

Greasy Fork已停更，请删除并切换为自动安装
# 更新
为保证用户体验请及时更新
## 自动
若自动安装，则可点击油猴图标->用户脚本检查更新，或油猴图标->管理面板，点击最后更新列中脚本的时间
## 手动
同手动安装
## Greasy Fork
卸载
# 功能
## 论坛
### 自动签到
需要你绑定微信
### 隐藏模块
请使用设置功能（点击油猴图标->(1p3a_script下的)设置）
## 定位贴和录取汇报贴
### 自动查看学校、三维
需要你有足够的积分
## 录取汇报版
### 自动折叠录取汇报版规
需要你自觉遵守
### 记录上次的录取汇报筛选条件
### 重置筛选条件
## Doing
### 自动答题
题库维护中，目前共有148题  
成功答题或题目不在题库，console会有提示
# QQ群
652122176  
暗号：一亩三分地  
欢迎技术爱好者加群交流，或对脚本提出意见
# 致谢
## 开源项目
* [jQuery](https://jquery.com/)
* [DreamUI](https://dreamui.applinzi.com/)
