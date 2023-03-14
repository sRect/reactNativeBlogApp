import React, {useEffect, useCallback, memo, Fragment, useRef} from 'react';
import {
  Platform,
  BackHandler,
  Text,
  StyleSheet,
  AppState,
  ToastAndroid,
} from 'react-native';
import {useNavigate, useLocation} from 'react-router-native';
import {Toast} from '@ant-design/react-native';

const ResetBack = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const numRef = useRef(1);

  const _handleAppStateChange = function (nextAppState) {
    // console.log(appState);
    console.log('nextAppState==>', nextAppState);

    if (nextAppState && nextAppState === 'background' && numRef.current > 0) {
      console.log('numRef.current==>', numRef.current);
      if (Platform.OS === 'android') {
        ToastAndroid.showWithGravity(
          '已切到后台',
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM,
        );
      }
    }
  };

  const handleHardwareBackPress = useCallback(() => {
    if (location.pathname === '/') {
      numRef.current--;

      if (numRef.current === 0) {
        Toast.info({
          content: <Text style={styles.txt}>在滑一次退出</Text>,
        });

        BackHandler.removeEventListener(
          'hardwareBackPress',
          handleHardwareBackPress,
        );

        return true;
      }
    }

    navigate(-1);
    return true;
  }, [navigate, location]);

  useEffect(() => {
    // AppState.addEventListener('change', _handleAppStateChange);
    // https://github.com/facebook/react-native/issues/34644#issuecomment-1245026317
    const listener = AppState.addEventListener('change', _handleAppStateChange);
    return () => {
      // AppState.removeEventListener('change', _handleAppStateChange);
      listener.remove();
    };
  }, []);

  useEffect(() => {
    // 禁用 Android 上的返回按钮(侧滑返回)
    if (Platform.OS === 'android') {
      BackHandler.addEventListener(
        'hardwareBackPress',
        handleHardwareBackPress,
      );
    }

    return () => {
      if (Platform.OS === 'android') {
        BackHandler.removeEventListener(
          'hardwareBackPress',
          handleHardwareBackPress,
        );

        numRef.current = 1;
      }
    };
  }, [handleHardwareBackPress]);

  return <Fragment />;
};

const styles = StyleSheet.create({
  txt: {
    fontFamily: '',
    color: '#ffffff',
  },
});

export default memo(ResetBack);
