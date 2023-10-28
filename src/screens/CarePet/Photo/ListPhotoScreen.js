import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  Pressable,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { CarePetRoutes } from '../../../navigations/routes';

const ListPhotoScreen = ({ Navigation, petName, petId }) => {
  const [imageList, setImageList] = useState([]); // 이미지 목록을 저장할 상태 변수
  const [isLoading, setIsLoading] = useState(true); // 데이터 로딩 상태를 저장할 상태 변수
  const [isRefreshing, setIsRefreshing] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const storedEmail = await AsyncStorage.getItem('email');
    const imgUrl = `http://43.200.8.47:8080/shared-images/${petId}/getAllImages`;

    try {
      const imgUrlResponse = await axios.get(imgUrl);
      if (imgUrlResponse.status === 200) {
        const responseData = imgUrlResponse.data;
        setImageList(responseData);
      } else {
        console.error(
          '이미지 URL을 가져오지 못했습니다. 응답 상태:',
          imgUrlResponse.status
        );
      }
    } catch (error) {
      console.error('이미지 URL 가져오기 오류:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false); // Stop the refresh indicator
    }
  };

  const onRefresh = () => {
    setIsRefreshing(true); // Start the refresh indicator
    fetchData();
  };

  const handleLoadPost = async (scheduleNum) => {
    try {
      const myEmail = await AsyncStorage.getItem('email');
      const myToken = await AsyncStorage.getItem('token');
      const parts = item.split('/');
      const petNum = parts[parts.length - 2];
      const rawScheduleNum = parts[parts.length - 1];
      const scheduleNum = rawScheduleNum.replace(/\.[^/.]+$/, '');

      // const scheduleUrl = `http://43.200.8.47:8080/sharedPetGallery/${myEmail}/get/${petNum}`;
      // console.log(scheduleUrl);
      // const scheduleResponse = await axios.get(scheduleUrl, {
      //   headers: {
      //     Authorization: `Bearer ${myToken}`,
      //   },
      // });
      // const responseData = scheduleResponse.data;
      // console.log(responseData);

      const response = await axios.get(
        `http://ec2-43-200-8-47.ap-northeast-2.compute.amazonaws.com:8080/sharedPetGallery/${myEmail}/getByPhotoId/${scheduleNum}`,
        {
          headers: {
            Authorization: `Bearer ${myToken}`,
          },
        }
      );

      if (response.status === 200) {
        const postData = response.data;
        navigation.navigate(CarePetRoutes.DETAIL_PHOTO, {
          petInfo: {
            petId: petId,
            writer: postData.email,
            photoId: scheduleNum,
            title: postData.title,
            wrote: postData.wrote,
            likedBy: postData.likedBy,
            likes: postData.likes,
            date: postData.date,
            imageUrl: item,
          },
        });
      } else {
        console.error(
          '포스트 데이터 가져오기 실패. 응답 상태:',
          response.status
        );
      }
    } catch (error) {
      console.error('포스트 데이터 가져오기 중 오류 발생:', error);
    }
  };

  const renderItem = ({ item }) => {
    const handlePress = async () => {
      try {
        const myEmail = await AsyncStorage.getItem('email');
        const myToken = await AsyncStorage.getItem('token');
        const parts = item.split('/');
        const petNum = parts[parts.length - 2];
        const rawScheduleNum = parts[parts.length - 1];
        const scheduleNum = rawScheduleNum.replace(/\.[^/.]+$/, '');

        const response = await axios.get(
          `http://ec2-43-200-8-47.ap-northeast-2.compute.amazonaws.com:8080/sharedPetGallery/${myEmail}/getByPhotoId/${scheduleNum}`,
          {
            headers: {
              Authorization: `Bearer ${myToken}`,
            },
          }
        );

        if (response.status === 200) {
          const postData = response.data;
          navigation.navigate(CarePetRoutes.DETAIL_PHOTO, {
            petInfo: {
              petId: petId,
              writer: postData.email,
              photoId: scheduleNum,
              title: postData.title,
              wrote: postData.wrote,
              likedBy: postData.likedBy,
              likes: postData.likes,
              date: postData.date,
              imageUrl: item,
            },
          });
        } else {
          console.error(
            '포스트 데이터 가져오기 실패. 응답 상태:',
            response.status
          );
        }
      } catch (error) {
        console.error('포스트 데이터 가져오기 중 오류 발생:', error);
      }
    };

    return (
      <Pressable onPress={handlePress}>
        <Image source={{ uri: item }} style={styles.image} />
      </Pressable>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000000" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
      >
        <FlatList
          data={imageList}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          numColumns={3}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'flex-start',
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
