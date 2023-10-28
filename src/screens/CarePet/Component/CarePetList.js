import {
  View,
  StyleSheet,
  Text,
  Image,
  Pressable,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { useState, useEffect } from 'react';
import { BLACK, WHITE } from '../../../colors';
import { YELLOW } from '../../../colors';
import ComponentAMD from '../../../components/ComponentAMD';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { MaterialIcons } from '@expo/vector-icons';
import { CarePetRoutes } from '../../../navigations/routes';
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from 'react-native-responsive-screen';

const CarePetList = ({
  navigation,
  petName,
  onAddPress,
  onSchedulePress,
  onPhotoPress,
  onRearerPress,
  // onDeletePress,
  onStatisticsPress,
  petId,
}) => {
  const window = useWindowDimensions();
  const [schedueltextColor, setScheduleTextColor] = useState(YELLOW.DARK);
  const [phototextColor, setPhotoTextColor] = useState(BLACK);
  const [rearertextColor, setRearerTextColor] = useState(BLACK);
  const [statisticstextColor, setStatisticstextColor] = useState(BLACK);
  const [petProfiles, setPetProfiles] = useState([]);
  const [responseData, setResponseData] = useState([]);
  const [myEmail, setMyEmail] = useState('');
  const [inviterEmail, setInviterEmail] = useState('');

  const handleSchedulePress = () => {
    setScheduleTextColor(YELLOW.DARK);
    setPhotoTextColor(BLACK);
    setRearerTextColor(BLACK);
    setStatisticstextColor(BLACK);
    onSchedulePress();
  };

  const handlePhotoPress = () => {
    setScheduleTextColor(BLACK);
    setPhotoTextColor(YELLOW.DARK);
    setRearerTextColor(BLACK);
    setStatisticstextColor(BLACK);
    onPhotoPress();
  };
  const handleRearerPress = () => {
    setScheduleTextColor(BLACK);
    setPhotoTextColor(BLACK);
    setStatisticstextColor(BLACK);
    setRearerTextColor(YELLOW.DARK);
    onRearerPress();
  };
  const handleStatisticsPress = () => {
    setScheduleTextColor(BLACK);
    setPhotoTextColor(BLACK);
    setRearerTextColor(BLACK);
    setStatisticstextColor(YELLOW.DARK);
    onStatisticsPress();
  };
  // update 버튼 누를 시 작동. 추후 수정 바람.
  const onUpdatePress = () => {};
  const onPetPress = () => {
    const route = [];
    route.push(petName);
    route.push(petId);

    navigation.navigate(CarePetRoutes.VIEW_PET, route);
  };

  const textStyle = StyleSheet.create({
    schdule: {
      color: schedueltextColor,
      fontSize: widthPercentageToDP('5%'),
    },
    photo: {
      color: phototextColor,
      fontSize: widthPercentageToDP('5%'),
    },
    rearer: {
      color: rearertextColor,
      fontSize: widthPercentageToDP('5%'),
    },
    statistics: {
      color: statisticstextColor,
      fontSize: widthPercentageToDP('5%'),
    },
  });
  const fetchData = async () => {
    try {
      const email = await AsyncStorage.getItem('email');
      const token = await AsyncStorage.getItem('token');
      const url = `http://ec2-43-200-8-47.ap-northeast-2.compute.amazonaws.com:8080/link/getAll/${email}`;

      setMyEmail(email);

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const userData = response.data;
      //console.log(userData)

      setPetProfiles(userData);
      userData.forEach(function (user) {
        //setInviterEmail(user.inviter)
        getImageUrl(user.inviter, user.id);
      });

      const myEmail = await AsyncStorage.getItem('email');
      const linkResponse = await axios.get(
        `http:43.200.8.47:8080/pet/get-pet/${myEmail}/${petId}`
      );
      const inviter = linkResponse.data.inviter;

      setInviterEmail(inviter);
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
              source={{
                uri:
                  `http://43.200.8.47:8080/pet/${inviterEmail}/downloadImage/${petId}.jpg` +
                  '?cache=' +
                  Math.random(),
              }}
              style={[
                styles.image,
                {
                  width: widthPercentageToDP('30%'),
                  height: heightPercentageToDP('15%'),
                },
              ]}
            />
            <View style={styles.editIconContainer}>
              <MaterialIcons name="edit" size={24} color="black" />
            </View>
          </TouchableOpacity>
          {/* 이름,케어 목록 */}
          <View style={styles.container_content}>
            <View style={{ flexDirection: 'row' }}>
              <View style={styles.container_name}>
                <Text
                  style={[
                    styles.name,
                    {
                      fontSize: widthPercentageToDP('7%'),
                    },
                  ]}
                >
                  {petName}
                </Text>
              </View>
            </View>
            {/* 케어 목록 */}
            <View style={styles.container_row}>
              <Pressable onPress={handleSchedulePress}>
                <Text style={textStyle.schdule}>일정</Text>
              </Pressable>
              <Text> | </Text>
              <Pressable onPress={handlePhotoPress}>
                <Text style={textStyle.photo}>사진첩</Text>
              </Pressable>
              <Text> | </Text>
              <Pressable onPress={handleRearerPress}>
                <Text style={textStyle.rearer}>양육자</Text>
              </Pressable>
              <Text> | </Text>
              <Pressable onPress={handleStatisticsPress}>
                <Text style={textStyle.statistics}>통계</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.componentAMD}>
        <ComponentAMD
          onAddPress={onAddPress}
          navigation={navigation}
          petName={petName}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: heightPercentageToDP('8%'),
  },
  container_row: {
    flexDirection: 'row',
  },
  container_main: {
    flexDirection: 'row',
    marginRight: widthPercentageToDP('9%'),
  },
  componentAMD: {
    width: widthPercentageToDP('90%'),
    marginBottom: heightPercentageToDP('-1.5%'),
  },
  container_content: {
    justifyContent: 'center',
    marginLeft: widthPercentageToDP('2%'),
  },
  container_name: {
    marginBottom: heightPercentageToDP('2%'),
  },
  name: {
    fontSize: 30,
    fontWeight: '600',
  },
  image: {
    borderRadius: 100,
    alignItems: 'center',
    marginRight: widthPercentageToDP('5%'),
  },
  editIconContainer: {
    position: 'absolute',
    bottom: heightPercentageToDP('1%'),
    right: widthPercentageToDP('1%'),
    borderWidth: 0.2,
    backgroundColor: WHITE,
    borderRadius: widthPercentageToDP('12%'),
    padding: widthPercentageToDP('2%'),
  },
});

export default CarePetList;
