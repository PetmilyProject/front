import {
  Pressable,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';

const Button2 = ({
  backgrouncolor,
  color,
  text,
  onPress,
  width,
  fontSize,
  paddingVertical,
  height,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
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
