import { useState, useEffect } from 'react';
import { Pressable, Text } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const DatePicker = ({ selectedDate, onDateChange }) => {
  const [currentDate, setCurrentDate] = useState('');
  const [selectedDateObj, setSelectedDateObj] = useState(null); // New state variable for selected date in Date object format

  useEffect(() => {
    const today = new Date();
    const year = String(today.getFullYear());
    const month = String(today.getMonth() + 1);
    const date = String(today.getDate());
    const formattedDate = `${year}년 ${month}월 ${date}일`;

    // If selectedDate is not set (null or undefined), set it to the current date
    if (!selectedDate) {
      onDateChange(formattedDate);
    }

    setCurrentDate(formattedDate);
  }, [selectedDate, onDateChange]);

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
    const month = String(pickerDate.getMonth() + 1);
    const date = String(pickerDate.getDate());
    const formattedDate = `${year}년 ${month}월 ${date}일`;

    setCurrentDate(formattedDate);
    setSelectedDateObj(pickerDate); // Store the selected date as a Date object
    onDateChange(formattedDate);
  };

  return (
    <Pressable onPress={showDatePicker}>
      <Text>{selectedDate || currentDate}</Text>
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
