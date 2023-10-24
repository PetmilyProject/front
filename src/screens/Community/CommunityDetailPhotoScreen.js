import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  Pressable,
  ActivityIndicator,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation, useNavigationState } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BLACK, GRAY, RED, WHITE, YELLOW } from '../../colors';
import Comment from '../../components/Comment';
import CommunityModal from './CommunityModal';
import {
  TouchableWithoutFeedback,
  ScrollView as GestureHandlerScrollView,
} from 'react-native-gesture-handler';

const CommunityDetailPhotoScreen = (props, route) => {
  const param = props.route.params;
  const photoUrl = param.detailUrl;
  const community_id = param.communityinfo.community_id;
  const writerEmail = param.communityinfo.email;
  const title = param.communityinfo.title;
  const wrote = param.communityinfo.wrote;
  const date = param.communityinfo.date;

  const [liked, setLiked] = useState(BLACK.DEFAULT);
  const [likes, setLikes] = useState(0);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [contentHeight, setContentHeight] = useState(0);
  const [modalActive, setModalActive] = useState(false);
  const [userInfo, setUserInfo] = useState([]);
  const [email, setEmail] = useState('');

  //<---------------------------------------사용자 정보 가져옴 ------------------------------------------------->
  const getUserInfo = async () => {
    const email = await AsyncStorage.getItem('email');
    setEmail(email);
    const token = await AsyncStorage.getItem('token');

    const userResponse = await axios.get(
      `http://43.200.8.47:8080/users/${param.communityinfo.email}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    //console.log(userResponse.data);
    setUserInfo(userResponse.data);
  };

  //<-----------------------------------------------------좋아요---------------------------------------------------->
  const LikeHandle = async () => {
    const email = await AsyncStorage.getItem('email');

    const token = await AsyncStorage.getItem('token');

    if (liked === BLACK.DEFAULT) {
      setLiked(RED.DEFAULT);

      const likesResponse = await axios.get(
        `http://43.200.8.47:8080/community/get/${param.communityinfo.community_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const likesData = likesResponse.data;
      let nowLikes = likesData.likes;
      const addLikes = await axios.put(
        `http://43.200.8.47:8080/community/updateLikes/${email}`,
        {
          communityId: likesData.communityId,
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
        `http://43.200.8.47:8080/community/get/${param.communityinfo.community_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const likesData = likesResponse.data;
      let nowLikes = likesData.likes;
      const minusLikes = await axios.put(
        `http://43.200.8.47:8080/community/updateLikes/${email}`,
        {
          communityId: likesData.communityId,
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
  };

  const setInitialLikes = async () => {
    const email = await AsyncStorage.getItem('email');
    const token = await AsyncStorage.getItem('token');

    const likesResponse = await axios.get(
      `http://43.200.8.47:8080/community/get/${param.communityinfo.community_id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const likesData = likesResponse.data.likes;
    const likedBy = likesResponse.data.likedBy;

    for (let i = 0; i < likedBy.length; i++) {
      if (likedBy[i] === email) {
        //console.log("좋아요 이미 누름");
        setLiked(RED.DEFAULT);
        break;
      }
    }

    setLikes(likesData);
  };

  //<----------------------------------------------댓글--------------------------------------------->
  // 댓글 작성 핸들러
  const handleComment = () => {
    if (comment !== '') {
      setComments([...comments, comment]);
      setComment('');
    }
  };

  //모든 댓글 가져오기
  const getComments = async () => {
    const myToken = await AsyncStorage.getItem('token');

    try {
      const commentsResponse = await axios.get(
        `http://43.200.8.47:8080/comment/getAll/${param.communityinfo.community_id}`,
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

    const myEmail = await AsyncStorage.getItem('email');
    const myToken = await AsyncStorage.getItem('token');
    const commentPostUrl = `http://43.200.8.47:8080/comment/post/${myEmail}`;
    const formData = {
      communityId: param.communityinfo.community_id,
      email: myEmail,
      commentInfo: comment,
      date: formattedDate,
    };
    const commentResponse = await axios.post(commentPostUrl, formData, {
      Authorization: `Bearer ${myToken}`,
    });
    const commentResponseData = commentResponse.data;

    // 2023-10-18 추가
    const updatedCommentsResponse = await axios.get(
      `http://43.200.8.47:8080/comment/getAll/${param.communityinfo.community_id}`,
      {
        headers: {
          Authorization: `Bearer ${myToken}`,
        },
      }
    );
    const updatedCommentsData = updatedCommentsResponse.data;

    setComments(updatedCommentsData);
    setComment('');
    // console.log(commentResponseData);
  };

  useEffect(() => {
    setInitialLikes();
    getUserInfo();
  }, [comments]);

  useEffect(() => {
    getComments();
  }, []);

  //<------------------------------------------------수정/삭제 모달 관리---------------------------->

  //모달 열기
  const openModal = () => {
    setModalActive(true);
  };
  //모달 닫기
  const closeModal = () => {
    setModalActive(false);
  };

  return (
    <View style={styles.main_style}>
      <ScrollView>
        <View style={styles.upside_style}>
          {/* 헤더 영역 */}
          <View style={styles.header_container}>
            <View style={{ flexDirection: 'row', marginLeft: 10 }}>
              <Image
                source={{
                  uri: `http://43.200.8.47:8080/profile/get/${userInfo.email}/${userInfo.email}.jpg`,
                }}
                style={styles.profile_image}
              />
              <View style={{ flex: 1, marginTop: 10, marginLeft: 10 }}>
                <Text>{userInfo.userName}</Text>
              </View>
              <TouchableOpacity onPress={openModal}>
                <MaterialCommunityIcons
                  name="dots-vertical"
                  size={30}
                  style={{ margin: 5, marginRight: 0 }}
                />
                <CommunityModal
                  modalActive={modalActive}
                  onClose={closeModal}
                  community_id={community_id}
                  email={email}
                  writerEmail={writerEmail}
                  photoUrl={photoUrl}
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
              source={{ uri: photoUrl }}
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
                  size={36}
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
              marginHorizontal: 5,
              marginBottom: 5,
            }}
          >
            <TextInput
              placeholder="댓글 작성"
              value={comment}
              onChangeText={(text) => setComment(text)}
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
          </View>
          {/* 댓글 영역 */}
          <View style={[styles.downside_style, styles.give_margin]}>
            {/* <GestureHandlerScrollView style={styles.comment_container}> */}
            <View style={styles.comment_container}>
              <Comment
                communityId={param.communityinfo.community_id}
                comments={comments}
              />
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

export default CommunityDetailPhotoScreen;
