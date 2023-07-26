import {
  Text,
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Pressable,
  Image,
} from 'react-native';
import { useState, useEffect } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { RED, GRAY, BLACK } from '../../../colors';

const DetailPhotoScreen = ({ navigation, route }) => {
  const [liked, setLiked] = useState(BLACK.DEFAULT);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const param = route.params;

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
    } else if (liked === RED.DEFAULT) {
      setLiked(BLACK.DEFAULT);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {/* 사진 출력 영역 */}
      <Image
        source={{
          uri: `http://43.200.8.47:8080/shared-images/lsyun1234@naver.com/downloadImage/${param.pet.sharedPetId}.jpg`,
        }}
        style={{ width: '100%', height: 300 }}
      />

      {/* 좋아요 버튼 */}
      <TouchableOpacity
        onPress={LikeHandle}
        style={{ flexDirection: 'row', padding: 10 }}
      >
        <MaterialCommunityIcons name="cards-heart" size={36} color={liked} />
        <Text style={{ fontSize: 25, lineHeight: 36 }}> {0}</Text>
      </TouchableOpacity>

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

      {/* 댓글 목록 */}
      <FlatList
        data={comments}
        renderItem={({ item }) => (
          <View style={{ paddingHorizontal: 10, paddingVertical: 5 }}>
            <Text>{item}</Text>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  profileImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  postImage: {
    width: '100%',
    height: 300,
    marginBottom: 8,
  },
  actions: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  likeButton: {
    marginRight: 16,
  },
  commentButton: {},
  likesCount: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  captionContainer: {
    flexDirection: 'row',
  },
  captionUsername: {
    fontWeight: 'bold',
    marginRight: 4,
  },
  caption: {},
});

export default DetailPhotoScreen;
