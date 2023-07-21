import { Image, Text, View, StyleSheet, Pressable } from 'react-native';
import { RED, GRAY, YELLOW } from '../../../colors';
import { AntDesign } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

const ViewPhotoScreen = () => {
  const [like, setLike] = useState(GRAY.DEFAULT);
  var likeColor = GRAY.DEFAULT;

  const LikeHandle = () => {
    if (like === GRAY.DEFAULT) {
      setLike(RED);
    } else if (like === RED) {
      setLike(GRAY.DEFAULT);
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.image_container}>
        <Image
          style={styles.pet_image}
          source={require('../../../assets/dog.jpg')}
        />
      </View>
      <View style={styles.info_container}>
        <Image
          source={require('../../../assets/user.jpg')}
          style={styles.user_imgae}
        />
        <Text style={{ paddingTop: 35, paddingLeft: 10, fontSize: 15 }}>
          작성
        </Text>
        <Text
          style={{
            paddingTop: 35,
            fontSize: 15,
            marginRight: 30,
            marginLeft: 190,

            color: GRAY.DEFAULT,
          }}
        >
          2023. 05. 23
        </Text>
      </View>
      <View
        style={{
          marginTop: 5,
          width: '100%',
          height: 1,
          backgroundColor: GRAY.DEFAULT,
        }}
      ></View>
      <View style={styles.memo_container}>
        <Text style={{ fontSize: 18 }}> 이월이가 자고있다.</Text>
      </View>
      <View style={styles.like_container}>
        <Pressable onPress={LikeHandle}>
          <MaterialCommunityIcons name="cards-heart" size={36} color={like} />
        </Pressable>
        <Pressable>
          <MaterialCommunityIcons
            name="download-circle"
            size={36}
            color={YELLOW.DEFAULT}
          />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  info_container: {
    flexDirection: 'row',
    paddingTop: 10,
    paddingLeft: 10,
  },
  memo_container: {
    padding: 20,
    height: 100,
  },
  like_container: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginRight: 10,
  },
  image_container: {
    width: '100%',
    height: 300,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pet_image: {
    width: '100%',
    height: '100%',
  },
  user_imgae: {
    width: 55,
    height: 55,
    borderRadius: 100,
  },
});
export default ViewPhotoScreen;
