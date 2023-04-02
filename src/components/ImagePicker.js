import { Image, Pressable, TouchableOpacity } from 'react-native';
import { Text, View, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';

const ImagePickerComponent = () => {
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
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowEditing: false,
      quality: 1,
      aspect: [1, 1],
    });
    if (result.canceled) {
      setUpload(false);
      return null;
    } else {
      setImageUrl(result.assets[0].uri);
      setUpload(true);
    }
  };

  return (
    <View style={styles.addphotobox}>
      {upload ? (
        <TouchableOpacity onPress={uploadImage} style={styles.photo}>
          <Image source={{ uri: imageUrl }} style={styles.photo} />
        </TouchableOpacity>
      ) : (
        <Pressable onPress={uploadImage}>
          <Text>사진등록</Text>
          <TouchableOpacity onPress={uploadImage}>
            <MaterialCommunityIcons
              name="plus-circle-outline"
              size={50}
              color="black"
              margin={15}
            />
          </TouchableOpacity>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  addphotobox: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%',
    height: '70%',
  },
  photo: {
    flex: 1,
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
});

export default ImagePickerComponent;
