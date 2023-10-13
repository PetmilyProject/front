import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, Text } from 'react-native';
import CustomMultiPicker from 'react-native-multiple-select-list';
import { WHITE, YELLOW, GRAY } from '../colors';
import Button2 from './Button2';

const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];

const SelectionListAlert = ({
  visible,
  onClose,
  item,
  width,
  scrollViewHeight,
  marginTop,
  marginLeft,
  marginRight,
  margintBottom,
  selected,
  buttonText,
  onConfirmSelection,
  multiple,
}) => {
  const [selectedItems, setSelectedItems] = useState(selected);

  // 주기(요일) 선택 순서를 정렬하는 함수
  const sortSelectedItems = (selectedItems) => {
    return selectedItems.sort(
      (a, b) => daysOfWeek.indexOf(a) - daysOfWeek.indexOf(b)
    );
  };

  const handleConfirm = () => {
    const orderedSelectedItems = sortSelectedItems(selectedItems);
    onConfirmSelection(orderedSelectedItems);
    onClose();
  };

  useEffect(() => {
    setSelectedItems(selected);
  }, [selected]);

  return (
    <Modal
      style={styles.container}
      visible={visible}
      transparent={true}
      animationType={'fade'}
      onRequestClose={onClose}
      onBackdropPress={onClose}
    >
      <View
        style={[
          styles.modalContainer,
          {
            width: width,
            marginTop: marginTop,
            marginBottom: margintBottom,
            marginLeft: marginLeft,
            marginRight: marginRight,
          },
        ]}
      >
        <CustomMultiPicker
          options={item}
          search={false}
          multiple={multiple}
          returnValue={'label'}
          callback={(res) => setSelectedItems(res)}
          rowBackgroundColor={WHITE}
          rowHeight={43}
          rowRadius={5}
          iconColor={YELLOW.DEFAULT}
          iconSize={30}
          selectedIconName={'ios-checkmark-circle-outline'}
          unselectedIconName={'ios-radio-button-off-outline'}
          scrollViewHeight={scrollViewHeight}
          selected={selected}
        />
        <View style={{ marginTop: 20 }}>
          <Button2
            backgrouncolor={YELLOW.DEFAULT}
            text={buttonText}
            onPress={handleConfirm}
            color={WHITE}
            width={200}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    position: 'absolute',
    borderRadius: 10,
    padding: 10,
    backgroundColor: WHITE,
    borderWidth: 1,
    borderColor: GRAY.DEFAULT,
  },
});

export default SelectionListAlert;
