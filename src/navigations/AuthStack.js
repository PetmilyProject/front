import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { WHITE } from '../colors';
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import UserInfoScreen from '../screens/UserInfo/UserInfoScreen';
import Navigation from './Navigation';
import { AuthRoutes } from './routes';
import HomeScreen from '../screens/HomeScreen';

const Stack = createNativeStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{ contentStyle: { backgroundColor: WHITE } }}
    >
      <Stack.Screen name={AuthRoutes.SIGN_IN} component={SignInScreen} />
      <Stack.Screen name={AuthRoutes.SIGN_UP} component={SignUpScreen} />
      <Stack.Screen name={AuthRoutes.NAVIGATION} component={Navigation} />
      <Stack.Screen name={AuthRoutes.HOME} component={HomeScreen} />
      <Stack.Screen name={AuthRoutes.UserInfo} component={UserInfoScreen} />
      <Stack.Screen name={AuthRoutes.ENTIRE} component={PetMainScreen} />
    </Stack.Navigator>
  );
};

export default AuthStack;
