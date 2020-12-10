import { Component } from "react";
import React from "react";
import { StyleSheet, Text, View, Button, Alert } from "react-native";
import UserService from "../utils/user";
import ConnectionsService from "../utils/connections";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

  render() {
    return (
      <View style={styles.container}>
        <Text>{this.state.username}</Text>
        <Text>{this.state.email}</Text>
        <Text>
          {this.state.firstName} {this.state.lastName}
        </Text>
        <Text>{this.state.bio}</Text>
        {
          this.state.pendingConnections.map((connection, index) => {
            if (connection.from) {
              return (
                <View key={{ index }}>
                  <Text>Sent to: {connection.user}</Text>
                </View>
              )
            } else {
              return (
                <View key={{ index }}>
                  <Text>From: {connection.user}
                    <Button title="Accept" onPress={() => this.handleAccept(connection.id, connection, index)} />
                    <Button title="Decline" onPress={() => this.handleDecline(connection.id, index)} />
                  </Text>
                </View>
              )
            }
          })
        }
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