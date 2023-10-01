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
  const [myPhotoUrl, setMyPhotoUrl] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
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
      } catch (error) {
        console.log('Error fetching pet data:', error);
      }
    };

    fetchData();
  }, []);

  // const renderItem = ({ item }) => {
  //   return <Image source={{ uri: item }} style={styles.photoItem} />;
  // };

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
      <View style={styles.separator} />
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
