import { Text, View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { RED, BLACK, WHITE, GRAY, YELLOW } from '../../../colors';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';
import { ScrollView } from 'react-native';
import CommunityModal from '../../Community/CommunityModal';
import { TextInput } from 'react-native-gesture-handler';
import Comment from '../../../components/Comment';
import CommentPhoto from '../../../components/CommentPhoto';
import PhotoModal from './PhotoModal';

const DetailPhotoScreen = (props, route) => {
  const param = props.route.params;
  //넘어온 게시글
  const date = param.petInfo.date;
  const writer = param.petInfo.writer;
  const petId = param.petInfo.petId;
  const photoId = param.petInfo.photoId;
  const title = param.petInfo.title;
  const wrote = param.petInfo.wrote;
  const imageUrl = param.petInfo.imageUrl;
  console.log('작성자:', writer);

  // console.log(param);
  const [email, setEmail] = useState('');
  //좋아요
  const [liked, setLiked] = useState(BLACK.DEFAULT);
  const [likes, setLikes] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);
  //작성자 정보
  const [writerInfo, setWriterInfo] = useState([]);

  //모달관리
  const [modalActive, setModalActive] = useState(false);
  // const likedBy[]=param.petInfo.likedBy;

  //댓글 관리
  const [commentInfo, setCommentInfo] = useState('');
  const [comments, setComments] = useState([]);

  //<---------------------------------------작성자 정보 가져옴 ------------------------------------------------->
  const getUserInfo = async () => {
    const token = await AsyncStorage.getItem('token');
    const email = await AsyncStorage.getItem('email');
    setEmail(email);

    const writerInfoResponse = await axios.get(
      `http://43.200.8.47:8080/users/${param.petInfo.writer}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setWriterInfo(writerInfoResponse.data);
    console.log('양육자정보', writerInfoResponse.data);
  };

  //<-----------------------------------------------------좋아요---------------------------------------------------->
  const LikeHandle = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      if (liked === BLACK.DEFAULT) {
        setLiked(RED.DEFAULT);

        const likesResponse = await axios.get(
          `http://43.200.8.47:8080/sharedPetGallery/${email}/getByPhotoId/${photoId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const likesData = likesResponse.data;
        // console.log(likesResponse.data);
        let nowLikes = likesData.likes;
        const addLikes = await axios.put(
          `http://43.200.8.47:8080/sharedPetGallery/${email}/updateLikes/${email}`,
          {
            photoId: likesData.photoId,
            date: likesData.date,
            email: likesData.email,
            likes: nowLikes + 1,
            title: likesData.title,
            wrote: likesData.wrote,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setLikes(nowLikes + 1);
      } else if (liked === RED.DEFAULT) {
        setLiked(BLACK.DEFAULT);

        const likesResponse = await axios.get(
          `http://43.200.8.47:8080/sharedPetGallery/${email}/getByPhotoId/${photoId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const likesData = likesResponse.data;
        // console.log('좋아요 정보', likesResponse.data);
        let nowLikes = likesData.likes;
        const minusLikes = await axios.put(
          `http://43.200.8.47:8080/sharedPetGallery/${email}/updateLikes/${email}`,
          {
            photoId: likesData.photoId,
            date: likesData.date,
            email: likesData.email,
            likes: nowLikes - 1,
            title: likesData.title,
            wrote: likesData.wrote,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setLikes(nowLikes - 1);
      }
    } catch (error) {
      console.error('LikeHandle에서 오류 발생: ', error);
    }
  };

  const setInitialLikes = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const response = await axios.get(
        `http://43.200.8.47:8080/sharedPetGallery/${writer}/getByPhotoId/${photoId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // 여기에서 response 상태 코드를 확인해보세요.
      if (response.status === 200) {
        const likesData = response.data.likes;
        const likedBy = response.data.likedBy;

        for (let i = 0; i < likedBy.length; i++) {
          if (likedBy[i] === email) {
            //console.log("좋아요 이미 누름");
            setLiked(RED.DEFAULT);
            break;
          }
        }

        setLikes(likesData);
      } else {
        console.error(`서버 응답 상태 코드: ${response.status}`);
        // 추가로 서버 응답 내용을 로그에 출력하거나 디버깅에 활용할 수 있는 정보를 확인합니다.
        // console.log(response.data);
      }
    } catch (error) {
      console.error('setInitialLikes에서 오류 발생: ', error);
    }
  };

  //<------------------------------------------------수정/삭제 모달 관리---------------------------->
  //모달 열기
  const openModal = () => {
    setModalActive(true);
  };
  //모달 닫기
  const closeModal = () => {
    setModalActive(false);
  };
  //<----------------------------------------------댓글--------------------------------------------->
  // 댓글 작성 핸들러
  const handleComment = () => {
    if (commentInfo !== '') {
      setComments([...comments, commentInfo]);
      setCommentInfo('');
    }
  };

  //모든 댓글 가져오기
  const getComments = async () => {
    const myToken = await AsyncStorage.getItem('token');

    try {
      const commentsResponse = await axios.get(
        `http://43.200.8.47:8080/GalleryComment/getAll/${photoId}`,
        {
          headers: {
            Authorization: `Bearer ${myToken}`,
          },
        }
      );
      const commentsData = commentsResponse.data;
      setComments(commentsData);
    } catch (error) {
      console.error('Error while fetching comments:', error);
    }
  };

  //댓글 등록
  const sendComment = async () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const date = String(currentDate.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${date}`;
    const myToken = await AsyncStorage.getItem('token');
    const commentPostUrl = `http://43.200.8.47:8080/GalleryComment/post/${email}`;
    const formData = {
      photoId: photoId,
      email: email,
      petId: petId,
      commentInfo: commentInfo,
      date: formattedDate,
    };
    const commentResponse = await axios.post(commentPostUrl, formData, {
      Authorization: `Bearer ${myToken}`,
    });
    const commentResponseData = commentResponse.data;

    // 2023-10-18 추가
    const updatedCommentsResponse = await axios.get(
      `http://43.200.8.47:8080/GalleryComment/getAll/${photoId}`,
      {
        headers: {
          Authorization: `Bearer ${myToken}`,
        },
      }
    );
    const updatedCommentsData = updatedCommentsResponse.data;

    setComments(updatedCommentsData);
    setCommentInfo('');
    // console.log(commentResponseData);
  };

  useEffect(() => {
    setInitialLikes();
    getUserInfo();
  }, [comments]);
  useEffect(() => {
    getComments();
  }, []);

  return (
    <View style={styles.main_style}>
      <ScrollView>
        <View style={styles.upside_style}>
          {/* 헤더 영역 */}
          <View style={styles.header_container}>
            <View style={{ flexDirection: 'row', marginLeft: 10 }}>
              <Image
                source={{
                  uri: `http://43.200.8.47:8080/profile/get/${writer}/${writer}.jpg` + '?cache=' + Math.random(),
                }}
                style={styles.profile_image}
              />
              <View style={{ flex: 1, marginTop: 10, marginLeft: 10 }}>
                <Text>{writerInfo.userName}</Text>
              </View>
              <TouchableOpacity onPress={openModal}>
                <MaterialCommunityIcons
                  name="dots-vertical"
                  size={30}
                  style={{ margin: 5, marginRight: 0 }}
                />
                <PhotoModal
                  modalActive={modalActive}
                  onClose={closeModal}
                  photoId={photoId}
                  petId={petId}
                  email={email}
                  writerEmail={writer}
                  photoUrl={imageUrl}
                  title={title}
                  date={date}
                  wrote={wrote}
                />
              </TouchableOpacity>
            </View>
          </View>
          {/* 이미지 영역 */}
          <View style={styles.image_container}>
            <Image
              source={{ uri: imageUrl }}
              style={{
                height: '100%',
                width: '100%',
                resizeMode: 'contain',
              }}
            />
          </View>
          {/* 상세 정보 영역 */}
          <View style={(styles.detail_container.height = 600 + contentHeight)}>
            <View style={styles.like_area}>
              {/* 좋아요 버튼 */}
              <TouchableOpacity
                onPress={LikeHandle}
                style={{ flexDirection: 'row', padding: 5 }}
              >
                <MaterialCommunityIcons
                  name="cards-heart"
                  size={30}
                  color={liked}
                />
              </TouchableOpacity>
              <Text
                style={{ fontSize: 15, lineHeight: 30, alignSelf: 'center' }}
              >
                {' '}
                좋아요 {likes}개
              </Text>
            </View>
            {/* 설명 부분 */}
            <View>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.content}>{wrote}</Text>
              <Text style={styles.date}>{date}</Text>
              <View style={styles.separator} />
            </View>
          </View>
          {/* 댓글 입력 */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginHorizontal: 10,
              marginBottom: 5,
              marginTop: 10,
            }}
          >
            <View
              style={{
                flex: 1,
                marginRight: 5,
                borderWidth: 1,
                borderRadius: 20,
                padding: 10,
                borderColor: GRAY.LIGHT,
              }}
            >
              <View style={{ flexDirection: 'row' }}>
                <TextInput
                  placeholder="댓글 작성"
                  value={commentInfo}
                  onChangeText={(text) => setCommentInfo(text)}
                  style={{ width: '90%' }}
                />
                <TouchableOpacity
                  onPress={() => {
                    handleComment(), sendComment();
                  }}
                >
                  <Text style={{ fontWeight: 'bold', color: YELLOW.DARK }}>
                    전송
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          {/* 댓글 입력
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginHorizontal: 5,
              marginBottom: 5,
            }}
          >
            <TextInput
              placeholder="댓글 작성"
              value={commentInfo}
              onChangeText={(text) => setCommentInfo(text)}
              style={{
                flex: 1,
                marginRight: 5,
                borderWidth: 1,
                borderRadius: 20,
                padding: 5,
              }}
            />
            <TouchableOpacity
              onPress={() => {
                handleComment(), sendComment();
              }}
              style={styles.submit}
            >
              <Text style={{ fontWeight: 'bold' }}>전송</Text>
            </TouchableOpacity>
          </View> */}
          {/* 댓글 영역 */}
          <View style={[styles.downside_style, styles.give_margin]}>
            {/* <GestureHandlerScrollView style={styles.comment_container}> */}
            <View style={styles.comment_container}>
              <CommentPhoto photoId={photoId} comments={comments} />
            </View>
            {/* </GestureHandlerScrollView> */}
            <View></View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  main_style: {
    flexDirection: 'column',
    flex: 1,
    width: '100%',
    //height: 600,
    backgroundColor: 'white',
  },
  upside_style: {
    backgroundColor: 'white',
    width: '100%',
    height: 800,
  },
  like_area: {
    flexDirection: 'row',
  },
  downside_style: {
    marginTop: 5,
    width: '100%',
    //height: 300,
    flex: 0.3,
  },
  header_container: {
    flex: 0.1,
    alignContent: 'flex-end',
    backgroundColor: 'white',
    justifyContent: 'center',
  },
  image_container: {
    flex: 0.6,
    backgroundColor: 'lightgray',
  },
  detail_container: {
    flex: 0.3,
    backgroundColor: 'white',
    height: 0,
  },
  comment_container: {
    flex: 1,
  },
  give_margin: {
    margin: 10,
  },
  separator: {
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
    width: '100%',
    marginVertical: 10,
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 8,
    marginLeft: 10,
  },
  content: {
    fontSize: 15,
    // marginBottom: 5,
    marginLeft: 10,
  },
  date: {
    fontSize: 12,
    color: 'gray',
    marginLeft: 10,
  },
  profile_image: {
    width: 40,
    height: 40,
    borderRadius: 30,
    marginBottom: 0,
  },
  submit: {
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 9,
    backgroundColor: YELLOW.DEFAULT,
    borderRadius: 20,
  },
});

export default DetailPhotoScreen;
