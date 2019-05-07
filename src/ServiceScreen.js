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
    if(this.state.email !== 'niko'){ Mixpanel.track(serviceString + " Touched"); firebase.analytics().logEvent(serviceString + ' Touched') }
    this.props.navigation.navigate('ServiceScreenSignup')
  }
 

  render() {

    const list = [
      {
        title: 'Premium EV parking locations',
        icon: 'map',
        color: '#2191fb'
      },
      {
        title: 'Get roadside assistance',
        icon: 'battery-charging-full',
        color: '#2191fb'
      },
      {
        title: 'DMV / Rebate Concierge',
        icon: 'perm-identity',
        color: '#2191fb'
      },
      {
        title: 'Schedule maintenance pick-up',
        icon: 'build',
        color: '#2191fb'
      },
      {
        title: 'Request EV test drive',
        icon: 'directions-car',
        color: '#2191fb'
      },
      {
        title: 'See Preferred EV Insurance Rates',
        icon: 'insert-chart',
        color: 'lightgrey'
      },
      {
        title: 'Request car wash',
        icon: 'local-car-wash',
        color: 'lightgrey'
      },
      {
        title: 'Request Home Charger Install w/ camera',
        icon: 'camera-alt',
        color: 'lightgrey'
      },
      {
        title: 'Exclusive Club Houses & Meetups',
        icon: 'home',
        color: 'lightgrey'
      },
      {
        title: 'Go to EV accessory shop',
        icon: 'redeem',
        color: 'lightgrey'
      },
      {
        title: 'Go to home solar installation offers',
        icon: 'wb-sunny',
        color: 'lightgrey'
      },
      {
        title: 'Go to EV forum (coming soon)',
        icon: 'chat',
        color: 'lightgrey'
      },
      {
        title: 'Buy/sell/trade your EV (premium listings)',
        icon: 'attach-money',
        color: 'lightgrey'
      },
      {
        title: 'Get windshield replacement',
        icon: 'fullscreen'     ,
        color: 'lightgrey'   
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
                      leftIcon={{ name: item.icon, color: item.color }}
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
                onPress={() => {this.setState({isVisible: true}); if(this.state.email !== 'niko'){Mixpanel.track("Learn More Pressed"); firebase.analytics().logEvent('Learn_More_Pressed')} }}
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