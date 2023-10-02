import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BLACK, GRAY, WHITE, YELLOW } from '../../../colors';
import DangerAlert from '../../../components/DangerAlert';

// 양육자 프로필 생성
const renderRearer = (name) => {
  return (
    <View style={styles.container_profile}>
      <Image
        style={styles.dogImage}
        source={require('../../../assets/user.jpg')}
      />
      <Text style={styles.nicname}>{name}</Text>
    </View>
  );
};

const RearerItem = ({ name }) => (
  <View style={styles.rearerItem}>{renderRearer(name)}</View>
);

const ListRearerScreen = ({ petName, petId }) => {
  const [visible, setVisible] = useState(false); // 초대 확인 모달 관리
  const [inviteName, setInviteName] = useState('');

  const [petLink, setPetLink] = useState(null);
  const [inviter, setInviter] = useState(null);

  const [allRearer, setAllRearer] = useState([]);
  const [mainRearer, setMainRearer] = useState(null);
  const [subRearer, setSubRearer] = useState([]);

  const fetchPetLink = async () => {
    try {
      const email = await AsyncStorage.getItem('email');

      // 특정 petLink
      const response = await axios.get(
        `http://ec2-43-200-8-47.ap-northeast-2.compute.amazonaws.com:8080/link/get/${email}/${petId}`
      );

      // 해당 계정에 속한 모든 양육자 불러오기
      const AllRearerResponse = await axios.get(
        `http://ec2-43-200-8-47.ap-northeast-2.compute.amazonaws.com:8080/link/rearer/${petId}`
      );

      if (response.status === 200) {
        setPetLink(response.data);
        setInviter(response.data.inviter);
        setAllRearer(AllRearerResponse.data);
      } else {
        console.error('펫 링크를 가져오는 데 실패했습니다');
      }
    } catch (error) {
      console.error('펫 링크를 가져오는 중 오류 발생:', error);
    }
  };

  useEffect(() => {
    fetchPetLink();
  }, []);

  useEffect(() => {
    handleMainRearer();
    console.log(allRearer);
  }, [allRearer]);

  const handleMainRearer = () => {
    const mainRearerCandidate = allRearer.find(
      (item) => item.owner === inviter
    );
    if (mainRearerCandidate) {
      setMainRearer(mainRearerCandidate);
      setSubRearer(allRearer.filter((item) => item.owner !== inviter));
    }
  };

  const handlePressOutside = () => {
    Keyboard.dismiss();
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <DangerAlert
          visible={visible}
          title={`${inviteName}` + ' 님을' + '\n' + '초대하시겠습니까?'}
          comment={'한 번 요청한 초대는 취소할 수 없습니다.'}
          leftText={'취소'}
          rightText={'초대'}
          onClose={() => setVisible(false)}
          onRight={() => {
            setVisible(false);
          }}
          leftBtnColor={GRAY.LIGHT}
          rightBtnColor={YELLOW.DEFAULT}
        />
        <View style={{ flex: 1, marginTop: 15 }}>
          <Text style={{ fontSize: 16, margin: 10, marginBottom: 15, flex: 1 }}>
            초대하기
          </Text>

          <View style={styles.container_invite}>
            <View style={{ flex: 0.7 }}>
              <TextInput
                borderRadius={30}
                style={{
                  marginLeft: 10,
                  marginRight: 10,
                  height: 40,
                  width: 250,
                  borderWidth: 1,
                  borderColor: 'gray',
                  paddingLeft: 20,
                }}
                onChangeText={(text) => setInviteName(text)}
                keyboardType="email-address"
                placeholder="예) petmily@gmail.com"
              />
            </View>
            <View
              borderRadius={30}
              style={{
                flex: 0.25,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: YELLOW.DEFAULT,
                height: 40,
              }}
            >
              <TouchableOpacity
                style={{
                  fontSize: 17,
                  color: WHITE,
                }}
                onPress={() => {
                  setVisible(true);
                }}
                paddingVertical={13}
              >
                <Text>초대</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.container_rearer}>
          <Text style={{ fontSize: 16, marginBottom: 10, margin: 10 }}>
            등록된 양육자
          </Text>
          <ScrollView style={styles.scrollView}>
            <View style={{ alignItems: 'flex-start' }}>
              {/* 주양육자 표시 */}
              <View style={{ alignItems: 'center' }}>
                <Image source={require('../../../assets/crown.png')} />
                {mainRearer && (
                  <View style={styles.rearerItem}>
                    {renderRearer(mainRearer.owner)}
                  </View>
                )}
              </View>
            </View>
            <View style={styles.rearerContainer}>
              {/* 부양육자 표시 */}
              {subRearer.map((item) => (
                <RearerItem key={item.linkId} name={item.owner} />
              ))}
            </View>
          </ScrollView>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, width: 385 },
  scrollView: {
    flex: 1,
    marginBottom: 10,
    marginHorizontal: 20,
  },
  container_invite: {
    flexDirection: 'row',
    marginBottom: 15,
    flex: 1,
  },
  container_rearer: {
    flex: 1,
  },
  rearerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  rearerItem: {
    width: '33.33%', // 3개씩 가로 배열을 위해 33.33%로 설정
    //padding: 5,
  },
  dogImage: {
    width: 95,
    height: 95,
    borderRadius: 50,
  },
  container_profile: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 120,
    //padding: 5,
  },
  nicname: {
    textAlign: 'center',
    marginTop: 10,
    fontSize: 17,
  },
});

export default ListRearerScreen;
