import { Component } from "react";
import React from "react";
import { StyleSheet, Text, View, Button, Alert } from "react-native";
import { NavigationActions } from "react-navigation";
import PostsService from "../utils/posts";
import AuthService from "../utils/auth";
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
    // id esta aqui com o mesmo nome q ja tinhamos no componentDidMount,
    //por isso e que secalhar é melhor fazer mesmo aqui dentro, porque senao ele vai fazer setSstate 2 vezes
    //metemos tudo dentro da promessa na mesma, como estava anes, nvm, sim sim XD chamo lhe id? loggedInUserId ou assim

    let loggedInUserId;
    this.getDataFromAsyncStorage().then((res) => {
      loggedInUserId = res;
      let userPromise = this.userService.getUser(loggedInUserId);
      const connectionsService = new ConnectionsService();
      let connectionPromise = connectionsService.getUserConnections();
      Promise.all([userPromise, connectionPromise]).then((values) => {
          //este console log nao aparece, deve ser o connectionPromise que nao esta a acontecer, por isso nao faz mais nada
          //queres tentar ir so buscar o usar primeiro, e tirar as outras promessas? espera ai, deixa so ver o connections primeiro
          console.log(values[0].data)
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
  }

  handleAccept = (id, connection, index) => {
    //é preciso mudar esta tb, mas acho melhor metermos so um id no state, fica mais facil de ir buscar
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
  //falta o render ya, vai ser giro, vamos so por a informacao do user, depois logo metemos as connections e isso
  //ja meti a fazer export la em cima , nice, mete so username, email e isso
  render() {
    return (
      <View>
        <Text>{this.state.username}</Text>
        <Text>{this.state.email}</Text>
        <Text>
          {this.state.firstName} {this.state.lastName}
        </Text>
        <Text>{this.state.bio}</Text>
      </View>
    );
  }
}
