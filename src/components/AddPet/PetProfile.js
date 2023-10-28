import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { GRAY, WHITE, YELLOW } from '../../colors';
import { useState } from 'react';
import { AntDesign } from '@expo/vector-icons';

const PetProfile = ({
  //key,
  name,
  age,
  species,
  gender,
  set,
  handleLongPressed,
  onPress,
  select,
  profiles,
  id,
  imgurl,
}) => {
  const PetProfileItem = {
    select: { select },
  };

  return (
    <>
      <Pressable onLongPress={handleLongPressed} onPress={onPress}>
        <View style={styles.main}>
          <View style={styles.container}>
            <Image
              source={{ uri: imgurl }} // Use imgurl prop as the source
              style={styles.image}
            />
            <View style={styles.container2}>
              <View style={styles.nametitle}>
                <Text style={styles.name}>{name}</Text>
                <Text style={styles.age}>{age}살</Text>
              </View>
              <View style={styles.container3}>
                <Text style={[styles.content]}> 특징 : {species}</Text>
                <Text style={styles.content}> 성별 : {gender}</Text>
                {/* <Text style={styles.content}>{gender}</Text>
                <Text style={styles.content}>{character}</Text> */}
              </View>
            </View>
            {PetProfileItem.select === true ? (
              <AntDesign name="checkcircle" size={24} color="black" />
            ) : null}
          </View>
        </View>
      </Pressable>
    </>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  container: {
    flexDirection: 'row',
    backgroundColor: GRAY.LIGHTER,
    justifyContent: 'center',
    height: 140,
    width: 360,
    borderRadius: 30,
    padding: 10,
  },
  container2: {
    flexDirection: 'column',
  },
  container3: {},
  nametitle: {
    flexDirection: 'row',
    borderRadius: 20,
    backgroundColor: YELLOW.DEFAULT,
    width: 220,
    height: 40,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 15,
  },
  name: {
    fontSize: 23,
    color: WHITE,
    fontWeight: '600',
    paddingLeft: 15,
  },
  age: {
    fontSize: 18,
    color: WHITE,
    marginLeft: 10,
  },
  content: {
    fontSize: 16,
    marginLeft: 10,
    marginBottom: 3,
  },
  image: {
    borderRadius: 100,
    backgroundColor: WHITE,
    alignItems: 'center',
    justifyContent: 'center',
    width: 110,
    height: 110,
    marginRight: 10,
    marginTop: 5,
  },
});

export default PetProfile;
