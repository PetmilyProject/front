import { View, StyleSheet, Modal, Pressable, Text } from 'react-native';
import PropTypes from 'prop-types';
import { BLACK, GRAY, WHITE, YELLOW } from '../colors';
import { TouchableOpacity, ScrollView } from 'react-native-gesture-handler';
import React, { useState } from 'react'; // Import React and useState
import { Image } from 'react-native';

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
  const [items, setItems] = useState([]);

  const addItem = () => {
    // Function to add a new item to the list
    const newItem = `Item ${items.length + 1}`;
    setItems([...items, newItem]);
  };

  const Item = () => {
    return (
      <View style={styles.container_Item}>
        <Image
          source={require('../assets/dog.jpg')}
          style={styles.user_profile}
        />
        <Text style={styles.user_name}>강아지</Text>
        <TouchableOpacity
          onPress={() => {
            console.log('승인');
          }}
          style={styles.button1_Item}
        >
          <Text>승인</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            console.log('거절');
          }}
          style={styles.button2_Item}
        >
          <Text>거절</Text>
        </TouchableOpacity>
      </View>
    );
  };

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
          <Text style={styles.scrollViewName}>{scrollViewName}</Text>
          <ScrollView style={styles.ScrollView}>
            {items.map((item, index) => (
              <Text key={index}>{item}</Text>
            ))}
            <Item />
            <Item />
            <Item />
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
    marginTop: -200,
    width: 330,
    height: 400,
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
    width: 60,
  },
});

export default ViewListAlert;
