import { Text, View, StyleSheet, Image, Keyboard } from 'react-native';
import ImagePickerComponent from '../../components/ImagePicker';
import { GRAY, WHITE, YELLOW } from '../../colors';
import { useState } from 'react';
import SquareButton, { ColorTypes } from '../../components/Button';
import {
  TextInput,
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler';
import { ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';
import axios from 'axios';

const AddCommunityScreen = ({ navigation, route }) => {
  const [imgUrl, setImgUrl] = useState(null);
  const [userName, setUserName] = useState('');
  const [postId, setPostId] = useState('');
  const [contents, setContents] = useState('');
  const [title, setTitle] = useState('');

  // 유저네임 가져오기
  useEffect(() => {
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
    const myEmail = await AsyncStorage.getItem('email');
    const url = `http://ec2-43-200-8-47.ap-northeast-2.compute.amazonaws.com:8080`;

    const formData = new FormData();
    formData.append('file', {
      uri: imgUrl,
      type: 'image/jpeg',
      name: 'image.jpg',
      postId: postId,
    });

    try {
      const response = await fetch(
        `${url}/communityImage/uploadImage/${myEmail}/${postId}`,
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

  const handleCommunitySubmit = () => {
    console.log(postId, title, contents, 'end \n');
    AsyncStorage.getItem('email')
      .then((myEmail) => {
        AsyncStorage.getItem('token')
          .then((token) => {
            const uploadImagePromise = handleImageUpload();
            const createCommunityPostPromise = axios.post(
              `http://ec2-43-200-8-47.ap-northeast-2.compute.amazonaws.com:8080/community/post/${myEmail}`,
              {
                community_id: postId,
                title: title,
                wrote: contents,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            Promise.all([uploadImagePromise, createCommunityPostPromise])
              .then((responses) => {
                console.log(
                  '이미지 업로드와 커뮤니티 글 작성이 모두 성공했습니다.'
                );
                console.log('이미지 업로드 응답:', responses[0]);
                console.log('커뮤니티 글 작성 응답:', responses[1]);
              })
              .catch((errors) => {
                console.error(
                  '이미지 업로드 또는 커뮤니티 글 작성 중 오류 발생:',
                  errors
                );
              })
              .finally(() => {
                navigation.goBack(); // 뒤로 이동
              });
          })
          .catch((error) => {
            console.error(error);
          });
      })
      .catch((error) => {
        console.error(error);
      });
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
            source={require('../../assets/pet_icon.png')}
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
              onPress={handleCommunitySubmit}
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
export default AddCommunityScreen;
