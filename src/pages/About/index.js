import React, {memo, useRef, useEffect, useState} from 'react';
import {
  View,
  Image,
  StyleSheet,
  Pressable,
  // useWindowDimensions,
  Alert,
  Vibration,
  // Platform,
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

  const isHermes = () => !!global.HermesInternal;
  const PlayMusicManager = NativeModules.PlayMusicManager;

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

    const eventListener = eventEmitter.addListener(
      'backgroundMusicPlayEnd',
      event => {
        console.log('backgroundMusicPlayEnd:', event); // "someValue"

        setHeadlessTaskId('');
      },
    );

    return () => {
      eventListener && eventListener.remove(); // 组件卸载时记得移除监听事件
    };
  }, []);

  return (
    <>
      <NavBar title="关于我" />
      <WingBlank size="md">
        <View style={styles.wrapper}>
          <Pressable onPress={openModal}>
            <Image
              source={require('../../assets/img/test2.png')}
              resizeMode="contain"
            />
          </Pressable>
          <WhiteSpace />

          {/* <TouchableHighlight
            style={styles.btn}
            onPress={() => navigate('/animatedDemo/aniBase')}>
            <View style={styles.btnWrap}>
              <Text style={styles.btnText}>go to animated</Text>
            </View>
          </TouchableHighlight> */}

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
            <List.Item wrap extra={isHermes() ? 'true' : 'false'} arrow="empty">
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
                <Button type="ghost" size="small" onPress={handleNotification}>
                  点击
                </Button>
              }>
              通知Notification
            </List.Item>
          </List>
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
  listWrap: {
    width: '100%',
    // flex: 1,
    height: '100%',
    overflow: 'scroll',
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
