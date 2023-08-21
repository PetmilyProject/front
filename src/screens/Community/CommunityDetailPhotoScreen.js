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
  TouchableOpacity
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation, useNavigationState } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BLACK, RED } from '../../colors';

const CommunityDetailPhotoScreen = (props) => {
  const params = props.route.params;
  const photoUrl = params.detailUrl;
  const [liked, setLiked] = useState(BLACK.DEFAULT);
  const [likes, setLikes] = useState(0);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);

  // 댓글 작성 핸들러
  const handleComment = () => {
    if (comment !== '') {
      setComments([...comments, comment]);
      setComment('');
    }
  };

  const LikeHandle = () => {
    if (liked === BLACK.DEFAULT) {
      setLiked(RED.DEFAULT);
      setLikes(1);
    } else if (liked === RED.DEFAULT) {
      setLiked(BLACK.DEFAULT);
      setLikes(0);
    }
  };

  return (
    <View style={styles.main_style}>
      <ScrollView>
        <View style={styles.upside_style}>
          {/* 헤더 영역 */}
          <View style={styles.header_container}>

          </View>
          {/* 이미지 영역 */}
          <View style={styles.image_container}>
            <Image
              source={{ uri: photoUrl }}
              style={{
                height: '100%',
                width: '100%',
                resizeMode: 'contain'
              }}
            />
          </View>
          {/* 상세 정보 영역 */}
          <View style={styles.detail_container}>
            <View style={styles.like_area}>
              {/* 좋아요 버튼 */}
              <TouchableOpacity
                onPress={LikeHandle}
                style={{ flexDirection: 'row', padding: 10 }}
              >
                <MaterialCommunityIcons name="cards-heart" size={36} color={liked} />
              </TouchableOpacity>
              <Text style={{ fontSize: 15, lineHeight: 60 }}> 좋아요 {likes}개</Text>
            </View>
            {/* 설명 부분 */}
            <View>
              
            </View>

            {/* 댓글 입력 */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 10,
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
              <TouchableOpacity onPress={handleComment}>
                <Text>게시</Text>
              </TouchableOpacity>
            </View>
          </View>
          {/* 댓글 영역 */}
          <View style={styles.downside_style}>
            <View style={styles.comment_container}>

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
    height: 600,
    backgroundColor: 'white'
  },
  upside_style: {
    backgroundColor: 'white',
    width: '100%',
    height: 500
  },
  like_area: {
    flexDirection: 'row'
  },
  downside_style: {
    backgroundColor: 'skyblue',
    width: '100%',
    //height: 300
  },
  header_container: {
    flex: 0.15,
    backgroundColor: 'white'
  },
  image_container: {
    flex: 0.6,
    backgroundColor: 'lightgray'
  },
  detail_container: {
    flex: 0.25,
    backgroundColor: 'white'
  },
  comment_container: {

  }
});

export default CommunityDetailPhotoScreen;