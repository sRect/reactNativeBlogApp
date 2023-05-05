import React, {memo} from 'react';
import {useNavigate} from 'react-router';
import {IconOutline} from '@ant-design/icons-react-native';
import styled from 'styled-components/native';

const NavWrapper = styled.View`
  width: 100%;
  height: 46px;
  padding-left: 10px;
  padding-right: 10px;
  flex-direction: row;
  align-items: center;
`;

const BackBtn = styled.TouchableOpacity`
  flex: 0.2;
  flex-direction: row;
  align-items: center;
`;

const BackText = styled.Text`
  color: #333;
  font-size: 14px;
  margin-left: 5px;
`;

const TitleWrap = styled.View`
  flex: 0.6;
  align-items: center;
`;

const TitleText = styled.Text`
  font-size: 17px;
  color: #333;
  font-family: '';
`;

const NavBar = props => {
  const {title, children, handleBack = null} = props;
  const navigate = useNavigate();

  const handleLeftPress = () => {
    handleBack ? handleBack() : navigate(-1);
  };

  return (
    <NavWrapper>
      <BackBtn activeOpacity={0.8} onPress={handleLeftPress}>
        <IconOutline name="left" color="#555" size={20} />
        <BackText selectable={false}>返回</BackText>
      </BackBtn>
      <TitleWrap>
        {children ? (
          children
        ) : (
          <TitleText
            selectable={false}
            numberOfLines={1}
            ellipsizeMode="middle">
            {title}
          </TitleText>
        )}
      </TitleWrap>
    </NavWrapper>
  );
};

export default memo(NavBar);
