import {
  View,
  StyleSheet,
  Text,
  Image,
  Pressable,
<<<<<<< HEAD
  Alert,
=======
>>>>>>> 97b6685c4cff2a9dd161799f40dfec95fea62051
  TouchableOpacity,
} from 'react-native';
import { useState, useEffect } from 'react';
import { BLACK, GRAY } from '../../../colors';
import { YELLOW } from '../../../colors';
import ComponentAMD from '../../../components/ComponentAMD';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import { CarePetRoutes } from '../../../navigations/routes';

const CarePetList = ({
  navigation,
  petName,
  onAddPress,
  onSchedulePress,
  onPhotoPress,
  onRearerPress,
  onDeletePress,
}) => {
  const [schedueltextColor, setScheduleTextColor] = useState(YELLOW.DARK);
  const [phototextColor, setPhotoTextColor] = useState(BLACK);
  const [rearertextColor, setRearerTextColor] = useState(BLACK);
  const [petProfiles, setPetProfiles] = useState([]);
  const [responseData, setResponseData] = useState([]);
  var petProfiles2 = [];
  var petData;

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
  // update 버튼 누를 시 작동. 추후 수정 바람.
  const onUpdatePress = () => {};
  const onPetPress = () => {
    navigation.navigate(CarePetRoutes.VIEW_PET, petName);
  };

  const textStyle = StyleSheet.create({
    schdule: {
      color: schedueltextColor,
    },
  });

  const fetchData = async () => {
    try {
      const email = await AsyncStorage.getItem('email');
      const url = `http://ec2-43-200-8-47.ap-northeast-2.compute.amazonaws.com:8080/users/${email}`;

      const response = await axios.get(url);
      const userData = response.data;

      petData = userData.pets;
      //inviter = userData.inviter;
      setPetProfiles(petData);
      petData.forEach(function (pet) {
        petProfiles2.push(pet);
        getImageUrl(pet.inviter, pet.id);
      });
    } catch (error) {
      console.log('Error fetching pet data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getImageUrl = async (inviter, id) => {
    try {
      const email = await AsyncStorage.getItem('email');
      const url = `http://ec2-43-200-8-47.ap-northeast-2.compute.amazonaws.com:8080/pet/${inviter}/downloadImage/${id}.jpg`;
      // console.log(url);
      setPetProfiles((prevProfiles) =>
        prevProfiles.map((profile) => {
          if (profile.id === id) {
            return { ...profile, imgurl: url };
          }
          return profile;
        })
      );
    } catch (error) {
      console.log('Error fetching pet image:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
        <View style={styles.container_main}>
          {/* 이미지 */}
          <TouchableOpacity onPress={onPetPress}>
            <Image
              source={require('../../../assets/pet_icon.png')}
              style={styles.image}
            />
          </TouchableOpacity>
          {/* 이름,케어 목록 */}
          <View style={styles.container_content}>
<<<<<<< HEAD
            {/* 펫 이름 */}
            <View style={styles.container_name}>
              <Text style={styles.name}>{petName}</Text>
=======
            <View style={{ flexDirection: 'row' }}>
              <View style={styles.container_name}>
                <Text style={styles.name}>{petName}</Text>
              </View>
              <TouchableOpacity onPress={onPetPress}>
                <Ionicons
                  name="heart-circle"
                  style={{ paddingLeft: 30 }}
                  size={40}
                  color={YELLOW.DEFAULT}
                />
              </TouchableOpacity>
>>>>>>> 97b6685c4cff2a9dd161799f40dfec95fea62051
            </View>
            {/* 케어 목록 */}
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

        <View style={styles.componentAMD}>
          <ComponentAMD
            onAddPress={onAddPress}
            onDeletePress={onDeletePress}
            navigation={navigation}
            petName={petName}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 70,
  },
  container_row: {
    flexDirection: 'row',
  },
  container_main: {
    flexDirection: 'row',
    marginRight: 50,
  },
  componentAMD: { marginTop: -30 },
  container_content: { justifyContent: 'center', marginLeft: 10 },
  container_name: {
    marginBottom: 10,
  },
  name: {
    fontSize: 30,
    fontWeight: 600,
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
