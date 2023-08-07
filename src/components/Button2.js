import { Pressable, StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import PropTypes from 'prop-types';

const Button2 = ({
  backgrouncolor,
  color,
  text,
  onPress,
  width,
  fontSize,
  paddingVertical,
}) => {
  return (
    <Pressable onPress={onPress}>
      <TouchableOpacity
        style={[
          btnStyle.yellow,
          {
            backgroundColor: `${backgrouncolor}`,
            width: width,
            paddingVertical: paddingVertical,
          },
        ]}
      >
        <Text
          style={[
            btnStyle.yellow_text,
            { color: `${color}`, fontSize: fontSize },
          ]}
        >
          {text}
        </Text>
      </TouchableOpacity>
    </Pressable>
  );
};

Button2.propTypes = {
  width: PropTypes.number,
  fontSize: PropTypes.number,
  paddingVertical: PropTypes.number,
};

Button2.defaultProps = {
  width: 350,
  fontSize: 17,
  paddingVertical: 15,
};

const btnStyle = StyleSheet.create({
  yellow: {
    alignItems: 'center',
    borderRadius: 20,
    marginBottom: 10,
  },
  yellow_text: {
    fontWeight: '600',
  },
});

export default Button2;
