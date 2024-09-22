import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, ScrollView } from 'react-native';
import { fetchUserProfileByEmail, updateUserProfile } from '../services/database';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

const ProfileScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');   
  const [mobile, setMobile] = useState(''); 
  const [user, setUser] = useState(null);    

  const fetchGoogleUserInfo = async () => {
    try {
      const userInfo = await GoogleSignin.getCurrentUser();
      
      if (!userInfo || !userInfo.user) {
        console.log('No user is currently signed in.');
        return;
      }

      const { email } = userInfo.user;
      const profile = await fetchUserProfileByEmail(email);
      
      if (profile) {
        setName(profile.name);
        setEmail(profile.email);   
        setAge(profile.age ? String(profile.age) : '');  
        setMobile(profile.mobile);   
        setUser(profile);         
      }

    } catch (error) {
      console.error('Error fetching Google Sign-In user info', error);
    }
  };

  useEffect(() => {
    fetchGoogleUserInfo();
  }, []);

  const handleUpdateProfile = () => {
    if (name && age && mobile && email) {
      const isSameProfile = 
        name === user.name &&
        age === String(user.age) &&
        mobile === user.mobile;
  
      if (isSameProfile) {
        Alert.alert('No Changes', 'Your profile is already up-to-date.');
      } else {
        updateUserProfile(name, age, mobile, email)
          .then(success => {
            if (success) {
              Alert.alert('Success', 'Profile updated successfully!');
            } else {
              Alert.alert('Error', 'Failed to update profile, no user found.');
            }
          })
          .catch(error => {
            console.error('Error during profile update', error);
            Alert.alert('Error', 'An error occurred while updating the profile.');
          });
      }
    } else {
      Alert.alert('Error', 'Please fill in all fields.');
    }
  };
  
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Edit Your Profile</Text>

      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      
      <TextInput
        placeholder="Email"
        value={email}
        editable={false}  
        style={styles.input}
      />

      <TextInput
        placeholder="Age"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"  
        style={styles.input}
      />

      <TextInput
        placeholder="Mobile"
        value={mobile}
        onChangeText={setMobile}
        style={styles.input}
      />

      <Button title="Update Profile" onPress={handleUpdateProfile} color="#4CAF50" />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
});

export default ProfileScreen;
