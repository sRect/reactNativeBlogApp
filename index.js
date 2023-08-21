/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {backgroundPlayMusic, backgroundPosition} from './src/utils';

AppRegistry.registerComponent(appName, () => App);
AppRegistry.registerCancellableHeadlessTask(
  'backgroundPlayMusic',
  () => backgroundPlayMusic,
);
AppRegistry.registerHeadlessTask(
  'BackgroundPosition',
  () => backgroundPosition,
);
