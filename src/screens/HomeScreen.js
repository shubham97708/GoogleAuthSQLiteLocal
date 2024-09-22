import React, { useEffect } from 'react';
import { View, Text, Button, StyleSheet, Image } from 'react-native';
import { checkAndInsertUser } from '../services/database'; // Ensure this path is correct
import { signOut } from '../services/firebase';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

const getCurrentMonth = () => {
  const date = new Date();
  const options = { month: 'long' }; // Use 'short' for abbreviated month names
  return date.toLocaleString('default', options);
};

const HomeScreen = () => {
  
  const addUserInTable = async () => {
    try {
      let userInfo = await GoogleSignin.getCurrentUser();
  
      if (!userInfo || !userInfo.user) {
        console.log('No user is currently signed in.');
        return;
      }
  
      const { user } = userInfo; 
      const { email, name } = user; 
  
      const month = getCurrentMonth();
      await checkAndInsertUser(name, email, month);
  
    } catch (error) {
      console.log('Error adding or checking user in database', error);
    }
  };
  
  useEffect(() => {
    addUserInTable();
  }, []);

  return (
    <View style={styles.container}>
      <Image 
        source={{ uri: 'https://example.com/welcome-image.png' }} // Replace with your image URL
        style={styles.welcomeImage} 
      />
      <Text style={styles.welcomeText}>Welcome to the Home Screen!</Text>
      <Text style={styles.greetingText}>We are glad to have you here.</Text>
      <Button title="Sign Out" onPress={signOut} color="#FF6347" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f8ff',
    padding: 20,
  },
  welcomeImage: {
    width: 150,
    height: 150,
    marginBottom: 20,
    borderRadius: 75, // Make it circular
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
  },
  greetingText: {
    fontSize: 16,
    marginBottom: 20,
    color: '#666',
    textAlign: 'center',
  },
});

export default HomeScreen;
