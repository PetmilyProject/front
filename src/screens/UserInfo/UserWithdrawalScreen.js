import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Navigation from '../../navigations/Navigation';
import { BLACK, GRAY, RED, WHITE } from '../../colors';
import SquareButton from '../../components/Button';
import Button2 from '../../components/Button2';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserWithdrawalScreen = ({ navigation }) => {
  const handleWithdrawal = async () => {
    try {
      // 서버에 계정 삭제 요청 보내기
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.error('로그인 토큰이 없습니다.');
        return;
      }

      const response = await axios.post(
        'http://ec2-43-200-8-47.ap-northeast-2.compute.amazonaws.com:8080/auth/logout',
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // 서버로부터 응답 받은 후, 계정 삭제에 성공하면 로컬 저장소에서도 계정 정보 삭제
      await AsyncStorage.clear();
      console.log('계정 삭제 완료');

      // 이전 화면으로 돌아가기
      navigation.goBack();
    } catch (error) {
      console.error('계정 삭제 실패:', error);
    }
  };

  const handleCancel = () => {
    // 이전 화면으로 돌아가기
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>계정을 삭제하시겠습니까?</Text>
      <Text style={styles.message}>
        계정을 삭제하는 경우{'\n'}
        -더 이상 해당 계정으로 PetMily에 로그인할 수 없게{'\n'} 됩니다.{'\n'}
        -등록된 반려동물 및 양육자에 대한 모든 정보는{'\n'}
        영구적으로 삭제됩니다.{'\n'}
        -사용자 계정은 영구적으로 삭제됩니다.
      </Text>
      <Button2
        backgrouncolor={GRAY.LIGHT}
        text="취소"
        onPress={handleCancel}
        color={BLACK}
        width={'90%'}
      />
      <Button2
        backgrouncolor={RED.DEFAULT}
        text="계정탈퇴"
        onPress={handleWithdrawal}
        color={WHITE}
        width={'90%'}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginLeft: 50,
    marginTop: 70,
  },
  title: {
    fontSize: 23,
    marginBottom: 20,
    fontWeight: '700',
  },
  message: {
    fontSize: 15,
    color: GRAY.DEFAULT,
  },
});

export default UserWithdrawalScreen;
