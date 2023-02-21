import React, {useEffect, useCallback, memo, Fragment, useRef} from 'react';
import {Platform, BackHandler, Text, StyleSheet} from 'react-native';
import {useNavigate, useLocation} from 'react-router-native';
import {Toast} from '@ant-design/react-native';

const ResetBack = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const numRef = useRef(1);

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
