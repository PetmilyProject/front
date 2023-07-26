import { Pressable, StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import PropTypes from 'prop-types';

const Button2 = ({ backgrouncolor, color, text, onPress }) => {
  return (
    <Pressable onPress={onPress}>
      <TouchableOpacity
        style={[btnStyle.yellow, { backgroundColor: `${backgrouncolor}` }]}
      >
        <Text style={[btnStyle.yellow_text, { color: `${color}` }]}>
          {text}
        </Text>
      </TouchableOpacity>
    </Pressable>
  );
};

const btnStyle = StyleSheet.create({
  yellow: {
    width: '90%',
    alignItems: 'center',
    paddingVertical: 15,
    borderRadius: 23,
    marginBottom: 10,
  },
  yellow_text: {
    fontSize: 17,
    fontWeight: '600',
  },
});

export default Button2;
