import React, {memo, useState, useCallback, useEffect, useRef} from 'react';
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
import NavBar from '../../components/NavBar';
import MyDoubleClickButton from '../../components/DoubleClickBtn';
import {sleep} from '../../utils';
import {getArticleList} from '../../api';

const tagColors = ['#999', '#1677ff', '#00b578', '#ff8f1f', '#ff3141'];
const titleStyle = {
  fontFamily: '',
  color: '#333',
  fontSize: 17,
};

const MyList = () => {
  const [list, setList] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();
  const flatListRef = useRef(null);

  const gotoDetail = detailId => {
    console.log('data==>', detailId);

    navigate('/detail/' + detailId);
  };

  const queryList = async () => {
    const [err, data] = await getArticleList();

    console.log('err==>', err);
    // console.log('data==>', data);

    if (err) {
      Toast.fail({
        content: <Text style={styles.toastText}>加载失败,请重试</Text>,
        duration: 2,
      });
      return;
    }

    setList(data);
  };

  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.item}
        onPress={() => gotoDetail(item.fileName)}>
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

  // 下拉刷新
  const onRefresh = useCallback(() => {
    setRefreshing(true);

    sleep(2000).then(() => {
      Toast.info({
        content: '刷新成功',
        mask: false,
        duration: 2,
      });
      setRefreshing(false);
    });
  }, []);

  const handleEndReached = () => {
    console.log('即将到底部');
  };

  useEffect(() => {
    if (!refreshing) {
      return;
    }

    queryList();

    return () => {
      setRefreshing(false);
    };
  }, [refreshing]);

  useEffect(() => {
    queryList();
  }, []);

  return (
    <>
      <NavBar title="文章列表">
        <MyDoubleClickButton
          onPress={() => {
            // 双击title，列表回到顶部
            console.log('double click');
            if (flatListRef.current) {
              flatListRef.current.scrollToOffset({
                animated: true,
                offset: 0,
              });
            }
          }}
          title="文章列表"
          doubleClickTime={300}
          textStyle={titleStyle}
        />
      </NavBar>
      <WingBlank size="md">
        <FlatList
          style={{marginBottom: (StatusBar.currentHeight || 0) + 60}}
          ref={flatListRef}
          data={list}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          ListEmptyComponent={<Empty />}
          onEndReachedThreshold={0.5}
          onEndReached={handleEndReached}
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
    </>
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
  toastText: {
    color: '#fff',
    fontFamily: '',
  },
});

export default memo(MyList);
