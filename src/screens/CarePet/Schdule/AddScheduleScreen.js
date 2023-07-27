import React, { useState } from 'react';
import { Button, Pressable, StyleSheet, TextInput } from 'react-native';
import { Text, View } from 'react-native';
import axios from 'axios';
import DatePicker from '../../../components/DatePicker';
import TimePicker from '../../../components/TimePicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WHITE } from '../../../colors';

const AddScheduleScreen = ({ navigation, route }) => {
  // route.params -> 이 부분이 이전 데이터 가져오는 부분
  const petName = route.params;
  const [schedule, setSchedule] = useState('');
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');
  const [repeat, setRepeat] = useState(0);
  const [inviter, setInviter] = useState('');
  const [alarm, setAlarm] = useState(0);

  const handleTimeChange = (selectedTime) => {
    setTime(selectedTime); // 선택된 시간을 state 변수에 반영
  };

  const handleScheduleSubmit = () => {
    console.log(petName, schedule, date, time, repeat, alarm, 'end \n');

    AsyncStorage.getItem('email')
      .then((inviter) => {
        AsyncStorage.getItem('token')
          .then((token) => {
            axios
              .post(
                `http://ec2-43-200-8-47.ap-northeast-2.compute.amazonaws.com:8080/schedule/${inviter}/${petName}`,
                {
                  schedule: schedule,
                  date: date,
                  hm: time,
                  period: repeat,
                  notice: alarm,
                  isCompleted: 0,
                  //inviter: inviter,
                },
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              )
              .then((response) => {
                // Handle the successful response here
                console.log(response.data);
              })
              .catch((error) => {
                // Handle the error here
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

  return (
    <View style={styles.container}>
      {/* Schedule */}
      <View style={styles.box}>
        <Text style={styles.title}>일정</Text>
        <TextInput
          placeholder="ex) 밥먹기"
          value={schedule}
          onChangeText={setSchedule}
          style={styles.input}
        />
      </View>

      {/* Time */}
      <View style={styles.box}>
        <Text style={styles.title}>시간</Text>
        <View style={styles.inputBox}>
          {/* TimePicker 컴포넌트에 시간과 시간 변경 핸들러 함수를 전달 */}
          <TimePicker
            selectedTime={time}
            onTimeChange={handleTimeChange}
            style={styles.input}
          />
        </View>
      </View>

      {/* Date */}
      <View style={styles.box}>
        <Text style={styles.title}>일자</Text>
        <View style={styles.inputBox}>
          <DatePicker
            selectedDate={date}
            onDateChange={setDate}
            style={styles.input}
          />
        </View>
      </View>

      {/* Repeat */}
      <View style={styles.box}>
        <Text style={styles.title}>주기</Text>
        <TextInput
          placeholder="숫자를 입력하세요 (단위 : 일)"
          value={Number(repeat)}
          onChangeText={(event) => {
            const inputValue = event;
            const numericValue = Number(inputValue);
            const calculatedValue = numericValue;
            setRepeat(calculatedValue.toString());
          }}
          style={styles.input}
        />
      </View>

      {/* Inviter */}
      <View style={styles.box}>
        <Text style={styles.title}>수행자</Text>
        <TextInput
          placeholder="수행자"
          value={inviter}
          onChangeText={setInviter}
          style={styles.input}
        />
      </View>

      {/* Alarm */}
      <View style={styles.box}>
        <Text style={styles.title}>알림</Text>
        <View style={styles.inputBox}>
          <Pressable onPress={() => setAlarm((alarm + 1) % 2)}>
            <Text>{alarm ? '켜짐' : '꺼짐'}</Text>
          </Pressable>
        </View>
      </View>

      {/* Submit Button */}
      <Button title="등록하기" onPress={handleScheduleSubmit} />

      {/* Separator */}
      <View style={styles.separator} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: WHITE,
  },
  box: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 100,
    width: 300,
    height: 200,
    marginVertical: 10,
  },
  title: {
    marginRight: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
  },
  inputBox: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 5,
    padding: 5,
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    width: '100%',
    marginBottom: 20,
  },
});

export default AddScheduleScreen;
