import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { Text, View } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WHITE, YELLOW } from '../../../colors';
import InputText_in from '../../../components/InputText_in';
import Button2 from '../../../components/Button2';
import { CarePetRoutes, ContentRoutes } from '../../../navigations/routes';
import SelectionListAlert from '../../../components/SelectionListAlert';
import ScheduleListScreen from './ScheduleListScreen';

const AddScheduleScreen = ({ navigation, route }) => {
  const petName = route.params;
  const [schedule, setSchedule] = useState('');
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');
  const [repeat, setRepeat] = useState(0);
  const [inviter, setInviter] = useState('');
  const [alarm, setAlarm] = useState(0);
  const [aaa, setaaa] = useState(0);
  const [visible, setVisible] = useState(false);
  const [executorVisible, setExecutorVisible] = useState(false);
  const [submit, setSubmit] = useState(false);
  const [selectedDays, setSelectedDays] = useState([]);
  const [selectedDaysForCycle, setSelectedDaysForCycle] = useState([]); // For 주기
  const [selectedDaysForExecutor, setSelectedDaysForExecutor] = useState([]); // For 양육자

  // 주기(요일) 리스트 아이템
  const item = {
    0: '일',
    1: '월',
    2: '화',
    3: '수',
    4: '목',
    5: '금',
    6: '토',
  };

  // 수행자 리스트 아이템
  const executor = {
    11: '홍길동',
    12: '김김김',
    13: '이이이',
    14: '박박박',
  };
  //SelectionList 활성화 여부 함수
  const handleSelection = () => {
    setVisible(true);
  };

  // 확인 버튼을 눌렀을 때 호출되는 함수
  const handleConfirmSelection = (selectedDays) => {
    console.log('선택한 요일:', selectedDays);
    let cnt = 0;

    for (let i = 0; i < selectedDays.length; i++) {
      if (selectedDays[i] === '일') {
        cnt += 1000000;
      } else if (selectedDays[i] === '월') {
        cnt += 100000;
      } else if (selectedDays[i] === '화') {
        cnt += 10000;
      } else if (selectedDays[i] === '수') {
        cnt += 1000;
      } else if (selectedDays[i] === '목') {
        cnt += 100;
      } else if (selectedDays[i] === '금') {
        cnt += 10;
      } else if (selectedDays[i] === '토') {
        cnt += 1;
      }
    }

    setRepeat(cnt);
    // console.log(cnt);
    setSelectedDays(selectedDays);
  };
  const handleExecutorSelection = () => {
    setExecutorVisible(true);
  };

  const handleTimeChange = (selectedTime) => {
    setTime(selectedTime);
  };

  const handleScheduleSubmit = () => {
    setSubmit(true);
    if (schedule != '') {
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
                  },
                  {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  }
                )
                .then((response) => {
                  console.log(response.data);
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
    } else {
      return 1;
    }
    navigation.goBack();
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView behavior={'padding'} style={styles.container}>
        <View>
          {/* 일정 입력 */}
          <InputText_in
            title={'일정'}
            titleSize={20}
            placeholder="ex) 밥먹기"
            value={schedule}
            onChangeText={setSchedule}
            type={'input'}
          />
          {/* 시간 입력 */}
          <InputText_in
            title={'시간'}
            titleSize={20}
            value={time}
            time={time}
            onChangeText={handleTimeChange}
            type={'time'}
          />

          {/* 일자 선택 */}
          <InputText_in
            title={'일자'}
            titleSize={20}
            selectedDate={date}
            onDateChange={setDate}
            type={'date'}
          />

          <InputText_in
            title={'반복'}
            titleSize={20}
            type={'toggle'}
            alarm={alarm}
            onToggleAlarm={setaaa}
          />
          {/* 주기(요일) 선택 리스트*/}
          <SelectionListAlert
            visible={visible}
            onClose={() => setVisible(false)}
            item={item}
            width={220}
            scrollViewHeight={170}
            marginTop={430}
            marginLeft={140}
            buttonText={'확인'}
            selected={selectedDays} // 선택한 요일을 전달합니다.
            onConfirmSelection={handleConfirmSelection} // 확인 버튼을 눌렀을 때 선택한 요일을 처리하는 함수를 전달합니다.
          />
          {/* 주기(요일) 입력 */}
          <InputText_in
            title={'주기'}
            titleSize={20}
            type={'free'}
            onPress={handleSelection}
            selectedDays={selectedDays} // 이 부분 추가
          />

          {/* 수행자 선택 리스트*/}
          <SelectionListAlert
            visible={executorVisible}
            onClose={() => setExecutorVisible(false)}
            item={executor}
            width={220}
            scrollViewHeight={150}
            marginTop={500}
            marginLeft={140}
            buttonText={'확인'}
            selected={'홍길동'}
          />
          {/* 수행자 입력 */}
          <InputText_in
            title={'수행자'}
            titleSize={20}
            type={'free'}
            onPress={handleExecutorSelection}
            selectedDays={selectedDaysForExecutor}
          />

          <InputText_in
            title={'알림'}
            titleSize={20}
            type={'toggle'}
            alarm={alarm}
            onToggleAlarm={setAlarm}
          />

          {/* 등록 버튼 */}
          <View style={{ marginTop: 50 }}>
            <Button2
              backgrouncolor={YELLOW.DEFAULT}
              color={WHITE}
              text={'등록하기'}
              onPress={handleScheduleSubmit}
              width={'100%'}
            />
          </View>
          {submit === true && schedule === '' ? (
            <Text>일정명을 등록해주세요</Text>
          ) : null}
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    backgroundColor: WHITE,
  },
  container2: {},
});

export default AddScheduleScreen;
