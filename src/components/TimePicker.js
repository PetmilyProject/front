import { useState } from 'react';
import { Text, Pressable } from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker';

const TimePicker = () => {
  const today = new Date();
  var hours = String(today.getHours());
  var minute = String(today.getMinutes());
  var ampm;
  var controlAmPm = () => {
    if (hours >= 12) {
      ampm = '오후';
    } else ampm = '오전';
    return ampm;
  };
  var currentime = `${controlAmPm()} ${hours}시 ${minute}분`;
  const [TimeVisible, setTimeVisible] = useState(false);
  const [time, setTime] = useState(currentime);

  const showTimePicker = () => {
    setTimeVisible(true);
  };
  const hideTimePicker = () => {
    setTimeVisible(false);
  };
  const handleTimePicker = (pickertime) => {
    setTimeVisible(false);
    hours = String(pickertime.getHours());
    minute = String(pickertime.getMinutes());
    controlAmPm();
    setTime(`${ampm} ${hours}시 ${minute}분`);
  };

  return (
    <Pressable onPress={showTimePicker}>
      <Text>{time}</Text>
      <DateTimePicker
        isVisible={TimeVisible}
        mode="time"
        onCancel={hideTimePicker}
        onConfirm={handleTimePicker}
      />
    </Pressable>
  );
};

export default TimePicker;
