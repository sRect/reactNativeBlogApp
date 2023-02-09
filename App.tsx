import React, {Suspense} from 'react';
import {View, SafeAreaView, Platform} from 'react-native';
import {Dialog} from '@rneui/themed';
import RouterConfig from './src/routes';

const App = () => {
  return (
    <>
      {Platform.OS === 'android' ? (
        <View>
          <Suspense
            fallback={<Dialog.Loading loadingProps={{size: 'large'}} />}>
            <RouterConfig />
          </Suspense>
        </View>
      ) : (
        <SafeAreaView>
          <Suspense fallback={<Dialog.Loading />}>
            <RouterConfig />
          </Suspense>
        </SafeAreaView>
      )}
    </>
  );
};

export default App;
