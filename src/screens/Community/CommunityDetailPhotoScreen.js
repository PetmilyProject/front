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

  // 댓글 작성 핸들러
  const handleComment = () => {
    if (comment !== '') {
      setComments([...comments, comment]);
      setComment('');
    }
  };
  console.log('넘어온거 : ', param);

  const LikeHandle = () => {
    if (liked === BLACK.DEFAULT) {
      setLiked(RED.DEFAULT);
      setLikes(1);
    } else if (liked === RED.DEFAULT) {
      setLiked(BLACK.DEFAULT);
      setLikes(0);
    }
  };

  const getDescription = () => {
    const title = '우리의 꿈';
    const detail =
      '내 어린 시절 우연히\n들었던 믿지 못할 한마디\n\n' +
      '이 세상을 다 준다는\n매혹적인 얘기\n내게 꿈을 심어 주었어';
    const nowDate = new Date().toISOString().slice(0, 10);

    return (
      <View
        style={styles.give_margin}
        onLayout={(event) => {
          setContentHeight(event.nativeEvent.layout.height);
        }}
      >
        <View style={{ marginBottom: 10 }}>
          <Text style={{ fontWeight: 'bold' }}>{title}</Text>
        </View>
        <View>
          <Text>{detail}</Text>
          <Text style={{ size: 12, color: 'gray', marginTop: 5 }}>
            2023.08.24
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.main_style}>
      <ScrollView>
        <View style={styles.upside_style}>
          {/* 헤더 영역 */}
          <View style={styles.header_container}>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
              <TouchableOpacity>
                <MaterialCommunityIcons
                  name="dots-vertical"
                  size={30}
                  style={{ margin: 5 }}
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
              <View style={styles.separator} />
              <Text style={styles.content}>{param.communityinfo.title}</Text>
              <Text style={styles.date}>{param.communityinfo.wrote}</Text>
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
});

export default CommunityDetailPhotoScreen;
