import React, {memo, useRef, useEffect, useState} from 'react';
import {
  View,
  ScrollView,
  Image,
  StyleSheet,
  Pressable,
  // useWindowDimensions,
  Alert,
  Vibration,
  Platform,
  // ToastAndroid,
  // TouchableHighlight,
  Text,
  AppState,
  PermissionsAndroid,
  NativeEventEmitter,
  NativeModules,
  AppRegistry,
} from 'react-native';
import {useNavigate} from 'react-router-native';
import {
  WingBlank,
  WhiteSpace,
  Toast,
  List,
  Button,
} from '@ant-design/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from 'react-native-config';
import * as WeChat from 'react-native-wechat-lib';
import NavBar from '../../components/NavBar';
import {FlashlightManager, MyNotificationManager} from '../../utils';

const About = () => {
  // const {height: windowHeight} = useWindowDimensions();
  const navigate = useNavigate();
  const appState = useRef(AppState.currentState);
  const lightTypeRef = useRef(false);
  const [headlessTaskId, setHeadlessTaskId] = useState('');
  const [locationList, setLocationList] = useState([]);

  const isHermes = () => !!global.HermesInternal;
  const PlayMusicManager = NativeModules.PlayMusicManager;
  const BackgroundPosition = NativeModules.BackgroundPosition;

  const openModal = () => {
    Alert.alert('只因太美', '只因与荔枝是兄弟吗', [
      {
        text: '否',
        onPress: () => {
          Vibration.vibrate(200);
          Toast.info({
            content: '你个小黑粉',
            duration: 1,
            stackable: true,
          });
        },
        style: 'cancel',
      },
      {
        text: '是',
        onPress: () => {
          Toast.success({
            content: <Text style={styles.ikun}>你是真ikun</Text>,
            duration: 2,
            stackable: true,
          });
        },
      },
    ]);
  };

  const handleOpenMinApp = async () => {
    try {
      const res = await WeChat.launchMiniProgram({
        userName: 'gh_19f12501594e',
        miniProgramType: 0,
        // path: 'pages/index/index',
      });
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  // 申请摄像机权限
  const handleAndroidPermissin = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: '闪光灯授权',
          message: '获取闪光灯权限',
          buttonNeutral: '跳过',
          buttonNegative: '取消',
          buttonPositive: '同意',
        },
      );

      console.log('授权结果granted==>', granted);
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('可以打开闪光灯了');
        return Promise.resolve();
      } else if (granted === PermissionsAndroid.RESULTS.DENIED) {
        Toast.fail({
          content: '已拒绝打开闪光灯',
        });
        return Promise.reject();
      } else {
        Toast.fail({
          content: '用户已拒绝，且不愿被再次询问',
        });
        return Promise.reject();
      }
    } catch (error) {
      console.error(error);
    }
  };

  // 申请定位权限
  const handleAndroidPositionPermission = async () => {
    try {
      // https://juejin.cn/post/7058265721540706311
      // android 11及以上版本申请权限时系统对话框不存在始终允许的选项，并且只能够在系统设置页面打开后台权限。
      // 如果同时申请这三个权限时不会弹窗，系统会忽略权限请求，不会授予其中的任一权限。
      // 在android 11级以上版本需要先申请ACCESS_COARSE_LOCATIO和ACCESS_FINE_LOCATION后
      // 再申请ACCESS_BACKGROUND_LOCATION权限，才能确保前台访问位置权限和后台访问位置权限正常。
      const granted1 = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        // PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
      ]);

      const granted2 = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
      );

      console.log('granted1==>', granted1);
      console.log('granted2==>', granted2);

      if (
        granted1['android.permission.ACCESS_FINE_LOCATION'] ===
          PermissionsAndroid.RESULTS.GRANTED &&
        granted1['android.permission.ACCESS_COARSE_LOCATION'] ===
          PermissionsAndroid.RESULTS.GRANTED &&
        granted2 === PermissionsAndroid.RESULTS.GRANTED
      ) {
        console.log('可以定位了');
        return Promise.resolve();
      } else {
        console.log('拒绝获取定位权限');
        Toast.fail({
          content: <Text style={styles.ikun}>拒绝获取定位权限</Text>,
          duration: 2,
          stackable: true,
        });
        return Promise.reject({msg: '拒绝获取定位权限'});
      }
    } catch (error) {
      console.warn(error);
      return Promise.reject();
    }
  };

  // 打开、关闭手电筒
  const toggleLight = async () => {
    try {
      await handleAndroidPermissin();
      const suportRes = await FlashlightManager.isSuportFlashlight();
      console.log('当前手机是否支持闪光灯:', suportRes);
      // await sleep(2000);
      // const falshlightType = await FlashlightManager.getFlashlightType();
      // console.log('当前手机闪光灯状态:', falshlightType);
      console.log('准备打开/关闭手电筒:', lightTypeRef.current ? 0 : 1);
      const res = await FlashlightManager.toggleLight(
        lightTypeRef.current ? 0 : 1,
      );

      lightTypeRef.current = res;
      console.log('手电筒打开/关闭结果:', res);
    } catch (error) {
      console.error('打开/关闭手电筒异常', error);
    }
  };

  // 申请通知权限
  const handleNotificationPermission = async () => {
    console.log('Platform.Version', Platform.Version);
    if (Platform.Version < 33 && Platform.OS === 'android') {
      return Promise.resolve();
    }

    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        {
          title: '通知授权',
          message: '获取通知权限',
          buttonNeutral: '跳过',
          buttonNegative: '取消',
          buttonPositive: '同意',
        },
      );

      console.log('授权结果granted==>', granted);
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        return Promise.resolve();
      } else if (granted === PermissionsAndroid.RESULTS.DENIED) {
        Toast.fail({
          content: '已拒绝通知权限',
        });
        return Promise.reject();
      } else {
        Toast.fail({
          content: '用户已拒绝，且不愿被再次询问',
        });
        return Promise.reject();
      }
    } catch (error) {
      console.error(error);
      return Promise.reject();
    }
  };

  const handleNotification = async () => {
    try {
      await handleNotificationPermission();

      const ctxId = Math.ceil(Math.random() * 10000000);
      MyNotificationManager.show(
        ctxId, // android中PendingIntent.getActivity的id,每次调用必须唯一，否则可能拿到旧数据
        '文章更新啦！', // 通知标题
        '查看新文章', // 通知内容
        'PageToJumpTo', // 需要调用android中哪个activity名称
        '/list', // 点击通知时需要跳转的路径
      );
    } catch (error) {
      console.log(error);
    }
  };

  // 申请读取文件权限
  // const handlePlayMusicPermission = async () => {
  //   try {
  //     const granted = await PermissionsAndroid.request(
  //       PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
  //       {
  //         title: '读写文件授权',
  //         message: '获取读写文件权限',
  //         buttonNeutral: '跳过',
  //         buttonNegative: '取消',
  //         buttonPositive: '同意',
  //       },
  //     );

  //     console.log('授权结果granted==>', granted);
  //     if (granted === PermissionsAndroid.RESULTS.GRANTED) {
  //       return Promise.resolve();
  //     } else if (granted === PermissionsAndroid.RESULTS.DENIED) {
  //       Toast.fail({
  //         content: '已拒绝通知权限',
  //       });
  //       return Promise.reject();
  //     } else {
  //       Toast.fail({
  //         content: '用户已拒绝，且不愿被再次询问',
  //       });
  //       return Promise.reject();
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     return Promise.reject();
  //   }
  // };

  // 在后台播放音乐
  const handleBackgroundPlayMusic = async type => {
    try {
      const taskId = Math.ceil(Math.random() * 10000000);
      const taskKey = 'backgroundPlayMusic';
      let mp3FileName = 'amaji';

      if (type === 'play') {
        // await handlePlayMusicPermission();
        if (!headlessTaskId) {
          console.log('开始后台任务', taskId, type);
          AppRegistry.startHeadlessTask(taskId, taskKey, {
            taskId,
            taskKey,
            payload: {
              mp3FileName,
              playerStatus: 'play',
              taskId,
            },
          });
          setHeadlessTaskId(taskId);
        } else {
          console.log('继续播放');
          await PlayMusicManager.control(mp3FileName, 'play');
        }
      } else {
        if (type === 'pause') {
          await PlayMusicManager.control(mp3FileName, 'pause');
        } else {
          await PlayMusicManager.control(mp3FileName, 'release');
          console.log('结束后台任务', headlessTaskId);
          AppRegistry.cancelHeadlessTask(headlessTaskId, taskKey);
          setHeadlessTaskId('');
        }
      }
    } catch (error) {
      console.error('backgroundPlayMusicTask error', error);
    }
  };

  // Headless JS后台任务
  const handleBackgroundTask = async type => {
    try {
      if (type === 'start') {
        await handleAndroidPositionPermission();
        // const taskId = Math.ceil(Math.random() * 10000000);
        // AppRegistry.startHeadlessTask(taskId, 'BackgroundTask');
        await BackgroundPosition.startBackgroudTask();
      } else {
        await BackgroundPosition.stopBackgroudTask();
      }
    } catch (error) {
      console.error('handleBackgroundTask error', error);
    }
  };

  useEffect(() => {
    (async function () {
      try {
        // 腾讯开放平台创建的移动应用必须要审核通过后，才能进行分享，支付等操作
        const res = await WeChat.registerApp(
          'wxed786df10438e24f',
          'https//baidu.com',
        );
        console.log('registerApp==>', res);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  useEffect(() => {
    // 监听后台任务音乐播放结束
    const eventEmitter = new NativeEventEmitter(NativeModules.PlayMusicManager);
    const eventEmitter2 = new NativeEventEmitter(
      NativeModules.TestModuleManager,
    );

    const eventListener = eventEmitter.addListener(
      'backgroundMusicPlayEnd',
      event => {
        console.log('backgroundMusicPlayEnd:', event); // "someValue"
        setHeadlessTaskId('');
      },
    );

    const eventListener2 = eventEmitter2.addListener(
      'backgroundTask',
      async event => {
        console.log('backgroundTask:', event);
        // const taskId = Math.ceil(Math.random() * 10000000);
        // AppRegistry.startHeadlessTask(taskId, 'backgroundTask');
      },
    );

    return () => {
      eventListener && eventListener.remove(); // 组件卸载时记得移除监听事件
      eventListener2 && eventListener2.remove();
    };
  }, []);

  useEffect(() => {
    console.log('about appState', appState);
    (async function () {
      if (appState.current === 'active') {
        let locationListStr = await AsyncStorage.getItem('location');
        console.log('locationListStr', locationListStr);
        if (locationListStr) {
          let obj = JSON.parse(locationListStr);

          setLocationList(obj.list);
        }
      }
    })();
  }, [appState]);

  return (
    <>
      <NavBar title="关于我" />
      <WingBlank size="md">
        <View>
          {locationList.length === 0 ? (
            <Pressable onPress={openModal} style={styles.center}>
              <Image
                source={require('../../assets/img/test2.png')}
                resizeMode="contain"
              />
            </Pressable>
          ) : (
            <ScrollView style={styles.locationScrollView}>
              <List style={styles.listWrap}>
                {locationList.map((item, key) => (
                  <List.Item wrap extra="" arrow="empty" key={key}>
                    {`latitude:${item.latitude}, longitude:${
                      item.longitude
                    }, date: ${item.date || ''}`}
                  </List.Item>
                ))}
              </List>
            </ScrollView>
          )}

          <WhiteSpace />

          {/* <TouchableHighlight
            style={styles.btn}
            onPress={() => navigate('/animatedDemo/aniBase')}>
            <View style={styles.btnWrap}>
              <Text style={styles.btnText}>go to animated</Text>
            </View>
          </TouchableHighlight> */}

          <ScrollView style={styles.scrollView}>
            <List style={styles.listWrap}>
              <List.Item
                extra=""
                arrow="horizontal"
                onPress={() => navigate('/animatedDemo/aniBase')}>
                animated demo
              </List.Item>
              <List.Item wrap extra={appState.current} arrow="empty">
                appState
              </List.Item>
              <List.Item wrap extra={Config.BASE_URL} arrow="empty">
                BASE_URL
              </List.Item>
              <List.Item
                extra={Config.NODE_ENV === 'development' ? 'debug' : 'release'}
                arrow="empty">
                环境
              </List.Item>
              <List.Item extra={Config.VERSION_NAME} arrow="empty">
                版本
              </List.Item>
              <List.Item
                wrap
                extra={isHermes() ? 'true' : 'false'}
                arrow="empty">
                Hermes引擎开启状态
              </List.Item>
              <List.Item
                arrow="empty"
                extra={
                  <View style={styles.backgroundTask}>
                    <View style={styles.backgroundTask}>
                      <Button
                        type="ghost"
                        size="small"
                        style={styles.backgroundTaskBtn}
                        onPress={() => handleBackgroundPlayMusic('play')}>
                        播放
                      </Button>
                      <Button
                        type="ghost"
                        size="small"
                        style={styles.backgroundTaskBtn}
                        disabled={headlessTaskId === ''}
                        onPress={() => handleBackgroundPlayMusic('pause')}>
                        暂停
                      </Button>
                      <Button
                        type="ghost"
                        size="small"
                        style={styles.backgroundTaskBtn}
                        disabled={headlessTaskId === ''}
                        onPress={() => handleBackgroundPlayMusic('release')}>
                        结束
                      </Button>
                    </View>
                  </View>
                }>
                后台播放音乐
              </List.Item>
              <List.Item
                arrow="empty"
                extra={
                  <View style={styles.backgroundTask}>
                    <View style={styles.backgroundTask}>
                      <Button
                        type="ghost"
                        size="small"
                        style={styles.backgroundTaskBtn}
                        onPress={() => handleBackgroundTask('start')}>
                        开始
                      </Button>
                      <Button
                        type="ghost"
                        size="small"
                        style={styles.backgroundTaskBtn}
                        onPress={() => handleBackgroundTask('stop')}>
                        结束
                      </Button>
                    </View>
                  </View>
                }>
                Headless JS后台任务
                <List.Item.Brief>后台GPS持续获取定位</List.Item.Brief>
              </List.Item>
              <List.Item extra="" arrow="horizontal" onPress={handleOpenMinApp}>
                打开微信小程序
                <List.Item.Brief>
                  腾讯开放平台创建的移动应用必须审核通过，这里审核没通过，所以拉起小程序失败
                </List.Item.Brief>
              </List.Item>
              <List.Item
                extra=""
                arrow="horizontal"
                onPress={() => navigate('/amapDemo/31/121')}>
                高德地图
              </List.Item>
              <List.Item
                extra={
                  <Button type="ghost" size="small" onPress={toggleLight}>
                    打开/关闭
                  </Button>
                }>
                调用安卓原生打开手电筒
              </List.Item>
              <List.Item
                extra={
                  <Button
                    type="ghost"
                    size="small"
                    onPress={handleNotification}>
                    点击
                  </Button>
                }>
                通知Notification
              </List.Item>
              <List.Item
                extra=""
                arrow="horizontal"
                onPress={() => navigate('/deepLinks')}>
                Deep Links
              </List.Item>
            </List>
          </ScrollView>
        </View>
      </WingBlank>
    </>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    // flex: 1,
    backgroundColor: '#f0f0f0',
    paddingTop: 20,
    alignItems: 'center',
  },
  ikun: {
    fontFamily: '',
    color: '#ffffff',
  },
  center: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    width: '100%',
    height: 450,
  },
  locationScrollView: {
    width: '100%',
    height: 200,
  },
  listWrap: {
    height: '100%',
    width: '100%',
  },
  location: {
    fontFamily: '',
  },
  backgroundTask: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  backgroundTaskBtn: {
    width: 50,
    marginRight: 2,
  },
});

export default memo(About);
