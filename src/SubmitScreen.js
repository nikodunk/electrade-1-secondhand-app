import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, AsyncStorage, Button, ScrollView, Image, FlatList, TouchableOpacity, Linking, TextInput, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import Mixpanel from 'react-native-mixpanel'

import styles from './styles'


import ImagePicker from 'react-native-image-crop-picker';

export default class SubmitScreen extends React.Component {


  constructor(props) {
    super(props);
    this.state = { 
      name: null,
      price: null,
      image: null,
      email: null,
      loading: false,
      listingType: null
       };
  }

  componentDidMount() {
      Mixpanel.track("SubmitScreen Loaded");
      this.setState({listingType: this.props.navigation.getParam('listingType') })
  }


  _onPress = async (name, price, email, listingType) => {
    Mixpanel.track("Email Button Pressed");
    this.setState({loading: true})
    console.log(email)
    if(email === '' || email === ' ' || email === null){
      Alert.alert('Please enter your email');
      this.setState({loading: false})
      return
    }
    else{
      this.setState({loading: true})
      fetch('https://electrade-server.herokuapp.com/api/listings/create/'+listingType, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: name,
            price: price,
            image: 'http://nikodunk.com',
            link: 'mailto:'+email
          }),
      }).then(() => AsyncStorage.setItem('email', email ))
        .then(() => this.props.navigation.goBack())
    }
  }

  _pickImage = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true
    }).then(image => {
      console.log(image);
    });
  }
 

  render() {
    return (
       <View>

        <TouchableOpacity 
              onPress={() => this.props.navigation.goBack()} 
              style={{left: 10, marginTop: 30}}>
          <View style={{padding: 5}}>
            <Text style={{fontSize: 18, color: 'dodgerblue'}}>
                Back
            </Text>
          </View>
        </TouchableOpacity>

          <ScrollView style={{height: '100%'}}>

                <View style={{margin: 20}}>
                  <Text style={styles.newsTitle}>Add your EV</Text>
                  <TextInput 
                      underlineColorAndroid="transparent"
                      style={styles.textInput}
                      placeholder={'Car Model'}
                      autoFocus={true}
                      onChangeText={ (text) => {  this.setState({name: text}) }}
                  />
                  <TextInput 
                      underlineColorAndroid="transparent"
                      style={styles.textInput}
                      placeholder={'Requested Price'}
                      keyboardType={'decimal-pad'}
                      onChangeText={ (text) => {  this.setState({price: text}) }}
                  />
                  <TextInput 
                      underlineColorAndroid="transparent"
                      style={styles.textInput}
                      placeholder={'Your email'}
                      autoCapitalize = 'none'
                      keyboardType={'email-address'}
                      onChangeText={ (text) => {  this.setState({email: text}) }}
                  />

                  <Button 
                    style={[{backgroundColor: '#2191fb' }, styles.bottomButton]}
                    onPress={() => this._pickImage()} 
                    title="Pick Image" />


                  <Button 
                    style={[{backgroundColor: '#2191fb' }, styles.bottomButton]}
                    onPress={() => this._onPress(this.state.name, this.state.price, this.state.email, this.state.listingType)} 
                    title="Submit" />
                  {this.state.loading ? <ActivityIndicator /> : null}
                </View>


          </ScrollView>

        </View>
    );

  }
}

