import { Component } from "react";
import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  Alert,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { NavigationActions } from "react-navigation";
import PostsService from "../utils/posts";
import AuthService from "../utils/auth";
import UserService from "../utils/user";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default class SAearch extends Component {
  state = {
    users: [],
    usersCopy: [],
    search: "",
  };

  componentDidMount() {
    const userService = new UserService();
    userService.getAllUsers().then((users) => {
      this.setState({
        users: users.data,
        usersCopy: users.data,
      });
    });
  }

  handleSearch = (searchName) => {
    let newUsers = this.state.users.filter((user) => {
      return user.username.includes(searchName);
    });
    this.setState({
      usersCopy: newUsers,
      search: searchName,
    });
  };

  goToProfile = () => {
    console.log("go to this profile");
  };

  render() {
    return (
      <View>
        <TextInput
          style={{ height: 40 }}
          placeholder="Type here to translate!"
          onChangeText={(text) => {
            this.handleSearch(text);
          }}
          defaultValue={this.state.search}
        />
        {this.state.usersCopy.map((user) => {
          return (
            <TouchableOpacity onPress={console.log("hello")} key={user._id}>
              <Text key={user._id}>{user.username}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }
}