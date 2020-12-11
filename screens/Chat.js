import React from 'react'
import io from 'socket.io-client'
import { StyleSheet, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Button, ListItem, Icon } from 'react-native-elements';
import { Input } from 'react-native-elements';

const socket = io.connect('https://meshsocialserver.herokuapp.com', {
    withCredentials: true,
})

export default class Chat extends React.Component {
    state = {
        message: '',
        name: '',
        chat: []
    }

    componentDidMount() {
        socket.on('message', ({ name, message }) => {
            this.setState({
                chat: [...this.state.chat, { name, message }]
            })
        })
    }


    onMessageSubmit = () => {
        const { name, message } = this.state
        socket.emit('message', { name, message })
        this.setState({
            message: '',
            name
        })
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={{ fontSize: 30, paddingTop: 20, paddingBottom: 20, color: 'rgb(9, 161, 245)' }}>Chat</Text>
                <View style={{ height: '60%', width: '100%' }}>
                    <ScrollView>
                        {this.state.chat.map(({ name, message }, index) => (
                            <ListItem key={index} style={{ paddingBottom: 10 }}>
                                <Icon name='account-circle' color='rgb(9, 161, 245)' />
                                <ListItem.Content>
                                    <ListItem.Subtitle>From: {name}</ListItem.Subtitle>
                                    <ListItem.Subtitle>{message}</ListItem.Subtitle>
                                </ListItem.Content>
                            </ListItem>
                        )
                        )}
                    </ScrollView>
                </View>
                <Input
                    placeholder="Enter your username here..."
                    onChangeText={(text) =>
                        this.setState({ name: text })
                    }
                    defaultValue={this.state.name}
                />
                <Input
                    placeholder="Type your message here..."
                    onChangeText={(text) =>
                        this.setState({ message: text })
                    }
                    defaultValue={this.state.message}
                />
                <Button buttonStyle={{ width: 250 }} title="Send" onPress={this.onMessageSubmit} />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 20
    }
})