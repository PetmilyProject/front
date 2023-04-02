import { useState } from 'react';
import { Pressable, Text } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const DatePicker = () => {
  const today = new Date();
  var year = String(today.getFullYear());
  var month = String(today.getMonth());
  var date = String(today.getDate());
  var currnetdate = `${year}년 ${month}월 ${date}일`;
  const [DateVisible, setDateVisible] = useState(false);
  const [day, setDay] = useState(currnetdate);

  const showDatePicker = () => {
    setDateVisible(true);
  };
  const hideDatePicker = () => {
    setDateVisible(false);
  };
  const handleDatePicker = (pickerdate) => {
    setDateVisible(false);
    year = String(pickerdate.getFullYear());
    month = String(pickerdate.getMonth());
    date = String(pickerdate.getDate());
    setDay(`${year}년 ${month}월 ${date}일`);
  };

  return (
    <Pressable onPress={showDatePicker}>
      <Text>{day}</Text>
      <DateTimePickerModal
        isVisible={DateVisible}
        mode="date"
        onCancel={hideDatePicker}
        onConfirm={handleDatePicker}
      />
    </Pressable>
  );
};

export default DatePicker;
