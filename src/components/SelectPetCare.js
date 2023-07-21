import { StyleSheet, Text, View } from 'react-native';
import { MAINCOLOR } from '../colors';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { AuthRoutes } from '../navigations/routes';

const SelectPetCare = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.rowContainer}>
        <View style={styles.circle}></View>
        <View style={styles.colContainer}>
          <Text style={styles.name}>이월이</Text>
          <View style={styles.rowContainer}>
            <TouchableOpacity
              onPress={() => navigation.navigate(AuthRoutes.MAIN_HEALTH)}
            >
              <Text>일 정</Text>
            </TouchableOpacity>
            <Text> | </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate(AuthRoutes.MAIN_HEALTH)}
            >
              <Text>건 강</Text>
            </TouchableOpacity>
            <Text> | </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate(AuthRoutes.INIT_PHOTO)}
            >
              <Text>사진첩</Text>
            </TouchableOpacity>
            <Text> | </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate(AuthRoutes.MAIN_REARER)}
            >
              <Text>양육자</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowContainer: {
    flexDirection: 'row',
  },
  colContainer: {
    flexDirection: 'column',
  },
  circle: {
    height: 100,
    width: 100,
    borderRadius: 100,
    backgroundColor: MAINCOLOR.BRIGHTGRAY,
    marginRight: 20,
  },
  name: {
    fontSize: 30,
    fontWeight: '500',
    marginBottom: 20,
  },
});

export default SelectPetCare;
