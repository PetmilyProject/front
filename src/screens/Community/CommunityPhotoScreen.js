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
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation, useNavigationState } from '@react-navigation/native';
import { MaterialCommunityIcons, Entypo, Ionicons } from '@expo/vector-icons';
import { YELLOW } from '../../colors';

const CommunityPhotoScreen = () => {
  let token;
  let email;
  const [myPhotoUrl, setMyPhotoUrl] = useState([]);
  const navigation = useNavigation();

  const getDataFunc = async () => {
    token = await AsyncStorage.getItem('token');
    email = await AsyncStorage.getItem('email');

    const photos = [
      'https://i.ibb.co/fdyq1Qt/Screenshot-20230818-135718-Gallery.jpg',
      'https://i.ibb.co/yBMVMVG/Screenshot-20230818-135819-Gallery.jpg',
      'https://i.ibb.co/7WmvXKJ/20230816-153852.jpg',
      'https://i.ibb.co/6nkfSnw/Screenshot-20230818-150944-Gallery.jpg',
      'https://i.ibb.co/GF71qkv/Screenshot-20230818-151000-Gallery.jpg',
      'https://i.ibb.co/rMvRtG4/Screenshot-20230818-151024-Gallery.jpg',
      'https://i.ibb.co/WzNgbtY/Screenshot-20230818-151030-Gallery.jpg',
      'https://i.ibb.co/ZMDpfmx/Screenshot-20230818-151041-Gallery.jpg',
      'https://i.ibb.co/SdFzcC7/Screenshot-20230818-151046-Gallery.jpg'
    ];
    setMyPhotoUrl(photos);
  }

  useEffect(() => {
    getDataFunc();
  }, []);

  const renderItem = ({ item }) => {
    return (
      <Image
        source={{ uri: item }}
        style={styles.photoItem}
      />
    );
  };

  const gotoDetail = (index) => {
    //console.log(myPhotoUrl[index]);
    navigation.navigate('CommunityDetailPhotoScreen', {
      detailUrl: myPhotoUrl[index]
    });
  }

  return (
    <View style={styles.background}>
      <View style={styles.icon_style}>
        <TouchableOpacity>
          <Entypo 
            name="circle-with-plus" 
            size={40} 
            color={YELLOW.DEFAULT} 
          />
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
    height: '100%'
  },
  icon_style: {
    alignItems: 'flex-end',
    marginRight: 20
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
    width: '100%',
    height: 150,
  },
});

export default CommunityPhotoScreen;