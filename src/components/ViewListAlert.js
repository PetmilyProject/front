import {
  View,
  StyleSheet,
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import PropTypes from 'prop-types';
import { BLACK, GRAY, WHITE, YELLOW } from '../colors';
import React, { useState } from 'react'; // Import React and useState
import { Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useEffect } from 'react';
import { TextInput } from 'react-native-gesture-handler';
import { Button } from 'react-native-elements';

const ViewListAlert = ({
  visible,
  title,
  comment,
  subComment,
  leftText,
  onClose,
  leftBtnColor,
  scrollViewName,
}) => {
  const deleteInvitation = async (receiver, petId) => {
    const email = await AsyncStorage.getItem('email');
    const token = await AsyncStorage.getItem('token');
    const card = await axios.delete(`http://43.200.8.47:8080/invitation/delete/${email}/${receiver}/${petId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    console.log(`http://43.200.8.47:8080/invitation/delete/${email}/${receiver}/${petId}에 삭제 요청. 메시지 : `, card.data);
  }

  const [items, setItems] = useState([]);
  const [token, setToken] = useState([]);
  const [email, setEmail] = useState('');
  const [myPets, setMyPets] = useState([]);
  const [receivedPet, setReceivedPet] = useState([]);

  const findPet = async () => {
    setItems([]);
    const tmpEmail = await AsyncStorage.getItem('email');

    setEmail(tmpEmail);

    const tmpToken = await AsyncStorage.getItem('token');

    setToken(tmpToken);

    setMyPets([]);
    const getPets = await axios.get(
      `http://43.200.8.47:8080/pet/get-all/${email}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setItems([]);
    const getInvitations = await axios.get(
      `http://43.200.8.47:8080/invitation/get/${email}`
    )
    setMyPets(getPets.data);
    setItems(getInvitations.data);

    //console.log(getInvitations.data);
  };
  
  const getInvitationCard = async () => {
    setReceivedPet([]); 
    const petPromises = [];
  
    for (const i of items) {
      const petInvitation = axios.get(`http://43.200.8.47:8080/pet/get-pet/${i.inviter}/${i.petId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      petPromises.push(petInvitation);
    }
  
    try {
      const petResponses = await Promise.all(petPromises);
      const petData = petResponses.map((response) => response.data);
      setReceivedPet(petData);
    } catch (error) {
      console.error(`Error fetching pet data: ${error}`);
    }
  };
  
  const acceptPetLink = async (inviter, petId) => {
    const email = await AsyncStorage.getItem('email');
    const token = await AsyncStorage.getItem('token');
    const petLinkUrl = `http://43.200.8.47:8080/link/post/${email}/${inviter}/${petId}`;
    const petLinkResponse = await axios.post(petLinkUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log(`${petLinkUrl}에 등록 요청. 메시지 : `, petLinkResponse.data);
    
    const deleteUrl = `http://43.200.8.47:8080/invitation/delete/${inviter}/${email}/${petId}`;
    const deleteResponse = await axios.delete(deleteUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log(`${deleteUrl}에 삭제 요청. 기등록된 초대 요청 삭제. 메시지 : `, deleteResponse.data);

    await findPet();
  }

  const declinePetLink = async (inviter, petId) => {
    const email = await AsyncStorage.getItem('email');
    const token = await AsyncStorage.getItem('token');
    const deleteUrl = `http://43.200.8.47:8080/invitation/delete/${inviter}/${email}/${petId}`;
    const deleteResponse = await axios.delete(deleteUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log(`${deleteUrl}에 삭제 요청. 기등록된 초대 요청 삭제. 메시지 : `, deleteResponse.data);

    await findPet();
  }
  
  const Item = (invitationCard) => {
    return (
      <View style={styles.container_Item}>
        <Image
          source={{ 
            uri: `http://43.200.8.47:8080/pet/${invitationCard.item.inviter}/downloadImage/${invitationCard.item.id}.jpg`
          }}
          style={styles.user_profile}
          />
        <Text style={styles.user_name}>{invitationCard.item.petName}</Text>
        <TouchableOpacity
          onPress={() => {
            console.log('승인');
            acceptPetLink(invitationCard.item.inviter, invitationCard.item.id);
          }}
          style={styles.button1_Item}
          >
          <Text>승인</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            console.log('거절');
            declinePetLink(invitationCard.item.inviter, invitationCard.item.id)
          }}
          style={styles.button2_Item}
          >
          <Text>거절</Text>
        </TouchableOpacity>
      </View>
    );
  };
  
  useEffect(() => {
    const fetchData = async () => {
      await findPet();
    };

    fetchData();
  }, [email, token]);

  useEffect(() => {
    const fetchInvitations = async () => {
      await getInvitationCard();
    };

    fetchInvitations();
  }, [items]);

  return (
    <Modal
      style={styles.container}
      visible={visible}
      transparent={true}
      animationType={'fade'}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <Pressable onPress={onClose} style={styles.background}></Pressable>
        <View style={styles.alert}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.comment}>{comment}</Text>
          <Text style={styles.comment2}>{subComment}</Text>
          {/* <Text style={styles.scrollViewName}>{startInvitation}</Text>
          <ScrollView style={styles.ScrollView}>
            {myPets.map((item) => (
              <InvitationCard item={item} />
            ))}
          </ScrollView> */}
          <Text style={styles.scrollViewName}>{scrollViewName}</Text>
          <ScrollView style={styles.ScrollView}>
            {receivedPet.map((item) => (
              <Item key={item} item={item} />
            ))}
          </ScrollView>

          <View style={styles.container_row}>
            <TouchableOpacity onPress={onClose}>
              <View
                style={[styles.button1, { backgroundColor: `${leftBtnColor}` }]}
              >
                <Text>{leftText}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

ViewListAlert.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  alert: {
    backgroundColor: WHITE,
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingBottom: 20,
    marginTop: 0,
    width: 330,
    height: 450,
    borderRadius: 20,
  },
  container_row: {
    flexDirection: 'row',
  },
  title: {
    fontSize: 20,
    marginTop: 25,
  },
  comment: {
    color: GRAY.DEFAULT,
    fontSize: 14,
    marginTop: 20,
  },
  comment2: {
    color: GRAY.DEFAULT,
    fontSize: 12,
    marginTop: 3,
    marginBottom: 18,
  },
  scrollViewName: {
    flex: 0.1,
    width: 270,
    marginBottom: 10,
    paddingBottom: 10,
    alignItems: 'flex-start',
  },
  ScrollView: {
    flex: 1,
    height: 100,
    width: 270,
    marginBottom: 20,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: BLACK,
    opacity: 0.3,
  },
  button1: {
    width: 250,
    height: 40,
    paddingHorizontal: 3,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
  },

  container_Item: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    width: 510,
    paddingHorizontal: 5,
    marginBottom: 10,
  },
  button1_Item: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
    height: 25,
    backgroundColor: YELLOW.DEFAULT,
    borderRadius: 20,
    marginHorizontal: 2,
  },
  button2_Item: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
    height: 25,
    backgroundColor: GRAY.LIGHT,
    borderRadius: 20,
    marginHorizontal: 2,
  },
  user_profile: {
    width: 40,
    height: 40,
    borderRadius: 25,
    overflow: 'hidden',
    marginRight: 10,
  },
  user_name: {
    width: 40
  },
});

export default ViewListAlert;
