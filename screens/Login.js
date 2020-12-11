import React, { Component } from "react";
import {
  View,
  SafeAreaView,
  StyleSheet
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthService from "../utils/auth";
import { NavigationActions } from "react-navigation";
import { Button } from 'react-native-elements';
import { Input } from 'react-native-elements';


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
      <View style={styles.container}>
        <Input
          style={styles.input}
          placeholder="Username"
          onChangeText={(text) =>
            this.setState({ username: text, password: this.state.password })
          }
          defaultValue={this.state.username}
        />

        <Input
          style={styles.input}
          secureTextEntry={true}
          placeholder="Password"
          onChangeText={(text) =>
            this.setState({ password: text, username: this.state.username })
          }
          defaultValue={this.state.password}
        />
        <View>
          <Button style={styles.button} title="Login" onPress={this.submitLogin} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 80
  },
  button: {
    width: 255,
    marginTop: 50
  },
  input: {
    marginBottom: 10,
  }
})