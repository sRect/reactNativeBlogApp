import React, {Fragment, memo, useCallback, useState, useEffect} from 'react';
import {Linking, Alert, Platform, View, StyleSheet} from 'react-native';
import {WingBlank, List, Button} from '@ant-design/react-native';
import NavBar from '../../components/NavBar';

const Item = List.Item;
const Brief = Item.Brief;

const SendIntentButton = ({action, extras, children}) => {
  const handlePress = useCallback(async () => {
    try {
      if (Platform.OS !== 'android') {
        return Alert.alert('提示', '只限安卓端使用', [{text: '确认'}]);
      }

      await Linking.sendIntent(action, extras);
    } catch (e) {
      Alert.alert(e.message);
    }
  }, [action, extras]);

  return (
    <Button size="small" type="ghost" onPress={handlePress}>
      {children}
    </Button>
  );
};

const DeepLinks = () => {
  const [url, setUrl] = useState(null);

  const handleOpenLinkSetting = useCallback(async () => {
    // Open the custom settings if the app has one
    await Linking.openSettings();
  }, []);

  const getUrlAsync = async () => {
    // Get the deep link used to open the app
    const initialUrl = await Linking.getInitialURL();

    console.log('initialUrl:', initialUrl);

    // The setTimeout is just for testing purpose
    setTimeout(() => {
      setUrl(initialUrl);
    }, 1000);
  };

  const handleOpenUrl = async linkUrl => {
    const supported = await Linking.canOpenURL(linkUrl);

    if (supported) {
      // Opening the link with some app, if the URL scheme is "http" the web link should be opened
      // by some browser in the mobile
      await Linking.openURL(linkUrl);
    } else {
      Alert.alert('提示', `无法打开${linkUrl}`, [{text: '确定'}]);
    }
  };

  return (
    <Fragment>
      <NavBar title="Deep Links" />
      <WingBlank>
        <List>
          <Item
            extra={
              <Button
                type="primary"
                size="small"
                onPress={handleOpenLinkSetting}>
                click
              </Button>
            }>
            打开app应用设置页面
          </Item>
          <Item
            extra={
              <Button type="primary" size="small" onPress={getUrlAsync}>
                click
              </Button>
            }>
            获取Deep Link链接
            <Brief>
              链接为：{url || '无'}.
              应用是被一个链接调起的，则会返回相应的链接地址。否则它会返回null，debugging模式下始终返回null
            </Brief>
          </Item>
          <Item
            arrow="horizontal"
            onPress={() => handleOpenUrl('https://cn.bing.com')}>
            打开cn.bing.com
            <Brief>唤起本地浏览器打开</Brief>
          </Item>
          <Item
            arrow="horizontal"
            onPress={() => handleOpenUrl('slack://open?team=123456')}>
            打开slack app
          </Item>
          <Item
            extra={
              <View>
                <View style={styles.row}>
                  <SendIntentButton action="android.intent.action.POWER_USAGE_SUMMARY">
                    电池使用统计
                  </SendIntentButton>
                  <SendIntentButton
                    action="android.settings.APP_NOTIFICATION_SETTINGS"
                    extras={[
                      {
                        'android.provider.extra.APP_PACKAGE': 'com.blogapp',
                      },
                    ]}>
                    app通知设置
                  </SendIntentButton>
                </View>
              </View>
            }>
            发送 Intents <Brief>只限安卓端</Brief>
          </Item>
        </List>
      </WingBlank>
    </Fragment>
  );
};

const styles = StyleSheet.create({
  row: {
    width: 200,
    flexDirection: 'row',
    justifyContent: 'space-around',
    // alignItems: 'stretch',
  },
});

export default memo(DeepLinks);
