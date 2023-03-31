import React, {memo, useEffect, useState, useRef, useCallback} from 'react';
import {
  Platform,
  Dimensions,
  PermissionsAndroid,
  Image,
  Text,
} from 'react-native';
import {useParams} from 'react-router-native';
import styled from 'styled-components/native';
import Config from 'react-native-config';
import Geolocation from '@react-native-community/geolocation';
import {AMapSdk, MapView, MapType, Marker} from 'react-native-amap3d';
import {
  Button,
  Icon,
  Toast,
  ActionSheet,
  Modal,
} from '@ant-design/react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import NavBar from '../../components/NavBar';
import AMapGeocoder from './components/AMapGeocoder';
import Gps from './gps';

const MapContent = styled.View`
  width: 100%;
  height: ${Dimensions.get('window').height - 46}px;
`;

const LocationBtnWrap = styled.View`
  position: absolute;
  top: 10px;
  right: 15px;
  z-index: 1;
`;

const MapMarkerView = styled.View`
  align-items: center;
  justify-content: center;
`;

const MapMarkerText = styled.Text`
  color: #fff;
  background-color: #009688;
  align-items: center;
  border-radius: 5px;
  padding: 5px 5px;
  font-family: '';
`;

const locationICON = `data:img/jpg;base64,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`;

