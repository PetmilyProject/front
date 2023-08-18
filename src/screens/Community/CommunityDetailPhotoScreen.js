import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  Pressable,
  ActivityIndicator,
  ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation, useNavigationState } from '@react-navigation/native';

const CommunityDetailPhotoScreen = (props) => {
  const params = props.route.params;
  const photoUrl = params.detailUrl;

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

          </View>
        </View>
        {/* 댓글 영역 */}
        <View style={styles.downside_style}>
          <View style={styles.comment_container}>

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
    height: 600
  },
  upside_style: {
    backgroundColor: 'white',
    width: '100%',
    height: 500
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