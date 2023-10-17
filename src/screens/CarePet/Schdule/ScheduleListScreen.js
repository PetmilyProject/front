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
import { useFocusEffect } from '@react-navigation/native';

const ScheduleListScreen = ({ petName, petId }) => {
  const [responseData, setResponseData] = useState([]);
  const [selectedItemIndices, setSelectedItemIndices] = useState([]);
  const [currentDate, setCurrentDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  const navigation = useNavigation();

  // 스케줄 가져오기
  const fetchScheduleData = () => {
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
  };

  useEffect(() => {
    fetchScheduleData(); // 컴포넌트가 처음 렌더링될 때 데이터를 가져옵니다.
  }, [currentDate]);

  // 렌더링 되는 스케줄 아이템
  const renderItem = ({ item, index }) => {
    const isSelected = selectedItemIndices.includes(index.id);
    const backgroundColor = item.isCompleted
      ? YELLOW.DEFAULT_LIGHT
      : GRAY.LIGHTER;

    const executorProfileURL = `http://ec2-43-200-8-47.ap-northeast-2.compute.amazonaws.com:8080/profile/get/${item.complete}/${item.complete}.jpg`;

    return (
      <TouchableOpacity
        onPress={() => onSchedulePress(item.id)}
        style={[
          styles.scheduleItem,
          {
            opacity: isSelected ? 0.4 : 1,
            backgroundColor: backgroundColor,
          },
        ]}
      >
        <TouchableOpacity onPress={() => handleCompleted(index)}>
          {item.isCompleted ? (
            <Image
              source={{
                uri: executorProfileURL,
              }}
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
          <Text style={styles.executor}>{item.executor}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  // 일정 선택 함수
  const onSchedulePress = (id) => {
    navigation.navigate(CarePetRoutes.VIEW_ScheduleModification, {
      petId: petId,
      id: id,
    });
  };

  // 일정 수행 함수
  const handleCompleted = (index) => {
    AsyncStorage.getItem('email')
      .then((myEmail) => {
        if (myEmail) {
          const updatedSchedule = responseData[index];
          updatedSchedule.isCompleted =
            updatedSchedule.isCompleted === 0 ? 1 : 0;
          const completeUser =
            updatedSchedule.isCompleted === 1 ? myEmail : null;

          AsyncStorage.getItem('token')
            .then((token) => {
              axios
                .put(
                  `http://ec2-43-200-8-47.ap-northeast-2.compute.amazonaws.com:8080/schedule/${myEmail}/complete/${petId}/${updatedSchedule.id}`,
                  {
                    complete: completeUser,
                    isCompleted: updatedSchedule.isCompleted,
                  },
                  {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  }
                )
                .then((response) => {
                  console.log('Schedule updated successfully');

                  // responseData를 업데이트하지 않고 대신 화면을 다시 렌더링
                  // 데이터를 변경하면 컴포넌트가 다시 렌더링되므로 변경된 데이터를 화면에 반영
                  // 다시 렌더링하려면 화면 상태를 다시 가져와야함
                  fetchScheduleData(); // fetchScheduleData는 데이터를 다시 가져오는 함수
                })
                .catch((error) => {
                  console.error(error);
                });
            })
            .catch((error) => {
              console.error(error);
            });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  // 날짜 선택 화살표 함수
  const handleLeftArrowPress = () => {
    const currentDateObj = new Date(currentDate);
    currentDateObj.setDate(currentDateObj.getDate() - 1);
    setCurrentDate(currentDateObj.toISOString().split('T')[0]);
  };

  const handleRightArrowPress = () => {
    const currentDateObj = new Date(currentDate);
    currentDateObj.setDate(currentDateObj.getDate() + 1);
    setCurrentDate(currentDateObj.toISOString().split('T')[0]);
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
        keyExtractor={(item) => item.id}
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
  schedule_container: {
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
    fontWeight: '500',
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
});

export default ScheduleListScreen;
