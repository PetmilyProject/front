import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

import EmptyPetProfileScreen from './EmptyPetProfileScreen';
import PetProfileListScreen from './PetProfileListScreen';

const ShowPetProfileScreen = (petName) => {
  const [petProfiles, setPetProfiles] = useState([]);
  const navigation = useNavigation();
  useEffect(() => {
    const fetchPetProfiles = async () => {
      try {
          const myEmail = await AsyncStorage.getItem('email');
          const response = await fetch(
          `http://ec2-43-200-8-47.ap-northeast-2.compute.amazonaws.com:8080/pet/get-all/${myEmail}`
        );
        const data = await response.json();
        if (data.length === 0) {
          setPetProfiles([]);
        } else {
          setPetProfiles(data);
        }
      } catch (error) {
        console.log('Error fetching pet profiles:', error);
      }
    };

    fetchPetProfiles();
  }, []);

  if (petProfiles.length === 0) {
    return <EmptyPetProfileScreen />;
  } else {
    return (
      <PetProfileListScreen petProfiles={petProfiles} navigation={navigation} />
    );
  }
};

export default ShowPetProfileScreen;
