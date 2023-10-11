import { Image } from 'react-native';
import { View, StyleSheet, Text } from 'react-native';
import { GRAY, RED, WHITE } from '../../../colors';
import Button2 from '../../../components/Button2';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { CarePetRoutes } from '../../../navigations/routes';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DetailRearerScreen = ({ route }) => {
  const [petLink, setPetLink] = useState(null);
  const [email, setEmail] = useState('');
  const [isInviter, setIsInviter] = useState(false);
  const [deleteInviter, setDeleteInviter] = useState(false);

  const params = route.params;
  const owner = route.params.owner;
  const ownerName = route.params.ownerName;
  const petId = route.params.petId;
  console.log(isInviter);

  console.log('owner', owner, 'petId', petId);

  const navigation = useNavigation();

  useEffect(() => {
    fetchLinkedPet();
  }, []);
  useEffect(() => {}, [petLink]);

  //해당 양육자 petLink 받아오기
  const fetchLinkedPet = async () => {
    try {
      const email = await AsyncStorage.getItem('email');
      setEmail(email);
      const response = await axios.get(
        `http://ec2-43-200-8-47.ap-northeast-2.compute.amazonaws.com:8080/link/get/${owner}/${petId}`
      );
      if (response.status === 200) {
        const linkedPet = response.data; // 이 변수를 사용하여 특정 PetLink 데이터를 얻을 수 있음
        if (response.data.inviter === email) {
          setIsInviter(true);
        }
        if (owner === response.data.inviter) {
          setDeleteInviter(true);
        }
        setPetLink(linkedPet);

        // console.log('특정 PetLink 데이터:', linkedPet.linkId, '사용자:', email);
      } else {
        console.log('PetLink를 가져오는데 실패했습니다.');
      }
    } catch (error) {
      console.error('PetLink를 가져오는 중 오류 발생:', error);
    }
  };

  //양육자 삭제 함수
  const deleteRearer = async () => {
    if (isInviter === true) {
      if (owner !== petLink.inviter) {
        try {
          const response = await axios.delete(
            `http://ec2-43-200-8-47.ap-northeast-2.compute.amazonaws.com:8080/link/delete/${petLink.linkId}`
          );

          if (response.status === 200) {
            navigation.goBack();
            console.log('양육자 삭제 성공');
          } else {
            console.log('양육자 삭제에 실패했습니다.');
          }
        } catch (error) {
          console.error('양육자 삭제 중 오류 발생:', error);
        }
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          style={styles.dogImage}
          source={{
            uri: `http://ec2-43-200-8-47.ap-northeast-2.compute.amazonaws.com:8080/profile/get/${owner}/${owner}.jpg`,
          }}
        />
      </View>
      <View
        style={{
          alignItems: 'center',
        }}
      >
        <Text style={{ fontSize: 20, marginBottom: 10 }}>{ownerName}</Text>
        <Text>{owner}</Text>
      </View>
      <View style={{ marginTop: 70 }}>
        {deleteInviter ? (
          <View></View>
        ) : isInviter ? (
          <Button2
            backgrouncolor={RED.DEFAULT}
            color={WHITE}
            text={'양육자 삭제'}
            onPress={() => {
              deleteRearer();
            }}
            width={350}
          />
        ) : (
          <Button2
            backgrouncolor={GRAY.DEFAULT}
            color={WHITE}
            text={'양육자 삭제'}
            onPress={() => {}}
            width={350}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: WHITE,
    paddingTop: 50,
  },
  imageContainer: {
    marginBottom: 20,
    marginTop: 20,
  },
  dogImage: {
    width: 150,
    height: 150,
    borderRadius: 100,
  },
});

export default DetailRearerScreen;
