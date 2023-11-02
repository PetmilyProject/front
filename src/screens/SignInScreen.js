import React, { useState, useEffect } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableWithoutFeedback,
  ActivityIndicator,
  View,
} from 'react-native';

import Input, { InputTypes, ReturnKeyTypes } from '../components/Input';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SquareButton, { ColorTypes } from '../components/Button';
import { useContext } from 'react';
import { AuthContext } from '../navigations/Nest';
import { BLACK, GRAY, WHITE, YELLOW } from '../colors';

const SignInScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { signIn, isSignedIn } = useContext(AuthContext);

  const handleSignIn = () => {
    if (loading) return;

    setLoading(true);

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

        AsyncStorage.setItem('token', token)
          .then(() => {
            setLoading(false);
            signIn();
          })
          .catch((error) => {
            setLoading(false);
            console.error('로그인 토큰 저장 실패:', error);
          });
      })
      .catch((error) => {
        setLoading(false);
        console.error('로그인 실패:', error);
      });
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <KeyboardAvoidingView style={styles.container} behavior="height">
        <View
          style={{
            width: 500,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: WHITE,
            flex: 1,
          }}
        >
          <View
            style={{
              width: 380,
              justifyContent: 'center',
            }}
          >
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
                width: { width: 380 },
              }}
              value={password}
              onChangeText={(text) => setPassword(text.trim())}
              inputType={InputTypes.PASSWORD}
              returnKeyType={ReturnKeyTypes.DONE}
            />
          </View>

          {loading ? (
            <SquareButton
              colorType={ColorTypes.YELLOW}
              text={<ActivityIndicator size="small" color={BLACK} />}
              onPress={handleSignIn}
            />
          ) : (
            <SquareButton
              colorType={ColorTypes.YELLOW}
              text="로그인하기"
              onPress={handleSignIn}
            />
          )}
        </View>
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
