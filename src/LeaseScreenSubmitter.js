import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, AsyncStorage, Button, ScrollView, Image, FlatList, TouchableOpacity, Linking, TextInput, ActivityIndicator, KeyboardAvoidingView, Alert} from 'react-native';
import { SafeAreaView } from 'react-navigation';
import Mixpanel from 'react-native-mixpanel'
import styles from './styles'
import firebase from 'react-native-firebase';


export default class SubmitScreen extends React.Component {


  constructor(props) {
    super(props);
    this.state = { 
      email: '',
      thanks: false,
      loading: ''
       };
  }

  componentDidMount() {
      // get email, except if developer mode
      AsyncStorage.getItem('email').then((res) => {
        this.setState({email: res})
        {this.state.email ? Mixpanel.identify(this.state.email) : null }
        if(this.state.email !== 'niko'){Mixpanel.track("GetLease Touched") }
      })

      this.setState({item: this.props.navigation.getParam('item') })
      
      AsyncStorage.getItem('email').then(email => this.setState({email: email}) )
      firebase.analytics().logEvent('GetLease_Touched')

  }


  _onPress = async () => {
    Mixpanel.track("Email Button Pressed");
    this.setState({loading: true})
    console.log(this.state.email)
    if(this.state.email === '' || this.state.email === ' ' || this.state.email === null){
      Alert.alert('Please enter your email');
      this.setState({loading: false})
      return
    }
    else{
      this.setState({loading: true})
      // fetch('http://localhost:8080/api/leases/create/'+this.state.email+'/'+this.state.item.title, {
      fetch('https://electrade-server.herokuapp.com/api/leases/create/'+this.state.email+'/'+this.state.item.title, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          }
      })
      .then(() => {
          Mixpanel.track("Lease Request Submitted")
          firebase.analytics().logEvent('Lease_Request_Submitted');
          this.setState({thanks: true})
        } )
      .then(() => setTimeout(() => this.props.navigation.navigate('Lease'), 1000 ) )
    }
  }

  

  render() {
    return (
      <SafeAreaView style={{flex: 1}}>
        <KeyboardAvoidingView behavior="padding" enabled style={{flex: 1}}>

            <TouchableOpacity 
                  onPress={() => this.props.navigation.goBack()} 
                  style={{left: 10}}>
              <View style={{padding: 5}}>
                <Text style={{fontSize: 18, color: 'dodgerblue'}}>
                    Back
                </Text>
              </View>
            </TouchableOpacity>

          {!this.state.thanks ? 
            <ScrollView style={{flex: 1}}>
              <View style={{marginBottom: 80}}>
                <View style={styles.deal}>

                <Text style={[styles.newsTitle, {fontSize: 20}]}>
                  Thanks for your interest!
                  {'\n'}
                </Text>

                <Text>
                  Unfortunately, we're dealing with higher demand than anticipated. We're expecting this deal to be live again very soon. Please enter your email below to join the waitlist, and we will notify you once it is available again.
                  {'\n'}{'\n'}
                </Text>


                {/* EMAIL */}
                  <View>
                    <Text style={styles.newsTitle}>Email</Text>
                    <TextInput 
                      underlineColorAndroid="transparent"
                      style={styles.textInput}
                      placeholder={'Email'}
                      value={this.state.email}
                      autoCapitalize = 'none'
                      keyboardType={'email-address'}
                      onChangeText={ (text) => {  this.setState({email: text}) }}
                      />
                  </View>


                  <Button 
                    style={[{backgroundColor: '#2191fb' }, styles.bottomButton]}
                    onPress={() => this._onPress()} 
                    title="Join Waitlist" />

                  {this.state.loading ? <ActivityIndicator /> : null}

                </View>
              </View>
            </ScrollView>:

            <View style={{marginTop: 100, alignItems: 'center'}}>
              <Text style={{color: 'grey', fontSize: 25, fontWeight: '300'}}>Thank you! We'll be in touch soon.</Text>
            </View> }
          

        </KeyboardAvoidingView>
      </SafeAreaView>
    );

  }
}

