import React, {lazy} from 'react';
import {NativeRouter, Routes, Route} from 'react-router-native';

import Home from '../pages/Home';

const List = lazy(() => import('../pages/List'));
const About = lazy(() => import('../pages/About'));
const AnimatedDemo = lazy(() => import('../pages/AnimatedDemo'));
const AniBase = lazy(() => import('../pages/AnimatedDemo/aniBase'));

const RouterConfig = () => {
  return (
    <NativeRouter>
      <Routes>
        <Route path="/" index element={<Home />} />
        <Route path="/list" element={<List />} />
        <Route path="/about" element={<About />} />
        <Route path="/animatedDemo" element={<AnimatedDemo />}>
          <Route path="/animatedDemo/aniBase" index element={AniBase} />
        </Route>
      </Routes>
    </NativeRouter>
  );
};

export default RouterConfig;
