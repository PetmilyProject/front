import { StyleSheet, Pressable, TouchableOpacity, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { useContext, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { WHITE } from '../colors';
import axios from 'axios';
import FormData from 'form-data';
//import { ImageContext } from '../context/LoginContext';

export const ImagePickerComponent = ({ width, height, InsertUrl }) => {
  const [imageUrl, setImageUrl] = useState('');
  const [status, requestPermission] = ImagePicker.useMediaLibraryPermissions();
  const [upload, setUpload] = useState(false);

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
    if (result.canceled) {
      setUpload(false);
      return null;
    } else {
      setImageUrl(result.assets[0].uri);
      InsertUrl(result.assets[0].uri);
      setUpload(true);
    }

    // 서버에 요청 보내기
    const localUri = result.uri;
    const filename = localUri.split('/').pop();
    const match = /\.(\w+)$/.exec(filename ?? '');
    const type = match ? `image/${match[1]}` : `image`;
    const formData = new FormData();
    formData.append('image', { uri: localUri, name: filename, type });

    await axios({
      method: 'post',
      uri: `http://ec2-43-200-8-47.ap-northeast-2.compute.amazonaws.com:8080/pet/${inviter}/uploadImage/${petid}`,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: formData,
    });
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
      backgroundColor: WHITE,
      borderWidth: 1,
    },
  });

  return (
    <Pressable onPress={uploadImage}>
      <TouchableOpacity onPress={uploadImage} style={styles.floatingButton}>
        <Ionicons
          style={{ alignItems: 'center', justifyContent: 'center' }}
          name="camera-outline"
          size={30}
          color="black"
        />
        <Image source={{ uri: imageUrl }} />
      </TouchableOpacity>
    </Pressable>
  );
};

export default ImagePickerComponent;
