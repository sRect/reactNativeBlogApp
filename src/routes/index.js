import React, {lazy} from 'react';
import {NativeRouter, Routes, Route} from 'react-router-native';

import Home from '../pages/Home';

const List = lazy(() => import('../pages/List'));
const About = lazy(() => import('../pages/About'));

const RouterConfig = () => {
  return (
    <NativeRouter>
      <Routes>
        <Route path="/" index element={<Home />} />
        <Route path="/list" element={<List />} />
        <Route path="About" element={<About />} />
      </Routes>
    </NativeRouter>
  );
};

export default RouterConfig;
