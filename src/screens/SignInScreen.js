import React from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';

import Input, { InputTypes, ReturnKeyTypes } from '../components/Input';
import { useState } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SquareButton, { ColorTypes } from '../components/Button';
import { useContext } from 'react';
import { AuthContext } from '../navigations/Nest';
import { WHITE } from '../colors';

const SignInScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { signIn, isSignedIn } = useContext(AuthContext);

  const handleSignIn = () => {
    AsyncStorage.setItem('email', email);
    axios
      .post(
        'http://ec2-43-200-8-47.ap-northeast-2.compute.amazonaws.com:8080/auth/login',
        {
          email: email,
          password: password,
        }
      )
      .then((response) => {
        const token = response.data.token;
        const loginsuccess = () => {
          setIsSignedIn(true);
        };

        AsyncStorage.setItem('token', token)
          .then(() => {
            console.log('로그인 토큰 저장 완료:', token);
            signIn();
          })
          .catch((error) => {
            console.error('로그인 토큰 저장 실패:', error);
          });
      })
      .catch((error) => {
        console.error('로그인 실패:', error);
      });
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <KeyboardAvoidingView style={styles.container} behavior="height">
        <Input
          styles={{
            container: { marginBottom: 20, paddingHorizontal: 20 },
            input: { borderWidth: 1 },
          }}
          value={email}
          onChangeText={(text) => setEmail(text.trim())}
          inputType={InputTypes.EMAIL}
          returnKeyType={ReturnKeyTypes.NEXT}
        />
        <Input
          styles={{
            container: { marginBottom: 20, paddingHorizontal: 20 },
            input: { borderWidth: 1 },
          }}
          value={password}
          onChangeText={(text) => setPassword(text.trim())}
          inputType={InputTypes.PASSWORD}
          returnKeyType={ReturnKeyTypes.DONE}
        />
        <SquareButton
          colorType={ColorTypes.YELLOW}
          text="로그인하기"
          onPress={handleSignIn}
        />
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: WHITE,
  },
});

export default SignInScreen;
