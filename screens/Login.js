import React, { useState, useEffect, Component } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TextInputProps,
  Button,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthService from "../utils/auth";
import { NavigationActions } from "react-navigation";

export default class LoginScreen extends Component {
  state = {
    username: "",
    password: "",
  };

  storeData = async (userId) => {
    try {
      await AsyncStorage.setItem("loggedInUser", userId);
    } catch (error) {
      console.log(error);
    }
  };

  submitLogin = () => {
    const authService = new AuthService();
    authService
      .login(this.state.username, this.state.password)
      .then((res) => {
        let user = res.data;
        this.storeData(user._id).then(() => {
          this.setState({
            username: "",
            password: "",
          });
          this.props.navigation.navigate(
            "App",
            { loggedInUser: user._id },
            NavigationActions.navigate("Dashboard")
          );
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  render() {
    return (
      <View style={{ padding: 10 }}>
        <TextInput
          style={{ height: 40 }}
          placeholder="Type here to translate!"
          onChangeText={(text) =>
            this.setState({ username: text, password: this.state.password })
          }
          defaultValue={this.state.username}
        />

        <TextInput
          secureTextEntry={true}
          style={{ height: 40 }}
          placeholder="Type here to translate!"
          onChangeText={(text) =>
            this.setState({ password: text, username: this.state.username })
          }
          defaultValue={this.state.password}
        />
        <View>
          <Button title="Login" onPress={this.submitLogin} />
        </View>
      </View>
    );
  }
}
