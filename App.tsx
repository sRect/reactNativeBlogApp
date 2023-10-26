import React, {Suspense} from 'react';
import {
  View,
  SafeAreaView,
  Platform,
  StatusBar,
  useColorScheme,
} from 'react-native';
import {Provider, Button} from '@ant-design/react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import Config from 'react-native-config';
import RouterConfig from './src/routes';

import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: Config.SENTRY_DSN_ENV,
  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
  release: Config.SENTRY_RELEASE,
  dist: Config.SENTRY_DIST,
});

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <Provider>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      {Platform.OS === 'android' ? (
        <View>
          <Suspense fallback={<Button loading>loading button</Button>}>
            <RouterConfig />
          </Suspense>
        </View>
      ) : (
        <SafeAreaView>
          <Suspense fallback={<Button loading>loading button</Button>}>
            <RouterConfig />
          </Suspense>
        </SafeAreaView>
      )}
    </Provider>
  );
};

// setTimeout(() => {
//   Sentry.captureException(new Error('app tsx'));
// }, 3000);

export default Sentry.wrap(App);
