import { Component } from "react"
import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { NavigationActions } from 'react-navigation'
import PostsService from "../utils/posts"
import AuthService from "../utils/auth"
import UserService from "../utils/user"
import AsyncStorage from "@react-native-async-storage/async-storage"


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


  logoutUser = () => {
    const authService = new AuthService();
    authService.logout()
      .then(() => {
        /*           this.props.setCurrentUser(null);
         */
        AsyncStorage.removeItem('loggedInUser').then((res) => {
          console.log('inside asyncStorage to remove', res)
          this.props.navigation.navigate('Auth', {}, NavigationActions.navigate('Home'))
          // this.props.navigation.navigate('Home');
        })
      })
  }
  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Button title="Logout" onPress={this.logoutUser} />
        {this.state.posts.map((post) => {
          return <Text key={post._id}>{post.content}</Text>
        })}

      </View>
    );
  }
}
