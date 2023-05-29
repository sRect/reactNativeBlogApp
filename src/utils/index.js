import {NativeModules} from 'react-native';

// public String getName()中返回的字符串
let FlashlightManager = NativeModules.FlashlightManager;
let MyNotificationManager = NativeModules.MyNotificationManager;
let PlayMusicManager = NativeModules.PlayMusicManager;

function sleep(timeout) {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
}

// 后台播放音乐
async function backgroundPlayMusic(data) {
  try {
    console.log('backgroundPlayMusic task:', data);

    const {mp3FileName, playerStatus} = data.payload;

    const res = await PlayMusicManager.control(mp3FileName, playerStatus);
    console.log('backgroundPlayMusic res:', res);

    return Promise.resolve();
    // const {taskId, taskKey} = data;

    // AppRegistry.cancelHeadlessTask(taskId, taskKey);
  } catch (error) {
    console.error('backgroundPlayMusic error', error);

    return Promise.reject();
  }
}

export {
  sleep,
  backgroundPlayMusic,
  FlashlightManager,
  MyNotificationManager,
  PlayMusicManager,
};
