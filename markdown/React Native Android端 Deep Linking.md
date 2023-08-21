# React Native Android端 Deep Linking

[本文 github 仓库链接](https://github.com/sRect/reactNativeBlogApp)

## 1. `Deep Linking`的日常使用场景

1. 从并夕夕app分享到微信，邀请好友砍一刀，其中有的链接打开后是h5页面，h5页面打开后，弹出提示，“立即打开xx应用”，或者打开后，要求右上角在本机浏览器中打开，然后浏览器里弹出提示，“当前网站请求打开xx应用”。

2. 从app中，或者短信中打开微信小程序，链接如`weixin://dl/business/?t= *TICKET*`。

## 2. 什么是`Deep Linking`?

[文档](https://www.reactnative.cn/docs/security#authentication-and-deep-linking)中提到：

> Mobile apps have a unique vulnerability that is non-existent in the web: deep linking. Deep linking is a way of sending data directly to a native application from an outside source. A deep link looks like app:// where app is your app scheme and anything following the // could be used internally to handle the request.

> Deep links are not secure and you should never send any sensitive information in them.

总结：
1. `Deep Linking`是手机端app中独有的；

2. `Deep Linking`是一种通过外面链接把数据发送到app里的方法；

3. `Deep Linking`长得像`app://`，其中“*app*”是你的app包名，“*//*”后面跟的内容，用来给app处理的；

4. `Deep Linking`是不安全的，不要通过这种方式发送敏感数据。

## 3. 