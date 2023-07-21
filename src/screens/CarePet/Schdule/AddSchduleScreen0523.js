import { useState } from 'react';
import { Button, Pressable, StyleSheet, TextInput } from 'react-native';
import { Text, View } from 'react-native';
import DatePicker from '../../components/DatePicker';
import TimePicker from '../../components/TimePicker';

const AddSchduleScreen = ({ navigation, route }) => {
  const [alarm, setAlarm] = useState(false);
  const [alarmStirng, setAlarmString] = useState('꺼짐');

  const handlelalarm = () => {
    {
      setAlarm(!alarm);
      alarm === false ? setAlarmString('켜짐') : setAlarmString('꺼짐');
      alarm === true ? setAlarmString('꺼짐') : setAlarmString('켜짐');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.container1}>
        {/* 일정 */}
        <View style={styles.box}>
          <Text style={styles.title}>일정</Text>
          <TextInput placeholder="일정추가"></TextInput>
        </View>
        {/* 날짜 */}
        <View style={styles.box}>
          <Text style={styles.title}>날짜</Text>
          <DatePicker />
        </View>
        {/* 시간 */}
        <View style={styles.box}>
          <Text style={styles.title}>시간</Text>
          <TimePicker />
        </View>
        {/* 반복 */}
        <View style={styles.box}>
          <Text style={styles.title}>반복</Text>
          <TextInput
            keyboardType="number-pad"
            placeholder="0"
            style={{ paddingRight: 10 }}
          ></TextInput>
          <Text>일에 한 번</Text>
        </View>
        {/* 알림 */}
        <View style={styles.box}>
          <Text style={styles.title}>알림</Text>
          <Pressable onPress={handlelalarm}>
            <Text>{alarmStirng}</Text>
          </Pressable>
        </View>
      </View>
      {/* 버튼 */}
      <View style={styles.container2}>
        <Button style={{ margin: 10 }} title="등록"></Button>
        <Button bustyle={[styles.button]} title="취소"></Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  container1: {
    padding: 20,
    flex: 1,
  },
  container2: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  box: {
    flexDirection: 'row',
    margin: 10,
    borderStyle: 'solid',
    borderRadius: 10,
    borderWidth: 1,
    width: '90%',
    padding: 10,
  },
  title: {
    marginRight: 30,
    fontSize: 18,
  },
  button: {
    margin: 100,
  },
});
export default AddSchduleScreen;
