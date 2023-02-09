import React, {memo} from 'react';
import {
  View,
  Image,
  StyleSheet,
  Pressable,
  useWindowDimensions,
  Alert,
  Vibration,
  Platform,
  ToastAndroid,
} from 'react-native';
import {useNavigate} from 'react-router-native';

const About = () => {
  const {height: windowHeight} = useWindowDimensions();
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
    <View style={{...styles.wrapper, height: windowHeight}}>
      <Pressable onPress={openModal}>
        <Image
          source={require('../../assets/img/test2.png')}
          resizeMode="contain"
        />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    // flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 20,
    alignItems: 'center',
  },
});

export default memo(About);
