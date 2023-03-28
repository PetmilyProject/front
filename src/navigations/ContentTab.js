import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ContentRoutes } from './routes';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { GRAY, PRIMARY } from '../colors';
import HomeScreen from '../screens/HomeScreen';
import MapScreen from '../screens/MapScreen';
import ListScreen from '../screens/ListScreen';
import SignInScreen from '../screens/SignInScreen';
//import TabBarAddButton from '../components/TabBarAddButton';

const Tab = createBottomTabNavigator();

const getTabBarIcon = ({ focused, color, size, name }) => {
  const iconName = focused ? name : `${name}-outline`;
  return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
};

const AddButtonScreen = () => null;

const ContentTab = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name={ContentRoutes.HOME} component={HomeScreen} />
      <Tab.Screen name={ContentRoutes.LIST} component={ListScreen} />

      <Tab.Screen name={'AddButton'} component={AddButtonScreen} />

      <Tab.Screen name={'SignInScreen'} component={SignInScreen} />

      <Tab.Screen name={'Map'} component={MapScreen} />
    </Tab.Navigator>
  );
};

export default ContentTab;
