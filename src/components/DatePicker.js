import { useState, useEffect } from 'react';
import { Pressable, Text } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const DatePicker = () => {
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const today = new Date();
    const year = String(today.getFullYear());
    const month = String(today.getMonth() + 1); // 월은 0부터 시작하므로 1을 더해줍니다.
    const date = String(today.getDate());
    const currentDate = `${year}년 ${month}월 ${date}일`;
    setCurrentDate(currentDate);
  }, []);

  const [dateVisible, setDateVisible] = useState(false);

  const showDatePicker = () => {
    setDateVisible(true);
  };

  const hideDatePicker = () => {
    setDateVisible(false);
  };

  const handleDatePicker = (pickerDate) => {
    setDateVisible(false);
    const year = String(pickerDate.getFullYear());
    const month = String(pickerDate.getMonth() + 1); // 월은 0부터 시작하므로 1을 더해줍니다.
    const date = String(pickerDate.getDate());
    const selectedDate = `${year}년 ${month}월 ${date}일`;
    setCurrentDate(selectedDate);
  };

  return (
    <Pressable onPress={showDatePicker}>
      <Text>{currentDate}</Text>
      <DateTimePickerModal
        isVisible={dateVisible}
        mode="date"
        onCancel={hideDatePicker}
        onConfirm={handleDatePicker}
      />
    </Pressable>
  );
};

export default DatePicker;
