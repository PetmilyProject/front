import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { AuthContext } from '../navigations/Nest';
import FirstScreen from './FirstScreen';
import * as Update from 'expo-updates';

const UserInfoScreen = () => {
  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');

  const navigation = useNavigation();

  const [isSignedIn, setIsSignedIn] = useState(false);

  const signOut = () => {
    setIsSignedIn(false);
  };
  const authContext = {
    signIn: () => setIsSignedIn(true),
    signOut: () => setIsSignedIn(false),
  };

  // AsyncStorage에서 토큰과 이메일을 가져옵니다.
  useEffect(() => {
    AsyncStorage.getItem('email')
      .then((myEmail) => {
        AsyncStorage.getItem('token')
          .then((token) => {
            axios
              .get(
                `http://ec2-43-200-8-47.ap-northeast-2.compute.amazonaws.com:8080/users/${myEmail}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              )
              .then((response) => {
                setEmail(response.data.email);
                setUserName(response.data.userName);
              })
              .catch((error) => {
                console.error(error);
              });
          })
          .catch((error) => {
            console.error(error);
          });
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  // 로그아웃 함수
  const handleLogout = async () => {
    try {
      AsyncStorage.clear();
      navigation.navigate(''); // 이 부분에 로그아웃 네비게이션
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      {/* 강아지 사진과 이름 */}
      <View style={styles.topContainer}>
        <Image
          style={styles.dogImage}
          source={require('../assets/pet_icon.png')}
        />
        <View>
          <Text style={styles.labelText}>이메일</Text>
          <Text style={styles.valueText}>{email}</Text>
        </View>
        <View>
          <Text style={styles.labelText}>닉네임</Text>
          <Text style={styles.valueText}>{userName}</Text>
        </View>
      </View>

      {/* 등록된 양육자와 사진 */}
      <View style={styles.userContainer}>
        <Text> 등록된 양육자 </Text>
        <Image
          style={styles.userImage}
          source={require('../assets/defaultimage.png')}
        />
      </View>

      {/* 로그아웃과 회원탈퇴 버튼 */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleLogout}>
          <Text style={styles.buttonText}>로그아웃</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>회원탈퇴</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    paddingTop: 50,
  },
  topContainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  dogImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  labelText: {
    fontSize: 17,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  valueText: {
    fontSize: 15,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  userText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  buttonContainer: {
    marginTop: 50,
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
    width: 200,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default UserInfoScreen;
