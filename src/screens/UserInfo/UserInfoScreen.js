import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  PermissionsAndroid,
  ScrollView,
  RefreshControl
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { UserInfoRoutes } from '../../navigations/routes';
import { AuthContext } from '../../navigations/Nest';
import DangerAlert from '../../components/DangerAlert';
import { GRAY, WHITE, YELLOW } from '../../colors';
import Button2 from '../../components/Button2';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';

const UserInfoScreen = () => {
  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [visible, setVisible] = useState(false);
  const [image, setImage] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const navigation = useNavigation();

  const handleRefresh = () => {
    setRefreshing(true);

    setTimeout(() => {
      setRefreshing(false);
    }, 1000); // Replace 2000 with an appropriate delay
  };

  const { signOut, isSignedIn } = useContext(AuthContext);
  const getImage = async () => {
    try {
      //setImage('');
      const myEmail = await AsyncStorage.getItem('email');
      const token = await AsyncStorage.getItem('token');
      const myProfileUrl = `http://ec2-43-200-8-47.ap-northeast-2.compute.amazonaws.com:8080/profile/get/${myEmail}/${myEmail}.jpg`;

      const response = await axios.get(myProfileUrl);

      setImage(myProfileUrl);
    } catch (error) {
      console.log('이미지 가져오기 실패. 에러 코드 : ', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const myEmail = await AsyncStorage.getItem('email');
        //const myUserName = await AsyncStorage.getItem('userName');
        const token = await AsyncStorage.getItem('token');
        setImage(
          `http://ec2-43-200-8-47.ap-northeast-2.compute.amazonaws.com:8080/profile/get/${myEmail}/${myEmail}.jpg`
        );
        console.log('프로필 변경 : ', image);

        if (myEmail && token) {
          const response = await axios.get(
            `http://ec2-43-200-8-47.ap-northeast-2.compute.amazonaws.com:8080/users/${myEmail}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          setEmail(response.data.email);
          setUserName(response.data.userName);
        }
      } catch (error) {
        console.error('사용자 데이터 가져오기 오류:', error);
      }
    };

    handleRefresh();
    getImage();
    fetchData();
  }, [email]);

  // 이미지 업로드 함수
  const uploadImage = async (uri) => {
    try {
      const formData = new FormData();

      const myEmail = await AsyncStorage.getItem('email');
      const token = await AsyncStorage.getItem('token');
      const tmpProfile = `http://ec2-43-200-8-47.ap-northeast-2.compute.amazonaws.com:8080/profile/get/${myEmail}/${myEmail}.jpg`;
      setImage(tmpProfile);

      console.log('uri : ', uri);

      formData.append('file', {
        uri: `${uri}`,
        type: 'multipart/form-data',
        name: `${myEmail}.jpg`,
        // type: 'image/jpg',
      });

      const response = await axios.post(
        `http://ec2-43-200-8-47.ap-northeast-2.compute.amazonaws.com:8080/profile/post/${myEmail}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',

            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data);
      // 업로드 성공 시 서버에서 이미지 URL을 반환하는 것을 가정합니다.
      if (response.data && response.data.imageUrl) {
        setImage(response.data.imageUrl);
        getImage();
        console.log('성공 : ', response.data.imageUrl);
      }
    } catch (error) {
      console.error('이미지 업로드 오류:', error);
    }
  };

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
    <ScrollView
      contentContainerStyle={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
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
          {/* <TouchableOpacity
          onPress={async () => {
            let result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.All,
              allowsEditing: true,
              aspect: [3, 3],
              quality: 1,
            });

            console.log(result);

            if (!result.canceled) {
              setImage(result.assets[0].uri);
            }
          }}
        >
         */}
          <TouchableOpacity
            onPress={async () => {
              let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [3, 3],
                quality: 1,
              });

              console.log(
                '결과 : ',
                result,
                '넣을 데이터 : ',
                result.assets[0].uri
              );

              uploadImage(result.assets[0].uri);
            }}
          >
            {image ? (
              <Image
                source={{ uri: image + '?cache=' + Math.random() }}
                style={styles.dogImage}
              />
            ) : (
              <Image
                style={styles.dogImage}
                source={require('../../assets/pet_icon.png')}
              />
            )}
            <View style={styles.editIconContainer}>
              <MaterialIcons name="edit" size={24} color="black" />
            </View>
          </TouchableOpacity>
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
          <Button2
            backgrouncolor={YELLOW.DEFAULT}
            color={WHITE}
            text={'수정'}
            width={350}
          />
          <Button2
            backgrouncolor={YELLOW.DEFAULT}
            color={WHITE}
            text={'로그아웃'}
            onPress={() => {
              setVisible(true);
            }}
            width={350}
          />
          <Button2
            backgrouncolor={GRAY.LIGHT}
            color={WHITE}
            text={'계정탈퇴'}
            onPress={handleWithdrawal}
            width={350}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: WHITE,
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
  editIconContainer: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: '#FFCC33',
    borderRadius: 50,
    padding: 5,
  },
});

export default UserInfoScreen;
