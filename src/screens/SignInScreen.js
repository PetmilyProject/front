import { Button, StyleSheet, Text, View } from 'react-native';
import Input, {
  InputTypes,
  KeyboardTypes,
  ReturnKeyTypes,
} from '../components/Input';
import { useRef, useState } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SquareButton, { ColorTypes } from '../components/Button';
import { useContext } from 'react';
import { AuthContext } from '../navigations/Nest';

const SignInScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { signIn, isSignedIn } = useContext(AuthContext); // isSignedIn 가져오기

  const handleSignIn = () => {
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

            // 다음 화면으로 이동
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

  return (
    <View style={styles.container}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SignInScreen;
