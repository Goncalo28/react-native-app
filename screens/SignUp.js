import React from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AuthService from '../utils/auth';
import { NavigationActions } from "react-navigation";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default class SignUp extends React.Component {
    state = {
        username: '',
        password: '',
        email: "",
        firstName: "",
        lastName: "",
        typeOfUser: "Investor"
    }

    storeData = async (userId) => {
        try {
            await AsyncStorage.setItem("loggedInUser", userId);
        } catch (error) {
            console.log(error);
        }
    };

    handleSubmit = () => {
        const authService = new AuthService();
        authService.signup(this.state)
            .then((res) => {
                let user = res.data;
                console.log(user)
                this.storeData(user._id).then(() => {
                    this.setState({
                        username: '',
                        password: '',
                        email: "",
                        firstName: "",
                        lastName: "",
                        typeOfUser: ""
                    });
                    this.props.navigation.navigate(
                        "App",
                        { loggedInUser: user._id },
                        NavigationActions.navigate("Dashboard")
                    );

                })
            }).catch((err) => {
                Alert.alert("Register unsuccesful")
            })
    }


    render() {
        return (
            <View style={{ padding: 10 }}>
                <TextInput
                    style={{ height: 40 }}
                    placeholder="Username"
                    onChangeText={(text) =>
                        this.setState({ username: text })
                    }
                    defaultValue={this.state.username}
                />
                <TextInput
                    secureTextEntry={true}
                    style={{ height: 40 }}
                    placeholder="Password"
                    onChangeText={(text) =>
                        this.setState({ password: text })
                    }
                    defaultValue={this.state.password}
                />
                <TextInput
                    style={{ height: 40 }}
                    placeholder="Email"
                    onChangeText={(text) =>
                        this.setState({ email: text })
                    }
                    defaultValue={this.state.email}
                />
                <TextInput
                    style={{ height: 40 }}
                    placeholder="First Name"
                    onChangeText={(text) =>
                        this.setState({ firstName: text })
                    }
                    defaultValue={this.state.firstName}
                />
                <TextInput
                    style={{ height: 40 }}
                    placeholder="Last Name"
                    onChangeText={(text) =>
                        this.setState({ lastName: text })
                    }
                    defaultValue={this.state.lastName}
                />
                <Picker
                    selectedValue={this.state.typeOfUser}
                    style={{ height: 50, width: 100 }}
                    onValueChange={(itemValue, itemIndex) =>
                        this.setState({ typeOfUser: itemValue })
                    }>
                    <Picker.Item label="Investor" value="Investor" />
                    <Picker.Item label="Innovator" value="Innovator" />
                </Picker>
                <Button title="Register" onPress={this.handleSubmit} />
            </View>
        )
    }
}
