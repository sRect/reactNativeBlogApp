import React, {memo, useRef} from 'react';
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
} from 'react-native';
import {useNavigate} from 'react-router-native';
import {
  WingBlank,
  WhiteSpace,
  Toast,
  List,
  // Button,
} from '@ant-design/react-native';
import Config from 'react-native-config';
import NavBar from '../../components/NavBar';

const About = () => {
  // const {height: windowHeight} = useWindowDimensions();
  const navigate = useNavigate();
  const appState = useRef(AppState.currentState);

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
            <List.Item
              extra=""
              arrow="horizontal"
              onPress={() => navigate('/amapDemo/31/121')}>
              高德地图
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
  },
  location: {
    fontFamily: '',
  },
});

export default memo(About);
