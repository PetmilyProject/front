import React from 'react';
import { View, StyleSheet, Modal } from 'react-native';
import CustomMultiPicker from 'react-native-multiple-select-list';
import { WHITE, YELLOW, GRAY } from '../colors';
import Button2 from './Button2';

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
}) => {
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
          multiple={true}
          returnValue={'label'}
          callback={(res) => {
            console.log(res);
          }}
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
            onPress={onClose}
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
