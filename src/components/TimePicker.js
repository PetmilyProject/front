// import { useState } from 'react';
// import { Text, Pressable } from 'react-native';
// import DateTimePicker from 'react-native-modal-datetime-picker';

// const TimePicker = () => {
//   const today = new Date();
//   var hours = String(today.getHours());
//   var minute = String(today.getMinutes());
//   var ampm;
//   var controlAmPm = () => {
//     if (hours >= 12) {
//       ampm = '오후';
//     } else ampm = '오전';
//     return ampm;
//   };
//   var currentime = `${controlAmPm()} ${hours}시 ${minute}분`;
//   const [TimeVisible, setTimeVisible] = useState(false);
//   const [time, setTime] = useState(currentime);

//   const showTimePicker = () => {
//     setTimeVisible(true);
//   };
//   const hideTimePicker = () => {
//     setTimeVisible(false);
//   };
//   const handleTimePicker = (pickertime) => {
//     setTimeVisible(false);
//     hours = String(pickertime.getHours());
//     minute = String(pickertime.getMinutes());
//     controlAmPm();
//     setTime(`${ampm} ${hours}시 ${minute}분`);
//   };

//   return (
//     <Pressable onPress={showTimePicker}>
//       <Text>{time}</Text>
//       <DateTimePicker
//         isVisible={TimeVisible}
//         mode="time"
//         onCancel={hideTimePicker}
//         onConfirm={handleTimePicker}
//       />
//     </Pressable>
//   );
// };

// export default TimePicker;

import React, { useState, useEffect } from 'react';
import { Text, Pressable } from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker';

const TimePicker = ({ selectedTime, onTimeChange }) => {
  const [timeVisible, setTimeVisible] = useState(false);
  const [currentime, setCurrentTime] = useState('');

  useEffect(() => {
    // 현재 시각을 기본으로 설정
    const today = new Date();
    const hours = String(today.getHours()).padStart(2, '0');
    const minutes = String(today.getMinutes()).padStart(2, '0');
    setCurrentTime(`${hours}:${minutes}`);
  }, []);

  const showTimePicker = () => {
    setTimeVisible(true);
  };

  const hideTimePicker = () => {
    setTimeVisible(false);
  };

  const handleTimePicker = (pickedTime) => {
    hideTimePicker();

    // 시간을 hh:mm 형식으로 변환
    const hours = String(pickedTime.getHours()).padStart(2, '0');
    const minutes = String(pickedTime.getMinutes()).padStart(2, '0');
    const formattedTime = `${hours}:${minutes}`;

    // 선택된 시간을 부모 컴포넌트로 전달
    onTimeChange(formattedTime);
  };

  return (
    <Pressable onPress={showTimePicker}>
      <Text>{selectedTime || currentime}</Text>
      <DateTimePicker
        isVisible={timeVisible}
        mode="time"
        onCancel={hideTimePicker}
        onConfirm={handleTimePicker}
      />
    </Pressable>
  );
};

export default TimePicker;
