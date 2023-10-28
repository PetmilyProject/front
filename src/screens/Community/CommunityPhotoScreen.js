import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  RefreshControl,
  TouchableOpacity,
  Text,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { Entypo } from '@expo/vector-icons';
import { YELLOW } from '../../colors';
import { CommunityRoutes } from '../../navigations/routes';

const CommunityPhotoScreen = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [topicData, setTopicData] = useState([]);
  const navigation = useNavigation();
  const [sortedPhotoUrl, setSortedPhotoUrl] = useState([]);
  const [titleOfPost, setTitleOfPost] = useState([]);

  useEffect(() => {
    fetchData();
    getTopic();
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

      const sorted = responseData.sort((a, b) => {
        const numA = parseInt(a.split('/')[5].slice(0, -4), 10);
        const numB = parseInt(b.split('/')[5].slice(0, -4), 10);
        return numB - numA;
      });
      setSortedPhotoUrl(sorted);

      let tmpTitle = [];

      for (let i = 0; i < sorted.length; i++) {
        const num = sorted[i].split('/')[5].slice(0, -4);
        const tmp = await axios.get(
          `http://43.200.8.47:8080/community/get/${num}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        tmpTitle.push(tmp.data.title);
      }

      setTitleOfPost(tmpTitle);
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
        sortedPhotoUrl[index].split('/').pop().split('.')[0]
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
          detailUrl: sortedPhotoUrl[index],
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

  const getTopic = async () => {
    const email = await AsyncStorage.getItem('email');
    const token = await AsyncStorage.getItem('token');
    const getData = await axios.get(
      'http://43.200.8.47:8080/community/getAll',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    let sortedData = getData.data.sort();

    setTopicData(getData.data);
  };

  return (
    <View style={styles.background}>
      <View style={styles.icon_style}>
        <TouchableOpacity onPress={AddCommunityScreen}>
          <Entypo name="circle-with-plus" size={40} color={YELLOW.DEFAULT} />
        </TouchableOpacity>
      </View>
      <View style={styles.separator} />
      <FlatList
        data={sortedPhotoUrl}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() => gotoDetail(index)}
            style={styles.photoList}
          >
            <View style={{ alignItems: 'center' }}>
              <Image
                source={{ uri: item + '?cache=' + Math.random() }}
                style={styles.photoItem}
              />
            </View>
            <Text style={{ marginTop: 10, marginLeft: 10, fontSize: 16 }}>
              {titleOfPost[index]}
            </Text>
          </TouchableOpacity>
        )}
        numColumns={2}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
      />
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
    backgroundColor: 'lightgray',
    height: 1,
    width: '100%',
  },
  photoList: {
    width: '50%',
    marginTop: '10%',
  },
  photoItem: {
    width: '90%',
    aspectRatio: 1,
  },
});

export default CommunityPhotoScreen;
