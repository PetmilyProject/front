import {
  View,
  StyleSheet,
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import { BLACK, GRAY, WHITE, YELLOW } from '../colors';

import { useState } from 'react';

const MemoAlert = ({ visible, title }) => {
  return (
    <Modal
      style={styles.container}
      visible={visible}
      transparent={true}
      animationType={'fade'}
    >
      <View style={styles.container}>
        <View style={[styles.alert, { height: visible ? 'auto' : 0 }]}>
          <Text style={styles.title}>{title}</Text>
        </View>
      </View>
    </Modal>
  );
};

MemoAlert.propTypes = {
  visible: PropTypes.bool.isRequired,
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

  alert: {
    backgroundColor: YELLOW.DEFAULT_LIGHT,
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingBottom: 20,
    marginTop: -200,
    width: 300,
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
});

export default MemoAlert;
