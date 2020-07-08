本项目使用了[marked](https://github.com/markedjs/marked)项目来解析markdown

- 这个东西是什么？

  - 就是一个支持markdown并自动在开头添加deadline提醒信息的备忘录

- 这个东西的意义？

  - 作为一只拥有草履虫一般脑容量的人类，记ddl对我来说总是一件困难的事
  - 作为一只拥有草履虫一般脑容量的人类，即使ddl的日期放我面前我也会因为忘记今天是几号而忽视ddl
  - 作为一只拥有草履虫一般脑容量的懒成一坨的人类，每天确认ddl实在太麻烦了
  - 作为一只拥有草履虫一般脑容量的人类，我写我们学校的丧病实验写烦了，于是就做了个这个调节下心情

- 这个东西的使用方法？

  - 点击内容可以进入编辑模式，在编辑模式里使用类似下方的格式。比如下面这个内容所对应的ddl分别为今年6月18日早上八点，今年本月11日，以及2020年6月17日18点1分32秒。

    ```markdown
    - 6.18 8
      - 女朋友生日礼物
       - 淘宝收藏
    - 11
        - （重要）编译原理课后题
        - 数据库实验
        - 编译系统实验
    - 2020.6.17 18:01:32
        - 大数据分析实验
    - 图片测试
    ![](http://scp-sandbox-3.wdfiles.com/local--files/miumeat/07___libra___scp_2597_by_sunnyclockwork-dbbvj3l.jpg)
    ```
    这个小玩意会利用正则匹配形似`- 日期 时间`的形式，日期格式为`年.月.日`或`月.日`或`日`，时间格式为`时:分:秒`或`时:分`或`时`。其中年月的默认值是今年今月，时分秒的默认值是早上八点整，ddl为匹配到的所有日期中最早的日期。由于使用timestamp，不建议使用1970年那个日期之前的日期作为ddl（穿越者的ddl才会在那个时间吧！）。如果当前时间超过了ddl会红字警告并提醒是否忘记了ddl；如果ddl距离当前日期等小于2天会红字警告并显示倒计时；如果ddl距离当前日期大于2天只会正常提示ddl距离当前的天数
    
  - 我把它和 [SAO Utils](http://sao.gpbeta.com/) 一起使用，这是一个可以给桌面加上超多挂件，甚至还能加基于网页的挂件的工具，附上官方的介绍
  
    - SAO Utils 是什么？
      >
      > SAO Utils 是一款还原神作 SAO（刀剑神域）外观风格的启动器，搭载各种各样强大的小工具。
      >
      > 它所设计的 [插件模式](http://sao.gpbeta.com/#section_develop)，可以让任何的开发者为其设计插件并让其自动加载。
  
    - 听起来很酷？
    
      的确如此，它超~酷。
    
      但需要注意的是，SAO Utils本体的最近一次更新是在2019.05.03，之后的更新日志都是“更新开发笔记”，而且这个项目所配合的支持网页挂件功能插件最后一次更新已经是2016.03.30了，所以不要对新功能抱有不切实际的期望。
    
      但即便如此，SAO Utils目前仍然足够强大且易用，即使不更新问题也不大。只是因为网页插件的内核还是Chromium 45.0.2454.101这个16年的老旧版本，有些新功能不受支持。比如正则表达式的命名捕获分组功能在这个版本中就不受支持。
    
    - 你也想写个类似的插件？
    
      很简单，你可以在SAO Utils的官网中的[SAO Utils 插件 – 桌面网页挂件](http://www.gpbeta.com/post/develop/sao-utils-web-widget/)一节中找到很多的示例。
    
      实际上这个东西就是参考官方提供的[SAO 记事本](http://www.gpbeta.com/post/develop/sao-utils-web-widget/#demo_widget)做出来的，但研究了一下感觉自己并不需要[CKEditor](http://ckeditor.com/)的“所见即所得”编辑模式，但需要markdown。于是我就开始大改特改，现在这个项目里大概只有`index.html`中的`!DOCTYPE`与`html`标签还留着原本的样子了

