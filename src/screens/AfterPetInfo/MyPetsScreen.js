import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Button } from 'react-native-elements';

export default function MypetsScreen() {
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    fetch(
      'http://ec2-43-201-21-193.ap-northeast-2.compute.amazonaws.com:8080/users/fetchAll'
    )
      .then((response) => response.json())
      .then((data) => setUserData(data))
      .catch((error) => console.log(error));
  }, []);

  const handleImagePress = (userId) => {
    console.log(`Image for user ${userId} pressed`);
  };

  const handleButtonPress = (userId) => {
    console.log(`Button for user ${userId} pressed`);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={userData}
        renderItem={({ item }) => (
          <View style={styles.buttonContainer}>
            <View style={styles.row}>
              <TouchableOpacity onPress={() => handleImagePress(item.userId)}>
                <View style={styles.userImageContainer}>
                  <Image
                    source={{
                      uri: 'http://ec2-43-201-21-193.ap-northeast-2.compute.amazonaws.com:8080/downloadImage/dog1.jpg',
                    }}
                    resizeMode="contain"
                    style={styles.userImage}
                  />
                </View>
              </TouchableOpacity>
              <View style={styles.buttonContent}>
                <TouchableOpacity
                  onPress={() => handleButtonPress(item.userId)}
                >
                  <Button
                    key={item.userId}
                    title={`Name: ${
                      item.userName ? item.userName : 'Name not available'
                    }\nEmail: ${item.email}`}
                    buttonStyle={styles.button}
                    titleStyle={styles.buttonTitle}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
        keyExtractor={(item) => item.userId.toString()}
        //contentContainerStyle={[styles.contentContainer, { alignItems: 'center' }]}
        ListEmptyComponent={() => (
          <View style={styles.contentContainer}>
            <Text>No data available.</Text>
          </View>
        )}
        style={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 20,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    marginHorizontal: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 2,
    shadowOffset: {
      width: 1,
      height: 1,
    },
  },
  row: {
    flexDirection: 'row',
  },
  userImageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  userImage: {
    width: 80,
    height: 80,
  },
  buttonContent: {
    flex: 2,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#fff',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 0,
    height: 80,
    color: '#000', // 글자 색상 지정
  },
  buttonTitle: {
    fontSize: 16,
    color: '#000',
  },
  list: {
    flex: 1,
    width: '100%',
  },
});
