import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import axios from 'axios';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import Button2 from '../../components/Button2';
import InputText from '../../components/InputText';
import { YELLOW, WHITE } from '../../colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserInfoEditScreen = ({ navigation }) => {
  const [userId, setId] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userName, setUserName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  useEffect(() => {
    fetchUserInformation();
  }, []);

  const fetchUserInformation = async () => {
    try {
      const myEmail = await AsyncStorage.getItem('email');
      const token = await AsyncStorage.getItem('token');

      if (myEmail && token) {
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
            const userData = response.data;
            setId(userData.userId);
            setUserEmail(userData.email);
            setUserName(userData.userName);
            setPhoneNumber(userData.phoneNumber);
            console.log('userData : ', userData);
          })
          .catch((error) => {
            console.error('유저 정보 가져오기 실패:', error);
            Alert.alert('에러', '유저 정보를 가져오는데 실패했습니다.');
          });
      } else {
        Alert.alert('에러', '이메일 또는 토큰을 찾을 수 없습니다.');
      }
    } catch (error) {
      console.error('에러:', error);
      Alert.alert('에러', '다시 시도해주세요.');
    }
  };

  // const handleProfileUpdate = async () => {
  //   try {
  //     const myEmail = await AsyncStorage.getItem('email');
  //     const token = await AsyncStorage.getItem('token');

  //     if (myEmail && token) {
  //       axios
  //         .put(
  //           'http://ec2-43-200-8-47.ap-northeast-2.compute.amazonaws.com:8080/users/update',
  //           {
  //             // password: password,
  //             userId: userId,
  //             userName: userName,
  //             phoneNumber: phoneNumber,
  //           },
  //           {
  //             headers: {
  //               Authorization: `Bearer ${token}`,
  //             },
  //           }
  //         )
  //         .then((response) => {
  //           Alert.alert('업데이트 성공', '프로필이 업데이트되었습니다.');
  //           navigation.goBack();
  //         })
  //         .catch((error) => {
  //           console.log('usid : ', myEmail);
  //           console.error('업데이트 실패:', error);
  //           Alert.alert('업데이트 실패', '다시 시도해주세요.');
  //         });

  //       // 키보드를 닫습니다.
  //       Keyboard.dismiss();
  //     } else {
  //       Alert.alert('에러', '이메일 또는 토큰을 찾을 수 없습니다.');
  //     }
  //   } catch (error) {
  //     console.error('에러:', error);
  //     Alert.alert('에러', '다시 시도해주세요.');
  //   }
  // };

  const handleProfileUpdate = () => {
    AsyncStorage.getItem('email')
      .then((myEmail) => {
        AsyncStorage.getItem('token')
          .then((token) => {
            axios
              .put(
                `http://ec2-43-200-8-47.ap-northeast-2.compute.amazonaws.com:8080/users/update`,
                {
                  email: userEmail,
                  // user_id: userId,
                  userName: userName,
                  phoneNumber: phoneNumber,
                },
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              )
              .then((response) => {
                console.log(response.data);
              })
              .catch((error) => {
                console.error('유저 정보 업데이트 실패 : 에러 : ', error);
                console.log('ddd : ', userEmail);
              });
          })
          .catch((error) => {
            console.error(error);
          });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="height">
        <ScrollView contentContainerStyle={styles.container}>
          {/* <InputText
            title={'비밀번호'}
            placeholder={'비밀번호'}
            keyboardType={'visible-password'}
            secureTextEntry={true}
            onChangeText={(text) => setPassword(text)}
            width={widthPercentageToDP('90%')}
          /> */}
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
            text={'프로필 수정'}
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
