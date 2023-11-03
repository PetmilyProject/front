import {
  Image,
  StyleSheet,
  View,
  Pressable,
  Text,
  ScrollView,
} from 'react-native';
import { AddPetRoutes, AuthRoutes } from '../../navigations/routes';
import { useState } from 'react';
// import ImagePickerComponent from '../../components/ImagePicker';
import * as ImagePicker from 'expo-image-picker';
import { GRAY, WHITE, YELLOW } from '../../colors';
import SquareButton, { ColorTypes } from '../../components/Button';
import InputText from '../../components/InputText';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import 'react-native-get-random-values';
import { nanoid } from 'nanoid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import ImagePickerComponent from '../../components/ImagePicker';

const PetRegisterScreen = ({ navigation, route }) => {
  const [imgUrl, setImgUrl] = useState(null);
  const [name, setName] = useState('멍멍이');
  const [gender, setGender] = useState('');
  const [species, setSpecies] = useState('');
  const [age, setAge] = useState('');
  const [character, setCharater] = useState('');
  const [email, setEmail] = useState('');

  const [list, setList] = useState([]);

  const onInsert = async () => {
    const tmpToken = await AsyncStorage.getItem('token');
    const myEmail = await AsyncStorage.getItem('email');

    try {
      setEmail(myEmail);
      const userResponse = await axios.get(
        `http://ec2-43-200-8-47.ap-northeast-2.compute.amazonaws.com:8080/users/${myEmail}`
      );
      const myId = userResponse.data.userId;
      const userInviter = userResponse.data.inviter;

      const newPet = {
        userId: myId,
        name: name,
        gender: gender,
        age: age,
        character: character,
      };

      const addPetUrl = `http://ec2-43-200-8-47.ap-northeast-2.compute.amazonaws.com:8080/pet/add/${myEmail}`;
      const addPetResponse = await axios
        .post(
          addPetUrl,
          {
            petName: name,
            petCode: name + ' ' + myEmail,
            detailInfo: character,
            petAge: age,
            inviter: userInviter,
            gender: gender,
          },
          {
            headers: {
              Authorization: `Bearer ${tmpToken}`,
            },
          }
        )
        .catch((error) => {
          console.error('펫 추가 실패:', error);
        });

      console.log('펫 추가 메시지 : ', addPetResponse.data);

      const petId = addPetResponse.data.id;

      uploadToServer(petId);

      // petlink 추가
      await axios.post(
        `http://43.200.8.47:8080/link/post/${myEmail}/${myEmail}/${addPetResponse.data.id}`,
        {
          headers: {
            Authorization: `Bearer ${tmpToken}`,
            'Content-Type': 'multipart/form-data',
          },
          //data: formData,
        }
      );

      setList((prev) => [newPet, ...prev]);
      navigation.navigate(AddPetRoutes.LIST, { list: list, newPet: newPet });
    } catch (error) {
      console.error('펫 추가 실패', error);
    }
  };

  const InsertUrl = (url) => {
    setImgUrl(url);
  };

  const [imageUrl, setImageUrl] = useState('');
  const [status, requestPermission] = ImagePicker.useMediaLibraryPermissions();

  const uploadImage = async () => {
    if (!status?.granted) {
      const permission = await requestPermission();
      if (!permission.granted) {
        return null;
      }
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (result.canceled) {
      setUpload(false);
      return null;
    } else {
      setImageUrl(result.assets[0].uri);
      InsertUrl(result.assets[0].uri);
      setUpload(true);
    }
  };

  const uploadToServer = async (petId) => {
    console.log('imgUrl ', imgUrl);
    // 서버에 요청 보내기
    const localUri = imgUrl;
    const filename = localUri.split('/').pop();
    const match = /\.(\w+)$/.exec(filename ?? '');
    const type = match ? `image/${match[1]}` : `image`;
    const formData = new FormData();
    const myEmail = await AsyncStorage.getItem('email');
    const tmpToken = await AsyncStorage.getItem('token');
    formData.append('file', { uri: localUri, name: filename, type });

    const postResponse = await axios.post(
      `http://ec2-43-200-8-47.ap-northeast-2.compute.amazonaws.com:8080/pet/${myEmail}/uploadImage/${petId}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${tmpToken}`,
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    console.log('post 결과', postResponse.data);
  };

  return (
    <View
      style={{
        backgroundColor: WHITE,
        flex: 1,
        padding: 10,
      }}
    >
      <ScrollView constentContainerStyle={styles.container}>
        <View style={styles.photoContainer}>
          <TouchableOpacity onPress={uploadImage}>
            <View style={{ alignItems: 'center' }}>
              <View style={styles.photoBox}>
                {imgUrl === null ? (
                  <View style={styles.photoBox}></View>
                ) : (
                  <Image source={{ uri: imgUrl }} style={styles.image} />
                )}
                <Pressable>
                  <View style={styles.editIconContainer}>
                    <MaterialIcons name="edit" size={24} color="black" />
                  </View>
                  <Image source={{ uri: imageUrl }} />
                </Pressable>
              </View>
            </View>
          </TouchableOpacity>
          <View style={styles.rowContainer}>
            <Ionicons name="md-pencil" size={20} color="black" />
            <TextInput
              style={styles.name}
              onChangeText={(text) => setName(text.trim())}
            >
              {name}
            </TextInput>
          </View>
        </View>
        <View style={{ alignItems: 'center' }}>
          <InputText
            title="나이"
            placeholder={'예) 8'}
            keyboardType={'numeric'}
            onChangeText={(text) => {
              setAge(text.trim());
            }}
          />
          <InputText
            title="성별"
            placeholder={'예) 암컷'}
            onChangeText={(text) => setGender(text.trim())}
          />

          <InputText
            title="특징"
            placeholder={'예) 산책을 좋아함'}
            onChangeText={(text) => setCharater(text.trim())}
          />

          <SquareButton
            colorType={ColorTypes.YELLOW}
            text="등록하기"
            onPress={onInsert}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  photoContainer: {
    flex: 1,
    width: '100%',
    marginTop: 30,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
    width: '100%',
    paddingHorizontal: 20,
  },
  photoBox: {
    backgroundColor: GRAY.LIGHT,
    borderRadius: 100,
    width: 150,
    height: 150,
  },
  name: {
    fontSize: 20,
    textAlign: 'center',
  },
  image: {
    borderRadius: 10,
    width: 150,
    height: 150,
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: YELLOW.DEFAULT_LIGHT,
    borderRadius: 50,
    padding: 5,
  },
});

export default PetRegisterScreen;
