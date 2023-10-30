import {
  Text,
  View,
  StyleSheet,
  Image,
  Keyboard,
  ScrollView,
} from 'react-native';
import { useState } from 'react';

import {
  TextInput,
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { CarePetRoutes, CommunityRoutes } from '../../../navigations/routes';
import ImagePickerComponent from '../../../components/ImagePicker';
import { GRAY, WHITE } from '../../../colors';
import SquareButton, { ColorTypes } from '../../../components/Button';
//import defaultImage from '../../assets/defaultImage.png'

const UpdatePhotoScreen = ({ navigation, route }) => {
  const params = route.params;
  const petId = params.petId;
  const photoId = params.photoId;
  const writerEmail = params.writerEmail;
  const photoUrl = params.photoUrl;
  const title = params.title;
  const wrote = params.wrote;
  console.log('펫아이디', petId);

  const [email, setEmail] = useState('');
  const [imgUrl, setImgUrl] = useState(photoUrl);
  const [userName, setUserName] = useState('');
  const [userImage, setUserImage] = useState('');
  const [postId, setPostId] = useState('');
  const [contents, setContents] = useState(wrote);
  const [newTitle, setNewTitle] = useState(title);
  const [image, setImage] = useState('');

  //사용자 정보, 프로필 가져오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        const myEmail = await AsyncStorage.getItem('email');
        const token = await AsyncStorage.getItem('token');
        setUserImage(
          `http://ec2-43-200-8-47.ap-northeast-2.compute.amazonaws.com:8080/profile/get/${writerEmail}/${writerEmail}.jpg`
        );
        console.log('사용자 프로필 url : ', userImage);

        if (myEmail && token) {
          const response = await axios.get(
            `http://ec2-43-200-8-47.ap-northeast-2.compute.amazonaws.com:8080/users/${writerEmail}`,
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

  {
    /*---------------------------------------------사진 업로드-------------------------------------------------*/
  }
  const handleImageUpload = async () => {
    try {
      const imageUrl = imgUrl
      ? imgUrl
      : `https://i.ibb.co/Twj7906/defaultimage.jpg`;

      const formData = new FormData();

      const myEmail = await AsyncStorage.getItem('email');
      const token = await AsyncStorage.getItem('token');

      formData.append('file', {
        uri: imageUrl,
        type: 'multipart/form-data',
        name: `${photoId}.jpg`,
      });

      const response = await axios.put(
        `http://ec2-43-200-8-47.ap-northeast-2.compute.amazonaws.com:8080/shared-images/${petId}/updateImage/${photoId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data) {
        // 이미지 수정 성공
        console.log('이미지 수정 성공 : ', response.data);
      } else {
        // 이미지 수정 실패
        console.log('이미지 수정 오류 이유 : ', response);
      }
    } catch (error) {
      console.error('이미지 수정 오류:', error);
    }
  };

  const handleCommunitySubmit = async () => {
    try {
      const myEmail = await AsyncStorage.getItem('email');
      const token = await AsyncStorage.getItem('token');

      const updatedCommunityData = {
        photoId: photoId,
        title: newTitle,
        wrote: contents,
      };

      const response = await axios.put(
        `http://ec2-43-200-8-47.ap-northeast-2.compute.amazonaws.com:8080/sharedPetGallery/${email}/update/${photoId}`,
        updatedCommunityData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data) {
        console.log('게시글 수정 성공');
        handleImageUpload(photoId); // 이미지 업로드 역시 필요하다면 호출
        navigation.navigate('PetProfileListScreen');
        // 다른 작업을 수행하거나 페이지를 이동하는 코드 추가
      } else {
        console.log('게시글 수정 실패');
      }
    } catch (error) {
      console.error('게시글 수정 오류:', error);
    }
  };

  const InsertUrl = (url) => {
    setImgUrl(url);
  };
  return (
    <View style={{ flex: 1, backgroundColor: WHITE }}>
      <ScrollView
        contentContainerStyle={styles.container}
        //keyboardShouldPersistTaps="handled"
      >
        <TouchableWithoutFeedback>
          {/* 작성자 */}
          <View style={styles.profile_container}>
            <Image source={{ uri: userImage }} style={styles.profile} />
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
              onChangeText={(text) => setNewTitle(text)}
              placeholder="제목"
              style={{
                fontSize: 19,
                marginHorizontal: 15,
                width: 380,
                padding: 10,
              }}
              value={newTitle}
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
              value={contents}
            ></TextInput>

            <View style={styles.containerRow}>
              <SquareButton
                colorType={ColorTypes.YELLOW}
                text="등록하기"
                onPress={handleCommunitySubmit}
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
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: WHITE,
  },
  profile_container: {
    flexDirection: 'row',
    flex: 0.25,
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginHorizontal: 20,
    marginVertical: 5,
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
    //marginTop: -20,
  },
});
export default UpdatePhotoScreen;
