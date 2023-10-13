import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  Pressable,
  ActivityIndicator,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation, useNavigationState } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BLACK, RED, GRAY } from '../../colors';

const CommunityModal = (params) => {
  const [isConfirmingDeletion, setIsConfirmingDeletion] = useState(false);

  const modalActive = params.modalActive;
  const onClose = params.onClose;
  //console.log(modalActive);

  const handleDeleteClick = () => {
    setIsConfirmingDeletion(true); // '삭제' 버튼 클릭 시 상태 업데이트
  };

  const handleCancelDelete = () => {
    setIsConfirmingDeletion(false); // '아니오' 클릭 시 상태 업데이트
  };

  const handleConfirmDelete = () => {
    onClose();
  };

  return (
    <Modal visible={modalActive} animationType="none" transparent={true}>
      <TouchableWithoutFeedback
        onPress={() => {
          onClose();
          handleCancelDelete();
        }}
      >
        <View style={styles.modalBackground}>
          <View style={styles.container}>
            <View style={styles.modal_view}>
              {isConfirmingDeletion ? (
                // '삭제' 버튼 클릭 시 보여질 내용
                <>
                  <View style={{ alignItems: 'center'}}>
                    <Text style={styles.re_ask}>
                      정말로 삭제하시겠습니까?
                    </Text>
                  </View>
                  <View style={styles.separator}></View>
                  <TouchableOpacity onPress={handleConfirmDelete}>
                    <Text style={styles.delete}>예</Text>
                  </TouchableOpacity>
                  <View style={styles.separator}></View>
                  <TouchableOpacity onPress={handleCancelDelete}>
                    <Text style={styles.update_and_cancel}>아니오</Text>
                  </TouchableOpacity>
                </>
              ) : (
                // 기본 모달 내용
                <>
                  <TouchableOpacity onPress={onClose}>
                    <Text style={styles.delete} onPress={handleDeleteClick}>
                      삭제
                    </Text>
                  </TouchableOpacity>
                  <View style={styles.separator}></View>
                  <TouchableOpacity onPress={onClose}>
                    <Text style={styles.update_and_cancel}>수정</Text>
                  </TouchableOpacity>
                  <View style={styles.separator}></View>
                  <TouchableOpacity onPress={onClose}>
                    <Text style={styles.update_and_cancel}>취소</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default CommunityModal;

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(2, 0, 0, 0.5)',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal_view: {
    width: '50%',
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'lightgray',
    alignItems: 'center',
  },
  re_ask: { 
    fontSize: 18, 
    textAlign: 'center',
    margin: 15
  },
  delete: {
    //width: 150,
    fontSize: 18,
    color: 'red',
    margin: 15,
  },
  update_and_cancel: {
    //width: 150,
    fontSize: 18,
    color: 'gray',
    margin: 15,
  },
  separator: {
    height: 2,
    backgroundColor: 'lightgray',
    width: '100%',
  },
});
