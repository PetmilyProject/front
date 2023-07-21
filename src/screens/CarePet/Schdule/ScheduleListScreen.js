import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

function ScheduleListScreen({ petName }) {
  const [responseData, setResponseData] = useState([]);

  useEffect(() => {
    AsyncStorage.getItem('email')
      .then((myEmail) => {
        AsyncStorage.getItem('token')
          .then((token) => {
            axios
              .get(
                `http://ec2-43-200-8-47.ap-northeast-2.compute.amazonaws.com:8080/schedule/${myEmail}/${petName}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              )
              .then((response) => {
                setResponseData(response.data);
              })
              .catch((error) => {
                console.error(error);
              });
          })
          .catch((error) => {
            console.error(error);
          });
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.scheduleItem}>
      <Text style={styles.details}>{item.schedule}</Text>
      <Text style={styles.time}>{item.hm}</Text>
    </TouchableOpacity>
  );

  return (
    <View>
      <FlatList
        data={responseData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        style={styles.container}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
  },
  scheduleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  details: {
    fontSize: 18,
  },
  time: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 120,
  },
});

export default ScheduleListScreen;
