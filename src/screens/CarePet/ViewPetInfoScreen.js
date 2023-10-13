import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
} from 'react-native';
import { BLACK, GRAY, RED, WHITE, YELLOW } from '../../colors';
import * as ImagePicker from 'expo-image-picker';
import ImagePickerComponent from '../../components/ImagePicker';
import { Ionicons } from '@expo/vector-icons';
import { TextInput } from 'react-native-gesture-handler';
import InputText_in from '../../components/InputText_in';
import Button2 from '../../components/Button2';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { AddPetRoutes, CarePetRoutes } from '../../navigations/routes';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import DangerAlert from '../../components/DangerAlert';

const ViewPetInfoScreen = ({ navigation, route }) => {
  const petName = route.params[0];
  const petId = route.params[1];
  const [imgUrl, setImgUrl] = useState(null);
  const [name, setName] = useState(petName);
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [species, setSpecies] = useState('');
  const [character, setCharater] = useState('');
  const [inviter, setInviter] = useState('');
  const [email, setEmail] = useState('');
  const [petLink, setPetLink] = useState(null);

  const [visible, setVisible] = useState(false);

  const uploadImage = async (uri) => {
    try {
      const formData = new FormData();

      const myEmail = await AsyncStorage.getItem('email');
      const token = await AsyncStorage.getItem('token');
      const linkResponse = await axios.get(
        `http:43.200.8.47:8080/pet/get-pet/${myEmail}/${petId}`
      );
      const inviter = linkResponse.data.inviter;
      const petProfile = `http://43.200.8.47:8080/pet/${inviter}/downloadImage/${petId}.jpg`;
      setImgUrl(petProfile);

      console.log('post 할 uri : ', uri);

      formData.append('file', {
        uri: `${uri}`,
        type: 'multipart/form-data',
        name: `${myEmail}.jpg`,
        // type: 'image/jpg',
      });

      const response = await axios.post(
        `http://43.200.8.47:8080/pet/${inviter}/uploadImage/${petId}`,
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
        setImgUrl(response.data.imageUrl);
        console.log('성공 : ', response.data.imageUrl);
      }
    } catch (error) {
      console.error('이미지 업로드 오류:', error);
    }
  };

  const InsertUrl = async () => {
    const myEmail = await AsyncStorage.getItem('email');
    setEmail(myEmail);
    const token = await AsyncStorage.getItem('token');
    const linkResponse = await axios.get(
      `http:43.200.8.47:8080/pet/get-pet/${myEmail}/${petId}`
    );
    const inviter = linkResponse.data.inviter;
    setInviter(inviter);
    const petImageUrl = `http://43.200.8.47:8080/pet/${inviter}/downloadImage/${petId}.jpg`;

    console.log('펫 이미지 url : ', petImageUrl);

    setImgUrl(petImageUrl);
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };
  // 펫 정보 호출
  useEffect(() => {
    const fetchData = async () => {
      try {
        const email = await AsyncStorage.getItem('email');
        const token = await AsyncStorage.getItem('token');

        setEmail(email);
        const url = `http://ec2-43-200-8-47.ap-northeast-2.compute.amazonaws.com:8080/link/get/${email}/${petId}`;

        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const inviter = response.data.inviter;
        setPetLink(response.data.linkId);
        const petUrl = `http://43.200.8.47:8080/pet/get-pet/${inviter}/${petId}`;
        const rawResponseData = await axios.get(petUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const responseData = rawResponseData.data;

        setName(responseData.petName);
        setAge(responseData.petAge);
        setCharater(responseData.detailInfo);
      } catch (error) {
        console.log('Error fetching pet data:', error);
      }
    };

    fetchData();
    InsertUrl();
  }, [imgUrl]);

  const handlePetInfoSubmit = async () => {
    const email = await AsyncStorage.getItem('email');
    const token = await AsyncStorage.getItem('token');
    const linkResponse = await axios.get(
      `http:43.200.8.47:8080/pet/get-pet/${email}/${petId}`
    );
    const inviter = linkResponse.data.inviter;

    const putData = await axios.put(
      `http://43.200.8.47:8080/pet/put-pet/${inviter}/${petId}`,
      {
        petName: name,
        petAge: age,
        detailInfo: character,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log('완료?', putData.data);

    const route = [petName, petId];

    navigation.navigate(CarePetRoutes.MAIN_CARE_PET, route);
  };

  // 계정나가기
  //owner 계정나가기 - petLink 삭제
  const deletePetLink = async () => {
    try {
      const response = await axios.delete(
        `http://ec2-43-200-8-47.ap-northeast-2.compute.amazonaws.com:8080/link/delete/${petLink}`
      );

      if (response.status === 200) {
        navigation.navigate(AddPetRoutes.LIST);
        console.log('펫계정 나가기 성공');
      } else {
        console.log('펫계정 나가기를 실패했습니다.');
      }
    } catch (error) {
      console.error('펫 계정 나가는 중 오류 발생:', error);
    }
  };
  //inviter 계정나가기(1)- pet 삭제
  const deletePet = () => {
    AsyncStorage.getItem('email')
      .then((email) => {
        AsyncStorage.getItem('token')
          .then((token) => {
            axios
              .delete(
                `http://ec2-43-200-8-47.ap-northeast-2.compute.amazonaws.com:8080/pet/delete-pet/${email}/${petId}`,
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

    navigation.navigate(AddPetRoutes.LIST);
  };
  // //inviter 계정 나가기(2) - AllPetLink 삭제
  const deleteAllPetLink = async () => {
    try {
      const response = await axios.delete(
        `http://ec2-43-200-8-47.ap-northeast-2.compute.amazonaws.com:8080/link/deleteAll/${petId}`
      );
      console.log(response.data);

      if (response.status === 200) {
        navigation.navigate(AddPetRoutes.LIST);

        console.log('모든 펫링크 지우기 성공');
      } else {
        console.log('모든 펫링크 지우기 실패');
      }
    } catch (error) {
      console.error('모든 펫링크 지우는 중 오류 발생:', error);
    }
  };

  const setName1 = (newName) => {
    console.log('ddd : ', newName);
    setName(newName);
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={styles.container}>
        <DangerAlert
          visible={visible}
          title={`${petName}` + ' 계정에서' + '\n' + '나가시겠습니까?'}
          comment={'한 번 삭제된 계정은 복구 수 없습니다.'}
          leftText={'취소'}
          rightText={'나가기'}
          onClose={() => setVisible(false)}
          onRight={() => {
            setVisible(false);
            {
              inviter === email
                ? (deleteAllPetLink(), deletePet())
                : deletePetLink();
            }
          }}
          leftBtnColor={GRAY.LIGHT}
          rightBtnColor={YELLOW.DEFAULT}
        />
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
          <View style={styles.imageContainer}>
            <View style={styles.photoBox}>
              {
                <Image
                  source={{ uri: imgUrl + '?cache=' + Math.random() }}
                  style={styles.photoBox}
                />
              }
              <View style={styles.editIconContainer}>
                <MaterialIcons name="edit" size={24} color="black" />
              </View>
            </View>
          </View>
        </TouchableOpacity>
        <View style={styles.container_info}>
          <InputText_in
            title={'이름'}
            titleSize={20}
            value={name}
            onChangeText={setName1}
            type={'input'}
          />
          <InputText_in
            title={'나이'}
            titleSize={20}
            value={String(age)}
            onChangeText={setAge}
            type={'input'}
            keyboardType={'decimal-pad'}
          />
          {/* 
          <InputText_in
            title={'구분'}
            titleSize={20}
            value={species}
            onChangeText={setSpecies}
            type={'input'}
          />
          <InputText_in
            title={'성별'}
            titleSize={20}
            value={gender}
            onChangeText={setGender}
            type={'input'}
          />
          */}
          <InputText_in
            title={'특징'}
            titleSize={20}
            value={character}
            onChangeText={setCharater}
            type={'input'}
          />
          <View style={{ marginTop: 30 }}>
            <Button2
              backgrouncolor={GRAY.LIGHT}
              color={BLACK}
              text={'확인'}
              onPress={handlePetInfoSubmit}
            />
            {inviter === email ? (
              <Button2
                backgrouncolor={RED.DEFAULT}
                color={WHITE}
                text={'계정 지우기'}
                onPress={() => setVisible(true)}
              />
            ) : (
              <Button2
                backgrouncolor={RED.DEFAULT}
                color={WHITE}
                text={'계정 나가기'}
                onPress={() => setVisible(true)}
              />
            )}
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    backgroundColor: WHITE,
  },
  container_profile: {
    flex: 1,
    width: '100%',
    marginTop: 30,
  },
  container_photo: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container_name: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },
  photoBox: {
    backgroundColor: GRAY.LIGHT,
    borderRadius: 100,
    width: 150,
    height: 150,
  },
  image: {
    borderRadius: 100,
    width: 150,
    height: 150,
  },
  name: {
    fontSize: 20,
    textAlign: 'center',
  },
  container_info: {
    flex: 2,
    alignItems: 'center',
    // backgroundColor: GRAY.LIGHTER,
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

export default ViewPetInfoScreen;
