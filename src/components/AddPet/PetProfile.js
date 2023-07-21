import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { GRAY, WHITE, YELLOW } from '../../colors';
import { useState } from 'react';
import { AntDesign } from '@expo/vector-icons';

const PetProfile = ({
  key,
  name,
  age,
  species,
  set,
  handleLongPressed,
  onPress,
  select,
  imgurl,
  profiles,
  id,
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
                <Text style={styles.content}>{species}</Text>
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
    backgroundColor: GRAY.LIGHT,
    justifyContent: 'center',
    height: 140,
    width: 360,
    borderRadius: 8,
    padding: 10,
  },
  container2: {
    flexDirection: 'column',
  },
  container3: {
    flexDirection: 'row',
  },
  nametitle: {
    flexDirection: 'row',
    borderRadius: 8,
    backgroundColor: YELLOW.DEFAULT,
    width: 220,
    height: 40,
    marginTop: 10,
    marginBottom: 15,
  },
  name: {
    fontSize: 23,
    color: WHITE,
    fontWeight: '500',
    paddingLeft: 15,
    paddingTop: 10,
  },
  age: {
    fontSize: 18,
    color: WHITE,
    marginLeft: 10,
    marginTop: 12,
  },
  content: {
    fontSize: 16,
    marginLeft: 10,
  },
  image: {
    borderRadius: 100,
    backgroundColor: WHITE,
    alignItems: 'center',
    width: 110,
    height: 110,
    marginRight: 10,
  },
});

export default PetProfile;
