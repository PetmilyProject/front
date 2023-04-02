import { Text, View, StyleSheet, TextInput, Button } from 'react-native';
import DatePicker from '../../components/DatePicker';
import ImagePickerComponent from '../../components/ImagePicker';
import TimePicker from '../../components/TimePicker';

const AddphotoScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.container2}>
        <View style={styles.box}>
          <Text style={styles.title}>날짜</Text>
          <DatePicker />
        </View>
        <View style={styles.box}>
          <Text style={styles.title}>시간</Text>
          <TimePicker />
        </View>
      </View>

      <View style={styles.container3}>
        <ImagePickerComponent />
        <TextInput placeholder="메모" style={styles.memobox}></TextInput>
        <View style={styles.containerRow}>
          <Button style={styles.Button} title="등록"></Button>
          <Button title="취소"></Button>
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
  box: {
    flexDirection: 'row',
    margin: 10,
    borderStyle: 'solid',
    borderRadius: 10,
    borderWidth: 1,
    width: '70%',
    padding: 10,
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
    marginRight: 20,
  },
  Button: {},
});
export default AddphotoScreen;
