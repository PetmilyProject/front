import { View, StyleSheet, Text } from 'react-native';
import CarePetList from '../Component/CarePetList';
import { GRAY } from '../../../colors';

const EmptySchduleScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        등록 된 일정이 없습니다{'\n'}일정을 추가하고 함께 공유해보세요
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewpetcarelistscreen: {
    flex: 1,
  },
  container2: {
    flex: 2,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 15,
    textAlign: 'center',
    color: GRAY.DARK,
  },
});

export default EmptySchduleScreen;
