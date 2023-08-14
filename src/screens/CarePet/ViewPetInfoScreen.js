import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { BLACK, GRAY, RED, WHITE, YELLOW } from '../../colors';
import ImagePickerComponent from '../../components/ImagePicker';
import { Ionicons } from '@expo/vector-icons';
import { TextInput } from 'react-native-gesture-handler';
import InputText_in from '../../components/InputText_in';
import Button2 from '../../components/Button2';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { AddPetRoutes, CarePetRoutes } from '../../navigations/routes';
import { number } from 'prop-types';

const ViewPetInfoScreen = ({ navigation, route }) => {
  const petName = route.params;
  const [imgUrl, setImgUrl] = useState(null);
  const [name, setName] = useState(petName);
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [species, setSpecies] = useState('');
  const [character, setCharater] = useState('');
  const [email, setEmail] = useState('');
  const InsertUrl = (url) => {
    setImgUrl(url);
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };
  // 펫 정보 호출
  useEffect(() => {
    const fetchData = async () => {
      try {
        const email = await AsyncStorage.getItem('email');
        setEmail(email);
        const url = `http://ec2-43-200-8-47.ap-northeast-2.compute.amazonaws.com:8080/pet/get-pet/${email}/${petName}`;

        const response = await axios.get(url);
        const responseData = response.data;

        setAge(responseData.petAge);
        setSpecies(responseData.detailInfo);
      } catch (error) {
        console.log('Error fetching pet data:', error);
      }
    };

    fetchData();
  }, [petName]);

  // 펫 계정 수정(이름 변경시 수정X)
  const handlePetInfoSubmit = () => {
    console.log(petName, email, name, age, species, +'\n');
    AsyncStorage.getItem('email')
      .then((email) => {
        AsyncStorage.getItem('token')
          .then((token) => {
            axios
              .put(
                `http://ec2-43-200-8-47.ap-northeast-2.compute.amazonaws.com:8080/pet/put-pet/${email}/${petName}`,
                {
                  petName: name,
                  petAge: age,
                  detailInfo: species,
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
    navigation.navigate(CarePetRoutes.MAIN_CARE_PET, name);
  };
  //펫 계정 나가기

  const handleLeaveAccount = () => {
    AsyncStorage.getItem('email')
      .then((email) => {
        AsyncStorage.getItem('token')
          .then((token) => {
            axios
              .delete(
                `http://ec2-43-200-8-47.ap-northeast-2.compute.amazonaws.com:8080/pet/delete-pet/${email}/${petName}`,
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

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={styles.container}>
        <View style={styles.container_profile}>
          <View style={styles.container_photo}>
            {imgUrl === null ? (
              <View style={styles.photoBox}></View>
            ) : (
              <Image source={{ uri: imgUrl }} style={styles.image} />
            )}
            <View style={{ marginTop: 120, marginLeft: -50 }}>
              <ImagePickerComponent
                width={40}
                height={40}
                InsertUrl={InsertUrl}
              />
            </View>
          </View>
          <View style={styles.container_name}>
            <Ionicons name="md-pencil" size={20} color="black" />
            <TextInput
              style={styles.name}
              onChangeText={(text) => setName(text.trim())}
            >
              {name}
            </TextInput>
          </View>
        </View>
        <View style={styles.container_info}>
          <InputText_in
            title={'나이'}
            titleSize={20}
            value={String(age)}
            onChangeText={setAge}
            type={'input'}
            keyboardType={'decimal-pad'}
          />
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
            <Button2
              backgrouncolor={RED.DEFAULT}
              color={WHITE}
              text={'계정 나가기'}
              onPress={handleLeaveAccount}
            />
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
});

export default ViewPetInfoScreen;
