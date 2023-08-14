import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { GRAY, YELLOW } from '../colors';
import DatePicker from './DatePicker';
import TimePicker from './TimePicker';
import ToggleSwitch from 'toggle-switch-react-native';
import { useState } from 'react';

const InputText_in = ({
  title,
  titleSize,
  placeholder,
  keyboardType,
  onChangeText,
  selectedDate,
  onDateChange,
  value,
  type,
  time,
  date,
  alarm,
  onToggleAlarm,
  onPress,
  selectedDays,
  selectedDaysForCycle,
  onCycleDayChange,
  selectedDaysForExecutor,
  onExecutorDayChange,
}) => {
  const [toggle, setToggle] = useState(false);

  const handleToggle = () => {
    setToggle(!toggle);
    onToggleAlarm(toggle ? 0 : 1);
  };

  // type이 'free'인 경우, 선택한 요일을 표시하는 함수
  const displaySelectedDays = () => {
    if (type === 'free') {
      return selectedDays.join(', '); // 선택한 요일을 콤마로 구분하여 문자열로 반환합니다.
    }
    return '';
  };

  return (
    <View style={styles.container}>
      <View style={styles.container_row}>
        <Text style={[styles.title, { fontSize: titleSize }]}>{title}</Text>
        {type === 'date' ? (
          <View style={{ marginLeft: 10 }}>
            <DatePicker selectedDate={date} onDateChange={onDateChange} />
          </View>
        ) : type === 'input' ? (
          <TextInput
            style={styles.input}
            placeholder={placeholder}
            keyboardType={keyboardType}
            onChangeText={onChangeText}
            value={value}
          />
        ) : type === 'time' ? (
          <View style={{ marginLeft: 10 }}>
            <TimePicker selectedTime={time} onTimeChange={onChangeText} />
          </View>
        ) : type === 'toggle' ? (
          <View style={{ marginLeft: 30 }}>
            <ToggleSwitch
              isOn={toggle}
              onColor={YELLOW.DEFAULT}
              offColor="gray"
              labelStyle={{ color: 'black' }}
              size="medium"
              onToggle={handleToggle}
            />
          </View>
        ) : type === 'free' ? (
          <Pressable onPress={onPress}>
            <View
              style={{
                marginLeft: 30,
                width: 250,
                height: 20,
              }}
            >
              <Text>{displaySelectedDays()}</Text>
            </View>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  container_row: {
    flexDirection: 'row',
    borderWidth: 1,
    width: 350,
    alignItems: 'center',
    borderRadius: 20,
    borderColor: GRAY.DEFAULT,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  container2: {
    alignItems: 'center',
  },
  title: {
    alignItems: 'flex-start',
  },
  input: {
    marginLeft: 10,
  },
});

export default InputText_in;
