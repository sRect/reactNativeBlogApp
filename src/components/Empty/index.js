import React, {memo} from 'react';
import {View, StyleSheet, useWindowDimensions} from 'react-native';
import {Result} from '@ant-design/react-native';
import {IconFill} from '@ant-design/icons-react-native';

const Empty = props => {
  const {height} = props;
  const window = useWindowDimensions();

  return (
    <View style={styles.wrap(height, window)}>
      <Result
        message="暂无数据"
        img={<IconFill name="robot" size={100} color="#ddd" />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: (height, window) => ({
    height: height || window.height,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
  }),
});

export default memo(Empty);
