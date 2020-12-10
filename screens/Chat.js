import React from 'react'
import io from 'socket.io-client'
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';

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
                <TextInput
                    style={{ height: 40 }}
                    placeholder="Name!"
                    onChangeText={(text) =>
                        this.setState({ name: text })
                    }
                    defaultValue={this.state.name}
                />

                <TextInput
                    style={{ height: 40 }}
                    placeholder="Message"
                    onChangeText={(text) =>
                        this.setState({ message: text })
                    }
                    defaultValue={this.state.message}
                />
                <View>
                    <Button title="Send" onPress={this.onMessageSubmit} />
                </View>
                <Text>Chat</Text>
                {this.state.chat.map(({ name, message }, index) => (
                    <Text key={index}>{name}: {message}</Text>
                )
                )}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    }
})