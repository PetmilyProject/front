import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from 'react-native';
import { Text, View } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WHITE, YELLOW } from '../../../colors';
import InputText_in from '../../../components/InputText_in';
import Button2 from '../../../components/Button2';
import SelectionListAlert from '../../../components/SelectionListAlert';
import ScheduleListScreen from './ScheduleListScreen';

const ScheduleModificationScreen = ({ route }) => {
  const params = route.params;
  const scheduleId = route.params.id;
  const [schedule, setSchedule] = useState('');
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');
  const [repeat, setRepeat] = useState(0);
  const [alarm, setAlarm] = useState(0);
  const [aaa, setaaa] = useState(0);
  const [visible, setVisible] = useState(false);
  const [submit, setSubmit] = useState(false);
  const [selectedDays, setSelectedDays] = useState([]);
  const [selectedDaysForCycle, setSelectedDaysForCycle] = useState([]);
  const [selectedDaysForExecutor, setSelectedDaysForExecutor] = useState([]);
  const [email, setEmail] = useState('');
  const [inviter, setInviter] = useState('');
  const [petname, setPetname] = useState('');
  const [executorVisible, setExecutorVisible] = useState(false);
  const [selectedExecutor, setSelectedExecutor] = useState([]);

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
    11: '나',
    12: '아빠',
    13: '엄마',
    14: '형',
  };
  //SelectionList 활성화 여부 함수
  const handleSelection = () => {
    setVisible(true);
  };

  //SelectionList 활성화 여부 함수
  const handleExecutorSelection = (selectedItems) => {
    setSelectedExecutor(selectedItems);
    setExecutorVisible(false);
  };

  // 확인 버튼을 눌렀을 때 호출되는 함수
  const handleConfirmSelection = (selectedDays) => {
    // console.log('선택한 요일:', selectedDays);
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

  const handleTimeChange = (selectedTime) => {
    setTime(selectedTime);
  };

  // 일정 정보 호출
  useEffect(() => {
    AsyncStorage.getItem('email').then((myEmail) => {
      AsyncStorage.getItem('token').then((token) => {
        axios
          .get(
            `http://ec2-43-200-8-47.ap-northeast-2.compute.amazonaws.com:8080/schedule/${myEmail}/${params.petName}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then((response) => {
            const responseData = response.data;
            // console.log(response.data);
            setPetname(responseData.petname);
          })
          .catch((error) => {
            // console.log('펫이름 : ', params.petName);
            console.error(error);
          });
      });
    });
  });

  // 일정 수정
  const Modification = () => {
    AsyncStorage.getItem('email')
      .then((myEmail) => {
        AsyncStorage.getItem('token')
          .then((token) => {
            axios
              .put(
                `http://ec2-43-200-8-47.ap-northeast-2.compute.amazonaws.com:8080/schedule/${myEmail}/${params.petName}/${scheduleId}`,
                {
                  schedule: schedule,
                  date: date,
                  hm: time,
                  period: repeat,
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
  };

  // 일정 삭제
  const performScheduleDelete = () => {
    AsyncStorage.getItem('email')
      .then((myEmail) => {
        AsyncStorage.getItem('token')
          .then((token) => {
            axios
              .delete(
                `http://ec2-43-200-8-47.ap-northeast-2.compute.amazonaws.com:8080/schedule/${myEmail}/${params.petName}/${scheduleId}`,
                {
                  id: scheduleId,
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
    // navigation.navigate('scheduleListScreen');
  };

  // 일정 삭제 알람
  const scheduleDelete = () => {
    Alert.alert(
      '삭제 확인',
      '일정을 삭제하시겠습니까?',
      [
        {
          text: '취소',
          style: 'cancel',
        },
        {
          text: '삭제',
          onPress: performScheduleDelete,
          style: 'destructive',
        },
      ],
      { cancelable: false }
    );
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
            selected={selectedExecutor}
            onConfirmSelection={handleExecutorSelection}
          />
          {/* 수행자 입력 */}
          <InputText_in
            title={'수행자'}
            titleSize={20}
            type={'free'}
            onPress={() => setExecutorVisible(true)}
            selectedDays={selectedExecutor}
          />

          <InputText_in
            title={'알림'}
            titleSize={20}
            type={'toggle'}
            alarm={alarm}
            onToggleAlarm={setAlarm}
          />

          {/* 수정 및 삭제 버튼 */}
          <View style={styles.buttonContainer}>
            <View style={styles.buttonWrapper}>
              <Button2
                backgrouncolor={YELLOW.DEFAULT}
                color={WHITE}
                text={'확인'}
                onPress={Modification}
                width={'100%'}
              />
            </View>
            <View style={styles.buttonWrapper}>
              <Button2
                backgrouncolor={'red'}
                color={WHITE}
                text={'삭제'}
                onPress={scheduleDelete}
                width={'100%'}
              />
            </View>
          </View>
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 50,
    paddingHorizontal: 20,
  },
  buttonWrapper: {
    flex: 1,
    marginRight: 10,
  },
});

export default ScheduleModificationScreen;
