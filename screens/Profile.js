import { Component } from "react";
import React from "react";
import { StyleSheet, Text, View, Alert } from "react-native";
import UserService from "../utils/user";
import ConnectionsService from "../utils/connections";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthService from "../utils/auth"
import { NavigationActions } from "react-navigation";
import { Icon, Card, Button } from 'react-native-elements'
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";

export default class Profile extends Component {
  state = {
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    bio: "",
    typeOfUser: "",
    connections: [],
    pendingConnections: [],
    open: false,
    id: "",
  };

  getDataFromAsyncStorage = async () => {
    let loggedInUser;
    try {
      loggedInUser = await AsyncStorage.getItem("loggedInUser");
      return loggedInUser;
    } catch (error) {
      console.log(error);
    }
  };

  userService = new UserService();

  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      let loggedInUserId;
      this.getDataFromAsyncStorage().then((res) => {
        loggedInUserId = res;
        let userPromise = this.userService.getUser(loggedInUserId);
        const connectionsService = new ConnectionsService();
        let connectionPromise = connectionsService.getUserConnections();
        Promise.all([userPromise, connectionPromise]).then((values) => {

          let {
            username,
            email,
            firstName,
            lastName,
            bio,
            typeOfUser,
            connections,
          } = values[0].data;

          let userConnections = values[1].data.map((connection) => {
            if (connection.from === loggedInUserId) {
              return { user: connection.to, id: connection._id, from: true };
            } else {
              return { user: connection.from, id: connection._id, from: false };
            }
          });

          const promisesUserConnections = [];
          userConnections.forEach((connection) => {
            promisesUserConnections.push(
              this.userService.getUser(connection.user)
            );
          });

          Promise.all(promisesUserConnections).then((response) => {
            response.forEach((user, index) => {
              userConnections[index].user = user.data.username;
              userConnections[index].userId = user.data._id;
              userConnections[index].connections = user.data.connections;
            });

            this.setState({
              username: username,
              email: email,
              firstName: firstName,
              lastName: lastName,
              bio: bio,
              typeOfUser: typeOfUser,
              connections: connections,
              pendingConnections: userConnections,
              id: loggedInUserId,
            });
          });
        });
      });
    })
  }

  componentWillUnmount = () => {
    this._unsubscribe();
  }

  handleAccept = (id, connection, index) => {

    connection.connections.push(this.state.id);

    const connectionsService = new ConnectionsService();

    let newPending = [...this.state.pendingConnections];
    newPending.splice(index, 1);

    let newConnections = [...this.state.connections];
    newConnections.push(connection.userId);

    let userLoggedInPromise = this.userService.editUser(this.state.id, {
      $push: { connections: connection.userId },
    });
    let otherUserPromise = this.userService.editUser(connection.userId, {
      $push: { connections: this.state.id },
    });
    let connectionPromise = connectionsService.deleteConnection(id);

    Promise.all([
      userLoggedInPromise,
      otherUserPromise,
      connectionPromise,
    ]).then((values) => {
      this.setState({
        connections: newConnections,
        pendingConnections: newPending,
      });
      Alert.alert("Accepted");
    });
  };

  handleDecline = (id, index) => {
    const connectionsService = new ConnectionsService();

    let newPending = [...this.state.pendingConnections];
    newPending.splice(index, 1);

    this.setState({
      pendingConnections: newPending,
    });

    connectionsService.deleteConnection(id).then(() => {
      Alert.alert("Declined");
    });
  };


  logoutUser = () => {
    const authService = new AuthService();
    authService.logout()
      .then(() => {
        AsyncStorage.removeItem('loggedInUser').then((res) => {
          console.log('inside asyncStorage to remove', res)
          this.props.navigation.navigate('Auth', {}, NavigationActions.navigate('Home'))
        })
      })
  }

  render() {
    return (
      <View style={styles.container}>
        <Card containerStyle={{ padding: 20, height: '60%', width: '80%', display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
          <View style={{ display: 'flex', justifyContent: 'space-evenly' }}>
            <Card.Title style={{ marginBottom: 10 }}>{this.state.username}</Card.Title>
            <Icon name='account-circle' color='rgb(9, 161, 245)' />
            <Text style={{ marginTop: 10 }}>Email: {this.state.email}</Text>
            <Text style={{ marginTop: 10 }}>
              Name: {this.state.firstName} {this.state.lastName}
            </Text>
            <Text style={{ marginTop: 10 }}>
              I'm an: {this.state.typeOfUser}
            </Text>
            <Text style={{ marginTop: 10 }}>About: {this.state.bio}</Text>
            <View style={{ height: '30%', marginTop: 15 }}>
              <Text style={{ paddingBottom: 10 }}>Pending requests:</Text>
              <ScrollView contentContainerStyle={{ marginTop: 10 }}>
                {
                  this.state.pendingConnections.map((connection, index) => {
                    if (connection.from) {
                      return (
                        <View key={index}>
                          <Text>Sent to: {connection.user}</Text>
                        </View>
                      )
                    } else {
                      return (
                        <View key={index} style={{ display: 'flex', alignItems: "left", justifyContent: 'center' }}>
                          <Text>From: {connection.user}
                            <TouchableOpacity onPress={() => this.handleAccept(connection.id, connection, index)}>
                              <Icon name='check-circle-outline' color='green' size={25} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.handleDecline(connection.id, index)}>
                              <Icon name='remove-circle-outline' color='red' size={25} />
                            </TouchableOpacity>
                          </Text>
                        </View>
                      )
                    }
                  })
                }
              </ScrollView>
            </View>
            <Button title="Logout" onPress={this.logoutUser} style={{ paddingTop: 30 }} />
          </View>
        </Card>
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