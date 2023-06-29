import { View, StyleSheet, Text } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { WHITE, YELLOW } from '../../colors';
import { color } from 'react-native-reanimated';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';

const ViewCalender = () => {
  const [responseData, setResponseData] = useState([]);
  // 서버에서 일정 데이터를 가져오는 비동기 함수
  useEffect(() => {
    AsyncStorage.getItem('schedule')
      .then((inviter) => {
        AsyncStorage.getItem('token')
          .then((token) => {
            axios
              .get(
                `http://ec2-43-200-8-47.ap-northeast-2.compute.amazonaws.com:8080/schedule/${inviter}/초코`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              )
              .then((response) => {
                // console.log(response.data[1].schedule);
                setResponseData(response.data);
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
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.scheduleItem}>
      <Text style={styles.details}>{item.schedule}</Text>
      <Text style={styles.time}>{item.hm}</Text>
    </TouchableOpacity>
  );

  const renderRecurringItems = () => {
    // 반복 일정 데이터를 만들고 FlatList로 렌더링합니다.
    const recurringData = [
      { id: 1, schedule: '반복 일정 1', hm: '10:00 AM' },
      { id: 2, schedule: '반복 일정 2', hm: '02:00 PM' },
      { id: 3, schedule: '반복 일정 3', hm: '06:00 PM' },
    ];
    return (
      <View>
        <Text
          style={{
            marginLeft: 10,
            marginTop: 20,
            fontSize: 18,
            color: YELLOW.DEFAULT,
            fontWeight: '700',
          }}
        >
          반복 일정
        </Text>
        <FlatList
          data={recurringData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          style={styles.container2}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Calendar style={styles.calendar} />
      <View>
        <Text
          style={{
            marginLeft: 10,
            marginTop: 20,
            fontSize: 18,
            color: YELLOW.DEFAULT,
            fontWeight: '700',
          }}
        >
          예정된 일정
        </Text>
        <FlatList
          data={responseData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          style={styles.container2}
        />
        {renderRecurringItems()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 20,
    backgroundColor: WHITE,
  },
  calendar: {
    borderBottomWidth: 1,
    borderBottomColor: WHITE,
  },
  container2: {
    marginTop: 30,
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
  details: {
    fontSize: 18,
  },
  time: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 120,
  },
});

export default ViewCalender;
