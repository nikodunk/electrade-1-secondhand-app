import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, AsyncStorage, Button, ScrollView, Image, FlatList, TouchableOpacity, Linking, TextInput, ActivityIndicator, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import Mixpanel from 'react-native-mixpanel'

import styles from './styles'


import ImagePicker from 'react-native-image-crop-picker';

export default class SubmitScreen extends React.Component {


  constructor(props) {
    super(props);
    this.state = { 
      name: '',
      price: '',
      image: '',
      email: '',
      
      source: 'electrade',
      miles: '',
      location: '',
      batterysize: '',
      range: '',

      loading: '',
      listingType: null
       };
  }

  componentDidMount() {
      // get email, except if developer mode
      AsyncStorage.getItem('email').then((res) => {
        this.setState({email: res})
        {this.state.email ? Mixpanel.identify(this.state.email) : null }
        if(this.state.email !== 'niko'){Mixpanel.track("SubmitScreen Loaded") }
      })

      this.setState({listingType: this.props.navigation.getParam('listingType') })
      this.setState({type: this.props.navigation.getParam('type') })
      
      AsyncStorage.getItem('email').then(email => this.setState({email: email}) )

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
      fetch('https://electrade-server.herokuapp.com/api/listings/create/'+this.state.listingType, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: this.state.name,
            price: this.state.price,
            image: this.state.image,
            link: 'mailto:'+this.state.email,
            source: this.state.source,
            miles: this.state.miles,
            location: this.state.location,
            batterysize: this.state.batterysize,
            range: this.state.range,
          }),
      }).then(() => AsyncStorage.setItem('email', this.state.email ))
        .then(() => this.props.navigation.goBack())
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

            <ScrollView style={{flex: 1}}>
              <View style={{marginBottom: 80}}>
                <View style={styles.deal}>


                {/* CAR MODEL */}
                <Text style={styles.newsTitle}>Company Name</Text>
                  <TextInput 
                      underlineColorAndroid="transparent"
                      style={styles.textInput}
                      placeholder={'Company Name'}
                      onChangeText={ (text) => {  this.setState({name: text}) }}
                  />

                {/* REQUESTED PRICE */}
                  {this.state.listingType === 'gallery' ? null :
                  <View>
                    <Text style={styles.newsTitle}>First & Last Name</Text>
                    <TextInput 
                          underlineColorAndroid="transparent"
                          style={styles.textInput}
                          placeholder={'First & Last Name'}
                          keyboardType={'decimal-pad'}
                          onChangeText={ (text) => {  this.setState({price: text}) }}
                      />
                  </View>}

                {/* YOUR CONTACT */}
                  {this.state.listingType === 'gallery' ? null : 
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
                  </View> }

                  <Button 
                    style={[{backgroundColor: '#2191fb' }, styles.bottomButton]}
                    onPress={() => this._onPress()} 
                    title="Submit" />

                  {this.state.loading ? <ActivityIndicator /> : null}

                </View>
              </View>
            </ScrollView>
          

        </KeyboardAvoidingView>
      </SafeAreaView>
    );

  }
}

