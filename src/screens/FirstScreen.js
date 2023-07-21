import {
  StyleSheet,
  View,
  Text,
  Button,
  TouchableHighlight,
  TouchableOpacity,
} from 'react-native';
import { AuthRoutes } from '../navigations/routes';
import SignInScreen from './SignInScreen';
import Navigation from '../navigations/Navigation';
import AuthStack from '../navigations/AuthStack';

const FirstScreen = ({ navigation, route }) => {
  return (
    <View style={styles.container}>
      <View style={styles.title_container}>
        <Text style={styles.main_title}>PETMILY</Text>
        <Text style={styles.sub_title}>함께 키우는 마이펫</Text>
      </View>
      <View style={styles.main_container}>
        <TouchableOpacity
          style={styles.signup_button}
          onPress={() => navigation.navigate(AuthRoutes.SIGN_UP)}
        >
          <Text style={{ fontSize: 20, fontWeight: '600' }}>가입하기</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.signin_button}
          onPress={() => navigation.navigate(AuthRoutes.SIGN_IN)}
        >
          <Text
            style={{
              color: 'white',
              fontSize: 23,
              fontWeight: '600',
              marginBottom: 15,
            }}
          >
            로그인
          </Text>
        </TouchableOpacity>
        <View style={styles.find_container}>
          <TouchableOpacity>
            <Text style={styles.find}>아이디찾기</Text>
          </TouchableOpacity>
          <Text style={styles.find}>|</Text>
          <TouchableOpacity>
            <Text style={styles.find}>비밀번호찾기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: '#fcd34d',
  },
  title_container: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  main_container: {
    flex: 1,
    marginTop: -80,
    alignItems: 'center',
  },
  find_container: {
    flexDirection: 'row',
  },
  main_title: {
    fontSize: 50,
    fontWeight: 'bold',
  },
  sub_title: { alignItems: 'center', fontSize: 20 },
  find: {
    fontSize: 17,
    marginHorizontal: 5,
    color: 'white',
    fontWeight: '500',
  },
  signup_button: {
    backgroundColor: 'white',
    width: 300,
    alignItems: 'center',
    paddingVertical: 17,
    borderRadius: 10,
    margin: 15,
  },
  signin_button: { color: 'white' },
});

export default FirstScreen;
