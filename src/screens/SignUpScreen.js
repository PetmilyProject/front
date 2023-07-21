import { useNavigation } from '@react-navigation/native';
import {
  StyleSheet,
  TextInput,
  View,
  Alert,
  Text,
  TouchableOpacity,
} from 'react-native';
import SquareButton, { ColorTypes } from '../components/Button';
import InputText from '../components/InputText';
import axios from 'axios';
import { useState } from 'react';
import Input, { InputTypes, ReturnKeyTypes } from '../components/Input';
import Navigation from '../navigations/Navigation';
import FirstScreen from './FirstScreen';

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
        }
      )
      .then((response) => {
        //console.log(response);
        setInviter(email);
        navigation.goBack();
      })
      .catch((error) => {
        console.error('회원가입 실패:', error);
        Alert.alert('회원가입 실패', '다시 시도해주세요.');
      });
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={(text) => setEmail(text)}
        placeholder="이메일"
      />
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={(text) => setPassword(text)}
        placeholder="비밀번호"
        secureTextEntry={true}
      />
      <TextInput
        style={styles.input}
        value={userName}
        onChangeText={(text) => setUserName(text)}
        placeholder="닉네임"
      />
      <TextInput
        style={styles.input}
        value={phoneNumber}
        onChangeText={(text) => setPhoneNumber(text)}
        placeholder="전화번호"
      />
      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>회원가입</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
