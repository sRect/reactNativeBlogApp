/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {memo, Fragment, useRef, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ImageBackground,
  useWindowDimensions,
  Image,
  TouchableHighlight,
  Animated,
  Easing,
} from 'react-native';
import {useNavigate} from 'react-router-native';

function Home() {
  const navigate = useNavigate();

  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      // 按顺序执行一个动画数组里的动画，等待一个完成后再执行下一个
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.2,
          duration: 10000,
          useNativeDriver: true,
          easing: Easing.linear,
          // delay: 1000,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 10000,
          useNativeDriver: true,
          easing: Easing.linear,
          // delay: 1000,
        }),
      ]),
    ).start();
  }, [scale]);

  return (
    <SafeAreaView style={styles.wrapper}>
      <View style={styles.wrapper}>
        <Animated.View style={[styles.animateView, {transform: [{scale}]}]}>
          <ImageBackground
            source={require('../../assets/img/bg.png')}
            resizeMode="cover"
            style={{
              ...styles.backgroundImg,
              height: useWindowDimensions().height,
            }}
          />
        </Animated.View>

        <View style={styles.container}>
          <Text style={styles.h1}>个人博客</Text>

          <TouchableHighlight
            style={styles.item}
            activeOpacity={0.6}
            underlayColor="rgba(0, 0, 0, 0.4)"
            onPress={() => navigate('/list')}>
            <Fragment>
              <Image
                style={styles.itemImg}
                source={require('../../assets/img/list.png')}
              />

              <Text style={styles.itemText}>文章列表</Text>
            </Fragment>
          </TouchableHighlight>

          <TouchableHighlight
            style={styles.item}
            activeOpacity={0.6}
            underlayColor="rgba(0, 0, 0, 0.4)"
            onPress={() => navigate('/about')}>
            <Fragment>
              <Image
                style={styles.itemImg}
                source={require('../../assets/img/user.png')}
              />

              <Text style={styles.itemText}>关于我</Text>
            </Fragment>
          </TouchableHighlight>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  animateView: {
    width: '100%',
  },
  backgroundImg: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    width: '80%',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    position: 'absolute',
    top: 200,
  },
  h1: {
    color: '#ffffff',
    fontSize: 20,
    marginTop: 10,
  },
  item: {
    width: '100%',
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    marginTop: 20,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemImg: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  itemText: {
    color: '#ffffff',
    fontSize: 16,
  },
});

export default memo(Home);
