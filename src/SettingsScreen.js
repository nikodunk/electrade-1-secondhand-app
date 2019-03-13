import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, AsyncStorage, Button, ScrollView, Image, FlatList, TouchableOpacity, Linking, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import Details from './DetailScreen';
import Mixpanel from 'react-native-mixpanel'
import * as Animatable from 'react-native-animatable';
Mixpanel.sharedInstanceWithToken('99a084449cc885327b81217f3433be3a')
import firebase from 'react-native-firebase';


export default class SettingsScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = { 
      data: null,
      email: null,
      loading: null,
      region: null
       };

  }


  componentDidMount() {

      this.setState({loading: false})
      
      // get email, except if developer mode
      AsyncStorage.getItem('email').then((res) => {
        this.setState({email: res})
        if(this.state.email){ Mixpanel.identify(this.state.email); Mixpanel.set({"$email": this.state.email}); firebase.analytics().setUserId(this.state.email) }
        if(this.state.email !== 'niko'){Mixpanel.track("NewsScreen Loaded"); firebase.analytics().setCurrentScreen('NewsScreen Loaded') }
        // this seems to be android only but not sure yet 
        // Mixpanel.setPushRegistrationId("GCM/FCM push token")
      })

      AsyncStorage.getItem('region').then((res) => {
        if(this.state.region === null){this.setState({region: 'Bay Area'})}
        else{ this.setState({region: res}) }
      })

      
  }


  

  render() {
    return (
      <SafeAreaView style={{flex: 1}}>
        <ScrollView style={{flex: 1}}>
              <View style={styles.deal}>
                <Text style={styles.newsTitle}>
                  Your Region
                </Text>
                <Text>
                  {this.state.region}
                </Text>
              </View>

              <View style={styles.deal}>
                <Text style={styles.newsTitle}>
                  Your email:
                </Text>
                <Text>
                  {this.state.email}
                </Text>
              </View>

              <View>
                <Button
                  onPress={() => Linking.openURL("mailto:hello@sunboxlabs.com")}
                  title="Send Feedback to developers" />
              </View>
        </ScrollView>
      </SafeAreaView>
    );

  }
}