import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { WHITE } from '../colors';
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import Navigation from './Navigation';
import { AuthRoutes } from './routes';

const Stack = createNativeStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{ contentStyle: { backgroundColor: WHITE } }}
    >
      <Stack.Screen name={AuthRoutes.SIGN_IN} component={SignInScreen} />
      <Stack.Screen name={AuthRoutes.SIGN_UP} component={SignUpScreen} />
      <Stack.Screen name={AuthRoutes.NAVIGATION} component={Navigation} />
    </Stack.Navigator>
  );
};

export default AuthStack;
