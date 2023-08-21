import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons, Entypo, Ionicons } from '@expo/vector-icons';
import { YELLOW } from '../colors';
import { CarePetRoutes } from '../navigations/routes';

//등록 수정 삭제 아이콘
const ComponentAMD = ({
  navigation,
  petName,
  onAddPress,
  onDeletePress,
  onUpdatePress,
}) => {
  const onPetPress = () => {
    navigation.navigate(CarePetRoutes.VIEW_PET, petName);
  };
  return (
    <>
      <View style={styles.container}>
        {/* 펫정보 버튼 */}
        {/* <TouchableOpacity onPress={onPetPress}>
          <Ionicons name="heart-circle" size={40} color={YELLOW.DEFAULT} />
        </TouchableOpacity> */}
        {/* 입력 버튼 */}
        <TouchableOpacity onPress={onAddPress}>
          <Entypo name="circle-with-plus" size={40} color={YELLOW.DEFAULT} />
        </TouchableOpacity>
        {/* 수정 버튼 */}
        <TouchableOpacity onPress={onUpdatePress}>
          <MaterialCommunityIcons
            name="pencil-circle"
            size={40}
            color={YELLOW.DEFAULT}
          />
        </TouchableOpacity>
        {/* 삭제 버튼 */}
        <TouchableOpacity onPress={onDeletePress}>
          <MaterialCommunityIcons
            name="delete-circle"
            size={40}
            color={YELLOW.DEFAULT}
          />
        </TouchableOpacity>
      </View>
    </>
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
