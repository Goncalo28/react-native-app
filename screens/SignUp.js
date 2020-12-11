import React from 'react';
import { View, StyleSheet, TextInput, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AuthService from '../utils/auth';
import { NavigationActions } from "react-navigation";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Input, Button } from 'react-native-elements';

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
            <View style={styles.container}>
                <Input
                    style={styles.input}
                    placeholder="Username"
                    onChangeText={(text) =>
                        this.setState({ username: text })
                    }
                    defaultValue={this.state.username}
                />
                <Input
                    style={styles.input}
                    secureTextEntry={true}
                    placeholder="Password"
                    onChangeText={(text) =>
                        this.setState({ password: text })
                    }
                    defaultValue={this.state.password}
                />
                <Input
                    style={styles.input}
                    placeholder="Email"
                    onChangeText={(text) =>
                        this.setState({ email: text })
                    }
                    defaultValue={this.state.email}
                />
                <Input
                    style={styles.input}
                    placeholder="First Name"
                    onChangeText={(text) =>
                        this.setState({ firstName: text })
                    }
                    defaultValue={this.state.firstName}
                />
                <Input
                    style={styles.input}
                    placeholder="Last Name"
                    onChangeText={(text) =>
                        this.setState({ lastName: text })
                    }
                    defaultValue={this.state.lastName}
                />
                <Picker
                    style={styles.picker}
                    selectedValue={this.state.typeOfUser}
                    onValueChange={(value) =>
                        this.setState({ typeOfUser: value })
                    }>
                    <Picker.Item label="Investor" value="Investor" />
                    <Picker.Item label="Innovator" value="Innovator" />
                </Picker>
                <View>
                    <Button title="Register" onPress={this.handleSubmit} />
                </View>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 110,
        paddingHorizontal: 20
    },
    button: {
        width: 150,
    },
    input: {
        marginBottom: 5,
    },
    picker: {
        marginTop: -30,
        marginBottom: 20
    }
})