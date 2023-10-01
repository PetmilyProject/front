import { View, StyleSheet, Modal, Pressable, Text, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { BLACK, GRAY, WHITE, YELLOW } from '../colors';

import { useState } from 'react';

const DangerAlert = ({
  visible,
  title,
  comment,
  leftText,
  rightText,
  onClose,
  onRight,
  leftBtnColor,
  rightBtnColor,
}) => {
  return (
    <Modal
      style={styles.container}
      visible={visible}
      transparent={true}
      animationType={'fade'}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <Pressable onPress={onClose} style={styles.background}></Pressable>
        <View style={[styles.alert, { height: visible ? 'auto' : 0 }]}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.comment}>{comment}</Text>
          <View style={styles.container_row}>
            <TouchableOpacity onPress={() => { onClose(); }}>
              <View
                style={[styles.button1, { backgroundColor: `${leftBtnColor}` }]}
              >
                <Text>{leftText}</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { onRight(); }}>
              <View
                style={[
                  styles.button2,
                  { backgroundColor: `${rightBtnColor}` },
                ]}
              >
                <Text>{rightText}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

DangerAlert.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container_row: {
    flexDirection: 'row',
  },
  title: {
    fontSize: 17,
    marginTop: 25,
    textAlign: 'center',
  },
  comment: {
    color: GRAY.DEFAULT,
    fontSize: 13,
    marginTop: 3,
    marginBottom: 18,
  },
  alert: {
    backgroundColor: WHITE,
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingBottom: 20,
    marginTop: -200,
    width: '70%',
    borderRadius: 20,
    overflow: 'hidden', // 자식 컨텐츠가 넘치는 경우를 처리하기 위해 오버플로우 제어
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: BLACK,
    opacity: 0.3,
  },
  button1: {
    width: 110,
    height: 30,
    paddingHorizontal: 3,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  button2: {
    width: 110,
    height: 30,
    paddingHorizontal: 3,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
  },
});

export default DangerAlert;
