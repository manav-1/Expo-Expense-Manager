import React from 'react';
import HomeScreen from '../screens/Home';
import Profile from '../screens/Profile';
import ExpensesScreen from '../screens/Expenses';
import Ionicons from '@expo/vector-icons/Ionicons';
import Notes from '../screens/Notes';
import Analytics from '../screens/Analytics';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {App} from '../state/store';
import {RFPercentage} from 'react-native-responsive-fontsize';
import {observer} from 'mobx-react';

const Tab = createMaterialTopTabNavigator();

const HomeTabNavigation = observer(() => {
  const theme = App.theme;
  return (
    <Tab.Navigator
      tabBarPosition="bottom"
      screenOptions={{
        lazy: true,
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.primary2,
        tabBarLabelStyle: {
          fontFamily: theme.primaryFont.MEDIUM,
          fontSize: RFPercentage(1.1),
        },
        tabBarStyle: {
          borderRadius: 50,
          position: 'absolute',
          overflow: 'hidden',
          left: 10,
          right: 10,
          bottom: 5,
          height: 60,
          justifyContent: 'center',
          backgroundColor: theme.background,
        },
        tabBarIndicatorStyle: {
          backgroundColor: theme.secondary,
        },
      }}>
      <Tab.Screen
        component={HomeScreen}
        name="Home"
        options={{
          tabBarIcon: ({focused, color}) => (
            <Ionicons
              size={20}
              color={color}
              name={`home${focused ? '' : '-outline'}`}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Expenses"
        component={ExpensesScreen}
        options={{
          tabBarIcon: ({focused, color}) => (
            <Ionicons
              size={20}
              color={color}
              name={`card${focused ? '' : '-outline'}`}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Analytics"
        component={Analytics}
        options={{
          tabBarIcon: ({focused, color}) => (
            <Ionicons
              size={20}
              color={color}
              name={`analytics${focused ? '' : '-outline'}`}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Notes"
        component={Notes}
        options={{
          tabBarIcon: ({focused, color}) => (
            <Ionicons
              size={20}
              color={color}
              name={`attach${focused ? '' : '-outline'}`}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({focused, color}) => (
            <Ionicons
              size={20}
              color={color}
              name={`person${focused ? '' : '-outline'}`}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
});

export default HomeTabNavigation;
