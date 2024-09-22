import firebase from 'firebase/app';
import auth from '@react-native-firebase/auth'; 
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { Alert } from 'react-native';



GoogleSignin.configure({
  webClientId: '909598206839-knhsnekh856g1i36gbj2pordteaclb3h.apps.googleusercontent.com',
});

export const signInWithGoogle = async () => {
  try {
    const { idToken } = await GoogleSignin.signIn();
    const googleCredential = firebase.auth.GoogleAuthProvider.credential(idToken);
    return firebase.auth().signInWithCredential(googleCredential);
  } catch (error) {
    console.error(error);
  }
};

export const signOut = async () => {
  try {
    // Sign out from Firebase
    await auth().signOut();
    
    // Sign out from Google
    await GoogleSignin.signOut();
    
    Alert.alert('Signed out', 'You have successfully signed out.');
  } catch (error) {
    console.error('Sign-Out Error:', error);
    Alert.alert('Error', error.message || 'Sign out failed.');
  }
};