import {NativeModules} from 'react-native';

function sleep(timeout) {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
}

// public String getName()中返回的字符串
let FlashlightManager = NativeModules.FlashlightManager;
let MyNotificationManager = NativeModules.MyNotificationManager;

export {sleep, FlashlightManager, MyNotificationManager};
