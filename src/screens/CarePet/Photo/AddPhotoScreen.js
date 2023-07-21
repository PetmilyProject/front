import { Text, View, StyleSheet, TextInput, Button, Image } from 'react-native';
import ImagePickerComponent from '../../../components/ImagePicker';
import { CarePetRoutes } from '../../../navigations/routes';
import DatePicker from '../../../components/DatePicker';
import TimePicker from '../../../components/TimePicker';
import InputText from '../../../components/InputText';
import { GRAY } from '../../../colors';
import { useState } from 'react';
import SquareButton, { ColorTypes } from '../../../components/Button';

const AddphotoScreen = ({ navigation, route }) => {
  const [imgUrl, setImgUrl] = useState(null);

  const InsertUrl = (url) => {
    setImgUrl(url);
  };
  return (
    <View style={styles.container}>
      <View style={styles.container3}>
        {imgUrl === null ? (
          <View style={styles.photoBox}></View>
        ) : (
          <Image source={{ uri: imgUrl }} style={styles.image} />
        )}
        <View style={{ marginTop: -28, marginLeft: 300 }}>
          <ImagePickerComponent width={50} height={50} InsertUrl={InsertUrl} />
        </View>
        <View>
          <Text style={styles.title}>날짜</Text>
          <View style={styles.box}>
            <DatePicker />
          </View>
        </View>
        <InputText
          title="메모"
          placeholder={'선택사항'}
          onChangeText={(text) => setCharater(text.trim())}
        />
        <View style={styles.containerRow}>
          <SquareButton colorType={ColorTypes.YELLOW} text="등록하기" />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: 20,
  },
  container2: {
    flex: 1,
    paddingTop: 50,
    alignItems: 'center',
    width: '100%',
  },
  container3: {
    flex: 3,
    width: '100%',
    alignItems: 'center',
  },
  containerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoBox: {
    width: 350,
    height: 200,
    padding: 10,
    backgroundColor: GRAY.LIGHT,
  },
  image: {
    width: 350,
    height: 200,
    padding: 10,
  },
  box: {
    borderWidth: 1,
    width: 350,
    padding: 10,
    borderRadius: 10,
    borderColor: GRAY.DEFAULT,
  },

  memobox: {
    backgroundColor: '#d1d5db',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
    height: '10%',
    marginTop: 10,
    padding: 10,
  },
  title: {
    alignItems: 'flex-start',
    marginBottom: 5,
    fontSize: 16,
  },
  imagePicker: {
    marginTop: -20,
  },
});
export default AddphotoScreen;
