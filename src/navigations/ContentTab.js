import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ContentRoutes } from './routes';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import SignInScreen from '../screens/SignInScreen';
import PetRegister from '../screens/PetRegister';
import PetInfoScreen from '../screens/PetInfoScreen';
import React from 'react';
import PetMainScreen from '../screens/PetMainScreen';

const Tab = createBottomTabNavigator();

const getTabBarIcon = ({ focused, color, size, name }) => {
  const iconName = focused ? name : `${name}-outline`;
  if (name === 'dog') {
    return null; // PetInfoScreen 아이콘을 없앰
  }
  return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
};

const ContentTab = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          switch (route.name) {
            case ContentRoutes.HOME:
              iconName = 'home';
              break;
            case ContentRoutes.REGISTER:
              iconName = 'plus-box-outline';
              break;
            case ContentRoutes.INFO:
              iconName = 'dog';
              break;
            case 'SignInScreen':
              iconName = 'account-circle';
              break;
            default:
              iconName = '';
              break;
          }
          return getTabBarIcon({ focused, color, size, name: iconName });
        },
      })}
      tabBarOptions={{
        showLabel: true, // 라벨 보이기
        labelStyle: { fontSize: 12 }, // 라벨 폰트 크기 조정
        style: { paddingBottom: 5, height: 60 }, // tabBar 스타일 조정
      }}
    >
      <Tab.Screen
        name={ContentRoutes.HOME}
        component={PetMainScreen}
        options={{
          tabBarVisible: true,
        }}
      />
      <Tab.Screen
        name={ContentRoutes.REGISTER}
        component={PetRegister}
        options={{
          tabBarVisible: false, // PetRegister 탭은 보이지 않게 함
        }}
      />
      <Tab.Screen
        name={ContentRoutes.INFO}
        component={PetInfoScreen}
        options={{
          tabBarVisible: false, // PetInfoScreen 탭은 보이지 않게 함
        }}
      />
      <Tab.Screen
        name={'SignInScreen'}
        component={SignInScreen}
        options={{
          tabBarVisible: true,
        }}
      />
    </Tab.Navigator>
  );
};

export default ContentTab;
