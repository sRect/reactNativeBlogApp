/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {backgroundPlayMusic} from './src/utils';

AppRegistry.registerComponent(appName, () => App);
AppRegistry.registerCancellableHeadlessTask(
  'backgroundPlayMusic',
  () => backgroundPlayMusic,
);
