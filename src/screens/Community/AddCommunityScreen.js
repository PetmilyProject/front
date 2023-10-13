import {
  Text,
  View,
  StyleSheet,
  Image,
  Keyboard,
  ScrollView,
} from 'react-native';
import ImagePickerComponent from '../../components/ImagePicker';
import { GRAY, WHITE, YELLOW } from '../../colors';
import { useState } from 'react';
import SquareButton, { ColorTypes } from '../../components/Button';
import {
  TextInput,
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';
import axios from 'axios';
//import defaultImage from '../../assets/defaultImage.png'

const AddCommunityScreen = ({ navigation, route }) => {
  const [imgUrl, setImgUrl] = useState(null);
  const [userName, setUserName] = useState('');
  const [postId, setPostId] = useState('');
  const [contents, setContents] = useState('');
  const [title, setTitle] = useState('');
  const [image, setImage] = useState('');

  const currentDate = new Date();
  const year = currentDate.getFullYear(); // 연도
  const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // 월 (0부터 시작하므로 +1, 1월은 0)
  const date = String(currentDate.getDate()).padStart(2, '0'); // 일

  const formattedDate = `${year}-${month}-${date}`;

  // 이제 formattedDate 변수를 사용하여 axios 요청을 보낼 때 date 필드에 넣을 수 있습니다.

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

  // 사진 전송
  const handleImageUpload = async (postId) => {
    const imageUrl = imgUrl ? imgUrl : `https://i.ibb.co/Twj7906/defaultimage.jpg`;

    try {
      const formData = new FormData();

      const myEmail = await AsyncStorage.getItem('email');
      const token = await AsyncStorage.getItem('token');

      console.log('uri : ', imageUrl);

      formData.append('file', {
        uri: imageUrl,
        type: 'multipart/form-data',
        name: `${postId}.jpg`,
        //postId: `${postId}`,
      });

      //console.log("post할 url : ", `http://ec2-43-200-8-47.ap-northeast-2.compute.amazonaws.com:8080/communityImage/uploadImage/${myEmail}/${postId}`)

      const response = await axios.post(
        `http://ec2-43-200-8-47.ap-northeast-2.compute.amazonaws.com:8080/communityImage/uploadImage/${myEmail}/${postId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',

            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data) {
        setImage(response.data.imageUrl);
        // getImage();
        console.log('성공 : ', response.data.imageUrl);
      } else {
        console.log('오류이유 : ', response);
      }
    } catch (error) {
      console.error('이미지 업로드 오류:', error);
    }
  };

  const handleCommunitySubmit = () => {
    const uploadCommunity = async () => {
      const tmpEmail = await AsyncStorage.getItem('email');
      const tmpToken = await AsyncStorage.getItem('token');
      const response = await axios.post(
        `http://ec2-43-200-8-47.ap-northeast-2.compute.amazonaws.com:8080/community/post/${tmpEmail}`,
        {
          //communityId: postId,
          title: title,
          wrote: contents,
          date: formattedDate,
          likes: 0,
        },
        {
          headers: {
            Authorization: `Bearer ${tmpToken}`,
          },
        }
      );

      const postResponse = response.data;
      console.log(postResponse);
      handleImageUpload(postResponse.communityId);

    };
    uploadCommunity();
    
    navigation.goBack();
  };

  const InsertUrl = (url) => {
    setImgUrl(url);
  };
  return (
    <ScrollView
      contentContainerStyle={styles.container}
      //keyboardShouldPersistTaps="handled"
    >
      <TouchableWithoutFeedback>
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
            <Image
              source={{uri: `https://i.ibb.co/Twj7906/defaultimage.jpg` }}
              style={styles.photoBox}
            />
          ) : (
            <Image source={{ uri: imgUrl }} style={styles.image} />
          )}
          <View style={{ marginLeft: 300 }}>
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
export default AddCommunityScreen;
