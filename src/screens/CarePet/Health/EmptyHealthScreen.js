import { View, Text, StyleSheet, Image } from 'react-native';
import { GRAY } from '../../../colors';
import SquareButton, { ColorTypes } from '../../../components/Button';

const EmptyHealthScreen = ({ navigation, route }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        등록 된 건강 없습니다{'\n'}건강을 추가하고 함께 공유해보세요
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 15,
    textAlign: 'center',
    color: GRAY.DARK,
  },
});

export default EmptyHealthScreen;
