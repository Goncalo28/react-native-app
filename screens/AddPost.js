import { Component } from "react";
import React from "react";
import { StyleSheet, Text, View, Button, Alert, TextInput } from "react-native";
import { NavigationActions } from "react-navigation";
import PostsService from "../utils/posts";
import AuthService from "../utils/auth";
import UserService from "../utils/user";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default class AddPost extends Component {
  state = {
    content: "",
  };

  handleFormSubmit = () => {
    let postService = new PostsService();
    postService.createPost(this.state).then(() => {
      this.setState({
        content: "",
      });
      Alert.alert("Post created!");
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={{ height: 40 }}
          placeholder="Type here to translate!"
          onChangeText={(text) =>
            this.setState({ content: text })
          }
          defaultValue={this.state.content}
        />
        <Button title="Create Post" onPress={this.handleFormSubmit} />
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
})