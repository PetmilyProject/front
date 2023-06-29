import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Navigation from '../../../navigations/Navigation';

const WithdrawalScreen = ({ navigation }) => {
  const handleWithdrawal = () => {
    // 여기서 실제로 계정을 삭제하는 로직을 수행할 수 있습니다.
    // ...
    // 계정 삭제 후, 이전 화면으로 돌아가기
    // navigation.goBack();
  };

  const handleCancel = () => {
    // 이전 화면으로 돌아가기
    // navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.message}>계정을 삭제하시겠습니까?</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleCancel}>
          <Text style={styles.buttonText}>취소</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleWithdrawal}>
          <Text style={styles.buttonText}>확인</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    fontSize: 20,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#FF0000',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default WithdrawalScreen;
