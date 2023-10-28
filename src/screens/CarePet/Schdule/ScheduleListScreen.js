import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  RefreshControl,
  useWindowDimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { GRAY, WHITE, YELLOW } from '../../../colors';
import { CarePetRoutes } from '../../../navigations/routes';
import { useNavigation } from '@react-navigation/native';

const ScheduleListScreen = ({ petName, petId }) => {
  const window = useWindowDimensions();
  const [responseData, setResponseData] = useState([]);
  const [selectedItemIndices, setSelectedItemIndices] = useState([]);
  const [currentDate, setCurrentDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [scheduleMap, setScheduleMap] = useState({});
  const [isRefreshing, setIsRefreshing] = useState(false);

  const navigation = useNavigation();

  // 스케줄 가져오기
  const fetchScheduleData = () => {
    setIsRefreshing(true);
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
              })
              .finally(() => {
                setIsRefreshing(false);
              });
          })
          .catch((error) => {
            console.error(error);
            setIsRefreshing(false);
          });
      })
      .catch((error) => {
        console.error(error);
        setIsRefreshing(false);
      });
  };

  fetchEtcData = async () => {
    const email = await AsyncStorage.getItem('email');
    const token = await AsyncStorage.getItem('token');
    const getAllUrl = `http://43.200.8.47:8080/executed/getAll`;
    const getAllResponse = await axios.get(getAllUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const getAllResponseData = getAllResponse.data;

    // scheduleMap 초기화
    const newScheduleMap = {};
    getAllResponseData.forEach((data) => {
      const key = `${data.date}-${data.scheduleId}`;
      if (!newScheduleMap[key]) {
        newScheduleMap[key] = [];
      }
      newScheduleMap[key].push(data.email);
    });

    // scheduleMap 업데이트
    setScheduleMap(newScheduleMap);
  };

  useEffect(() => {
    fetchScheduleData(); // 컴포넌트가 처음 렌더링될 때 데이터를 가져옵니다.
    fetchEtcData();
  }, [currentDate]);

  const onRefresh = () => {
    setSelectedItemIndices([]);
    setCurrentDate(new Date().toISOString().split('T')[0]);
    fetchScheduleData();
  };

  useEffect(() => {
    //console.log('scheduleMap updating...');
  }, [scheduleMap]);

  // 렌더링 되는 스케줄 아이템
  const renderItem = ({ item, index }) => {
    //console.log(item);
    //console.log(`2 ${currentDate}-${item.scheduleId} ` + scheduleMap[`${currentDate}-${item.scheduleId}`])
    const isSelected = selectedItemIndices.includes(index.id);
    const key = `${currentDate}-${item.scheduleId}`;
    const backgroundColor = scheduleMap[key]
      ? YELLOW.DEFAULT_LIGHT
      : GRAY.LIGHTER;
    const executorProfileURL = `http://43.200.8.47:8080/profile/get/${scheduleMap[key]}/${scheduleMap[key]}.jpg`;
    //console.log(executorProfileURL);

    return (
      <TouchableOpacity
        onPress={() => onSchedulePress(item.scheduleId)}
        style={[
          styles.scheduleItem,
          {
            opacity: isSelected ? 0.4 : 1,
            backgroundColor: backgroundColor,
            width: window.width * 0.9,
          },
        ]}
      >
        <TouchableOpacity onPress={() => handleCompleted(index)}>
          {scheduleMap[`${currentDate}-${item.scheduleId}`] ? (
            <Image
              source={{
                uri: executorProfileURL + '?cache=' + Math.random(),
              }}
              style={styles.executor_profile}
            />
          ) : (
            <View style={styles.execute}></View>
          )}
        </TouchableOpacity>

        <View style={styles.container_detail}>
          <Text style={[styles.details, { fontSize: 0.045 * window.width }]}>
            {item.schedule}
          </Text>
        </View>
        <View style={styles.container_time}>
          <Text style={[styles.time, { fontSize: 0.036 * window.width }]}>
            {item.hm}
          </Text>
        </View>
        <View style={styles.container_executor}>
          <Text style={[styles.executor, { fontSize: 0.03 * window.width }]}>
            {item.executor}
          </Text>
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
  const handleCompleted = async (index) => {
    //console.log(responseData[index]);

    const email = await AsyncStorage.getItem('email');
    const token = await AsyncStorage.getItem('token');
    const scheduleId = responseData[index].scheduleId;
    const data = responseData[index];
    const executeUrl = `http://43.200.8.47:8080/executed/${email}/${scheduleId}/${currentDate}`;
    const deleteExecutionUrl = `http://43.200.8.47:8080/executed/delete/${scheduleId}/${currentDate}`;
    const key = `${currentDate}-${data.scheduleId}`;

    if (!scheduleMap[key]) {
      const executeResponse = await axios.get(executeUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const executeResponseData = executeResponse.data;

      const newScheduleMap = { ...scheduleMap }; // 새로운 객체 생성
      newScheduleMap[key] = email; // 새로운 객체에 값을 할당

      setScheduleMap(newScheduleMap); // 상태 업데이트

      console.log(executeResponseData, 'added');
    } else {
      const deleteResponse = await axios.delete(deleteExecutionUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const deleteResponseData = deleteResponse.data;
      const newScheduleMap = { ...scheduleMap };
      delete newScheduleMap[key]; // 해당 키를 제거

      setScheduleMap(newScheduleMap);
      console.log(deleteResponseData, 'deleted');
    }

    //console.log(executeUrl);
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
          <Text style={styles.select_date}>◀</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.date}>{currentDate}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleRightArrowPress}>
          <Text style={styles.select_date}>▶</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={responseData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={styles.schedule_container}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
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
    marginHorizontal: 20,
  },
  select_date: {
    fontSize: 22,
  },
  schedule_container: {
    flex: 1,
    width: '90%',
    marginLeft: 5,
    marginRight: 5,
    marginTop: 40,
  },
  scheduleItem: {
    width: 320,
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
    fontSize: 15,
  },
  container_time: {
    flex: 1,
    width: '20%',
    alignItems: 'flex-end',
    marginRight: 5,
  },
  time: {
    fontSize: 12,
    fontWeight: '500',
    marginRight: 15,
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