const AMapDemo = () => {
  let routerParams = useParams();
  const mapRef = useRef(null);
  const aMapGeocoderRef = useRef(null);
  const [androidLocationPermissin, setAndroidLocationPermissin] =
    useState(false);
  const [location, setLocation] = useState({latitude: '', longitude: ''});
  const [locationBtnDisabled, setLocationBtnDisabled] = useState(true);
  const [address, setAddress] = useState('');
  const [mapType, setMapType] = useState(MapType.Standard);

  // 地图点击事件
  const handleMapPress = data => {
    console.log('地图点击事件：', data.nativeEvent);
    const position = data.nativeEvent;

    Modal.alert(
      '当前经纬度',
      // eslint-disable-next-line react-native/no-inline-styles
      <Text style={{fontFamily: ''}}>
        {`latitude: ${position.latitude}, longitude: ${position.longitude}`}
      </Text>,
      [
        {
          text: '复制',
          onPress: () => {
            Clipboard.setString(
              `latitude: ${position.latitude}, longitude: ${position.longitude}`,
            );
          },
          style: 'default',
        },
      ],
    );
  };

  // 切换地图类型
  const handleChangeMapType = () => {
    const mapArr = [
      {
        label: '标准地图',
        value: MapType.Standard,
      },
      {
        label: '卫星地图',
        value: MapType.Satellite,
      },
      {
        label: '夜间地图',
        value: MapType.Night,
      },
      {
        label: '导航地图',
        value: MapType.Navi,
      },
      {
        label: '公交地图',
        value: MapType.Bus,
      },
    ];

    ActionSheet.showActionSheetWithOptions(
      {
        title: '请选择',
        message: <Text>地图类型切换</Text>,
        options: mapArr.map(item => item.label),
        cancelButtonIndex: 5,
        // destructiveButtonIndex: 5,
      },
      buttonIndex => {
        console.log(buttonIndex);
        let val = mapArr[buttonIndex].value;

        if (val !== mapType) {
          setMapType(val);
        }
      },
    );
  };

  // 逆地理编码，获取位置
  const sendAddressToParent = data => {
    console.log('sendAddressToParent', data);
    try {
      setAddress(data.result.regeocode.formattedAddress);
    } catch (error) {
      setAddress('当前位置');
    }
  };

  const setWebviewLoad = webviewLoadStatus => {
    console.log('setWebviewLoad==>', webviewLoadStatus);
    setLocationBtnDisabled(!webviewLoadStatus);
  };

  // Geolocation获取当前位置
  const getCurrentPosition = () => {
    Geolocation.getCurrentPosition(
      info => {
        const {
          coords: {latitude, longitude},
        } = info;

        console.log(latitude, longitude);

        // gps坐标转高德坐标
        let obj = new Gps({
          latitude,
          longitude,
        });
        console.log('gps坐标转高德坐标', obj);

        setLocation({
          latitude: obj.latitude,
          longitude: obj.longitude,
        });

        // 移动视角相机
        mapRef.current &&
          mapRef.current.moveCamera(
            {
              target: {
                latitude: obj.latitude,
                longitude: obj.longitude,
              },
              zoom: 16,
            },
            100,
          );

        console.log('获取到当前位置，进行逆地理编码，获取位置信息');
        aMapGeocoderRef.current &&
          aMapGeocoderRef.current.getAddress([obj.longitude, obj.latitude]);
      },
      err => {
        console.warn('获取定位失败==>', err);

        Toast.fail({
          content: '获取定位失败',
        });
      },
    );
  };

  // 申请定位权限
  const handleAndroidPermissin = useCallback(async () => {
    try {
      const granted = await PermissionsAndroid.requestMultiple(
        [
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        ],
        {
          title: '位置信息授权',
          message: '获取当前位置信息测试',
          buttonNeutral: '跳过',
          buttonNegative: '取消',
          buttonPositive: '同意',
        },
      );

      console.log('granted==>', granted);

      if (
        granted['android.permission.ACCESS_FINE_LOCATION'] ===
        PermissionsAndroid.RESULTS.GRANTED
      ) {
        console.log('可以定位了');
        setAndroidLocationPermissin(true);

        getCurrentPosition();
      } else if (
        granted['android.permission.ACCESS_FINE_LOCATION'] ===
        PermissionsAndroid.RESULTS.DENIED
      ) {
        Toast.fail({
          content: '已拒绝获取位置信息',
        });
      } else {
        Toast.fail({
          content: '用户已拒绝，且不愿被再次询问',
        });
      }
    } catch (error) {
      console.warn(error);
    }
  }, []);

  // 定位按钮点击
  const handleLocation = async () => {
    console.log('androidLocationPermissin', androidLocationPermissin);
    if (!androidLocationPermissin) {
      await handleAndroidPermissin();
      return;
    }

    getCurrentPosition();
  };

  useEffect(() => {
    setLocation({
      latitude: Number(routerParams.latitude) || 31,
      longitude: Number(routerParams.longitude) || 121,
    });

    // return () => {
    //   Geolocation.clearWatch();
    // };
  }, [routerParams]);

  useEffect(() => {
    console.log('Platform.OS', Platform.OS);
    if (Platform.OS !== 'android') {
      return;
    }

    PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
    )
      .then(preGranted => {
        console.log('preGranted==>', preGranted);
        setAndroidLocationPermissin(preGranted);

        if (preGranted) {
          setTimeout(() => {
            getCurrentPosition();
          }, 1000);
        } else {
          handleAndroidPermissin();
        }
      })
      .catch(() => {
        setAndroidLocationPermissin(false);
      });
  }, [handleAndroidPermissin]);

  useEffect(() => {
    AMapSdk.init(
      Platform.select({
        android: Config.AMP_ANDROID_API_KEY,
      }),
    );
  }, []);

  return (
    <>
      <NavBar title="高德地图" />
      <MapContent>
        <LocationBtnWrap>
          <Button
            type="ghost"
            size="small"
            disabled={locationBtnDisabled}
            onPress={handleLocation}>
            <Icon name="aim" color="#1890ff" size="sm" />
          </Button>

          <Button
            type="ghost"
            size="small"
            // eslint-disable-next-line react-native/no-inline-styles
            style={{marginTop: 5}}
            disabled={locationBtnDisabled}
            onPress={handleChangeMapType}>
            <Icon name="setting" color="#1890ff" size="sm" />
          </Button>
        </LocationBtnWrap>

        <MapView
          ref={mapRef}
          mapType={mapType}
          myLocationEnabled={true}
          myLocationButtonEnabled={false}
          onPress={handleMapPress}
          onLoad={() => {
            console.log('map onLoad');
          }}
          onLocation={e => {
            console.log('onLocation==>', e);
          }}>
          {location.latitude && location.longitude && (
            <Marker
              position={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
              opacity={0.8}
              onPress={() => console.log('marker press')}>
              <MapMarkerView>
                <Image
                  source={{
                    uri: locationICON,
                    width: 32,
                    height: 32,
                  }}
                />
                <MapMarkerText>{address}</MapMarkerText>
              </MapMarkerView>
            </Marker>
          )}
        </MapView>
      </MapContent>

      <AMapGeocoder
        ref={aMapGeocoderRef}
        sendAddressToParent={sendAddressToParent}
        setWebviewLoad={setWebviewLoad}
      />
    </>
  );
};

export default memo(AMapDemo);
