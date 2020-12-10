import { Component } from "react";
import React from "react";
import { StyleSheet, Text, View, Button, Alert, TextInput } from "react-native";
import { NavigationActions } from "react-navigation";
import PostsService from "../utils/posts";
import AuthService from "../utils/auth";
import UserService from "../utils/user";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default class SAearch extends Component {
    state={
        users: [],
        usersCopy: [],
        search: ""
    }

    componentDidMount(){
    const userService = new UserService()
    userService.getAllUsers()
        .then((users) => {
            this.setState({
                users: users.data,
                usersCopy: users.data

            })
        })
    }






}