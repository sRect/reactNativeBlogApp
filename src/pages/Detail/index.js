import React, {memo, useRef, useState} from 'react';
import {
  StyleSheet,
  useWindowDimensions,
  ActivityIndicator,
  View,
} from 'react-native';
import {useParams, useNavigate} from 'react-router-native';
import {WebView} from 'react-native-webview';
import {Result} from '@ant-design/react-native';
import {IconFill} from '@ant-design/icons-react-native';

// <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
// 页面设置meta标签，禁止缩放
const INJECTED_JAVASCRIPT_BEFORE = `
  var headEl = document.querySelector('head');
  var viewport = document.createElement("meta");
  viewport.setAttribute("name", "viewport");
  viewport.setAttribute("content", "width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0");

  headEl.appendChild(viewport);
`;

const INJECTED_JAVASCRIPT = `
  var navBtn = document.querySelector(".adm-nav-bar-back");
  var aEl = document.querySelectorAll("a");

  ${INJECTED_JAVASCRIPT_BEFORE}

  [...aEl].forEach(el => {
    el.style.color="#0969da";
  });

  navBtn.addEventListener("click", () => {
    window.ReactNativeWebView.postMessage("goback");
  }, false);

  true; // note: this is required, or you'll sometimes get silent failures
`;

const Detail = () => {
  const {detailId} = useParams();
  const navigate = useNavigate();
  const window = useWindowDimensions();
  const numRef = useRef(0);

  const [loadingState, setLoadingState] = useState(true);

  console.log('detailId==>', detailId);

  const handleOnError = e => {
    console.log('webview页面加载失败==>');
  };

  const handleOnLoad = e => {
    console.log('webview页面加载完成==>');
  };

  const handleOnWebViewMsg = e => {
    console.log('handleOnWebViewMsg==>', e);
    numRef.current++;

    if (numRef.current > 1) {
      return;
    }

    if (e && e.nativeEvent && e.nativeEvent.data === 'goback') {
      navigate(-1);
    }
  };

  return (
    <WebView
      source={{uri: `http://1.15.42.2:3000/posts/${detailId || ''}`}}
      containerStyle={[styles.container, {height: window.height}]}
      injectedJavaScript={INJECTED_JAVASCRIPT}
      injectJavaScript={INJECTED_JAVASCRIPT_BEFORE}
      injectedJavaScriptBeforeContentLoaded={INJECTED_JAVASCRIPT_BEFORE}
      startInLoadingState={loadingState}
      renderLoading={() => (
        <View style={styles.loading}>
          <ActivityIndicator size="large" />
        </View>
      )}
      renderError={() => (
        <Result
          style={[styles.loading, ...[{top: 0}]]}
          message="加载失败"
          img={<IconFill name="warning" size={100} color="#faad14" />}
          buttonText="返回"
          buttonType="primary"
          onButtonClick={() => navigate(-1)}
        />
      )}
      onError={handleOnError}
      onLoad={handleOnLoad}
      onMessage={handleOnWebViewMsg}
      onLoadStart={() => {
        console.log('onLoadStart');
        // setLoadingState(true);
      }}
      onLoadEnd={() => {
        console.log('onLoadEnd');
        // setTimeout(() => setLoadingState(false), 5000);
        setLoadingState(false);
      }}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 0,
  },
  loading: {
    width: '100%',
    position: 'absolute',
    top: 20,
  },
});

export default memo(Detail);
