import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import axios from 'axios';
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from 'react-native-responsive-screen';
import Button2 from '../../components/Button2';
import InputText from '../../components/InputText';
import { YELLOW, WHITE } from '../../colors';

const UserInfoEditScreen = ({ navigation }) => {
  const [password, setPassword] = useState('');
  const [userName, setUserName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleProfileUpdate = () => {
    axios
      .put(
        'http://ec2-43-200-8-47.ap-northeast-2.compute.amazonaws.com:8080/auth/update-profile',
        {
          password: password,
          userName: userName,
          phoneNumber: phoneNumber,
        }
      )
      .then((response) => {
        Alert.alert('프로필 업데이트 성공', '프로필이 업데이트되었습니다.');
        // 업데이트 후 필요한 작업 수행
        navigation.goBack();
      })
      .catch((error) => {
        console.error('프로필 업데이트 실패:', error);
        Alert.alert('프로필 업데이트 실패', '다시 시도해주세요.');
      });

    // 키보드를 닫습니다.
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="height">
        <ScrollView contentContainerStyle={styles.container}>
          <InputText
            title={'비밀번호'}
            placeholder={'비밀번호'}
            keyboardType={'visible-password'}
            onChangeText={(text) => setPassword(text)}
            width={widthPercentageToDP('90%')}
          />
          <InputText
            title={'닉네임'}
            placeholder={'닉네임'}
            keyboardType={'default'}
            onChangeText={(text) => setUserName(text)}
            width={widthPercentageToDP('90%')}
          />
          <InputText
            title={'전화번호'}
            placeholder={'전화번호'}
            keyboardType={'numeric'}
            onChangeText={(text) => setPhoneNumber(text)}
            width={widthPercentageToDP('90%')}
          />
          <Button2
            backgrouncolor={YELLOW.DEFAULT}
            color={WHITE}
            text={'프로필 업데이트'}
            onPress={handleProfileUpdate}
            width={widthPercentageToDP('90%')}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: WHITE,
  },
});

export default UserInfoEditScreen;
