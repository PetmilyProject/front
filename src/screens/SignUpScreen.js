import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  KeyboardAvoidingView,
  useWindowDimensions,
} from 'react-native';
import axios from 'axios';
import InputText from '../components/InputText';
import Button2 from '../components/Button2';
import { YELLOW, WHITE, GRAY } from '../colors';

const SignUpScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userName, setUserName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [inviter, setInviter] = useState('');
  const { width, height } = useWindowDimensions();

  const overlapCheck = () => {
    // 클라이언트에서 이메일을 입력하여 중복 확인 요청을 서버로 보냅니다.
    axios
      .get(
        `http://ec2-43-200-8-47.ap-northeast-2.compute.amazonaws.com:8080/users/${email}`
      )
      .then((response) => {
        Alert.alert('사용 불가', '이미 사용 중인 이메일입니다.');
        setEmail('');
      })
      .catch((error) => {
        Alert.alert('사용 가능', '사용하지 않는 이메일입니다.');
        setEmail(email);
      });
  };

  const handleSignup = () => {
    axios
      .post(
        'http://ec2-43-200-8-47.ap-northeast-2.compute.amazonaws.com:8080/auth/signup',
        {
          email: email,
          password: password,
          userName: userName,
          phoneNumber: phoneNumber,
          inviter: email,
        }
      )
      .then((response) => {
        setInviter(email);
        navigation.goBack();
      })
      .catch((error) => {
        console.error('회원가입 실패:', error);
        Alert.alert('회원가입 실패', '다시 시도해주세요.');
      });

    // 키보드를 닫습니다.
    Keyboard.dismiss();
  };
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="height">
        <ScrollView contentContainerStyle={[styles.container, { height }]}>
          <View style={{ marginTop: height * -0.25, marginBottom: 30 }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'flex-end',
                justifyContent: 'center',
              }}
            >
              <View style={{ marginRight: 5 }}>
                <InputText
                  title={'이메일'}
                  placeholder={'이메일'}
                  keyboardType={'email-address'}
                  onChangeText={(text) => setEmail(text)}
                  width={width * 0.63}
                />
              </View>
              <Button2
                backgrouncolor={YELLOW.DEFAULT}
                color={WHITE}
                text={'중복확인'}
                onPress={overlapCheck}
                width={width * 0.25}
                fontSize={15}
              />
            </View>
            <InputText
              title={'비밀번호'}
              placeholder={'비밀번호'}
              keyboardType={'visible-password'}
              secureTextEntry={true}
              onChangeText={(text) => setPassword(text)}
              width={width * 0.9}
            />
            <InputText
              title={'닉네임'}
              placeholder={'닉네임'}
              keyboardType={'default'}
              onChangeText={(text) => setUserName(text)}
              width={width * 0.9}
            />
            <InputText
              title={'전화번호'}
              placeholder={'전화번호'}
              keyboardType={'numeric'}
              onChangeText={(text) => setPhoneNumber(text)}
              width={width * 0.9}
            />
          </View>
          <Button2
            backgrouncolor={YELLOW.DEFAULT}
            color={WHITE}
            text={'회원가입'}
            onPress={handleSignup}
            width={width * 0.9}
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
  input: {
    width: '80%',
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#ccc',
  },
  button: {
    width: '80%',
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default SignUpScreen;
