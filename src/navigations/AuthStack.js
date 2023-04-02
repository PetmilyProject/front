import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { WHITE } from '../colors';
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import { AuthRoutes } from './routes';
import { NavigationContainer } from '@react-navigation/native';
import ContentTab from './ContentTab';

const Stack = createNativeStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{ contentStyle: { backgroundColor: WHITE } }}
    >
      <Stack.Screen name={'tab'} component={ContentTab} />
      <Stack.Screen name={AuthRoutes.SIGN_IN} component={SignInScreen} />
      <Stack.Screen name={AuthRoutes.SIGN_UP} component={SignUpScreen} />
    </Stack.Navigator>
  );
};

export default AuthStack;
