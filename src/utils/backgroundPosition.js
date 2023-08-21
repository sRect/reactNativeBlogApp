import Geolocation from '@react-native-community/geolocation';
// import {getArticleList} from './src/api';
import {InteractionManager, AppState, NativeModules} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import dayjs from 'dayjs';

const BackgroundPosition = NativeModules.BackgroundPosition;
let flag = false;

function handleListenerAppState(watchId = 0) {
  const subscription = AppState.addEventListener('change', nextAppState => {
    console.log('nextAppState', nextAppState);
    if (nextAppState === 'active') {
      flag = false;
      console.log('app回到前台，后台任务停止');
      console.log('watchId:', watchId);
      BackgroundPosition.stopBackgroudTask();
      Geolocation.clearWatch(watchId);
      subscription.remove();
    }
  });
}

// Geolocation获取当前位置
const getCurrentPosition = () => {
  let sleep = null;
  if (!flag) {
    sleep = null;
    return;
  }

  sleep = function (startTime, delay) {
    return () => {
      let cur = new Date().getTime();
      while (cur < startTime + delay) {
        cur = new Date().getTime();

        if (!flag) {
          return;
        }
      }
    };
  };

  Geolocation.getCurrentPosition(
    info => {
      const {
        coords: {latitude, longitude},
      } = info;

      console.log('当前位置：', latitude, longitude);

      let startTime = new Date().getTime();
      console.log(
        'sleep start',
        dayjs(startTime).format('YYYY-MM-DD HH:mm:ss'),
      );
      sleep(startTime, 5000)();
      sleep = null;
      console.log(
        'sleep end',
        dayjs(new Date().getTime()).format('YYYY-MM-DD HH:mm:ss'),
      );
      getCurrentPosition();
    },
    err => {
      console.warn('获取定位失败==>', err);
    },
    {
      // maximumAge: 0,
      enableHighAccuracy: true, // 使用GPS定位，不使用wifi定位
    },
  );

  // setTimeout(() => {
  //   getCurrentPosition()(m);
  // }, 1500);
};

export async function backgroundPosition(e) {
  flag = true;
  // console.log('backgroundPosition start:', e);
  // requestAnimationFrame(() => {
  //   console.log('requestAnimationFrame test');
  // });

  // const [err, data] = await getArticleList();

  // console.log('err==>', err);
  // console.log('data==>', data);

  await AsyncStorage.clear();

  const handle = InteractionManager.createInteractionHandle();
  InteractionManager.runAfterInteractions(() => {
    // ...需要长时间同步执行的任务...
    // getCurrentPosition();
    let watchPositionId = Geolocation.watchPosition(
      async info => {
        const {
          coords: {latitude, longitude},
        } = info;
        console.log('当前位置：', latitude, longitude);

        let locationListStr = await AsyncStorage.getItem('location');
        let locationObj =
          locationListStr === null ? {list: []} : JSON.parse(locationListStr);
        locationObj.list.push({
          latitude,
          longitude,
          date: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        });

        await AsyncStorage.setItem('location', JSON.stringify(locationObj));
      },
      err => {
        console.warn('获取定位失败==>', err);
      },
      {
        interval: 5000, // 每5s更新一次位置
        timeout: 10000, // 获取一个位置，10s钟超时
        maximumAge: 15000, // 可能缓存位置的最长时间(以毫秒为单位)
        enableHighAccuracy: true, // 使用GPS
        distanceFilter: 1, // 返回一个新位置之前，与前一个位置的最小距离。设置为0表示不过滤位置。默认为100m。
        // useSignificantChanges?: boolean; // 只有当设备检测到一个重要的距离已经被突破时，才会返回位置。默认为FALSE。
      },
    );
    console.log('watchPositionId:', watchPositionId);
    handleListenerAppState(watchPositionId);
  });

  InteractionManager.clearInteractionHandle(handle);
  // return await Promise.resolve();
}
