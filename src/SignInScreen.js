import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Button, AsyncStorage, KeyboardAvoidingView, TextInput, ActivityIndicator, Alert} from 'react-native';
import { SafeAreaView } from 'react-navigation';
import * as Animatable from 'react-native-animatable';
import Mixpanel from 'react-native-mixpanel'
Mixpanel.sharedInstanceWithToken('99a084449cc885327b81217f3433be3a')

export default class SignInScreen extends React.Component {

  static navigationOptions = {
    title: 'Welcome!',
    headerMode: 'none'
  };

  constructor(props) {
    super(props);
    this.state = { 
        loading: false,
        email: ''
       };
  }


  componentDidMount() {
      Mixpanel.track("EmailScreen Loaded");
      AsyncStorage.getItem('email').then((res) => {
        email = res
        this.setState({email: email})
      })
      AsyncStorage.setItem('region', JSON.stringify('SF Bay Area'))
  }


  _onPress = async (email) => {
    Mixpanel.track("Email Button Pressed");
    this.setState({loading: true})
    console.log(email)
    if(email === '' || email === ' ' || email === null){
      Alert.alert('Please enter your email');
      this.setState({loading: false})
      return
    }
    else{
      // fetch('http://localhost:8080/api/users/create/'+email, {
      fetch('https://electrade-server.herokuapp.com/api/users/create/'+email, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email
          }),
      }).then(() => AsyncStorage.setItem('email', email ))
        .then(() => this.props.navigation.navigate('App'))
    }
  };


  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Animatable.View animation="fadeIn" duration={1000}>
          { this.state.loading ? 
                      
                      <ActivityIndicator style={{marginTop: 10}} color="black" />
                      
                      : 
                      <KeyboardAvoidingView behavior="padding" enabled>

                        <View style={styles.signin}>
                          <Text></Text>
                          <View>
                            <Text style={{fontWeight: '500', color: 'dodgerblue', fontSize: 20}}>Be part of the oncoming electric revolution from here.</Text>
                            <Text></Text>
                          <TextInput 
                              underlineColorAndroid="transparent"
                              style={styles.textInput}
                              placeholder={'Enter email'}
                              autoFocus={true}
                              autoCapitalize = 'none'
                              keyboardType={'email-address'}
                              onChangeText={ (text) => {  this.setState({email: text}) }}
                          />
                          <Button
                            onPress={() => this._onPress(this.state.email)}
                            title="Let's Go!" />
                          </View>
                          <Text style={{color: 'grey'}}>Your email is only for the rare feedback email to improve the app. I won't sell it, I won't spam you.</Text>
                        </View>



                      </KeyboardAvoidingView>
                    }

        </Animatable.View>
      </SafeAreaView>
    );
  }

  
}