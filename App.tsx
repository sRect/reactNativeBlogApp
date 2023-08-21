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
import RouterConfig from './src/routes';
import DeepLinksListener from './src/components/DeepLinksListener';

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
      <DeepLinksListener />
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

export default App;
