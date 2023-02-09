import React, {Suspense} from 'react';
import {View, SafeAreaView, Platform} from 'react-native';
import {Provider, Button} from '@ant-design/react-native';
import RouterConfig from './src/routes';

const App = () => {
  return (
    <Provider>
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
