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
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation, useNavigationState } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BLACK, RED } from '../../colors';
import Comment from '../../components/Comment';

const CommunityDetailPhotoScreen = (props, route) => {
  const param = props.route.params;
  const photoUrl = param.detailUrl;
  const [liked, setLiked] = useState(BLACK.DEFAULT);
  const [likes, setLikes] = useState(0);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [contentHeight, setContentHeight] = useState(0);
  const [userInfo, setUserInfo] = useState([]);

  // 댓글 작성 핸들러
  const handleComment = () => {
    if (comment !== '') {
      setComments([...comments, comment]);
      setComment('');
    }
  };
  //console.log('넘어온거 : ', param);

  const LikeHandle = () => {
    if (liked === BLACK.DEFAULT) {
      setLiked(RED.DEFAULT);
      setLikes(1);
    } else if (liked === RED.DEFAULT) {
      setLiked(BLACK.DEFAULT);
      setLikes(0);
    }
  };

  const getUserInfo = async () => {
    const email = await AsyncStorage.getItem('email');
    const token = await AsyncStorage.getItem('token');

    const userResponse = await axios.get(`http://43.200.8.47:8080/users/${param.communityinfo.email}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    //console.log(userResponse.data);
    setUserInfo(userResponse.data);
  };

  useEffect(() => {
    getUserInfo();
  }, [])

  return (
    <View style={styles.main_style}>
      <ScrollView>
        <View style={styles.upside_style}>
          {/* 헤더 영역 */}
          <View style={styles.header_container}>
            <View style={{ flexDirection: 'row', marginLeft: 10 }}>
              <Image 
                source={{ uri: `http://43.200.8.47:8080/profile/get/${userInfo.email}/${userInfo.email}.jpg`}}
                style={ styles.profile_image }
              />
              <View style={{ flex: 1, marginTop: 10, marginLeft: 10 }}>
                <Text>{userInfo.userName}</Text>
              </View>
              <TouchableOpacity>
                <MaterialCommunityIcons
                  name="dots-vertical"
                  size={30}
                  style={{ margin: 5, marginRight: 0 }}
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
              <Text style={styles.title}>{param.communityinfo.title}</Text>
              <Text style={styles.content}>{param.communityinfo.wrote}</Text>
              <Text style={styles.date}>{param.communityinfo.date}</Text>
              <View style={styles.separator} />
            </View>
          </View>
          {/* 댓글 영역 */}
          <View style={[styles.downside_style, styles.give_margin]}>
            <View>
              <Comment />
            </View>
            <View style={styles.comment_container}>
              {/* 댓글 입력 */}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingRight: 10,
                }}
              >
                <TextInput
                  placeholder="댓글 작성"
                  value={comment}
                  onChangeText={(text) => setComment(text)}
                  style={{
                    flex: 1,
                    marginRight: 10,
                    borderWidth: 1,
                    borderRadius: 5,
                    padding: 5,
                  }}
                />
                <TouchableOpacity
                  onPress={handleComment}
                  style={{ alignItems: 'flex-end', marginRight: 10 }}
                >
                  <Text>게시</Text>
                </TouchableOpacity>
              </View>
            </View>
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
  },
  header_container: {
    flex: 0.1,
    alignContent: 'flex-end',
    backgroundColor: 'white',
    justifyContent: 'center'
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
  comment_container: {},
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
    marginLeft: 10
  },
  content: {
    fontSize: 15,
    marginBottom: 5,
    marginLeft: 10
  },
  date: {
    fontSize: 12,
    color: 'gray',
    marginLeft: 10
  },
  profile_image: { 
    width: 40,
    height: 40,
    borderRadius: 30,
    marginBottom: 0,
  }
});

export default CommunityDetailPhotoScreen;
