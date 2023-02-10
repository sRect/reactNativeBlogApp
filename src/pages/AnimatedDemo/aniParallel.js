/* eslint-disable */
import React, {useState, useEffect} from 'react';
import {Animated, View, Text} from 'react-native';

const AniParallel = () => {
  const [animation1, setAnimation1] = useState(new Animated.Value(0));
  const [animation2, setAnimation2] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(animation1, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(animation2, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const animatedStyle1 = {
    transform: [{scale: animation1}],
  };
  const animatedStyle2 = {
    opacity: animation2,
  };

  return (
    <View style={{flex: 1, alignItems: 'center'}}>
      <Animated.View
        style={[
          {width: 100, height: 100, backgroundColor: 'red'},
          animatedStyle1,
        ]}>
        <Animated.Text style={[{color: 'white'}, animatedStyle2]}>
          Hello World!
        </Animated.Text>
      </Animated.View>
    </View>
  );
};

export default AniParallel;
