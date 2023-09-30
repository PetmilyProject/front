import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { GRAY, WHITE, YELLOW } from '../../../colors';
import { AntDesign } from '@expo/vector-icons';
import { CarePetRoutes } from '../../../navigations/routes';
import { useNavigation } from '@react-navigation/native';

const ScheduleListScreen = ({ petName, petId }) => {
  const [responseData, setResponseData] = useState([]);
  const [executeArray, setExecuteArray] = useState([]);
  const [executeColor, setExecuteColor] = useState(GRAY.LIGHTER);
  const [selectedItemIndices, setSelectedItemIndices] = useState([]);
  const [currentDate, setCurrentDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [currentDay, setCurrentDay] = useState(new Date().getDay());
  const [selectedScheduleIds, setSelectedScheduleIds] = useState([]);
  const [time, setTime] = useState('');

  const navigation = useNavigation();

  const onSchedulePress = (id) => {
    navigation.navigate(CarePetRoutes.VIEW_ScheduleModification, {
      petName: petName,
      id: id,
    });
  };

  useEffect(() => {
    AsyncStorage.getItem('email')
      .then((myEmail) => {
        AsyncStorage.getItem('token')
          .then((token) => {
            axios
              .get(
                `http://ec2-43-200-8-47.ap-northeast-2.compute.amazonaws.com:8080/schedule/${myEmail}/get-all/${petId}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              )
              .then((response) => {
                const newResponseData = [];

                for (let i = 0; i < response.data.length; i++) {
                  const zegopsu = Math.pow(
                    10,
                    6 - new Date(currentDate).getDay()
                  );

                  if (
                    Math.floor(parseInt(response.data[i].period) / zegopsu) %
                      10 ===
                    1
                  ) {
                    newResponseData.push(response.data[i]);
                  }
                }

                setResponseData(newResponseData);
                setExecuteArray(Array(response.data.length).fill(false));
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
  }, [currentDate]);

  const handleLongPress = (index) => {
    if (selectedItemIndices.includes(index)) {
      // If the item is already selected, remove it from the selection
      setSelectedItemIndices(selectedItemIndices.filter((i) => i !== index));
    } else {
      // If the item is not selected, add it to the selection
      setSelectedItemIndices([...selectedItemIndices, index]);
    }
  };
  const renderItem = ({ item, index }) => {
    const isSelected = selectedItemIndices.includes(index.id);
    const backgroundColor = executeArray[index]
      ? YELLOW.DEFAULT_LIGHT
      : GRAY.LIGHTER;

    return (
      <TouchableOpacity
        onPress={() => onSchedulePress(item.id)}
        onLongPress={() => handleLongPress(index)}
        delayLongPress={300}
        style={[
          styles.scheduleItem,
          {
            opacity: isSelected ? 0.4 : 1,
            backgroundColor: backgroundColor,
          },
        ]}
      >
        <TouchableOpacity onPress={() => toggleExecute(index)}>
          {isSelected ? (
            <AntDesign name="circledown" size={24} color="#34D399" />
          ) : executeArray[index] ? (
            <Image
              source={require('../../../assets/pet_icon.png')}
              style={styles.executor_profile}
            />
          ) : (
            <View style={styles.execute}></View>
          )}
        </TouchableOpacity>

        <View style={styles.container_detail}>
          <Text style={styles.details}>{item.schedule}</Text>
        </View>
        <View style={styles.container_time}>
          <Text style={styles.time}>{item.hm}</Text>
        </View>
        <View style={styles.container_executor}>
          <Text style={styles.executor}>수행자</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const toggleExecute = (index) => {
    const newExecuteArray = [...executeArray];
    newExecuteArray[index] = !newExecuteArray[index];
    setExecuteArray(newExecuteArray);
  };

  const handleLeftArrowPress = () => {
    const currentDateObj = new Date(currentDate);
    currentDateObj.setDate(currentDateObj.getDate() - 1);
    setCurrentDay(currentDateObj.getDay());
    setCurrentDate(currentDateObj.toISOString().split('T')[0]); // 다시 'YYYY-MM-DD' 형식으로 변환합니다.
  };

  const handleRightArrowPress = () => {
    const currentDateObj = new Date(currentDate);
    currentDateObj.setDate(currentDateObj.getDate() + 1);
    setCurrentDay(currentDateObj.getDay());
    setCurrentDate(currentDateObj.toISOString().split('T')[0]); // 다시 'YYYY-MM-DD' x형식으로 변환합니다.
  };

  return (
    <View style={styles.container}>
      <View style={styles.container_row}>
        <TouchableOpacity onPress={handleLeftArrowPress}>
          <Text style={styles.select_date}>◀ </Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.date}>{currentDate}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleRightArrowPress}>
          <Text style={styles.select_date}> ▶</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={responseData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        style={styles.schedule_container}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: WHITE,
  },
  container_row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  date: {
    fontSize: 20,
  },
  select_date: {
    fontSize: 22,
  },
  schdule_container: {
    flex: 1,
    width: '90%',
    marginLeft: 5,
    marginRight: 5,
    marginTop: 20,
  },
  scheduleItem: {
    width: 350,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    borderRadius: 30,
    backgroundColor: GRAY.LIGHTER,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  container_detail: {
    width: '40%',
    marginHorizontal: 10,
  },
  details: {
    fontSize: 20,
  },
  container_time: {
    flex: 1,
    width: '20%',
    alignItems: 'flex-end',
    marginRight: 5,
  },
  time: {
    fontSize: 20,
    fontWeight: 500,
  },
  container_executor: {
    flex: 1,
    width: '10%',
    alignItems: 'flex-start',
    margin: 5,
  },
  executor: {
    fontSize: 15,
  },
  executor_profile: {
    width: 30,
    height: 30,
    borderRadius: 25,
    overflow: 'hidden',
  },
  execute: {
    width: 30,
    height: 30,
    borderRadius: 25,
    backgroundColor: WHITE,
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ScheduleListScreen;
