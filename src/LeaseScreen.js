// https://forum.leasehackr.com/t/bolt-ev-lease-bay-area-10k-36-mo-as-low-as-250-mo-plus-tax-w-3-300-drive-off-net-0-with-cvrp-and-pg-e-chevyphil-415-596-6262/100847/42

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, AsyncStorage, Button, ScrollView, Image, FlatList, TouchableOpacity, Linking, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import Details from './DetailScreen';
import Mixpanel from 'react-native-mixpanel'
import * as Animatable from 'react-native-animatable';
Mixpanel.sharedInstanceWithToken('99a084449cc885327b81217f3433be3a')
import firebase from 'react-native-firebase';


export default class HomeScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = { 
      data: null,
      email: null,
      loading: null
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
  }


  

  render() {
    return (
      <SafeAreaView style={{flex: 1}}>
        <ScrollView style={{flex: 1}}>
              <View style={styles.deal}>
                <Text>
                  Your Region: Bay Area
                </Text>
              </View>
              <View style={styles.deal}>
                <Text style={styles.newsTitle}>
                  Bolt EV
                </Text>
                <Text></Text>
                <Text style={styles.newsTitle}>
                  $377/mo plus tax, $0 down
                </Text>
                <Text>
                  36 months, 10'000 miles per year{'\n'}
                  (add $11/mo or $400 for 12k) {'\n'}
                  (add $31 or $1,100 for 15k) {'\n'}
                  Prices are only for excellent credit {'\n'}
                  Drive off amounts include all upfront tax and fees {'\n'}{'\n'}{'\n'}

                  Phil Gileno
                  415-596-6262
                  Capitol Chevy
                  San Jose C.A.
                  PhilGileno@gmail.com
                </Text>
              </View>
        </ScrollView>
      </SafeAreaView>
    );

  }
}