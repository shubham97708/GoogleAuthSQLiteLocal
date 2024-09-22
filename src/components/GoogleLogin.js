import { View, Button, StyleSheet, Alert } from 'react-native';
import React, { useEffect } from 'react';
import {
  GoogleOneTapSignIn,
  statusCodes,
  isErrorWithCode,
  GoogleSignin,
} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';

const GoogleLogin = () => {
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: "909598206839-knhsnekh856g1i36gbj2pordteaclb3h.apps.googleusercontent.com",
  
    });
  }, []);



  const onGoogleSignin = async () => {
    try {
      // Sign in with Google
      const userInfo = await GoogleSignin.signIn();
      // console.log('Google Sign-In User Info:', userInfo);

      // Get tokens
      const { idToken } = await GoogleSignin.getTokens();
      // console.log('Google Sign-In ID Token:', idToken);

      if (!idToken) {
        throw new Error('ID Token is null');
      }

      // Create a Google credential
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      // console.log('Google Credential:', googleCredential);

      // Sign in with credential
      const userCredential = await auth().signInWithCredential(googleCredential);
      // console.log('User signed in:', userCredential);
      Alert.alert('Success', 'Google Sign-In successful!');

    } catch (error) {
      // console.error('Google Sign-In Error:', error);
      Alert.alert('Error', error.message || 'Google Sign-In failed. Please try again.');
    }
  };
  return (
    <View style={styles.container}>
      <Button title="Google Sign in" onPress={onGoogleSignin} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 20,
  },
});

export default GoogleLogin;
