import { StyleSheet, Text, TextInput, View } from 'react-native';
import { GRAY } from '../colors';
import PropTypes from 'prop-types';

const InputText = ({
  title,
  placeholder,
  keyboardType,
  onChangeText,
  secureTextEntry,
  width,
}) => {
  return (
    <View style={styles.nest_container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.container2}>
        <TextInput
          style={[styles.input, { width: width }]}
          placeholder={placeholder}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          onChangeText={onChangeText}
        ></TextInput>
      </View>
    </View>
  );
};
InputText.propTypes = {
  width: PropTypes.number,
};

InputText.defaultProps = {
  width: 350,
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  container2: {
    alignItems: 'center',
  },
  nest_container: {
    marginVertical: 10,
  },
  title: {
    alignItems: 'flex-start',
    marginBottom: 5,
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    width: 350,
    padding: 10,
    borderRadius: 20,
    borderColor: GRAY.DEFAULT,
  },
});

export default InputText;
