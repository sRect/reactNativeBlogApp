import React, {useState, useEffect} from 'react';
import {Animated, View, Text} from 'react-native';

const MyAnimations = () => {
  const [animation, setAnimation] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.loop(
      Animated.timing(animation, {
        toValue: 1,
        duration: 5000,
        useNativeDriver: true,
      }),
    ).start();
  }, [animation]);

  const animatedStyle = {
    transform: [{scale: animation}],
  };

  return (
    // eslint-disable-next-line react-native/no-inline-styles
    <View style={{flex: 1, alignItems: 'center'}}>
      <Animated.View
        style={[
          // eslint-disable-next-line react-native/no-inline-styles
          {width: 100, height: 100, backgroundColor: 'red'},
          animatedStyle,
        ]}>
        <Text>Hello World!</Text>
      </Animated.View>
    </View>
  );
};

export default MyAnimations;
