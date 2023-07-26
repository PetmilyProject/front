import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { CarePetRoutes } from '../../../navigations/routes';
import DetailPhotoScreen from './DetailPhotoScreen';

const ListPhotoScreen = ({ navigation }) => {
  const [imageList, setImageList] = useState([]); // 이미지 목록을 저장할 상태 변수
  const [email, setEmail] = useState(''); // 이메일을 저장할 상태 변수
  const [isLoading, setIsLoading] = useState(true); // 데이터 로딩 상태를 저장할 상태 변수
  const [sharedPets, setSharedPets] = useState([]);

  useEffect(() => {
    const getPhotoImage = async () => {
      const storedEmail = await AsyncStorage.getItem('email');
      setEmail(storedEmail);
      setSharedPets([]);

      const sharedPetInfo = (
        await axios.get(
          `http://ec2-43-200-8-47.ap-northeast-2.compute.amazonaws.com:8080/shared/get-all/${storedEmail}`
        )
      ).data;
      setSharedPets((prevPetInfo) => prevPetInfo.concat(sharedPetInfo));
      //console.log(sharedPetInfo);

      const newImageList = []; // 새로운 이미지 목록을 담을 배열 생성

      for (let i = 0; i < sharedPetInfo.length; i++) {
        const sharedUrl = `http://ec2-43-200-8-47.ap-northeast-2.compute.amazonaws.com:8080/shared-images/${storedEmail}/downloadImage/${sharedPetInfo[i].sharedPetId}.jpg`;

        try {
          const response = await fetch(sharedUrl); // 이미지 데이터를 가져오기 위해 fetch 요청
          if (response.ok) {
            const imageData = await response.blob(); // 응답을 Blob 객체로 변환
            const base64Data = await convertBlobToBase64(imageData); // Blob을 base64로 변환
            // 이미지 정보 말고도 다양한 정보를 추가로 넣을 수 있다
            newImageList.push({
              id: sharedPetInfo[i].sharedPetId,
              image: base64Data,
            }); // 새로운 이미지를 업데이트된 이미지 목록에 추가
          } else {
            console.log(
              'Error fetching image data. Response status:',
              response.status
            );
          }
        } catch (error) {
          console.log('Error fetching image data:', error);
        }
      }
      setImageList(newImageList); // 업데이트된 이미지 목록으로 상태 변수 업데이트
      setIsLoading(false); // 데이터 로딩이 완료되었으므로 로딩 상태 업데이트
    };

    const fetchData = async () => {
      try {
        getPhotoImage();
      } catch (error) {
        console.log('Error fetching shared data:', error);
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
    const handlePress = () => {
      const matchedPet = sharedPets.find((pet) => pet.sharedPetId === item.id);
      if (matchedPet) {
        navigation.navigate({
          name: CarePetRoutes.DETAIL_PHOTO,
          params: { pet: matchedPet },
          key: 'DetailPhotoScreen',
        });
      }
    };

    return (
      <Pressable onPress={handlePress}>
        <Image source={{ uri: item.image }} style={styles.image} />
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
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
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
