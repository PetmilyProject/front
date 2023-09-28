import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  Pressable,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation, useNavigationState } from '@react-navigation/native';
import { MaterialCommunityIcons, Entypo, Ionicons } from '@expo/vector-icons';
import { YELLOW } from '../../colors';
import { CommunityRoutes } from '../../navigations/routes';

const CommunityPhotoScreen = () => {
  let token;
  let email;
  const [myPhotoUrl, setMyPhotoUrl] = useState([]);
  const navigation = useNavigation();

  const getDataFunc = async () => {
    token = await AsyncStorage.getItem('token');
    email = await AsyncStorage.getItem('email');

    const photos = [
      'http://43.200.8.47:8080/communityImage/lsyun1234@naver.com/1000.jpg',
      'http://43.200.8.47:8080/communityImage/lsyun1234@naver.com/1001.jpg',
      'http://43.200.8.47:8080/communityImage/lsyun1234@naver.com/1002.jpg',
      'http://43.200.8.47:8080/communityImage/lsyun1234@naver.com/1003.jpg',
      'http://43.200.8.47:8080/communityImage/lsyun1234@naver.com/1004.jpg',
      'http://43.200.8.47:8080/communityImage/lsyun1234@naver.com/1005.jpg',
      'http://43.200.8.47:8080/communityImage/lsyun1234@naver.com/1006.jpg',
      'http://43.200.8.47:8080/communityImage/lsyun1234@naver.com/1007.jpg',
    ];
    setMyPhotoUrl(photos);
  };

  useEffect(() => {
    getDataFunc();
  }, []);

  const renderItem = ({ item }) => {
    return <Image source={{ uri: item }} style={styles.photoItem} />;
  };

  const gotoDetail = (index) => {
    navigation.navigate('CommunityDetailPhotoScreen', {
      detailUrl: myPhotoUrl[index],
    });
  };

  const AddCommunityScreen = () => {
    navigation.navigate(CommunityRoutes.ADD_COMMUNITY);
  };

  return (
    <View style={styles.background}>
      <View style={styles.icon_style}>
        <TouchableOpacity onPress={AddCommunityScreen}>
          <Entypo name="circle-with-plus" size={40} color={YELLOW.DEFAULT} />
        </TouchableOpacity>
      </View>
      <ScrollView>
        <View style={styles.container}>
          <FlatList
            data={myPhotoUrl}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <TouchableOpacity 
                onPress={() => gotoDetail(index)}
                style={styles.photoList}
              >
                <Image
                  source={{ uri: item }}
                  style={styles.photoItem}
                />
              </TouchableOpacity>
            )}
            numColumns={2}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    backgroundColor: 'white',
    height: '100%',
  },
  icon_style: {
    alignItems: 'flex-end',
    marginRight: 20,
  },
  container: {
    width: '100%',
    alignItems: 'center',
    //padding: '5%',
  },
  photoList: {
    width: '47%',
    marginTop: '2%',
    marginLeft: '2%'
  },
  photoItem: {
    width: '60%',
    aspectRatio: 1,
    margin: 5,
  },
});

export default CommunityPhotoScreen;
