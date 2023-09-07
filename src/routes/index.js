import React, {lazy} from 'react';
import {NativeRouter, Routes, Route} from 'react-router-native';
import ResetBack from '../components/ResetBack';
import PageJumpTo from '../components/PageJumpTo';
import DeepLinksListener from '../components/DeepLinksListener';
import Home from '../pages/Home';

const List = lazy(() => import('../pages/List'));
const Detail = lazy(() => import('../pages/Detail'));
const About = lazy(() => import('../pages/About'));
const AnimatedDemo = lazy(() => import('../pages/AnimatedDemo'));
const AniBase = lazy(() => import('../pages/AnimatedDemo/aniBase'));
const AniParallel = lazy(() => import('../pages/AnimatedDemo/aniParallel'));
const AMapDemo = lazy(() => import('../pages/AMapDemo'));
const DeepLinks = lazy(() => import('../pages/DeepLinks'));

const RouterConfig = () => {
  return (
    <NativeRouter>
      <PageJumpTo />
      <ResetBack />
      <DeepLinksListener />
      <Routes>
        <Route path="/" index element={<Home />} />
        <Route path="/list" element={<List />} />
        <Route path="/detail/:detailId" element={<Detail />} />
        <Route path="/about" element={<About />} />
        <Route path="/amapDemo/:latitude/:longitude" element={<AMapDemo />} />
        <Route path="/animatedDemo" element={<AnimatedDemo />}>
          <Route path="/animatedDemo/aniBase" element={<AniBase />} />
          <Route path="/animatedDemo/aniParallel" element={<AniParallel />} />
        </Route>
        <Route path="/deepLinks" element={<DeepLinks />} />
      </Routes>
    </NativeRouter>
  );
};

export default RouterConfig;
