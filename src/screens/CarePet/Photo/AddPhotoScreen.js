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
import axios from 'axios';

const AddphotoScreen = ({ navigation, route }) => {
  const { petName, petId } = route.params;
  //사용자 정보 useState
  const [userName, setUserName] = useState('');
  const [userImage, setUserImage] = useState('');
  const [email, setEmail] = useState('');
  //이미지 useState
  const [image, setImage] = useState(null);
  const [uploadImage, setUploadImage] = useState('');
  //내용 useState
  const [contents, setContents] = useState('');
  const [title, setTitle] = useState('');
  //등록일

  const currentDate = new Date();
  const year = currentDate.getFullYear(); // 연도
  const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // 월 (0부터 시작하므로 +1, 1월은 0)
  const date = String(currentDate.getDate()).padStart(2, '0'); // 일

  const formattedDate = `${year}-${month}-${date}`;

  // 난수생성
  const generateSharedPetId = () => {
    const randomId = Math.floor(Math.random() * 100000); // 랜덤한 숫자 생성
    return randomId;
  };
  const [sharedPetId, setSharedPetId] = useState(generateSharedPetId());

  //사용자 정보, 프로필 가져오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        const myEmail = await AsyncStorage.getItem('email');
        const token = await AsyncStorage.getItem('token');
        setUserImage(
          `http://ec2-43-200-8-47.ap-northeast-2.compute.amazonaws.com:8080/profile/get/${myEmail}/${myEmail}.jpg`
        );
        console.log('사용자 프로필 url : ', userImage);

        if (myEmail && token) {
          const response = await axios.get(
            `http://ec2-43-200-8-47.ap-northeast-2.compute.amazonaws.com:8080/users/${myEmail}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setEmail(response.data.email);
          setUserName(response.data.userName);
        }
      } catch (error) {
        console.error('사용자 데이터 가져오기 오류:', error);
      }
    };
    fetchData();
  }, [email]);

  // 이미지 업로드
  const handleImageUpload = async (photoId, petId) => {
    try {
      const formData = new FormData();
      const myEmail = await AsyncStorage.getItem('email');
      const token = await AsyncStorage.getItem('token');

      console.log('uri : ', image);
      console.log(photoId, petId);

      formData.append('file', {
        uri: image,
        type: 'multipart/form-data',
        name: `${photoId}.jpg`,
      });

      const response = await axios.post(
        `http://43.200.8.47:8080/shared-images/${petId}/uploadImage/${myEmail}/${photoId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const postResponse = response.data;

      if (response.data) {
        setUploadImage(response.data.imageUrl);
        console.log('성공 : ', response.data.imageUrl);
      } else {
        console.log('오류이유 : ', response);
      }
    } catch (error) {
      console.error('이미지 업로드 오류:', error);
    }
  };
  //게시글 올리기
  const handleSubmit = () => {
    const uploadPhoto = async () => {
      const tmpToken = await AsyncStorage.getItem('token');
      const response = await axios.post(
        `http://ec2-43-200-8-47.ap-northeast-2.compute.amazonaws.com:8080/sharedPetGallery/${email}/post/${petId}`,
        {
          //communityId: postId,
          title: title,
          wrote: contents,
          date: formattedDate,
          likes: 0,
          email: email,
          petId: petId,
        },
        {
          headers: {
            Authorization: `Bearer ${tmpToken}`,
          },
        }
      );

      const postResponse = response.data;
      console.log(postResponse);
      handleImageUpload(postResponse.photoId, postResponse.petId);
    };
    uploadPhoto();

    navigation.goBack();
  };

  const InsertUrl = (url) => {
    setImage(url);
  };
  return (
    <View style={{ flex: 1, backgroundColor: WHITE }}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableWithoutFeedback
          onPress={() => {
            //Keyboard.dismiss();
          }}
        >
          {/* 작성자 */}
          <View style={styles.profile_container}>
            <Image source={{ uri: userImage }} style={styles.profile} />
            <Text style={{ marginLeft: 10, fontSize: 16 }}>{userName}</Text>
          </View>
          {/* 사진 */}
          <View style={styles.photo_container}>
            {image === null ? (
              <View style={styles.photoBox}></View>
            ) : (
              <Image source={{ uri: image }} style={styles.image} />
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
                onPress={handleSubmit}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: WHITE,
  },
  contents_container: {
    flex: 1,
  },
  profile_container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginHorizontal: 20,
    marginVertical: 13,
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
