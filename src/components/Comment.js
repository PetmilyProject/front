import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Touchable,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation, useNavigationState } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const Comment = (param) => {
  const communityId = param.communityId;
  const [contentHeight, setContentHeight] = useState(0);
  const [commentHeight, setCommentHeight] = useState(0);
  const [commentContent, setCommentContent] = useState([]);
  const [userNames, setuserNames] = useState([]);

  const commentInit = async () => {
    const email = await AsyncStorage.getItem('email');
    const token = await AsyncStorage.getItem('token');
    const commentResponse = await axios.get(
      `http://43.200.8.47:8080/comment/getAll/${communityId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const commentResponseData = commentResponse.data;

    setCommentContent(commentResponseData);
  };

  const handleLayout = (event) => {
    const height = event.nativeEvent.layout.height;

    setContentHeight(height);
  };
  const handleLayout2 = (event) => {
    const height = event.nativeEvent.layout.height;

    setCommentHeight(height);
  };

  useEffect(() => {
    commentInit();
  }, []); // 컴포넌트가 마운트될 때만 호출

  useEffect(() => {
    const fetchUserNames = async () => {
      const names = await Promise.all(
        commentContent.map(comment => {
          return getUserName(comment);
        })
      );
      setuserNames(names);
    };

    fetchUserNames();
  }, [commentContent]);

  const getUserName = async (comment) => {
    const token = await AsyncStorage.getItem('token');
    const response = await axios.get(`http://43.200.8.47:8080/users/${comment.email}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const responseData = response.data;

    return responseData.userName;
  }

  const getComment = (comment, index) => {
    return (
      <View
        style={styles.comment_container}
        onLayout={handleLayout}
      >
        <View style={{ width: 50, height: 65 }}>
          <View style={styles.profile_area}>
            <Image
              source={{ uri: `http://43.200.8.47:8080/profile/get/${comment.email}/${comment.email}.jpg` }}
              style={{ width: '100%', height: '100%', borderRadius: 30, marginTop: 5 }}
            />
          </View>
        </View>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', flex: 0.7 }}>
            <View style={styles.nickname_area}>
              <Text>{userNames[index]}</Text>
            </View>
            <View
              style={styles.comment_content_area}
              onLayout={handleLayout2}
            >
              <Text>{comment.commentInfo}</Text>
            </View>
            <View style={styles.icon_area}>
              <TouchableOpacity>
                <MaterialCommunityIcons name='dots-vertical' size={20} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ flexDirection: 'row', flex: 0.3, marginLeft: 10 }}>
            <Text style={styles.gray_text_style}>{comment.date}</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    commentContent.length ? 
      commentContent.map((comment, index) => {
        return getComment(comment, index);
      })
    : null
  )
};

const styles = StyleSheet.create({
  comment_container: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  profile_area: {
    width: 50,
    height: 50,
    marginBottom: 0,
  },
  nickname_area: {
    //fontFamily: 'GmarketSansTTFMedium',
    flex: 0.2,
    paddingLeft: 10,
    color: 'black',
    //height: 50,
  },
  comment_content_area: {
    flex: 0.65,
    marginBottom: 10,
    //height: 50,
  },
  icon_area: {
    flex: 0.15,
    //height: 50,
  },
  gray_text_style: {
    fontSize: 12,
    color: 'gray',
  },
});

export default Comment;
