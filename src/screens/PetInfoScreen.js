import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Header, Button } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import MypetsScreen from './AfterPetInfo/MyPetsScreen';
//import AddPetScreen from './AfterPetInfo/AddPetScreen';

export default function PetInfoScreen() {
  const [data, setData] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          'http://ec2-43-201-21-193.ap-northeast-2.compute.amazonaws.com:8080/users/fetchAll'
        );
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}></View>
      <View style={styles.buttonContainer}>
        <Button
          icon={<MaterialIcons name="add" size={24} color="black" />}
          onPress={() => console.log('Add button pressed')}
          containerStyle={{ marginRight: 10 }}
          buttonStyle={{ backgroundColor: 'white' }}
        />
        <Button
          icon={<MaterialIcons name="edit" size={24} color="black" />}
          onPress={() => console.log('Edit button pressed')}
          containerStyle={{ marginRight: 10 }}
          buttonStyle={{ backgroundColor: 'white' }}
        />
        <Button
          icon={<MaterialIcons name="delete" size={24} color="black" />}
          onPress={() => console.log('Delete button pressed')}
          buttonStyle={{ backgroundColor: 'white' }}
        />
      </View>
      <View style={styles.contentContainer}>
        {data ? <MypetsScreen /> : <AddPetScreen />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerContainer: {
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 10,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
