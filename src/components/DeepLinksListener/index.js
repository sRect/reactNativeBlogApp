import React, {Fragment, useEffect, memo} from 'react';
import {Linking} from 'react-native';
import {useNavigate} from 'react-router-native';

const DeepLinksListener = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // 应用已打开，被其它app启动
    const cb = data => {
      console.log('Linking data==>', data);

      const url = data.url;
      const schemas = [
        'blogapp://',
        'https://localhost/',
        'https://my.applink.com/',
      ];

      if (schemas.some(s => url.startsWith(s))) {
        let newUrl = url
          .replace(schemas[0], '')
          .replace(schemas[1], '')
          .replace(schemas[2], '');
        navigate && navigate(`/${newUrl}`);
      }
    };
    Linking.addEventListener('url', cb);

    // return () => {
    //   Linking.removeEventListener('url', cb);
    // };
  }, [navigate]);

  // useEffect(() => {
  //   (async function () {
  //     try {
  //       const res = await NativeModules.TrustIkunCrt.readIkunCrt();
  //       console.log('readIkunCrt res:', res);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   })();
  // });

  return <Fragment />;
};

export default memo(DeepLinksListener);
