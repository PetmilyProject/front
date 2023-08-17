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
import { useNavigation, useNavigationState } from '@react-navigation/native';

const MyPetPhotoScreen = ({ route }) => {
  const params = route.params.petInfo;
  const petId = params.pet.sharedPetId;
  const petOwner = params.pet.owner;

  const setImageFunc = async () => {
    const storedEmail = await AsyncStorage.getItem('email');
    const sharedUrl = `http://ec2-43-200-8-47.ap-northeast-2.compute.amazonaws.com:8080/shared-images/${storedEmail}/downloadImage/${petId}.jpg`;

    const [petImage, setPetImage] = useState(null);
    const [imageData, setImageData] = useState(null);

    const response = await axios.get(sharedUrl);
    setPetImage(response);
    console.log("response");

    if (response.ok) {
      const tmpImageData = await response.blob();
      const base64Data = await convertBlobToBase64(tmpImageData);
      setImageData(base64Data);
    } else {
      console.log(
        'Error fetching image data. Response status:',
        response.status
      );
    }
  }
  
  setImageFunc();
  
  return (<View></View>);
  
  return(
    (<View>
      <Image source={{ uri: imageData }} />
    </View>)
  )
}

export default MyPetPhotoScreen;