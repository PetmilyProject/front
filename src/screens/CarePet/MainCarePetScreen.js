import { View, StyleSheet, Text } from 'react-native';
import CarePetList from './Component/CarePetList';
import EmptySchduleScreen from './Schdule/EmptySchduleScreen';
import { useEffect, useState } from 'react';
import EmptyPhotoSceen from './Photo/EmptyPhotoScreen';
import EmptyRearerScreen from './Rearer/EmptyRearerScreen';
import ScheduleListScreen from './Schdule/ScheduleListScreen';
import ListPhotoScreen from './Photo/ListPhotoScreen';
import ListRearerScreen from './Rearer/ListRearerScreen';
import { CarePetRoutes } from '../../navigations/routes';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute } from '@react-navigation/native';
import { GRAY, WHITE } from '../../colors';

const MainCarePetScreen = ({ navigation, route }) => {
  const petName = route.params;
  const [content, setContent] = useState('일정');
  const [schdule, setSchdule] = useState('');
  const [health, setHealth] = useState(null);
  const [photo, setPhoto] = useState(true);
  const [rearer, setRearer] = useState(null);

  const onSchedulePress = () => {
    setContent('일정');
  };
  const onPhotoPress = () => {
    setContent('사진첩');
  };

  const onRearerPress = () => {
    setContent('양육자');
  };

  const onAddPress = () => {
    if (content === '일정') {
      //console.log("펫 : " + petName)
      navigation.navigate(CarePetRoutes.ADD_SCHDULE, petName);
    } else if (content === '사진첩') {
      navigation.navigate(CarePetRoutes.ADD_PHOTO);
    }
  };

  const onPress = () => {
    navigation.navigate(CarePetRoutes.VIEW_PHOTO);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const email = await AsyncStorage.getItem('email');
        const url = `http://ec2-43-200-8-47.ap-northeast-2.compute.amazonaws.com:8080/schedule/${email}/${petName}`;

        const response = await axios.get(url);
        const responseData = response.data;

        // Update the state based on the response data
        setSchdule(responseData.schedule);
        setHealth(responseData.health);
        setPhoto(responseData.photo);
        setRearer(responseData.rearer);
      } catch (error) {
        console.log('Error fetching pet data:', error);
      }
    };

    fetchData();
  }, [petName]);

  const renderScreen = () => {
    if (content === '일정') {
      return schdule === null ? (
        <EmptySchduleScreen />
      ) : (
        <View>
          <ScheduleListScreen petName={petName} />
        </View>
      );
    } else if (content === '사진첩') {
      return photo === null ? (
        <EmptyPhotoSceen />
      ) : (
        <ListPhotoScreen onPress={onPress} />
      );
    } else if (content === '양육자') {
      return rearer === null ? <EmptyRearerScreen /> : <ListRearerScreen />;
    } else {
      return null; // Return null or another default screen/component if needed
    }
  };

  return (
    <View style={styles.container}>
      <CarePetList
        petName={petName}
        onAddPress={onAddPress}
        onSchedulePress={onSchedulePress}
        onPhotoPress={onPhotoPress}
        onRearerPress={onRearerPress}
      />
      <View style={styles.line}></View>
      <View style={styles.container2}>{renderScreen()}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: WHITE,
  },
  line: {
    backgroundColor: GRAY.LIGHT,
    height: 1,
    width: '95%',
  },
  container2: {
    flex: 3,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MainCarePetScreen;
