import React, {memo, useState, useCallback} from 'react';
import {
  FlatList,
  View,
  Text,
  StyleSheet,
  StatusBar,
  RefreshControl,
} from 'react-native';
import {WingBlank, Toast} from '@ant-design/react-native';
import Empty from '../../components/Empty';
import {sleep} from '../../utils';

const DATA = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    title: 'First Item',
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    title: 'Second Item',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    title: 'Third Item',
  },
];

const MyList = () => {
  const [refreshing, setRefreshing] = useState(false);

  const renderItem = ({item}) => {
    return (
      <View style={styles.item}>
        <Text style={styles.title}>{item.title}</Text>
      </View>
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
    <WingBlank size="sm">
      <FlatList
        data={DATA}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        ListEmptyComponent={<Empty />}
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
    backgroundColor: '#f9c2ff',
    paddingTop: 20,
    paddingBottom: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
});

export default memo(MyList);
