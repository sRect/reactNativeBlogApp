import React, {memo, useState, useCallback} from 'react';
import {
  FlatList,
  View,
  Text,
  StyleSheet,
  StatusBar,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import {useNavigate} from 'react-router-native';
import {WingBlank, Toast} from '@ant-design/react-native';
import {IconOutline} from '@ant-design/icons-react-native';
import Empty from '../../components/Empty';
import {sleep} from '../../utils';

const tagColors = ['#999', '#1677ff', '#00b578', '#ff8f1f', '#ff3141'];

const DATA = [
  {
    id: 'Pg3g452hZCa-p4SregxcJ',
    title: '仿抖音左右歪头图片选择',
    keywords: ['face-api', ' 人脸识别', ' 抖音'],
    date: '2022-11-29',
    fileName: 'face-api',
  },
  {
    id: 'zK98CqmnhJBFi7g9jhdoc',
    title: 'uniapp 打包 h5 问题总结',
    keywords: ['uniapp', ' webpack4.x'],
    date: '2022-08-08',
    fileName: 'uniapp',
  },
  {
    id: '7BPmFqcDsuU3nUVspQJY5',
    title: 'Taro与微信小程序原生组件之间的事件通信',
    keywords: [
      'taro',
      'wemark',
      'face-api',
      ' 人脸识别',
      ' 抖音',
      'wemark',
      'face-api',
      ' 人脸识别',
    ],
    date: '2022-04-04',
    fileName: 'taro-wemark',
  },
];

const MyList = () => {
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();

  const gotoDetail = () => {
    navigate('/detail');
  };

  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.item}
        onPress={gotoDetail}>
        <View style={styles.itemLeft}>
          <View>
            <Text style={styles.title}>{item.title}</Text>
          </View>
          <View style={styles.tagWrap}>
            {item.keywords.map((text, key) => (
              <View style={styles.tag} key={key}>
                <Text
                  style={styles.tagText(
                    tagColors[Math.floor(Math.random() * 5)],
                  )}>
                  {text}
                </Text>
              </View>
            ))}
          </View>
          <View>
            <Text style={styles.date}>{item.date}</Text>
          </View>
        </View>
        <View style={styles.itemRight}>
          <IconOutline name="right" size={20} color="#ccc" />
        </View>
      </TouchableOpacity>
    );
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);

    sleep(2000).then(() => {
      Toast.info({
        content: '刷新成功',
        mask: true,
      });
      setRefreshing(false);
    });
  }, []);

  return (
    <WingBlank>
      <FlatList
        data={DATA}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        ListEmptyComponent={<Empty />}
        ItemSeparatorComponent={
          <View
            borderStyle="solid"
            borderColor="#f0f0f0"
            borderLeftWidth={0}
            borderRightWidth={0}
            borderBottomWidth={0}
            borderTopWidth={1}
          />
        }
        ListFooterComponent={
          <View style={styles.footer}>
            <Text style={styles.footerText}>--已经到底了--</Text>
          </View>
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            title="加载中..."
          />
        }
      />
    </WingBlank>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    width: '100%',
    backgroundColor: '#fff',
    paddingTop: 12,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemLeft: {
    flex: 0.9,
  },
  itemRight: {
    flex: 0.1,
    alignItems: 'flex-end',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  tagWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    padding: 5,
    paddingStart: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tagText: color => ({
    fontSize: 12,
    color: '#fff',
    backgroundColor: color,
    padding: 5,
    fontFamily: '',
  }),
  date: {
    color: '#999',
    fontSize: 15,
  },
  footer: {
    width: '100%',
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    color: '#ccc',
    fontSize: 14,
    fontFamily: '',
  },
});

export default memo(MyList);
