import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  Keyboard,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
  useWindowDimensions,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BLACK, GRAY, WHITE, YELLOW } from '../../../colors';
import DangerAlert from '../../../components/DangerAlert';
import { useNavigation } from '@react-navigation/native';
import { CarePetRoutes } from '../../../navigations/routes';
import SingleButtonAlert from '../../../components/SingleButtonAlert';
//초대하기
const giveInvitation = async (receiver, petId) => {
  const email = await AsyncStorage.getItem('email');
  const token = await AsyncStorage.getItem('token');
  const card = await axios.post(
    `http://43.200.8.47:8080/invitation/post/${email}/${receiver}/${petId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  console.log(
    `http://43.200.8.47:8080/invitation/post/${email}/${receiver}/${petId}에 등록 요청. 메시지 : `,
    card.data
  );
};

const ListRearerScreen = ({ petName, petId }) => {
  const window = useWindowDimensions();

  const [visible, setVisible] = useState(false); // 초대 확인 모달 관리
  const [inviteName, setInviteName] = useState('');

  //기존에 있는 양육자인지 판단 모달
  const [checkVisible, setCheckVisible] = useState(false);

  const [petLink, setPetLink] = useState(null);
  const [inviter, setInviter] = useState(null);

  const [allRearer, setAllRearer] = useState([]);
  const [mainRearer, setMainRearer] = useState(null);
  const [subRearer, setSubRearer] = useState([]);
  const [email, setEmail] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const navigation = useNavigation();

  //기존에 있는 양육자인지 판단
  const handleCheckInvitation = () => {
    if (inviteName && allRearer.some((rearer) => rearer.owner === inviteName)) {
      console.log(`InviteName ${inviteName} already exists in allRearer`);
      setCheckVisible(true);
    } else {
      // If inviteName is not in allRearer, proceed with the invitation
      giveInvitation(inviteName, petId);
    }
  };

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchPetLink().then(() => setIsRefreshing(false));
  };

  // 양육자 프로필 생성
  const renderRearer = (email) => {
    return (
      <View style={styles.container_profile}>
        <TouchableOpacity onPress={() => handleDetailRearer(email)}>
          <Image
            source={{
              uri: `http://ec2-43-200-8-47.ap-northeast-2.compute.amazonaws.com:8080/profile/get/${email.owner}/${email.owner}.jpg`,
            }}
            style={styles.dogImage}
          />
          <Text style={styles.nicname}>{email.ownerName}</Text>
        </TouchableOpacity>
      </View>
    );
  };
  //양육자 상세 정보 navigation
  const handleDetailRearer = (email) => {
    navigation.navigate(CarePetRoutes.DETAIL_REARER, {
      ownerName: email.ownerName,
      owner: email.owner,
      petId: petId,
    });
  };
  //부 양육자 프로필 랜더링
  const RearerItem = ({ owner }) => {
    return <View style={styles.rearerItem}>{renderRearer(owner)}</View>;
  };

  const fetchPetLink = async () => {
    try {
      const email = await AsyncStorage.getItem('email');
      setEmail(email);

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
    handleMainRearer();
  };

  useEffect(() => {
    fetchPetLink();
  }, []);

  useEffect(() => {
    // console.log(allRearer);
    handleMainRearer();
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

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      width: window.width,
    },
    scrollView: {
      flex: 1,
      marginBottom: 10,
      marginHorizontal: window.width * 0.04,
    },
    container_invite: {
      flexDirection: 'row',
      marginBottom: window.height * 0.015,
      flex: 1,
    },
    container_rearer: {
      flex: 1,
    },
    rearerContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: window.height * 0.01,
    },
    rearerItem: {
      width: window.width * 0.3,
    },
    dogImage: {
      width: window.width * 0.25,
      height: window.width * 0.25,
      borderRadius: window.width * 0.125,
    },
    container_profile: {
      justifyContent: 'center',
      alignItems: 'center',
      width: window.width * 0.3,
      marginVertical: window.height * 0.01,
    },
    nicname: {
      textAlign: 'center',
      marginTop: window.height * 0.009,
      fontSize: 17,
    },
  });

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.container}>
        <SingleButtonAlert
          visible={checkVisible}
          title={'초대 불가'}
          comment={'이미 존재하는 양육자 입니다.'}
          BtnText={'닫기'}
          onClose={() => {
            setCheckVisible(false);
            setInviteName('');
          }}
          BtnColor={YELLOW.DEFAULT}
        />
        <DangerAlert
          visible={visible}
          title={`${inviteName}` + ' 님을' + '\n' + '초대하시겠습니까?'}
          comment={'한 번 요청한 초대는 취소할 수 없습니다.'}
          leftText={'취소'}
          rightText={'초대'}
          onClose={() => setVisible(false)}
          onRight={() => {
            setVisible(false);
            setInviteName('');
            handleCheckInvitation();
          }}
          leftBtnColor={GRAY.LIGHT}
          rightBtnColor={YELLOW.DEFAULT}
        />
        <View style={{ flex: 1, marginTop: window.height * 0.03 }}>
          {inviter !== email ? (
            <View></View>
          ) : (
            <>
              <Text
                style={{
                  fontSize: 16,
                  margin: window.width * 0.05,
                  marginBottom: window.height * 0.015,
                  flex: 1,
                }}
              >
                초대하기
              </Text>

              <View style={styles.container_invite}>
                <View style={{ flex: 0.7 }}>
                  <TextInput
                    borderRadius={30}
                    style={{
                      marginLeft: window.width * 0.05,
                      marginRight: window.width * 0.05,
                      height: window.height * 0.05,
                      width: window.width * 0.7,
                      borderWidth: 1,
                      borderColor: 'gray',
                      paddingLeft: window.width * 0.05,
                      // marginLeft: 10,
                      // marginRight: 10,
                      // height: 40,
                      // width: 250,
                      // borderWidth: 0,
                      // backgroundColor: GRAY.BRIGHT,
                      // paddingLeft: 20,
                    }}
                    onChangeText={(text) => setInviteName(text)}
                    keyboardType="email-address"
                    placeholder="예) petmily@gmail.com"
                  >
                    {inviteName}
                  </TextInput>
                </View>

                <View
                  borderRadius={30}
                  style={{
                    flex: 0.25,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: YELLOW.DEFAULT,
                    height: window.height * 0.05,
                  }}
                >
                  <TouchableOpacity
                    style={{
                      fontSize: 17,
                    }}
                    onPress={() => {
                      setVisible(true);
                    }}
                    paddingVertical={window.height * 0.02}
                  >
                    <Text>초대</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </>
          )}
        </View>

        <View style={styles.container_rearer}>
          <Text
            style={{
              fontSize: 16,
              marginBottom: window.height * 0.01,
              margin: window.width * 0.05,
            }}
          >
            등록된 양육자
          </Text>
          <ScrollView style={styles.scrollView}>
            <View style={{ alignItems: 'flex-start' }}>
              <View style={{ alignItems: 'center' }}>
                <Image
                  style={{ marginBottom: -9 }}
                  source={require('../../../assets/crown.png')}
                />
                {mainRearer && (
                  <View style={styles.rearerItem}>
                    {renderRearer(mainRearer)}
                  </View>
                )}
              </View>
            </View>
            <View style={styles.rearerContainer}>
              {subRearer.map((item) => (
                <RearerItem key={item.linkId} owner={item} />
              ))}
            </View>
          </ScrollView>
        </View>
      </View>
    </ScrollView>
  );
};

export default ListRearerScreen;
