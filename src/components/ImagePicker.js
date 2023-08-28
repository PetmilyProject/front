import React, { useState } from 'react';
import { StyleSheet, View, Image, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import FormData from 'form-data';
import { TouchableOpacity } from 'react-native-gesture-handler';

export const ImagePickerComponent = ({ width, height, InsertUrl }) => {
  const [imageUrl, setImageUrl] = useState('');
  const [status, requestPermission] = ImagePicker.useMediaLibraryPermissions();

  const uploadImage = async () => {
    if (!status?.granted) {
      const permission = await requestPermission();
      if (!permission.granted) {
        return null;
      }
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (result.cancelled) {
      return null;
    } else {
      setImageUrl(result.uri); // 이미지 선택 결과의 URI를 설정
      InsertUrl(result.uri);

      // 서버에 요청 보내기
      const localUri = result.uri;
      const filename = localUri.split('/').pop();
      const match = /\.(\w+)$/.exec(filename ?? '');
      const type = match ? `image/${match[1]}` : `image`;
      const formData = new FormData();
      formData.append('image', { uri: localUri, name: filename, type });

      await axios({
        method: 'post',
        url: `http://ec2-43-200-8-47.ap-northeast-2.compute.amazonaws.com:8080/pet/${inviter}/uploadImage/${petid}`,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: formData,
      });
    }
  };

  const styles = StyleSheet.create({
    floatingButton: {
      width: width,
      height: height,
      alignItems: 'center',
      justifyContent: 'center',
      borderStyle: 'solid',
      borderRadius: 30,
      elevation: 8,
      backgroundColor: 'white',
      borderWidth: 1,
    },
  });

  return (
    <TouchableOpacity onPress={uploadImage}>
      <View style={styles.floatingButton}>
        <Ionicons
          style={{ alignItems: 'center', justifyContent: 'center' }}
          name="camera-outline"
          size={30}
          color="black"
        />
        {imageUrl !== '' && <Image source={{ uri: imageUrl }} />}
      </View>
    </TouchableOpacity>
  );
};

export default ImagePickerComponent;
