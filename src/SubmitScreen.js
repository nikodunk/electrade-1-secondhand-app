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
      // get email, except if developer mode
      AsyncStorage.getItem('email').then((res) => {
        this.setState({email: res})
        {this.state.email ? Mixpanel.identify(this.state.email) : null }
        if(this.state.email !== 'niko'){Mixpanel.track("SubmitScreen Loaded") }
        // if(this.state.email === 'niko'){ AsyncStorage.removeItem('remainingtrials') }
      })

      this.setState({listingType: this.props.navigation.getParam('listingType') })
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
            link: 'mailto:'+this.state.email
          }),
      }).then(() => AsyncStorage.setItem('email', this.state.email ))
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

      let photo = {
          uri: image.path,
          type: image.mime,
          name: image.filename,
      };

      let body = new FormData();
      body.append('image', photo);
      // body.append('title', 'A beautiful photo!');

      let serverURL = 'https://electrade-server.herokuapp.com/upload/image'
      // let serverURL = 'http://localhost:8080/upload/image'

      let request = new XMLHttpRequest();

      request.onreadystatechange = (e) => {
        if (request.readyState !== 4) {
          return;
        }

        if (request.status === 200) {
          // console.log('success:', request.responseText);
          console.log(request.responseText)
          console.log('successfully saved to S3');
          this.setState({image: request.responseText.substring(1, request.responseText.length-1)})

        } else {
          console.log('error:', request.responseText);
        }
      };

      request.open('POST', serverURL );
      request.send(body);


    });
  }


  _takeImage = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
    }).then(image => {
      console.log(image);

      let photo = {
          uri: image.path,
          type: image.mime,
          name: Date.now().toString(),
      };

      let body = new FormData();
      body.append('image', photo);
      // body.append('title', 'A beautiful photo!');

      let serverURL = 'https://electrade-server.herokuapp.com/upload/image'
      // let serverURL = 'http://localhost:8080/upload/image'

      let request = new XMLHttpRequest();

      request.onreadystatechange = (e) => {
        if (request.readyState !== 4) {
          return;
        }

        if (request.status === 200) {
          // console.log('success:', request.responseText);
          console.log(request.responseText)
          console.log('successfully saved to S3');
          this.setState({image: request.responseText.substring(1, request.responseText.length-1)})

        } else {
          console.log('error:', request.responseText);
        }
      };

      request.open('POST', serverURL );
      request.send(body);


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

          <ScrollView>

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

                 {!this.state.image ?
                  <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-around'}}>
                    <Button 
                      style={[{backgroundColor: '#2191fb' }, styles.bottomButton]}
                      onPress={() => this._pickImage()} 
                      title="Pick Image" />
                    <Button 
                      style={[{backgroundColor: '#2191fb' }, styles.bottomButton]}
                      onPress={() => this._takeImage()} 
                      title="Open Camera" />
                  </View> 
                  : null }

                 {this.state.image ? <Image  style={styles.imageCar} source={{uri: this.state.image}} /> : null }

                  <TextInput 
                      underlineColorAndroid="transparent"
                      style={styles.textInput}
                      value={this.state.email}
                      autoCapitalize = 'none'
                      keyboardType={'email-address'}
                      onChangeText={ (text) => {  this.setState({email: text}) }}
                  />


                  <Button 
                    style={[{backgroundColor: '#2191fb' }, styles.bottomButton]}
                    onPress={() => this._onPress()} 
                    title="Submit" />
                  {this.state.loading ? <ActivityIndicator /> : null}
                </View>


          </ScrollView>

        </View>
    );

  }
}

