import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  Pressable,
  ActivityIndicator,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation, useNavigationState } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { CarePetRoutes } from '../../../navigations/routes';

const PhotoModal = (params) => {
  const [isConfirmingDeletion, setIsConfirmingDeletion] = useState(false);

  const modalActive = params.modalActive;
  const onClose = params.onClose;
  const photoId = params.photoId;
  const email = params.email;
  const writerEmail = params.writerEmail;
  const photoUrl = params.photoUrl;
  const title = params.title;
  const wrote = params.wrote;
  const date = params.date;
  const petId = params.petId;
  console.log(petId);

  const navigation = useNavigation();

  //<----------------------------------------삭제--------------------------------------------------->
  const handleDeleteClick = () => {
    if (writerEmail === email) {
      setIsConfirmingDeletion(true); // '삭제' 버튼 클릭 시 상태 업데이트
    } else {
      onClose();
    }
  };
  const handleCancelDelete = () => {
    setIsConfirmingDeletion(false); // '아니오' 클릭 시 상태 업데이트
  };
  //이미지 삭제
  const performImageDelete = () => {
    AsyncStorage.getItem('token').then((token) => {
      axios
        .delete(
          `http://ec2-43-200-8-47.ap-northeast-2.compute.amazonaws.com:8080/shared-images/${petId}/deleteImage/${email}/${photoId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          if (response.status === 204) {
            console.log('이미지 삭제 성공:', response);
          } else {
            // 다른 상태 코드에 대한 처리 추가
            console.error('이미지 삭제 실패:', response);
          }
        })
        .catch((error) => {
          // 삭제 요청 에러 처리
          console.error('이미지 삭제 요청 에러:', error);
        });
    });
  };
  //게시글 삭제
  const performDelete = () => {
    AsyncStorage.getItem('token').then((token) => {
      // console.log(community_id);
      axios
        .delete(
          `http://ec2-43-200-8-47.ap-northeast-2.compute.amazonaws.com:8080/sharedPetGallery/${email}/delete/${photoId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          if (response.status === 204) {
            console.log('게시글 삭제 성공:', response);
          } else {
            // 다른 상태 코드에 대한 처리 추가
            console.error('게시글 삭제 실패:', response);
          }
        })
        .catch((error) => {
          // 삭제 요청 에러 처리
          console.error('게시글 삭제 요청 에러:', error);
        });
    });
  };
  //모든 댓글 삭제( 500 오류남,,, 수정 필요)
  // const performCommentDelete = () => {
  //   AsyncStorage.getItem('token').then((token) => {
  //     // console.log(community_id);
  //     axios
  //       .delete(
  //         `http://ec2-43-200-8-47.ap-northeast-2.compute.amazonaws.com:8080/comment/deleteByCommunityId/${community_id}`,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //           },
  //         }
  //       )
  //       .then((response) => {
  //         if (response.status === 204) {
  //           // 성공적으로 삭제되었습니다.
  //           // 원하는 작업 수행 가능
  //           console.log('모든 댓글 삭제 성공:', response);
  //         } else {
  //           // 다른 상태 코드에 대한 처리 추가
  //           console.error('모든 댓글 삭제 실패:', response);
  //         }
  //       })
  //       .catch((error) => {
  //         // 삭제 요청 에러 처리
  //         console.error('모든 댓글 삭제 요청 에러:', error);
  //       });
  //   });
  // };

  //삭제 최종확인
  const handleConfirmDelete = () => {
    performImageDelete();
    performDelete();
    onClose();
  };
  //<------------------------------------------수정----------------------------------------------->
  const handleUpdate = () => {
    if (writerEmail === email) {
      navigation.navigate(CarePetRoutes.UPDATE_PHOTO, {
        photoId,
        writerEmail,
        photoUrl,
        title,
        wrote,
        date,
        petId,
      });
      onClose();
    } else {
      onClose();
    }
  };

  return (
    <Modal visible={modalActive} animationType="none" transparent={true}>
      <TouchableWithoutFeedback
        onPress={() => {
          onClose();
          handleCancelDelete();
        }}
      >
        <View style={styles.modalBackground}>
          <View style={styles.container}>
            <View style={styles.modal_view}>
              {isConfirmingDeletion ? (
                // '삭제' 버튼 클릭 시 보여질 내용
                <View>
                  <View style={{ alignItems: 'center' }}>
                    <Text style={styles.re_ask}>정말로 삭제하시겠습니까?</Text>
                  </View>
                  <View style={styles.separator}></View>
                  <TouchableOpacity onPress={handleConfirmDelete}>
                    <Text style={styles.delete}>예</Text>
                  </TouchableOpacity>
                  <View style={styles.separator}></View>
                  <TouchableOpacity onPress={handleCancelDelete}>
                    <Text style={styles.update_and_cancel}>아니오</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                // 기본 모달 내용
                <>
                  <TouchableOpacity onPress={handleDeleteClick}>
                    <Text style={styles.delete}>삭제</Text>
                  </TouchableOpacity>
                  <View style={styles.separator}></View>
                  <TouchableOpacity onPress={handleUpdate}>
                    <Text style={styles.update_and_cancel}>수정</Text>
                  </TouchableOpacity>
                  <View style={styles.separator}></View>
                  <TouchableOpacity onPress={onClose}>
                    <Text style={styles.update_and_cancel}>취소</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default PhotoModal;

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(2, 0, 0, 0.5)',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal_view: {
    width: '60%',
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'lightgray',
    alignItems: 'center',
  },
  re_ask: {
    fontSize: 18,
    textAlign: 'center',
    margin: 15,
  },
  delete: {
    //width: 150,
    fontSize: 18,
    color: 'red',
    margin: 15,
  },
  update_and_cancel: {
    //width: 150,
    fontSize: 18,
    color: 'gray',
    margin: 15,
  },
  separator: {
    height: 2,
    backgroundColor: 'lightgray',
    width: '100%',
  },
});
