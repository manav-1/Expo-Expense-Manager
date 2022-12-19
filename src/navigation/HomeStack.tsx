import * as React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import LoginScreen from '../screens/Login';
import LogoScreen from '../screens/Logo';
import AppTab from './AppTab';

const Stack = createStackNavigator();

const StackNavigation = () => {
  return (
    <Stack.Navigator initialRouteName="Logo">
      <Stack.Screen
        name="Logo"
        component={LogoScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="HomeNav"
        component={AppTab}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default StackNavigation;
