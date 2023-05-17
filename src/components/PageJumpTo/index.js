import React, {memo, useEffect, Fragment} from 'react';
import {NativeEventEmitter, NativeModules} from 'react-native';
import {useNavigate} from 'react-router-native';

const PageJumpTo = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const eventEmitter = new NativeEventEmitter(
      NativeModules.MyNotificationModule,
    );

    const eventListener = eventEmitter.addListener('pageToJumpKey', data => {
      // data就是MainActivity传过来的params参数
      console.log('pageToJumpKey==>', data);
      navigate(data.pageToJumpKey);
    });

    return () => {
      eventListener && eventListener.remove(); // 组件卸载时记得移除监听事件
    };
  }, [navigate]);

  return <Fragment />;
};

export default memo(PageJumpTo);
