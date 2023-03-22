import React, {memo, useRef, useEffect, useState} from 'react';
import {
  View,
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
import Geolocation from '@react-native-community/geolocation';
import NavBar from '../../components/NavBar';

const About = () => {
  // const {height: windowHeight} = useWindowDimensions();
  const navigate = useNavigate();
  const appState = useRef(AppState.currentState);
  const [androidLocationPermissin, setAndroidLocationPermissin] =
    useState(false);
  const [location, setLocation] = useState({latitude: '', longitude: ''});

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

  const handleAndroidPermissin = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: '位置信息授权',
          message: '获取当前位置信息测试',
          buttonNeutral: '跳过',
          buttonNegative: '取消',
          buttonPositive: '同意',
        },
      );

      console.log('granted==>', granted);

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('可以定位了');
        setAndroidLocationPermissin(true);
      } else if (granted === PermissionsAndroid.RESULTS.DENIED) {
        Toast.fail({
          content: '已拒绝获取位置信息',
        });
      } else {
        Toast.fail({
          content: '用户已拒绝，且不愿被再次询问',
        });
      }
    } catch (error) {
      console.warn(error);
    }
  };

  useEffect(() => {
    if (Platform.OS !== 'android') {
      return;
    }

    PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    )
      .then(preGranted => {
        console.log('preGranted==>', preGranted);
        setAndroidLocationPermissin(preGranted);
      })
      .catch(() => {
        setAndroidLocationPermissin(false);
      });
  }, []);

  useEffect(() => {
    if (!androidLocationPermissin) {
      return;
    }

    Geolocation.getCurrentPosition(
      info => {
        const {
          coords: {latitude, longitude},
        } = info;

        console.log(latitude, longitude);
        setLocation({
          latitude,
          longitude,
        });
      },
      err => {
        console.warn('获取定位失败==>', err);

        Toast.fail({
          content: '获取定位失败',
        });
      },
    );
  }, [androidLocationPermissin]);

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
            {Platform.OS === 'android' && (
              <List.Item
                wrap
                extra={
                  androidLocationPermissin ? (
                    <Text
                      style={
                        styles.location
                      }>{`北纬: ${location.latitude}, 东经: ${location.longitude}`}</Text>
                  ) : (
                    <Button
                      type="ghost"
                      size="small"
                      onPressIn={handleAndroidPermissin}>
                      授权获取位置信息
                    </Button>
                  )
                }
                arrow="empty">
                位置权限
              </List.Item>
            )}
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
  },
  location: {
    fontFamily: '',
  },
});

export default memo(About);
