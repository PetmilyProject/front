import { View, StyleSheet, Text, Image, Pressable } from 'react-native';
import { WHITE } from '../../../colors';
import { useState } from 'react';
import { BLACK } from '../../../colors';
import { color } from 'react-native-reanimated';
import { YELLOW } from '../../../colors';
import ComponentAMD from '../../../components/ComponentAMD';
import { CarePetRoutes } from '../../../navigations/routes';

const CarePetList = ({ petName, onAddPress }) => {
  const [schdueltextColor, setSchduleTextColor] = useState(YELLOW.DARK);
  const [phototextColor, setPhotoTextColor] = useState(BLACK);
  const [rearertextColor, setRearerTextColor] = useState(BLACK);
  
  const onSchdulePress = () => {
    setSchduleTextColor(YELLOW.DARK);
    setPhotoTextColor(BLACK);
    setRearerTextColor(BLACK);
  };

  const onPhotoPress = () => {
    setSchduleTextColor(BLACK);
    setPhotoTextColor(YELLOW.DARK);
    setRearerTextColor(BLACK);
  };
  const onRearePress = () => {
    setSchduleTextColor(BLACK);
    setPhotoTextColor(BLACK);
    setRearerTextColor(YELLOW.DARK);
  };
  const textStyle = StyleSheet.create({
    schdule: {
      color: schdueltextColor,
    },
  });
  console.log(petName);
  return (
    <View style={styles.container}>
      <View style={{ paddingRight: 60 }}>
        <View style={styles.container_row}>
          <View style={{}}>
            <Image
              source={require('../../../assets/pet_icon.png')}
              style={styles.image}
            />
          </View>
          <View style={styles.container_content}>
            <View style={styles.container_name}>
              <Text style={styles.name}>{petName}</Text>
            </View>
            <View style={styles.container_row}>
              <Pressable onPress={onSchdulePress}>
                <Text style={textStyle.schdule}>일 정 </Text>
              </Pressable>
              <Text> | </Text>
              <Pressable onPress={onPhotoPress}>
                <Text style={{ color: phototextColor }}> 사 진 첩 </Text>
              </Pressable>
              <Text> | </Text>
              <Pressable onPress={onRearePress}>
                <Text style={{ color: rearertextColor }}> 양 육 자 </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.componentAMD}>
        <ComponentAMD onAddPress={onAddPress} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  container_row: {
    flexDirection: 'row',
  },
  componentAMD: {
    width: '100%',
    justifyContent: 'flex-end',
    marginRight: 30,
  },
  container_content: { padding: 10, marginTop: 15 },
  container_name: {
    marginBottom: 20,
  },
  name: {
    fontSize: 30,
  },
  image: {
    borderRadius: 100,
    alignItems: 'center',
    width: 110,
    height: 110,
    marginRight: 10,
  },
});

export default CarePetList;
