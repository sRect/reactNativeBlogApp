import React, {useRef} from 'react';
import {TouchableWithoutFeedback, Text} from 'react-native';

const MyDoubleClickButton = props => {
  // doubleClickTime为双击完成的时间
  const {onPress, title, doubleClickTime, textStyle} = props;
  const lastPress = useRef(0);

  const handlePress = () => {
    const now = new Date().getTime();
    const DOUBLE_PRESS_DELAY = doubleClickTime;
    if (now - lastPress.current < DOUBLE_PRESS_DELAY) {
      onPress();
    }
    lastPress.current = now;
  };

  return (
    <TouchableWithoutFeedback
      onPress={handlePress}
      delayPressIn={doubleClickTime / 2}
      delayPressOut={doubleClickTime / 2}>
      <Text style={textStyle}>{title}</Text>
    </TouchableWithoutFeedback>
  );
};

export default MyDoubleClickButton;
