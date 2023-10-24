import React, { memo, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  Pressable,
  ActivityIndicator,
  Text,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation, useNavigationState } from '@react-navigation/native';
import { CarePetRoutes } from '../../../navigations/routes';

const ListPhotoScreen = ({ Navigation, petName, petId }) => {
  const [imageList, setImageList] = useState([]); // 이미지 목록을 저장할 상태 변수
  const [email, setEmail] = useState(''); // 이메일을 저장할 상태 변수
  const [isLoading, setIsLoading] = useState(true); // 데이터 로딩 상태를 저장할 상태 변수
  const [sharedPets, setSharedPets] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    // AsyncStorage에서 이메일과 토큰 가져오는 코드
    const fetchData = async () => {
      const storedEmail = await AsyncStorage.getItem('email');
      const storedToken = await AsyncStorage.getItem('token');
      const imgUrl = `http://43.200.8.47:8080/shared-images/${petId}/getAllImages`;

      try {
        const imgUrlResponse = await axios.get(imgUrl);
        if (imgUrlResponse.status === 200) {
          const responseData = imgUrlResponse.data;
          setImageList(responseData);
          setIsLoading(false);
        } else {
          console.error(
            'Failed to fetch image URLs. Response status:',
            imgUrlResponse.status
          );
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error fetching image URLs:', error);
        setIsLoading(false);
      }
    };

    fetchData(); // 데이터 가져오는 함수 호출
  }, []);

  const convertBlobToBase64 = async (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const renderItem = ({ item }) => {
    const handlePress = async () => {
      const myEmail = await AsyncStorage.getItem('email');
      const myToken = await AsyncStorage.getItem('token');
      const parts = item.split('/');
      const petNum = parts[parts.length - 2];
      const rawScheduleNum = parts[parts.length - 1];
      const scheduleNum = rawScheduleNum.replace(/\.[^/.]+$/, '');

      const scheduleUrl = `http://43.200.8.47:8080/sharedPetGallery/${myEmail}/get/${petNum}`;
      console.log(scheduleUrl);
      const scheduleResponse = await axios.get(scheduleUrl, {
        headers: {
          Authorization: `Bearer ${myToken}`,
        },
      });
      const responseData = scheduleResponse.data;
      console.log(responseData);

      console.log(number);
      //const matchedPet = sharedPets.find((pet) => pet.sharedPetId === item.id);

      if (matchedPet) {
        navigation.navigate(CarePetRoutes.DETAIL_PHOTO, {
          petInfo: {
            pet: petNum,
            likes: matchedPet.likes,
            date: matchedPet.date,
            memo: matchedPet.memo,
          },
        });
      }
    };

    return (
      <Pressable onPress={handlePress}>
        <Image source={{ uri: item }} style={styles.image} />
      </Pressable>
    );
  };

  if (isLoading) {
    // 데이터 로딩 중일 때는 로딩 표시를 보여줌
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000000" />
      </View>
    );
  }

  // 데이터 로딩이 완료되면 이미지 목록을 화면에 표시
  return (
    <View style={styles.container}>
      <FlatList
        data={imageList}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        numColumns={3}
      ></FlatList>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 20,
    width: 380,
  },
  image: {
    width: 125,
    height: 125,
    margin: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ListPhotoScreen;
