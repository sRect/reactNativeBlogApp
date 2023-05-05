import React, {memo, useRef, useState} from 'react';
import {
  StyleSheet,
  useWindowDimensions,
  ActivityIndicator,
  View,
  Image,
  Modal,
  // Text,
} from 'react-native';
import {useParams, useNavigate} from 'react-router-native';
import {WebView} from 'react-native-webview';
import {Result, ActionSheet} from '@ant-design/react-native';
import {IconFill} from '@ant-design/icons-react-native';
// import githubCss from 'github-syntax-light/lib/github-light.css';
import ImageViewer from 'react-native-image-zoom-viewer';

const INJECTED_JAVASCRIPT = `
  var navBtn = document.querySelector(".adm-nav-bar-back");
  var aEl = document.querySelectorAll("a");
  var code = document.querySelectorAll("pre");
  var imgList = document.querySelectorAll("img");
  var navBarRight = document.querySelector(".adm-nav-bar-right");

  navBarRight.innerText = "分享";
  navBarRight.style.color = "#0969da";
  navBarRight.style.fontSize = "16px";
  navBarRight.style.fontFamily = "var(--adm-font-family)";

  [...aEl].forEach(el => {
    el.style.color="#0969da";
  });

  [...code].forEach(el => {
    el.style.backgroundColor="#f6f8fa";
  });

  navBtn.addEventListener("click", () => {
    window.ReactNativeWebView.postMessage(JSON.stringify({type: "goback"}));
  }, false);

  navBarRight.addEventListener("click", () => {
    window.ReactNativeWebView.postMessage(JSON.stringify({type: "share"}));
  });

  Array.from(imgList).forEach(el => {
    el.addEventListener("click", function () {
      window.ReactNativeWebView.postMessage(JSON.stringify({type: 'previewimg', data: this.src}));
    });
  });

  true; // note: this is required, or you'll sometimes get silent failures
`;

const Detail = () => {
  const {detailId} = useParams();
  const navigate = useNavigate();
  const window = useWindowDimensions();
  const numRef = useRef(0);

  const webviewUrl = `http://1.15.42.2:3000/posts/${detailId || ''}`;

  const [loadingState, setLoadingState] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [imgConf, setImgConf] = useState(() => {
    return {
      url: '',
      width: 0,
      height: 0,
    };
  });

  console.log('detailId==>', detailId);

  const handleOnError = e => {
    console.log('webview页面加载失败==>');
  };

  const handleOnLoad = e => {
    console.log('webview页面加载完成==>');
  };

  const handleOnWebViewMsg = e => {
    console.log('handleOnWebViewMsg==>');

    if (!e || !e.nativeEvent) {
      return;
    }

    let data = JSON.parse(e.nativeEvent.data);

    switch (data.type) {
      case 'goback':
        numRef.current++;
        if (numRef.current > 1) {
          return;
        }
        navigate(-1);
        break;
      case 'previewimg':
        console.log('data.data==>', data.data);
        Image.getSize(data.data, (...imgRes) => {
          setImgConf({
            width: imgRes[0],
            height: imgRes[1],
            url: data.data,
          });

          setModalVisible(true);
        });
        break;
      case 'share':
        ActionSheet.showShareActionSheetWithOptions({
          message: webviewUrl,
          title: '分享',
        });
        console.log('分享');
        break;
      default:
        break;
    }
  };

  return (
    <>
      <WebView
        source={{uri: webviewUrl}}
        containerStyle={[styles.container, {height: window.height}]}
        injectedJavaScript={INJECTED_JAVASCRIPT}
        startInLoadingState={loadingState}
        useWebView2={true}
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
        onHttpError={syntheticEvent => {
          const {nativeEvent} = syntheticEvent;
          console.warn(
            'WebView received error status code: ',
            nativeEvent.statusCode,
          );
        }}
      />

      <Modal
        onRequestClose={() => {
          setModalVisible(false);
          return true;
        }}
        animationType="fade"
        transparent={true}
        visible={modalVisible}>
        <ImageViewer
          useNativeDriver={true}
          enableSwipeDown={true}
          imageUrls={[
            {url: imgConf.url, width: imgConf.width, height: imgConf.height},
          ]}
          onCancel={() => setModalVisible(false)}
        />
      </Modal>
    </>
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
