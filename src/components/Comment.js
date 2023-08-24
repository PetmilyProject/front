import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Touchable
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation, useNavigationState } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const Comment = () => {
  const [contentHeight, setContentHeight] = useState(0);
  const [commentHeight, setCommentHeight] = useState(0);
  const commentContent = '말 도 안돼 고갤 저어도\n내 안의 나 나를 보고 속삭여\n' +
    '';

  const handleLayout = (event) => {
    const height = event.nativeEvent.layout.height;

    setContentHeight(height);
  };
  const handleLayout2 = (event) => {
    const height = event.nativeEvent.layout.height;

    setCommentHeight(height);
  }

  const getComment = () => {
    return (
      <View
        style={styles.comment_container}
        onLayout={handleLayout}
      >
        <View style={{ width: 50, height: 65 }}>
          <View style={styles.profile_area}>
            <Image
              source={{ uri: 'http://43.200.8.47:8080/pet/lsyun1234@naver.com/downloadImage/27.jpg' }}
              style={{ width: '100%', height: '100%', borderRadius: 30, marginTop: 5 }}
            />
          </View>
        </View>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', flex: 0.7 }}>
            <View style={styles.nickname_area}>
              <Text>아이디</Text>
            </View>
            <View
              style={styles.comment_content_area}
              onLayout={handleLayout2}
            >
              <Text>{commentContent}</Text>
            </View>
            <View style={styles.icon_area}>
              <TouchableOpacity>
                <MaterialCommunityIcons name='dots-vertical' size={20} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ flexDirection: 'row', flex: 0.3, marginLeft: 10 }}>
            <Text style={styles.gray_text_style}>2023.08.24</Text>
            <TouchableOpacity>
              <Text style={[styles.gray_text_style, { marginLeft: 10 }]}>답글 달기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    getComment()
  )
}

const styles = StyleSheet.create({
  comment_container: {
    flexDirection: 'row',
    marginBottom: 10
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
    color: 'gray'
  },
});

export default Comment;