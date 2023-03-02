## React Native Blog App

### 1. 本地开发

1. 安卓

> 如果已经连接真机，会在真机中安装测试 app，没连接真机会打开模拟器调试开发

```
npm run android
```

2. ios

```
npm run ios
```

### 2. 安卓 apk 打包

1. 更新 version 版本号

```
npm version xx.xx.xx
```

2. 执行打包

> 生成的 apk 文件在 `android/app/build/outputs/apk/release/app-release.apk`

```
npm run build:android
```

### 3. 安卓 google 应用市场 aab 打包

> 生成的 apk 文件在 `android/app/build/outputs/bundle/release/app-release.aab`

```
npm run build:android:aab
```
