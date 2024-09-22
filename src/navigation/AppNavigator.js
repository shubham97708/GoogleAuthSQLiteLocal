import React, {useState, useEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import LoginScreen from '../screens/LoginScreen';
import auth from '@react-native-firebase/auth';
import TabNavigator from './TabNavigator';


const Stack = createStackNavigator();

const AppNavigator = () => {

  // Animation For Swipe Right To Left
  const RightToLeftAnimation = {
    headerShown: false,
    headerTitleAlign: 'center',
    cardStyleInterpolator: ({current, layouts}) => {
      return {
        cardStyle: {
          transform: [
            {
              translateX: current.progress.interpolate({
                inputRange: [0, 1],
                outputRange: [layouts.screen.width, 0],
              }),
            },
          ],
        },
      };
    },
  };

  // Animation For Swipe Left To Right
  const LeftToRightAnimation = {
    headerTitleAlign: 'center',
    cardStyleInterpolator: ({current, layouts}) => {
      return {
        cardStyle: {
          transform: [
            {
              translateX: current.progress.interpolate({
                inputRange: [0, 1],
                outputRange: [-layouts.screen.width, 0],
              }),
            },
          ],
        },
      };
    },
  };

  const [user, setUser] = useState(null);  // Initial state is null, meaning not logged in

  const onAuthStateChanged = (authUser) => {
    if (authUser) {
      // console.log("User is authenticated:", authUser);
      setUser(authUser);
    } else {
      // console.log("No user is authenticated.");
      setUser(null);  // Set user to null if not authenticated
    }
  };







  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;  // Unsubscribe on unmount
  }, []);



  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user ? (
          // If user is authenticated, show the TabNavigator
          <Stack.Screen 
            name="MainApp" 
            component={TabNavigator} 
            options={RightToLeftAnimation} 
          />
        ) : (
          // If user is not authenticated, show the LoginScreen
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={LeftToRightAnimation}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
