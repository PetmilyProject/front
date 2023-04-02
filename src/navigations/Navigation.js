import { NavigationContainer } from '@react-navigation/native';
import AuthStack from './AuthStack';
import ContentTab from './ContentTab';

const Navigation = () => {
  return (
    <NavigationContainer>
      <AuthStack />
    </NavigationContainer>
  );
};

export default Navigation;
