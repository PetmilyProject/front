import React, { memo, useState } from 'react';
import {
  KeyboardAvoidingView,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { Text, View } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RED, WHITE, YELLOW } from '../../../colors';
import InputText_in from '../../../components/InputText_in';
import Button2 from '../../../components/Button2';
import SelectionListAlert from '../../../components/SelectionListAlert';
import { useEffect } from 'react';

const AddScheduleScreen = ({ navigation, route }) => {
  const { petName, petId } = route.params;
  useEffect(() => {
    // 현재 시간 받아와 time 기본값 설정
    const today = new Date();
    const hours = String(today.getHours()).padStart(2, '0');
    const minutes = String(today.getMinutes()).padStart(2, '0');
    setTime(`${hours}:${minutes}`);
  }, []);

  // 양육자 목록
  const [rearer, setRearer] = useState(null);
  // 입력란 useState
  const [schedule, setSchedule] = useState('');
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');
  const [period, setPeriod] = useState(0);
  const [executor, setExecutor] = useState([]);
  const [executorStr, setExecutorStr] = useState('');
  const [executorEmail, setExectorEmail] = useState('');
  const [memo, setMemo] = useState('');

  const [repeat, setRepeat] = useState(0);
  const [visible, setVisible] = useState(false);
  const [submit, setSubmit] = useState(false);
  const [selectedDays, setSelectedDays] = useState([]);
  // 수행자 모달 관리
  const [executorVisible, setExecutorVisible] = useState(false);
  // 랜더링된 owner 리스트
  const [executorList, setExecutorList] = useState({});
  const [executorEmailList, setExecutorEmailList] = useState([]);

  const fetchPetLink = async () => {
    try {
      // 해당 계정에 속한 모든 양육자 불러오기
      const AllRearerResponse = await axios.get(
        `http://ec2-43-200-8-47.ap-northeast-2.compute.amazonaws.com:8080/link/rearer/${petId}`
      );

      if (AllRearerResponse.status === 200) {
        setRearer(AllRearerResponse.data);
      } else {
        console.error('펫 링크를 가져오는 데 실패했습니다');
      }
    } catch (error) {
      console.error('펫 링크를 가져오는 중 오류 발생:', error);
    }
  };

  useEffect(() => {
    fetchPetLink();
  }, []);

  // 시간 변경 함수
  const handleTimeChange = (selectedTime) => {
    setTime(selectedTime);
  };

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

  // 주기(요일) 리스트 확인 버튼을 눌렀을 때 호출되는 함수
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

    setPeriod(cnt);
    setSelectedDays(selectedDays);
  };

  // 수행자 랜더링
  useEffect(() => {
    if (rearer) {
      const newExecutor = {};
      const newExecutorEmail = {};
      rearer.forEach((item) => {
        newExecutor[item.ownerName] = item.ownerName;
        newExecutorEmail[item.ownerName] = item.owner;
      });
      setExecutorList(newExecutor);
      setExecutorEmailList(newExecutorEmail);
    }
  }, [rearer]);

  // 수행자 리스트 확인 버튼을 눌렀을 때 호출되는 함수
  const handleExecutorSelection = (selectedItems) => {
    setExecutor(selectedItems);
    setExectorEmail(executorEmailList[selectedItems]);
    setExecutorStr(selectedItems.join(', '));
    setExecutorVisible(false);
  };

  // 등록하기 함수
  const handleScheduleSubmit = () => {
    setSubmit(true);

    if (schedule !== '') {
      console.log(petName, schedule, date, time, period, executor, 'end \n');

      AsyncStorage.getItem('email')
        .then((myEmail) => {
          AsyncStorage.getItem('token')
            .then((token) => {
              axios
                .post(
                  `http://ec2-43-200-8-47.ap-northeast-2.compute.amazonaws.com:8080/schedule/${myEmail}/add/${petId}`,
                  {
                    schedule: schedule,
                    date: date,
                    hm: time,
                    period: period,
                    executor: executorStr,
                    executorEmail: myEmail,
                    repeatSchedule: repeat,
                    memo: memo,
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
              console.error(error, 2);
            });
        })
        .catch((error) => {
          console.error(error, 3);
        });
    } else {
      return 1;
    }
    navigation.goBack();
  };

  useEffect(() => {
    if (repeat === 0) {
      setSelectedDays([]); // repeat가 0일 때 selectedDays를 초기화
    }
  }, [repeat]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView behavior={'padding'} style={styles.container}>
        <View>
          {submit === true && schedule === '' ? (
            <Text style={{ color: RED.DEFAULT }}>*일정명 필수입력</Text>
          ) : null}
          <InputText_in
            title={'일정'}
            titleSize={20}
            placeholder="ex) 밥먹기"
            value={schedule}
            onChangeText={setSchedule}
            type={'input'}
          />
          <InputText_in
            title={'시간'}
            titleSize={20}
            time={time}
            onChangeText={handleTimeChange}
            type={'time'}
          />
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
            onToggleAlarm={setRepeat}
          />
          <SelectionListAlert
            visible={visible}
            onClose={() => setVisible(false)}
            multiple={true}
            item={item}
            width={220}
            scrollViewHeight={170}
            marginTop={430}
            marginLeft={140}
            buttonText={'확인'}
            selected={selectedDays}
            onConfirmSelection={handleConfirmSelection}
          />
          <InputText_in
            title={'주기'}
            titleSize={20}
            type={'free'}
            onPress={() => {
              if (repeat === 1) {
                setVisible(true);
              }
            }}
            selectedDays={selectedDays}
          />
          <SelectionListAlert
            visible={executorVisible}
            onClose={() => setExecutorVisible(false)}
            multiple={false}
            item={executorList}
            width={220}
            scrollViewHeight={150}
            marginTop={500}
            marginLeft={140}
            buttonText={'확인'}
            selected={executor}
            onConfirmSelection={handleExecutorSelection}
          />
          <InputText_in
            title={'수행자'}
            titleSize={20}
            type={'free'}
            onPress={() => setExecutorVisible(true)}
            selectedDays={executor}
          />
          <InputText_in
            title={'메모'}
            titleSize={20}
            placeholder="메모"
            value={memo}
            onChangeText={setMemo}
            type={'input'}
          />
          <View style={{ marginTop: 50 }}>
            <Button2
              backgrouncolor={YELLOW.DEFAULT}
              color={WHITE}
              text={'등록하기'}
              onPress={handleScheduleSubmit}
              width={'100%'}
            />
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
});

export default AddScheduleScreen;
