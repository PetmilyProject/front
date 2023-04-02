import { useNavigation } from '@react-navigation/native';
import { Button, StyleSheet, Text, View } from 'react-native';
import { AuthRoutes } from '../navigations/routes';
import Input, {
  InputTypes,
  KeyboardTypes,
  ReturnKeyTypes,
} from '../components/Input';
import Input2, {
  InputTypes2,
  KeyboardTypes2,
  ReturnKeyTypes2,
} from '../components/Input2';
import { useState } from 'react';
import { BLACK } from '../colors';
import ImagePickerComponent from '../components/ImagePicker';

const SignInScreen = () => {
  const navigation = useNavigation();

  const [petImg, setPetImg] = useState('');
  const [petName, setPetName] = useState('');
  const [petAge, setPetAge] = useState('');
  const [petInfo, setPetInfo] = useState('');

  const handleRegister = () => {
    // handle register logic here
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          width: '100%',
          marginBottom: 15,
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1,
        }}
      >
        <Text style={styles.heading}>펫 등록</Text>
        <ImagePickerComponent />
      </View>
      <Input2
        styles={{
          container: { marginBottom: 20, paddingHorizontal: 20 },
          input: { borderWidth: 1 },
        }}
        value={petName}
        onChangeText={(text) => setPetName(text.trim())}
        inputType2={InputTypes2.NAME}
        returnKeyType={ReturnKeyTypes2.NEXT}
        placeholder="Pet Name"
      />
      <Input2
        styles={{
          container: { marginBottom: 20, paddingHorizontal: 20 },
          input: { borderWidth: 1 },
        }}
        value={petAge}
        onChangeText={(text) => setPetAge(text.trim())}
        inputType2={InputTypes2.AGE}
        returnKeyType={ReturnKeyTypes2.NEXT}
        placeholder="Pet Age"
        keyboardType={KeyboardTypes2.NUMERIC}
      />
      <Input2
        styles={{
          container: { marginBottom: 20, paddingHorizontal: 20 },
          input: { borderWidth: 1 },
        }}
        value={petInfo}
        onChangeText={(text) => setPetInfo(text.trim())}
        inputType2={InputTypes2.INFO}
        returnKeyType={ReturnKeyTypes2.DONE}
        placeholder="Pet Info"
        multiline={true}
        numberOfLines={5}
      />
      <View style={styles.buttonContainer}>
        <Button
          title="Register"
          color={BLACK}
          style={buttonStyles.container}
          onPress={handleRegister}
        />
        <Button
          title="Cancel"
          color={BLACK}
          style={[buttonStyles.container, { marginLeft: 10 }]}
          onPress={() => navigation.goBack()}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    backgroundColor: '#fff',
    width: '100%',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
    width: '100%',
    paddingHorizontal: 20,
  },
});

const buttonStyles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 20,
    marginTop: 10,
  },
  button: {
    borderRadius: 8,
  },
});

export default SignInScreen;
