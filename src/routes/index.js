import React, {lazy} from 'react';
import {NativeRouter, Routes, Route} from 'react-router-native';
import ResetBack from '../components/ResetBack';

import Home from '../pages/Home';

const List = lazy(() => import('../pages/List'));
const Detail = lazy(() => import('../pages/Detail'));
const About = lazy(() => import('../pages/About'));
const AnimatedDemo = lazy(() => import('../pages/AnimatedDemo'));
const AniBase = lazy(() => import('../pages/AnimatedDemo/aniBase'));
const AniParallel = lazy(() => import('../pages/AnimatedDemo/aniParallel'));

const RouterConfig = () => {
  return (
    <NativeRouter>
      <ResetBack />
      <Routes>
        <Route path="/" index element={<Home />} />
        <Route path="/list" element={<List />} />
        <Route path="/detail/:detailId" element={<Detail />} />
        <Route path="/about" element={<About />} />
        <Route path="/animatedDemo" element={<AnimatedDemo />}>
          <Route path="/animatedDemo/aniBase" element={<AniBase />} />
          <Route path="/animatedDemo/aniParallel" element={<AniParallel />} />
        </Route>
      </Routes>
    </NativeRouter>
  );
};

export default RouterConfig;
