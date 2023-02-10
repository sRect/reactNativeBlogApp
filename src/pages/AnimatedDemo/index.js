import React, {memo} from 'react';
import {View} from 'react-native';
import {Outlet, Link} from 'react-router-native';

const AnimatedDemo = () => {
  return (
    <View>
      {/* <View>
        <Link to="/animatedDemo/aniBase">animated base demo</Link>
      </View> */}
      <Outlet />
    </View>
  );
};

export default memo(AnimatedDemo);
