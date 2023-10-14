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
import Button2 from '../components/Button2';
import InputText from '../components/InputText';
import { YELLOW, WHITE } from '../colors';

const SignUpScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userName, setUserName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [inviter, setInviter] = useState('');

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
        <ScrollView contentContainerStyle={styles.container}>
          <View style={{ marginTop: heightPercentageToDP('10%') }}>
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
                  width={widthPercentageToDP('63%')}
                />
              </View>
              <Button2
                backgrouncolor={YELLOW.DEFAULT}
                color={WHITE}
                text={'중복확인'}
                onPress={handleSignup}
                width={widthPercentageToDP('25%')}
                fontSize={15}
              />
            </View>
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
          </View>
          <Button2
            backgrouncolor={YELLOW.DEFAULT}
            color={WHITE}
            text={'회원가입'}
            onPress={handleSignup}
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
