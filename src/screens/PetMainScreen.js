import React, { useState, useEffect } from 'react';
import {
  Button,
  Image,
  View,
  Platform,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import ScheduleList from './ScheduleList';
import { Icon } from 'react-native-elements/dist/icons/Icon';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AntDesign } from '@expo/vector-icons';

import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import DatePicker from '../components/DatePicker';

function PetMainScreen({ navigation, route }) {
  const [image, setImage] = useState(null);

  // 펫 정보를 나타낼 상태 변수
  const [petInfo, setPetInfo] = useState(null);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const handlePrevDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() - 1);
    setSelectedDate(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + 1);
    setSelectedDate(newDate);
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users/1')
      .then((response) => response.json())
      .then((data) => {
        setPetInfo({
          name: '퍼피',
          age: 3,
        });
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <View style={styles.imageContainer}>
          <Button title="사진을 선택하세요." onPress={pickImage} />
          {image ? (
            <Image
              source={{ uri: image }}
              style={{ width: 200, height: 200 }}
            />
          ) : (
            <Image
              source={require('../assets/defaultimage.png')}
              style={{ width: 200, height: 200 }}
            />
          )}
        </View>
        {petInfo && (
          <View style={styles.infoContainer}>
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
              {petInfo.name}
              {'\n'}
            </Text>
            <Text>{petInfo.age} 살</Text>
          </View>
        )}
      </View>
      <View style={styles.calendarcontainer}>
        <TouchableOpacity onPress={handlePrevDay} style={styles.arrowButton}>
          <AntDesign name="left" size={24} color="black" />
        </TouchableOpacity>
        {
          <DatePicker
            style={styles.datepicker}
            date={selectedDate}
            mode="date"
            placeholder="날짜 선택"
            format="YYYY-MM-DD"
            minDate="2021-01-01"
            maxDate="2030-12-31"
            onDateChange={setSelectedDate}
            iconComponent={<View />} // 아이콘 제거
          />
        }

        <TouchableOpacity onPress={handleNextDay} style={styles.arrowButton}>
          <AntDesign name="right" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <View style={styles.bottomContainer}>
        <ScheduleList />
      </View>

      {/* TouchableOpacity */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => {
          // 버튼 클릭시 동작할 내용 추가
          navigation.navigate('AddPetSchedule');
        }}
      >
        <Icon name="add" color="#ffffff" size={30} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  topContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  imageContainer: {
    alignItems: 'flex-start',
  },
  infoContainer: {
    alignItems: 'flex-end',
  },
  bottomContainer: {
    marginTop: 15,
    marginLeft: 15,
  },
  floatingButton: {
    position: 'absolute',
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    bottom: 20,
    backgroundColor: '#FF4500',
    borderRadius: 30,
    elevation: 8,
  },
  calendarcontainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 15,
    marginTop: 30,
  },
  label: {
    fontSize: 5,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  datepicker: {
    width: 200,
  },
  selectedDate: {
    marginTop: 20,
  },
  arrowButton: {
    paddingHorizontal: 30,
  },

  scheduleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  time: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  details: {
    fontSize: 18,
  },
  assignee: {
    fontSize: 16,
    color: '#777',
  },
});

export default PetMainScreen;
