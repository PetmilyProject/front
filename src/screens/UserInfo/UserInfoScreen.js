import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useNavigationState } from '@react-navigation/native';
import axios from 'axios';
import { UserInfoRoutes } from '../../navigations/routes';
import { AuthContext } from '../../navigations/Nest';
import DangerAlert from '../../components/DangerAlert';
import { GRAY, YELLOW } from '../../colors';

const UserInfoScreen = () => {
  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [visible, setVisible] = useState(false);
  const [logout, setLogout] = useState(false);

  const navigation = useNavigation();

  const { signOut, isSignedIn } = useContext(AuthContext);
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
      signOut();
    } catch (error) {
      console.log(error);
    }
  };

  // 회원탈퇴 함수
  const handleWithdrawal = async () => {
    navigation.navigate(UserInfoRoutes.WITHDRAWAL);
  };

  return (
    <View style={styles.container}>
      <DangerAlert
        visible={visible}
        onClose={() => setVisible(false)}
        onRight={handleLogout}
        leftBtnColor={GRAY.LIGHT}
        rightBtnColor={YELLOW.DEFAULT}
        title={'로그아웃 하시겠습니까?'}
        leftText={'취소'}
        rightText={'로그아웃'}
      />
      {/* 강아지 사진 */}
      <View style={styles.imageContainer}>
        <Image
          style={styles.dogImage}
          source={require('../../assets/pet_icon.png')}
        />
      </View>

      {/* 이메일과 닉네임 */}
      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <Text style={styles.nicknameText}>{userName}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.emailText}>{email}</Text>
        </View>
      </View>

      {/* 로그아웃과 회원탈퇴 버튼 */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button1}>
          <Text style={styles.buttonText}>양육자 초기화</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button1}
          onPress={() => {
            setVisible(true);
          }}
        >
          <Text style={styles.buttonText}>로그아웃</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button2} onPress={handleWithdrawal}>
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
  modal: {
    flex: 1,
    backgroundColor: 'red',
  },
  imageContainer: {
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  dogImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },

  nicknameText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginLeft: 45,
  },
  emailText: {
    fontSize: 15,
    fontWeight: 'bold',
    marginLeft: 10,
  },

  userText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  buttonContainer: {
    marginTop: 50,
  },
  button1: {
    backgroundColor: '#FFCC33',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 50,
    marginVertical: 10,
    width: 300,
    alignItems: 'center',
  },
  button2: {
    backgroundColor: '#999999',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 50,
    marginVertical: 10,
    width: 300,
    alignItems: 'center',
  },
  buttonText: {
    color: 'black',
    fontSize: 14,
  },
});

export default UserInfoScreen;
