import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { GRAY, WHITE } from '../../../colors';

function ScheduleListScreen({ petName }) {
  const [responseData, setResponseData] = useState([]);
  const [executeArray, setExecuteArray] = useState([]);

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
                setExecuteArray(Array(response.data.length).fill(false));
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

  const toggleExecute = (index) => {
    const newExecuteArray = [...executeArray];
    newExecuteArray[index] = !newExecuteArray[index];
    setExecuteArray(newExecuteArray);
  };

  const renderItem = ({ item, index }) => (
    <TouchableOpacity style={styles.scheduleItem}>
      <TouchableOpacity onPress={() => toggleExecute(index)}>
        {executeArray[index] ? (
          <Image
            source={require('../../../assets/pet_icon.png')}
            style={styles.executor_profile}
          />
        ) : (
          <View style={styles.execute}></View>
        )}
      </TouchableOpacity>

      <View style={styles.container_detail}>
        <Text style={styles.details}>{item.schedule}</Text>
      </View>
      <View style={styles.container_time}>
        <Text style={styles.time}>{item.hm}</Text>
      </View>
      <View style={styles.container_executor}>
        <Text style={styles.executor}>수행자</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.container_row}>
        <TouchableOpacity>
          <Text style={styles.select_date}>◀ </Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.date}>2022-05-05</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.select_date}> ▶</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={responseData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        style={styles.schdule_container}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: WHITE,
  },
  container_row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  date: {
    fontSize: 20,
  },
  select_date: {
    fontSize: 22,
  },
  schdule_container: {
    flex: 1,
    width: '90%',
    marginLeft: 5,
    marginRight: 5,
    marginTop: 20,
  },
  scheduleItem: {
    width: 350,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    borderRadius: 30,
    backgroundColor: GRAY.LIGHTER,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  container_detail: {
    width: '40%',
    marginHorizontal: 10,
  },
  details: {
    fontSize: 20,
  },
  container_time: {
    flex: 1,
    width: '20%',
    alignItems: 'flex-end',
    //backgroundColor: BLACK,
    marginRight: 5,
  },
  time: {
    fontSize: 20,
    fontWeight: 500,
  },
  container_executor: {
    flex: 1,
    width: '10%',
    alignItems: 'flex-start',
    margin: 5,
    //backgroundColor: BLACK,
  },
  executor: {
    fontSize: 15,
  },
  executor_profile: {
    width: 30,
    height: 30,
    borderRadius: 25,
    overflow: 'hidden',
  },
  execute: {
    width: 30,
    height: 30,
    borderRadius: 25,
    backgroundColor: WHITE,
  },
});

export default ScheduleListScreen;
