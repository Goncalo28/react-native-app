import { Component } from "react";
import React from "react";
import { StyleSheet, View, Alert, TextInput } from "react-native";
import PostsService from "../utils/posts";
import { Input, Button } from 'react-native-elements';


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
        <Input
          style={styles.input}
          placeholder="Type here to translate!"
          onChangeText={(text) =>
            this.setState({ content: text })
          }
          defaultValue={this.state.content}
        />
        <Button style={styles.button} title="Create Post" onPress={this.handleFormSubmit} />
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
    marginTop: 20
  },
  input: {
    marginBottom: 10,
  }
})