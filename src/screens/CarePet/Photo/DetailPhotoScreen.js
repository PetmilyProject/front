import { Text, View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { RED, BLACK, WHITE, GRAY } from '../../../colors';

const DetailPhotoScreen = ({ Navigation, route }) => {
  //좋아요
  const [liked, setLiked] = useState(BLACK.DEFAULT);
  const param = route.params;
  //좋아요 개수
  const [likedCounter, setLikedCounter] = useState(param.petInfo.likes);
  //좋아요 핸들러
  const LikeHandle = () => {
    if (liked === BLACK.DEFAULT) {
      setLiked(RED.DEFAULT);
      setLikedCounter(likedCounter + 1);
    } else if (liked === RED.DEFAULT) {
      setLiked(BLACK.DEFAULT);
      setLikedCounter(likedCounter - 1);
    }
  };

  return (
    <View style={styles.container}>
      {/* 작성자 */}
      <View style={styles.profile_container}>
        <Image
          source={require('../../../assets/pet_icon.png')}
          style={styles.profile}
        />
        <Text style={{ marginLeft: 10, fontSize: 16 }}>그로밋</Text>
      </View>
      {/* 사진 출력 영역 */}
      <View style={styles.photo_container}>
        <Image
          source={{
            uri: `http://43.200.8.47:8080/shared-images/lsyun1234@naver.com/downloadImage/${param.petInfo.pet.sharedPetId}.jpg`,
          }}
          style={{ width: '100%', height: 300 }}
        />
      </View>

      {/* 좋아요 버튼 */}
      <View style={styles.container2}>
        <View style={styles.like_container}>
          <TouchableOpacity onPress={LikeHandle}>
            <MaterialCommunityIcons
              name="cards-heart"
              size={25}
              color={liked}
            />
          </TouchableOpacity>
          <Text style={{ fontSize: 13, textAlignVertical: 'bottom' }}>
            {' '}
            좋아요 {likedCounter}개
          </Text>
        </View>
        <View style={styles.comment_container}>
          <Text style={styles.content}>{param.petInfo.memo}</Text>
          <Text style={styles.date}>{param.petInfo.date}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
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
  container2: {
    flex: 1,
    marginHorizontal: 20,
    marginTop: 30,
  },
  like_container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  comment_container: { marginTop: 10 },
  title: {
    fontSize: 18,
    fontWeight: 600,
    marginBottom: 5,
  },
  content: {
    fontSize: 17,
    marginBottom: 3,
  },
  date: { color: GRAY.DEFAULT },
});

export default DetailPhotoScreen;
