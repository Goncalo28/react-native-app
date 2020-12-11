import { Component } from "react"
import React from 'react';
import { StyleSheet, Text, View, Button, SafeAreaView, ScrollView } from 'react-native';
import PostsService from "../utils/posts"
import UserService from "../utils/user"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { ListItem, Icon } from 'react-native-elements'

export default class Dashboard extends Component {
  state = {
    content: "",
    posts: [],
    username: "",
    connections: []
  }

  getDataFromAsyncStorage = async () => {
    let loggedInUser;
    try {
      loggedInUser = await AsyncStorage.getItem('loggedInUser')
      return loggedInUser
    } catch (error) {
      console.log(error)
    }
  }

  getAllPosts = () => {
    let loggedInUserId;
    this.getDataFromAsyncStorage().then((res) => {
      loggedInUserId = res
      // const loggedInUserId = this.props.route.params.loggedInUser
      const postsService = new PostsService();
      const postsPromise = postsService.getAllPosts();

      const userService = new UserService()
      let userPromise = userService.getUser(loggedInUserId);

      Promise.all([userPromise, postsPromise]).then((values) => {
        let {
          username,
          connections,
        } = values[0].data;
        let allPosts = values[1].data;

        const promisesUserPosts = [];
        allPosts.forEach((post) => {
          promisesUserPosts.push(userService.getUser(post.user))
        });

        Promise.all(promisesUserPosts).then((response) => {
          response.forEach((user, index) => {
            allPosts[index].username = user.data.username;
          });

          this.setState({
            username: username,
            connections: connections,
            posts: allPosts,
          });

        })
      })
    })
  }

  componentDidMount = () => {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.getAllPosts()
    });
  }

  componentWillUnmount = () => {
    this._unsubscribe();
  }

  render() {
    return (
      <SafeAreaView style={{
        flex: 1, alignItems: 'center', justifyContent: 'center'
      }}>
        <Text style={{ fontSize: 30, marginTop: 10, color: 'rgb(9, 161, 245)' }
        } > Feed</ Text>
        <ScrollView style={{ marginVertical: 20, width: '100%', marginHorizontal: 20 }}>
          {this.state.posts.map((post) => {
            return (
              <ListItem bottomDivider key={post._id} style={{ marginBottom: 10 }}>
                <Icon name='account-circle' color='rgb(9, 161, 245)' />
                <ListItem.Content>
                  <Text>From: {post.username}</Text>
                  <ListItem.Subtitle style={{ fontSize: 15 }}>{post.content}</ListItem.Subtitle>
                </ListItem.Content>
              </ListItem>
            )
          })}
        </ScrollView>
      </SafeAreaView>
    );
  }
}
