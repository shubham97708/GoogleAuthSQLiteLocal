import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import TabNavigator from './src/navigation/TabNavigator';
import {  createContactTable, createTable } from './src/services/database';
import AppNavigator from './src/navigation/AppNavigator';

const App = () => {
  React.useEffect(() => {
    createTable();
    createContactTable();
  }, []);

  return (
   <AppNavigator/>
  );
};

export default App;
