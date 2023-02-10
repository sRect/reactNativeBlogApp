import React, {memo, useRef} from 'react';
import {StyleSheet, View} from 'react-native';
import {Outlet, useNavigate} from 'react-router-native';
import {Tabs, WhiteSpace} from '@ant-design/react-native';

const tabs = [{title: 'aniBase'}, {title: 'aniParallel'}];

const AnimatedDemo = () => {
  const navigate = useNavigate();
  const tabIndex = useRef(0).current;

  const handleTabClick = (tab, index) => {
    index === 0
      ? navigate('/animatedDemo/aniBase')
      : navigate('/animatedDemo/aniParallel');
  };

  return (
    <View style={styles.wrap}>
      <View style={styles.tabsWrap}>
        <Tabs tabs={tabs} initialPage={tabIndex} onTabClick={handleTabClick} />
      </View>
      <WhiteSpace size="large" />

      <View>
        <Outlet />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    flex: 1,
    flexDirection: 'column',
  },
  tabsWrap: {
    width: '100%',
    height: 100,
  },
});

export default memo(AnimatedDemo);
