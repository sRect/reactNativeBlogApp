import React, {memo} from 'react';
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
  TouchableHighlight,
  Text,
} from 'react-native';
import {useNavigate} from 'react-router-native';
import {WingBlank, WhiteSpace, Toast} from '@ant-design/react-native';

const About = () => {
  // const {height: windowHeight} = useWindowDimensions();
  const navigate = useNavigate();

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
    <WingBlank>
      <View style={styles.wrapper}>
        <Pressable onPress={openModal}>
          <Image
            source={require('../../assets/img/test2.png')}
            resizeMode="contain"
          />
        </Pressable>
        <WhiteSpace />

        <View style={styles.btnWrap}>
          <TouchableHighlight
            style={styles.btn}
            onPress={() => navigate('/animatedDemo/aniBase')}>
            <Text style={styles.btnText}>go to animated</Text>
          </TouchableHighlight>
        </View>
      </View>
    </WingBlank>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    // flex: 1,
    backgroundColor: '#f0f0f0',
    paddingTop: 20,
    alignItems: 'center',
  },
  btnWrap: {
    width: '100%',
  },
  btn: {
    padding: 12,
    borderColor: 'blue',
    borderWidth: 1,
    borderRadius: 4,
    alignItems: 'center',
  },
  btnText: {
    fontFamily: '',
    color: '#333333',
  },
  ikun: {
    fontFamily: '',
    color: '#ffffff',
  },
});

export default memo(About);
