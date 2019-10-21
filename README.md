# 网易云音乐NodeJs版播放器精简版

****

此vue音乐播放器项目用于练手和交流

****

#### 接口说明

​         非常感谢由[Binaryify](https://github.com/Binaryify)提供的[网易云音乐NodeJS版](https://binaryify.github.io/NeteaseCloudMusicApi)接口文档

****

#### 技术栈

[ VantUI](https://youzan.github.io/vant/#/zh-CN/intro): Vant - 轻量、可靠的移动端 Vue 组件库,轻量级的移动应用框架,提供了许多日常需要的业务需求的代码片段

 **Vue2**：采用最新Vue2的语法，最新的Vue框架版本。

**Vuex**：实现不同组件之间的状态共享，方便不同组件之间数据交互的便捷。

**vue-router**：单页应用路由管理必备，是 [Vue.js](http://cn.vuejs.org/) 官方的路由管理器，它和 Vue.js 的核心深度集成，让构建单页面应用变得易如反掌，

能够灵活的切换不同相关联的组件

**Ajax(JQ)**：发起http请求，支持多种请求方式包括jsonp等,接收数据，根据返回数据的结果进行页面的对应渲染

**LESS**：css预处理语言

**Webpack**：自动化构建工具，大部分配置vue-cli脚手架已经弄好了，大大缩减环境配置带来的时间效率问题，很方便。

**ES6**：采用ES6语法，它包含了一些很棒的新特性，可以更加方便的实现很多复杂的操作，提高开发人员的效率，这是趋势。

**vuex-persistedstate**：实现Vuex状态管理仓储的永久性储存
**CSS3**：CSS3动画及样式。

**Swiper**：是纯 javascript 打造的滑动特效插件，面向手机、平板电脑等移动终端，能实现触屏焦点图、触屏Tab切换、触屏多图切换等常用效果，开源、免费、稳定、使用简单、功能强大，是架构移动终端网站的重要选择！

****
#### 已完成的功能
  * 主页每日推荐
  * 主页歌单(歌单广场)
  * 主页播放器(player 需向右滑动隐藏或者点击底部显示,支持循环、列表和随机三种播放模式切换,支持显示歌词(点击player中央图片,再次点击因隐藏))
  * 主页推荐歌单(主页正面)
  * 主页搜索功能(主页最右上的搜索图标,搜索的结果的频道中 综合和单曲频道点击可搜索结果的列表可添加到播放列表中并播放)
  * 播放器的歌曲列表列出(支持播放和切换,以及删除,最右下的列表图标)
  * 每日推荐详情页
  * 普通歌单详情页(支持歌单内搜索(歌单fixed定位的右上角图标),搜索的结果也可以点击播放)
  
  ##### 注意事项
  
    歌单广场多个频道和搜索组件的多个频道当滑动到频道底部时,可以再向上滑动,可以加载更多数据 , 即可加载更多结果(向上滑动时会出现加载图标,若向     上滑动了很长的距离而加载图标没有出现说明已经请求加载了全部结果了)
    
    在进入每日推荐界面时，需要先登录才可以根据用户信息来推荐歌曲
    
    在使用chrome用手机调试功能时请再次刷新一遍,以便于再次计算设备宽高进行正确的适配

​        源代码地址：[GitHub](https://github.com/2902854803/neteasemusicformydemo) 欢迎您的star和watching



##### 在线预览：


​       [观看视频](http://47.106.129.158:2000/)

######         已部署到服务器

##### 在线查看地址：
`如果是手机预览,强烈推荐使用 手机版的chrome浏览器 ,因为项目内置的拖拽功能可能与普通浏览器的返回拖动有冲突,在chrome上没有发现这样的问题`


 ​     [网易云音乐播放器](http://47.106.129.158/)

     

#### 快速构建

****

######      使用 Build Setup：

****


```javascript
bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```
