import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  RefreshControl,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { Entypo } from '@expo/vector-icons';
import { YELLOW } from '../../colors';
import { CommunityRoutes } from '../../navigations/routes';

const CommunityPhotoScreen = () => {
  const [myPhotoUrl, setMyPhotoUrl] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const url = `http://ec2-43-200-8-47.ap-northeast-2.compute.amazonaws.com:8080/communityImage/getAllImages`;

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const responseData = response.data;

      setMyPhotoUrl(responseData);
      setIsRefreshing(false);
    } catch (error) {
      console.log('Error fetching pet data:', error);
      setIsRefreshing(false);
    }
  };

  const gotoDetail = async (index) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const communityInfo = `http://ec2-43-200-8-47.ap-northeast-2.compute.amazonaws.com:8080/community/getAll`;

      const response = await axios.get(communityInfo, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const responseData = response.data;

      const communityIdFromURL = parseInt(
        myPhotoUrl[index].split('/').pop().split('.')[0]
      );

      const communityIds = responseData.map((item) => item.communityId);

      const matchedIndex = communityIds.indexOf(communityIdFromURL);

      if (matchedIndex !== -1) {
        const matchedCommunity = responseData[matchedIndex];
        navigation.navigate('CommunityDetailPhotoScreen', {
          communityinfo: {
            community_id: matchedCommunity.communityId,
            email: matchedCommunity.email,
            likes: matchedCommunity.likes,
            date: matchedCommunity.date,
            title: matchedCommunity.title,
            wrote: matchedCommunity.wrote,
          },
          detailUrl: myPhotoUrl[index],
        });
      }
    } catch (error) {
      console.log('Error navigating to detail:', error);
    }
  };

  const AddCommunityScreen = () => {
    navigation.navigate(CommunityRoutes.ADD_COMMUNITY);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchData();
  };

  return (
    <View style={styles.background}>
      <View style={styles.icon_style}>
        <TouchableOpacity onPress={AddCommunityScreen}>
          <Entypo name="circle-with-plus" size={40} color={YELLOW.DEFAULT} />
        </TouchableOpacity>
      </View>
      <View style={styles.separator} />
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
      >
        <View style={styles.container}>
          <FlatList
            data={myPhotoUrl}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                onPress={() => gotoDetail(index)}
                style={styles.photoList}
              >
                <Image source={{ uri: item }} style={styles.photoItem} />
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
    marginBottom: 10,
  },
  separator: {
    backgroundColor: 'gray',
    height: 1,
    width: '100%',
  },
  container: {
    width: '100%',
    alignItems: 'center',
  },
  photoList: {
    width: '47%',
    marginTop: '2%',
    marginLeft: '2%',
  },
  photoItem: {
    width: '80%',
    aspectRatio: 1,
    margin: 15,
  },
});

export default CommunityPhotoScreen;
