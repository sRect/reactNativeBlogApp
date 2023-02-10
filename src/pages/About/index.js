import React, {memo} from 'react';
import {
  View,
  Image,
  StyleSheet,
  Pressable,
  // useWindowDimensions,
  Alert,
  Vibration,
  Platform,
  ToastAndroid,
  TouchableHighlight,
  Text,
} from 'react-native';
import {useNavigate} from 'react-router-native';
import {WingBlank, WhiteSpace} from '@ant-design/react-native';

const About = () => {
  // const {height: windowHeight} = useWindowDimensions();
  const navigate = useNavigate();

  const openModal = () => {
    Alert.alert('只因太美', '只因与荔枝是兄弟吗', [
      {
        text: '否',
        onPress: () => {
          Vibration.vibrate(200);
          if (Platform.OS === 'android') {
            ToastAndroid.show('你个小黑粉', 500);
          }
        },
        style: 'cancel',
      },
      {text: '是', onPress: () => navigate(-1)},
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
            onPress={() => navigate('/animatedDemo')}>
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
});

export default memo(About);
