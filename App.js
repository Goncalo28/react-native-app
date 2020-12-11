import React, { Component } from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from "./screens/Login"
import HomeScreen from "./screens/Home"
import SignUp from './screens/SignUp'
import Dashboard from './screens/Dashboard'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from "@react-native-async-storage/async-storage"
import Profile from './screens/Profile'
import AddPost from './screens/AddPost';
import Search from './screens/Search';
import Chat from './screens/Chat';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { Icon } from 'react-native-elements'

const Auth = createStackNavigator();
const AuthStack = () => (
  <Auth.Navigator
    initialRouteName="Home"
    screenOptions={{
      animationEnabled: false
    }}
  >
    <Auth.Screen name="Home" component={HomeScreen} />
    <Auth.Screen name="Login" component={LoginScreen} />
    <Auth.Screen name="SignUp" component={SignUp} />
  </Auth.Navigator>
)
// drawer use only in authenticated screens
const Tabs = createMaterialBottomTabNavigator();
const TabsStack = () => (
  <Tabs.Navigator initialRouteName="Dashboard" barStyle={{ backgroundColor: '#63BCE5', paddingBottom: 20, paddingTop: 10 }}>
    <Tabs.Screen name="Dashboard" component={Dashboard} options={{
      tabBarLabel: 'Home',
      tabBarIcon: ({ tintColor }) => (
        <Icon name='home' color='white' />
      ),
      tabBarOptions: { activeTintColor: 'red' },

    }} />
    <Tabs.Screen name="Profile" component={Profile} options={{
      tabBarLabel: 'Profile',
      tabBarIcon: () => (
        <Icon name='account-box' color='white' />
      ),
    }} />
    <Tabs.Screen name="Post" component={AddPost} options={{
      tabBarLabel: 'Add Post',
      tabBarIcon: () => (
        <Icon name='add-circle-outline' color='white' />
      ),
    }} />
    <Tabs.Screen name="Search" component={Search} options={{
      tabBarLabel: 'Users',
      tabBarIcon: () => (
        <Icon name='search' color='white' />
      ),
    }} />
    <Tabs.Screen name="Chat" component={Chat} options={{
      tabBarLabel: 'Chat',
      tabBarIcon: () => (
        <Icon name='textsms' color='white' />
      ),
    }} />
  </Tabs.Navigator>
)
const RootStack = createStackNavigator();


class App extends Component {
  state = {
    loading: true,
    hasToken: false
  }

  componentDidMount() {
    AsyncStorage.getItem('loggedInUser').then((token) => {
      this.setState({ hasToken: token !== null, loading: false })
    })
  }

  render() {
    const { loading, hasToken } = this.state;
    console.log(hasToken)
    if (loading) {
      return (
        <HomeScreen />
      )
    }
    else {
      return (
        <NavigationContainer>
          <RootStack.Navigator headerMode="none">
            <RootStack.Screen name='Auth' component={AuthStack} />
            <RootStack.Screen name='App' component={TabsStack} />
          </RootStack.Navigator>
        </NavigationContainer>
      );
    }
  }
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
