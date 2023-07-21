import { createStackNavigator } from '@react-navigation/stack';
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import FirstScreen from '../screens/FirstScreen';

const SignInStack = createStackNavigator();
/*로그인*/
const SignStack = () => {
  return (
    <SignInStack.Navigator>
      <SignInStack.Screen
        name="First"
        component={FirstScreen}
        options={{ headerShown: false }}
      />
      <SignInStack.Screen
        name="SignIn"
        component={SignInScreen}
        options={{ title: '로그인' }}
      />
      <SignInStack.Screen
        name="SignUp"
        component={SignUpScreen}
        options={{ title: '회원가입' }}
      />
    </SignInStack.Navigator>
  );
};

export default SignStack;
