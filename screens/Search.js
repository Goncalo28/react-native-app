import { Component } from "react";
import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  Alert,
  TouchableOpacity,
  Modal,
  ScrollView,
  SafeAreaView
} from "react-native";
import UserService from "../utils/user";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ConnectionsService from '../utils/connections';
import { ListItem, Input } from 'react-native-elements'
import { Icon } from 'react-native-elements'


export default class SAearch extends Component {
  state = {
    users: [],
    usersCopy: [],
    search: "",
    userInfo: {
      username: "",
      email: "",
      firstName: "",
      lastName: "",
      bio: "",
      typeOfUser: "",
      connections: [],
      id: "",
      status: ""
    },
    modalVisible: false,
    loggedInUser: ''
  };

  componentDidMount() {
    let loggedInUser;
    this.getDataFromAsyncStorage().then((res) => {
      loggedInUser = res
      const userService = new UserService();
      userService.getAllUsers().then((users) => {
        this.setState({
          users: users.data,
          usersCopy: users.data,
          loggedInUser: loggedInUser
        });
      });
    })
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

  getDataFromAsyncStorage = async () => {
    let loggedInUser;
    try {
      loggedInUser = await AsyncStorage.getItem("loggedInUser");
      return loggedInUser;
    } catch (error) {
      console.log(error);
    }
  };

  goToProfile = (id) => {
    let loggedInUser;
    this.getDataFromAsyncStorage().then((res) => {
      loggedInUser = res
      let connectionStatus = "";
      const userService = new UserService();
      userService.getUser(id)
        .then((user) => {
          const connectionsService = new ConnectionsService()
          connectionsService.getUserConnections()
            .then((connections) => {
              let userConnections = connections.data.filter((connection) => {
                return ((connection.from === id &&
                  connection.to === loggedInUser) ||
                  (connection.to === id &&
                    connection.from === loggedInUser
                  )
                );
              })
              if (userConnections.length > 0) {
                connectionStatus = "pending"
              }
              if (user.data.connections.includes(loggedInUser) && connectionStatus !== "pending") {
                connectionStatus = "connected"
              } else if (!user.data.connections.includes(loggedInUser) && connectionStatus !== "pending") {
                connectionStatus = "notConnected"
              }
              this.setState({
                modalVisible: true,
                userInfo: {
                  username: user.data.username,
                  email: user.data.email,
                  firstName: user.data.firstName,
                  lastName: user.data.lastName,
                  bio: user.data.bio,
                  typeOfUser: user.data.typeOfUser,
                  connections: user.data.connections,
                  id: user.data._id,
                  status: connectionStatus
                }
              })
            })
        })
    })
  };

  handleConnection = () => {
    let loggedUser;
    this.getDataFromAsyncStorage().then((res) => {
      loggedUser = res
      const connectionsService = new ConnectionsService()
      connectionsService.getUserConnections()
        .then((connections) => {
          let userConnections = connections.data.filter((connection) => {
            return ((connection.from === this.state.userInfo.id &&
              connection.to === loggedUser) ||
              (connection.to === this.state.userInfo.id &&
                connection.from === loggedUser)
            )
          });
          if (!userConnections.length) {
            connectionsService.createConnection(this.state.userInfo.id)
              .then((newConnection) => {
                this.setState({
                  userInfo: {
                    status: 'pending'
                  }
                })
                return
              })
          }
        })
    })
  }


  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>{this.state.userInfo.username}</Text>
              <Text style={{ fontSize: 16 }}>Email: {this.state.userInfo.email}</Text>
              <Text style={{ fontSize: 16 }}>Name: {this.state.userInfo.firstName} {this.state.userInfo.lastName}</Text>
              <Text style={{ fontSize: 16 }}>About: {this.state.userInfo.bio}</Text>
              {
                this.state.userInfo.status === "connected" ? <Text style={{ fontSize: 17 }}>Already connected</Text> :
                  this.state.userInfo.status === "pending" ? <Text style={{ fontSize: 17 }}>Pending</Text> :
                    <Button title="Connect" onPress={this.handleConnection} />
              }
              <Button title='Hide Profile'
                color='red'
                onPress={() => {
                  this.setState({ modalVisible: !this.state.modalVisible });
                }}
              />

            </View>
          </View>
        </Modal>
        <Input
          style={{ height: 50, width: '100%', textAlign: 'center' }}
          placeholder="Search by username here..."
          onChangeText={(text) => {
            this.handleSearch(text);
          }}
          defaultValue={this.state.search}
        />
        <ScrollView style={{ width: '100%' }}>
          {
            this.state.usersCopy.map((user, index) => {
              if (user._id.toString() === this.state.loggedInUser.toString()) {
                return null
              } else {
                return (
                  <TouchableOpacity onPress={() => this.goToProfile(user._id)} key={user._id} style={{ marginBottom: 10 }}>
                    <ListItem bottomDivider key={index}>
                      <Icon name='account-circle' color='rgb(9, 161, 245)' />
                      <ListItem.Content>
                        <ListItem.Title>{user.username}</ListItem.Title>
                        <ListItem.Subtitle>{user.typeOfUser}</ListItem.Subtitle>
                      </ListItem.Content>
                      <ListItem.Chevron />
                    </ListItem>
                  </TouchableOpacity>
                );
              }

            })
          }
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 20
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10
  },
  modalView: {
    margin: 20,
    height: '70%',
    width: '80%',
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    justifyContent: "space-evenly",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  modalText: {
    fontSize: 25,
    color: '#4B9FE1',
  }

})