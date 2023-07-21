import { Image, Pressable, TouchableOpacity } from 'react-native';
import { Text, View, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';

import { useContext, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { WHITE } from '../colors';
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
      </TouchableOpacity>
    </Pressable>
  );
};

export default ImagePickerComponent;
