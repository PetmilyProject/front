import { View, StyleSheet, Alert, ScrollView } from 'react-native';
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
import { GRAY, WHITE } from '../../colors';
import StatisticsScreen from './Statistics/StatisticsScreen';

const MainCarePetScreen = ({ navigation, route }) => {
  const petName = route.params[0];
  const petId = route.params[1];
  const [content, setContent] = useState('일정');
  const [schdule, setSchdule] = useState('');
  const [health, setHealth] = useState(null);
  const [photo, setPhoto] = useState(true);
  const [rearer, setRearer] = useState(null);
  const [selectedScheduleIds, setSelectedScheduleIds] = useState([]); // 선택한 일정의 ID를 저장하는 상태

  // console.log('zz : ', petId);

  const onSchedulePress = () => {
    setContent('일정');
  };
  const onPhotoPress = () => {
    setContent('사진첩');
  };

  const onRearerPress = () => {
    setContent('양육자');
  };
  const onStatisticsPress = () => {
    setContent('통계');
  };

  const onAddPress = () => {
    if (content === '일정') {
      navigation.navigate(CarePetRoutes.ADD_SCHDULE, { petName, petId });
    } else if (content === '사진첩') {
      navigation.navigate(CarePetRoutes.ADD_PHOTO, { petName, petId });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const email = await AsyncStorage.getItem('email');
        const url = `http://ec2-43-200-8-47.ap-northeast-2.compute.amazonaws.com:8080/schedule/${email}/get-all/${petId}`;
        // const url = `http://ec2-43-200-8-47.ap-northeast-2.compute.amazonaws.com:8080/link/get/${email}/${petId}`;

        const token = await AsyncStorage.getItem('token');

        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const responseData = response.data[0];

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
          <ScheduleListScreen petName={petName} petId={petId} />
        </View>
      );
    } else if (content === '사진첩') {
      return photo === null ? (
        <EmptyPhotoSceen />
      ) : (
        <ListPhotoScreen petName={petName} petId={petId} />
      );
    } else if (content === '양육자') {
      return <ListRearerScreen petName={petName} petId={petId} />;
    } else if (content === '통계') {
      return <StatisticsScreen petName={petName} petId={petId} />;
    } else {
      return null; // Return null or another default screen/component if needed
    }
  };

  return (
    <ScrollView style={{backgroundColor: 'white'}}>
      <View style={styles.container}>
        <CarePetList
          petName={petName}
          onAddPress={onAddPress}
          onSchedulePress={onSchedulePress}
          onPhotoPress={onPhotoPress}
          onRearerPress={onRearerPress}
          onStatisticsPress={onStatisticsPress}
          navigation={navigation}
          petId={petId}
        />
        <View style={styles.line}></View>
        <View style={styles.container2}>{renderScreen()}</View>
      </View>
    </ScrollView>
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
    flex: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MainCarePetScreen;
