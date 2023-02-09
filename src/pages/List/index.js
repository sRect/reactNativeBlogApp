import React, {memo} from 'react';
import {ScrollView, View, Text, TouchableOpacity} from 'react-native';
import {useNavigate} from 'react-router-native';

const List = () => {
  const navigate = useNavigate();

  return (
    <ScrollView>
      {[1, 2, 3].map(item => {
        return (
          <View key={item}>
            <Text>{item}</Text>
          </View>
        );
      })}

      <View>
        <TouchableOpacity onPress={() => navigate(-1)}>
          <Text>back</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default memo(List);
