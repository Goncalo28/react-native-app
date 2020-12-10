import { StatusBar } from 'expo-status-bar';
import React, {Component} from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
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

const Auth = createStackNavigator();
 const AuthStack =()=> (
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
const Tabs = createBottomTabNavigator();
const TabsStack = () => (
        <Tabs.Navigator initialRouteName="Dashboard">
            <Tabs.Screen name="Dashboard" component={Dashboard} />
            <Tabs.Screen name="Profile" component={Profile} />
            <Tabs.Screen name="AddPost" component={AddPost} />
        </Tabs.Navigator>
)
const RootStack = createStackNavigator();


class App extends Component {
  state = {
    loading: true,
    hasToken: false  
  }

  componentDidMount(){
    AsyncStorage.getItem('loggedInUser').then((token) => {
      this.setState({ hasToken: token !== null,loading:false})
    })
  }

/*   componentDidMount() {
    if (this.state.loggedInUser === null) {
      const authService = new AuthService();
      authService.loggedin().then((response) => {
        if (response.data._id) {
          this.setCurrentUser(response.data);
        } else {
          localStorage.removeItem("loggedInUser");
        }
      });
    }
  } */
  

render () {
  const {loading,hasToken} = this.state;
  console.log(hasToken)
  if (loading) {
    return <HomeScreen/>
  } 
 else  {
    return(
        <NavigationContainer>
           <RootStack.Navigator headerMode="none">
            <RootStack.Screen name='Auth' component={AuthStack}/>
            <RootStack.Screen name='App' component={TabsStack}/>
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
