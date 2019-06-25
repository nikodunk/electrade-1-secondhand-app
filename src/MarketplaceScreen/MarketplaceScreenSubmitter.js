import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, AsyncStorage, ScrollView, Image, FlatList, TouchableOpacity, Linking, TextInput, ActivityIndicator, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import Mixpanel from 'react-native-mixpanel'
import { Button } from 'react-native-elements';


import styles from '../styles'


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
        if(this.state.email !== 'niko'){Mixpanel.track("Marketplace Submit Loaded") }
      })

      this.setState({listingType: this.props.navigation.getParam('listingType') })
      this.setState({type: this.props.navigation.getParam('type') })
      
      AsyncStorage.getItem('email').then(email => this.setState({email: email}) )

      // this._takeImage()
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
      //let serverURL = 'http://localhost:8080/upload/image'

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
                <View style={styles.deal} >


                <Text style={[styles.newsTitle, {fontSize: 20}]}>Sell your EV</Text>

                {/* CAR MODEL */}
                <Text style={styles.newsTitle}>Car Year & Model</Text>
                  <TextInput 
                      underlineColorAndroid="transparent"
                      style={styles.textInput}
                      placeholder={'Car Year & Model'}
                      onChangeText={ (text) => {  this.setState({name: text}) }}
                  />

                {/* REQUESTED PRICE */}
                  {this.state.listingType === 'gallery' ? null :
                  <View>
                    <Text style={styles.newsTitle}>Requested Price</Text>
                    <TextInput 
                          underlineColorAndroid="transparent"
                          style={styles.textInput}
                          placeholder={'Requested Price'}
                          keyboardType={'decimal-pad'}
                          onChangeText={ (text) => {  this.setState({price: text}) }}
                      />
                  </View>}

                {/* YOUR CONTACT */}
                  {this.state.listingType === 'gallery' ? null : 
                  <View>
                    <Text style={styles.newsTitle}>How to contact you</Text>
                    <TextInput 
                      underlineColorAndroid="transparent"
                      style={styles.textInput}
                      placeholder={'Your Email'}
                      value={this.state.email}
                      autoCapitalize = 'none'
                      keyboardType={'email-address'}
                      onChangeText={ (text) => {  this.setState({email: text}) }}
                      />
                  </View> }

                {/* YOUR CONTACT */}
                  {this.state.listingType === 'gallery' ? null : 
                  <View>
                    <Text style={styles.newsTitle}>Miles</Text>
                    <TextInput 
                      underlineColorAndroid="transparent"
                      style={styles.textInput}
                      placeholder={'Miles'}
                      value={this.state.miles}
                      autoCapitalize = 'none'
                      onChangeText={ (text) => {  this.setState({miles: text}) }}
                       />
                  </View> }


                  {!this.state.image ?
                  <View>
                     <Text style={styles.newsTitle}>Image</Text>
                     <View style={[styles.textInput, {display: 'flex', flexDirection: 'row', justifyContent: 'space-around', height: 100, paddingTop: 30}]}>
                       <Button
                         type="clear"
                         onPress={() => this._pickImage()} 
                         title="Pick Image" />
                       <Button 
                         type="clear"
                         onPress={() => this._takeImage()} 
                         title="Open Camera" />
                     </View> 
                  </View>
                   : null }

                  {this.state.image ? <Image  style={styles.imageDetail} source={{uri: this.state.image}} /> : null }


                  {this.state.listingType === 'gallery' ? null : 
                  <View>
                    <Text style={styles.newsTitle}>Your Location</Text>
                    <TextInput 
                      underlineColorAndroid="transparent"
                      style={styles.textInput}
                      placeholder={'Location'}
                      value={this.state.location}
                      autoCapitalize = 'none'
                      onChangeText={ (text) => {  this.setState({location: text}) }}
                      />
                  </View> }

                  {this.state.listingType === 'gallery' ? null : 
                  <View>
                    <Text style={styles.newsTitle}>Battery Size</Text>
                    <TextInput 
                      underlineColorAndroid="transparent"
                      style={styles.textInput}
                      placeholder={'Battery Size (ie. 64kWh)'}
                      value={this.state.batterysize}
                      autoCapitalize = 'none'
                      onChangeText={ (text) => {  this.setState({batterysize: text}) }}
                      />
                  </View> }

                  {this.state.listingType === 'gallery' ? null : 
                  <View>
                    <Text style={styles.newsTitle}>Current range</Text>
                    <TextInput 
                      underlineColorAndroid="transparent"
                      style={styles.textInput}
                      placeholder={'Remaining range at 100% charge'}
                      value={this.state.range}
                      autoCapitalize = 'none'
                      onChangeText={ (text) => {  this.setState({range: text}) }}
                      />
                  </View> }

                  <Text></Text>
                  <Text></Text>

                  <Button
                    type="solid"
                    buttonStyle={styles.bigButton}
                    onPress={() => this.props.navigation.navigate('Submit', {listingType: this.state.listingType, type: 'Marketplace'} )}
                    title="Submit" 
                    />

                  {this.state.loading ? <ActivityIndicator /> : null}

                  </View>
                </View>
            </ScrollView>
          

        </KeyboardAvoidingView>
      </SafeAreaView>
    );

  }
}

