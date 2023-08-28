import { Text, View, StyleSheet, Image, Keyboard } from 'react-native';
import ImagePickerComponent from '../../../components/ImagePicker';

import { GRAY, WHITE, YELLOW } from '../../../colors';
import { useState } from 'react';
import SquareButton, { ColorTypes } from '../../../components/Button';
import {
  TextInput,
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler';
import { ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';

const AddphotoScreen = ({ navigation, route }) => {
  const [imgUrl, setImgUrl] = useState(null);
  const [userName, setUserName] = useState('');
  const [contents, setContents] = useState('');
  const [title, setTitle] = useState('');
  //등록일
  const [date, setDate] = useState('');
  // 난수생성
  const generateSharedPetId = () => {
    const randomId = Math.floor(Math.random() * 100000); // 랜덤한 숫자 생성
    return randomId;
  };
  const [sharedPetId, setSharedPetId] = useState(generateSharedPetId());

  useEffect(() => {
    // AsyncStorage에서 userName 가져오기
    AsyncStorage.getItem('userName')
      .then((storedUserName) => {
        if (storedUserName) {
          setUserName(storedUserName);
        }
      })
      .catch((error) => {
        console.log('Error fetching userName:', error);
      });
  }, []);

  // 이미지 업로드
  const handleImageUpload = async () => {
    if (!imgUrl) {
      console.log('이미지 없음');
      return;
    }
    const email = await AsyncStorage.getItem('email');
    const apiUrl = `http://ec2-43-200-8-47.ap-northeast-2.compute.amazonaws.com:8080`; // 백엔드 API와 일치하도록 이 URL을 업데이트하세요

    const formData = new FormData();
    formData.append('file', {
      uri: imgUrl,
      type: 'image/jpeg', // 필요한 경우 이미지 유형 변경
      name: 'image.jpg', // 필요한 경우 이름 변경
    });

    try {
      const response = await fetch(
        `${apiUrl}/shared-images/${email}/uploadImage/${sharedPetId}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'multipart/form-data' },
          body: formData,
        }
      );

      if (response.ok) {
        console.log('사진 등록 성공');
        navigation.goBack(); // 업로드 성공 후 뒤로 이동
      } else {
        console.log('사진 등록 실패');
      }
    } catch (error) {
      console.log('사진 등록 요청 실패' + error);
    }
  };

  const InsertUrl = (url) => {
    setImgUrl(url);
  };
  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
        }}
      >
        {/* 작성자 */}
        <View style={styles.profile_container}>
          <Image
            source={require('../../../assets/pet_icon.png')}
            style={styles.profile}
          />
          <Text style={{ marginLeft: 10, fontSize: 16 }}>{userName}</Text>
        </View>
        {/* 사진 */}
        <View style={styles.photo_container}>
          {imgUrl === null ? (
            <View style={styles.photoBox}></View>
          ) : (
            <Image source={{ uri: imgUrl }} style={styles.image} />
          )}
          <View style={{ marginTop: -28, marginLeft: 300 }}>
            <ImagePickerComponent
              width={45}
              height={45}
              InsertUrl={InsertUrl}
            />
          </View>
        </View>
        {/* 입력 */}
        <View style={styles.content_container}>
          <TextInput
            onChangeText={(text) => setTitle(text)}
            placeholder="제목"
            style={{
              fontSize: 19,
              marginHorizontal: 15,
              width: 380,
              padding: 10,
            }}
          ></TextInput>
          <View
            style={{
              backgroundColor: GRAY.LIGHT,
              height: 1,
              width: '100%',
            }}
          ></View>
          <TextInput
            onChangeText={(text) => setContents(text)}
            placeholder="내용을 입력해주세요"
            multiline={true}
            style={{
              textAlignVertical: 'top',
              height: 100,
              width: 380,
              marginHorizontal: 15,
              paddingHorizontal: 10,
              paddingTop: 15,
            }}
          ></TextInput>

          <View style={styles.containerRow}>
            <SquareButton
              colorType={ColorTypes.YELLOW}
              text="등록하기"
              onPress={handleImageUpload}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: WHITE,
  },
  profile_container: {
    flexDirection: 'row',
    flex: 0.22,
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginHorizontal: 20,
    //backgroundColor: YELLOW.DARK,
  },
  profile: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
  },
  photo_container: {
    flex: 1,
    alignItems: 'center',
  },
  content_container: {
    flex: 1,
    marginTop: 10,
  },
  containerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoBox: {
    width: 390,
    height: 270,
    backgroundColor: GRAY.LIGHTER,
  },
  image: {
    width: 390,
    height: 270,
  },
  title: {
    alignItems: 'flex-start',
    marginBottom: 5,
    fontSize: 16,
  },
  imagePicker: {
    marginTop: -20,
  },
});
export default AddphotoScreen;
