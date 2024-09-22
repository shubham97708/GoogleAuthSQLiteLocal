import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import DashboardScreen from '../screens/DashboardScreen';
import ContactForm from '../screens/ContactForm';
import ProfileScreen from '../screens/ProfileScreen';
import SignupListScreen from '../screens/SignupListScreen';

const Tab = createBottomTabNavigator();

const TabNavigator = () => (
  <Tab.Navigator>
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Dashboard" component={DashboardScreen} />
    <Tab.Screen name="Contact" component={ContactForm} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
    <Tab.Screen name="UserList" component={SignupListScreen} />
  </Tab.Navigator>
);

export default TabNavigator;
