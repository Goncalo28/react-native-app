import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, View, ImageBackground } from 'react-native';
import { Button } from 'react-native-elements';

import Image from '../assets/home-background.jpg'

export default function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <ImageBackground source={Image} style={styles.image}>
        <View style={styles.buttonContainer}>
          <Button
            title="Login"
            type='solid'
            style={styles.button}
            onPress={() => navigation.navigate('Login')}
          />
          <Button
            title="Signup"
            type='solid'
            style={styles.button}
            onPress={() => navigation.navigate('SignUp')}
          />
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    flex: 1,
    resizeMode: "cover",
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%'
  },
  buttonContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50
  },
  button: {
    width: 150,
    marginBottom: 50,
  }
})