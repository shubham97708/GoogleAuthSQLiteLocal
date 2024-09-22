import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import GoogleLogin from '../components/GoogleLogin';





const LoginScreen = () => {


  return (
    <View style={styles.container}>
      <Text style={styles.signup}>Login Screen</Text>
    

      <GoogleLogin />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  inputBox: {
    borderWidth: 1,
    borderColor: 'grey',
    paddingHorizontal: 12,
    borderRadius: 5,
    width: '90%',
    marginTop: 20,
  },
  register: {
    width: '90%',
    backgroundColor: '#FCAF03',
    padding: 12,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 40,
  },
  registerTitle: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '600',
  },
  signup: {
    fontSize: 20,
    color: '#000000',
    fontWeight: '600',
    marginBottom: 80,
  },
  forgotPassword: {
    color: '#AD40AF',
    fontWeight: '700',
    marginTop: 10,
  },
  signUpLink: {
    color: '#AD40AF',
    fontWeight: '700',
    marginTop: 10,
  },
});

export default LoginScreen;
