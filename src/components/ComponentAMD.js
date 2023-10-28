import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { YELLOW } from '../colors';
import { CarePetRoutes } from '../navigations/routes';

//등록 수정 삭제 아이콘
const ComponentAMD = ({ navigation, petName, onAddPress }) => {
  const onPetPress = () => {
    navigation.navigate(CarePetRoutes.VIEW_PET, petName);
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onAddPress}>
        <Entypo name="circle-with-plus" size={40} color={YELLOW.DEFAULT} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
});

export default ComponentAMD;
