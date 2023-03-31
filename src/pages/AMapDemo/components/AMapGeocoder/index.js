import React, {memo, useRef, forwardRef, useImperativeHandle} from 'react';
// import {View} from 'react-native';
import {WebView} from 'react-native-webview';
import Config from 'react-native-config';

const html = `
<!doctype html>
<html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="initial-scale=1.0, user-scalable=no, width=device-width">
    <title>逆地理编码(经纬度->地址)</title>
    <link rel="stylesheet" href="https://a.amap.com/jsapi_demos/static/demo-center/css/demo-center.css"/>
    <style>
        html,body,#container{
            height:100%;
            width:100%;
        }
        .btn{
            width:10rem;
            margin-left:6.8rem;   
        }
    </style>
</head>
<body>
<div id="container"></div>
<div class='info'>输入或点击地图获取经纬度。</div>
<div class="input-card" style='width:28rem;'>
    <label style='color:grey'>逆地理编码，根据经纬度获取地址信息</label>
    <div class="input-item">
        <div class="input-item-prepend"><span class="input-item-text">经纬度</span></div>
        <input id='lnglat' type="text" value='116.39,39.9'>
    </div>
    <div class="input-item">
        <div class="input-item-prepend"><span class="input-item-text" >地址</span></div>
        <input id='address' type="text" disabled>
    </div>
    <input id="regeo" type="button" class="btn" value="经纬度 -> 地址" >
</div>
<script type="text/javascript">
  // https://lbs.amap.com/api/javascript-api/guide/abc/prepare
  // 注意您这个设置必须是在  JSAPI 的脚本加载之前进行设置，否则设置无效
  window._AMapSecurityConfig = {
    securityJsCode: '${Config.AMP_JS_API_SECRET_KEY}',
  }
</script>
<script src="https://a.amap.com/jsapi_demos/static/demo-center/js/demoutils.js"></script>
<script type="text/javascript" src="https://webapi.amap.com/maps?v=2.0&key=${Config.AMP_JS_API_KEY}&plugin=AMap.Geocoder"></script>

</body>
</html>
`;

const AMapGeocoder = forwardRef((props, ref) => {
  const {sendAddressToParent, setWebviewLoad} = props;
  const webViewRef = useRef(null);

  const getAddressInjectSt = lnglat => {
    return `
      // window.ReactNativeWebView.postMessage(JSON.stringify({type: 'getAddress', data: {p: 123}}));
      // 逆地理编码 
      // https://lbs.amap.com/api/javascript-api-v2/guide/services/geocoder#t2
      AMap.plugin('AMap.Geocoder', function() {
        var geocoder = new AMap.Geocoder({
          city: '010' // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
        })
      
        // var lnglat = [116.396574, 39.992706]

        geocoder.getAddress([${lnglat}], function(status, result) {
          // if (status === 'complete' && result.info === 'OK') {
          //     // result为对应的地理位置详细信息
          //     window.ReactNativeWebView.postMessage(JSON.stringify({type: 'getAddress', data: {status, result}}));
          // }

          window.ReactNativeWebView.postMessage(JSON.stringify({type: 'getAddress', data: {status, result}}));
        })
      });

      // var geocoder = new AMap.Geocoder({
      //   city: "010", //城市设为北京，默认：“全国”
      //   // radius: 1000 //范围，默认：500
      // });

      // geocoder.getAddress(${lnglat}, function(status, result) {
      //       window.ReactNativeWebView.postMessage(JSON.stringify({type: 'getAddress', data: {status, result}}));
      //   });

      true;
    `;
  };

  // 接收webview的消息
  const handleWebViewMsg = e => {
    // console.log('接收webview的消息:', e);
    const obj = JSON.parse(e.nativeEvent.data);
    const {type, data} = obj;

    if (type === 'getAddress') {
      sendAddressToParent(data);
    }
  };

  useImperativeHandle(ref, () => {
    return {
      getAddress: location => {
        console.log('getAddress parentData:', location);
        const str = getAddressInjectSt(location);
        webViewRef.current && webViewRef.current.injectJavaScript(str);
      },
    };
  });

  return (
    <WebView
      ref={webViewRef}
      geolocationEnabled={true}
      source={{html: html, originWhitelist: ['*']}}
      onMessage={handleWebViewMsg}
      onLoad={() => {
        console.log('webview加载完成');
        setWebviewLoad(true);
      }}
      onError={() => {
        console.log('webview加载失败');
        setWebviewLoad(false);
      }}
    />
  );
});

export default memo(AMapGeocoder);
