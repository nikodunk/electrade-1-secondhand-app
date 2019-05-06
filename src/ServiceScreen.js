import React, {Component} from 'react';
import {Platform, Picker, StyleSheet, Text, View, AsyncStorage, ScrollView, Image, FlatList, TouchableOpacity, Linking, ActivityIndicator, Switch, TextInput } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import Mixpanel from 'react-native-mixpanel'
import * as Animatable from 'react-native-animatable';
Mixpanel.sharedInstanceWithToken('99a084449cc885327b81217f3433be3a')
import firebase from 'react-native-firebase';
import { Button, ListItem, Overlay } from 'react-native-elements';

import FeedbackComponent from './components/FeedbackComponent'
import LearnMoreCompontent from './components/LearnMoreComponent'

export default class SettingsScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = { 
      isVisible: false
       };
  }


  componentDidMount() {

      this.setState({loading: false})
      
      // get email, except if developer mode
      AsyncStorage.getItem('email').then((res) => {
        this.setState({email: res})
        if(this.state.email !== 'niko'){Mixpanel.track("Club Dashboard Loaded"); firebase.analytics().logEvent('Club_Dashboard_Loaded') }
        // this seems to be android only but not sure yet 
        // Mixpanel.setPushRegistrationId("GCM/FCM push token")
      })
  }


  _navigate(serviceString){
    Mixpanel.track(serviceString + " Touched");
    this.props.navigation.navigate('ServiceScreenSignup')
  }
 

  render() {

    const services = ['EV parking in prime locations (1 point)', 
                      'Request car wash at home or office (1 point)', 
                      'Request Trusted Mechanic Nearby',
                      'DMV Registration concierge service', 
                      'Get roadside assistance', 
                      'Get windshield replacement',
                      'Request free EV test drive',
                      'See Preferred EV Insurance Rates',
                      'Go to EV forum (coming soon)',
                      'Buy/sell/trade your EV (premium listings)', 
                      'Rent an EV',
                      'Go to home solar installation offers',
                      'Go to EV accessory shop']

    const list = [
      {
        title: 'Exclusive EV parking',
        icon: 'map'
      },
      {
        title: 'Get roadside assistance',
        icon: 'battery-charging-full'
      },
      {
        title: 'DMV / Rebate Concierge',
        icon: 'perm-identity'
      },
      {
        title: 'Schedule maintenance pick-up',
        icon: 'build'
      },
      {
        title: 'Request EV test drive',
        icon: 'directions-car'
      },
      {
        title: 'See Preferred EV Insurance Rates',
        icon: 'insert-chart'
      },
      {
        title: 'Request car wash',
        icon: 'local-car-wash'
      },
      {
        title: 'Request Home Charger Install w/ camera',
        icon: 'camera-alt'
      },
      {
        title: 'Exclusive Club Houses & Meetups',
        icon: 'home'
      },
      {
        title: 'Other benefits',
        icon: 'redeem'
      }
    ]

    return (
      <View style={{flex: 1}}>
        <ScrollView style={{flex: 1}}>
          <View style={{marginBottom: 80, marginTop: 30}}>
                  

              <View style={styles.deal}>
                <Text style={[styles.newsTitle, {fontSize: 20}]}>
                    My EV Services Dashboard
                </Text>

                <Text>
                    {' '}
                    Access your membership exclusives here
                </Text>

             <Text> </Text>

              {
                  list.map((item, i) => (
                    <ListItem
                      key={i}
                      title={item.title}
                      leftIcon={{ name: item.icon, color: '#2191fb' }}
                      titleStyle={{ color: '#303030'}}
                      chevron={true}
                      onPress={() => this._navigate(item.title)}
                      bottomDivider={true}
                    />
                  ))
                }

              

              <Text> </Text>
              <Button
                type="outline"
                buttonStyle={styles.button}
                onPress={() => this.setState({isVisible: true})}
                title="Learn More"
                />

              <LearnMoreCompontent
                isVisible={this.state.isVisible}
                dismiss={() => this.setState({ isVisible: false })} />

            </View>

          </View>
        </ScrollView>
      </View>
    );

  }
}