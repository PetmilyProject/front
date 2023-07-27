import { View, StyleSheet, Text, Image, Pressable } from 'react-native';
import { useState } from 'react';
import { BLACK } from '../../../colors';
import { YELLOW } from '../../../colors';
import ComponentAMD from '../../../components/ComponentAMD';

const CarePetList = ({
  petName,
  onAddPress,
  onSchedulePress,
  onPhotoPress,
  onRearerPress,
}) => {
  const [schedueltextColor, setScheduleTextColor] = useState(YELLOW.DARK);
  const [phototextColor, setPhotoTextColor] = useState(BLACK);
  const [rearertextColor, setRearerTextColor] = useState(BLACK);

  const handleSchedulePress = () => {
    setScheduleTextColor(YELLOW.DARK);
    setPhotoTextColor(BLACK);
    setRearerTextColor(BLACK);
    onSchedulePress();
  };

  const handlePhotoPress = () => {
    setScheduleTextColor(BLACK);
    setPhotoTextColor(YELLOW.DARK);
    setRearerTextColor(BLACK);
    onPhotoPress();
  };
  const handleRearerPress = () => {
    setScheduleTextColor(BLACK);
    setPhotoTextColor(BLACK);
    setRearerTextColor(YELLOW.DARK);
    onRearerPress();
  };
  const textStyle = StyleSheet.create({
    schdule: {
      color: schedueltextColor,
    },
  });

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
              <Pressable onPress={handleSchedulePress}>
                <Text style={textStyle.schdule}>일 정 </Text>
              </Pressable>
              <Text> | </Text>
              <Pressable onPress={handlePhotoPress}>
                <Text style={{ color: phototextColor }}> 사 진 첩 </Text>
              </Pressable>
              <Text> | </Text>
              <Pressable onPress={handleRearerPress}>
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
    marginTop: 60,
    marginLeft: 10,
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
