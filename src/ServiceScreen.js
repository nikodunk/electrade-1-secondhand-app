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


  _navigate(title, description){
    if(this.state.email !== 'niko'){ Mixpanel.track(title + " Touched"); firebase.analytics().logEvent(title.replace(/ /g, '_') + '_Touched') }
    this.props.navigation.navigate('ServiceScreenSignup', {title: title, description: description})
  }
 

  render() {

    const list = [
      {
        title: 'Request Charging Valet',
        icon: 'adjust',
        color: '#2191fb',
        description: 'We’ll drive your car to the nearest fast charger, charge it to your requested percentage, and return it to wherever you like.'
      },
      {
        title: 'Premium EV parking locations',
        icon: 'map',
        color: '#2191fb',
        description: 'As an Electrade member, you can enjoy having access to a network of parking/charging spots in participating cities. '
      },
      {
        title: 'Get roadside assistance',
        icon: 'battery-charging-full',
        color: '#2191fb',
        description: 'We can help eliminate your range anxiety by providing access to a nationwide network of charger equipped roadside assistance providers.'
      },
      {
        title: 'DMV / Rebate Concierge',
        icon: 'perm-identity',
        color: '#2191fb',
        description: 'Nobody likes doing paperwork and DMV lines. Leave your registration renewal and rebate paperworks to our professionals. '
      },
      {
        title: 'Schedule maintenance pick-up',
        icon: 'build',
        color: '#2191fb',
        description: 'Need some repairs or routine maintenance? Use our network of vetted EV maintenance provides. Pickup and dropoff services are also available. '
      },
      {
        title: 'Request EV test drive',
        icon: 'directions-car',
        color: '#2191fb',
        description: 'Thinking about getting a new EV or upgrading yours? Test drive all available electric vehicles in your area for free. '
      }
    ]

    list2 = [{
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
    }]


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
                      onPress={() => this._navigate(item.title, item.description)}
                      bottomDivider={true}
                    />
                  ))
                }

              

              <Text> </Text>
              <Button
                type="outline"
                buttonStyle={styles.button}
                icon={
                  <Icon
                    name="ios-information-circle-outline"
                    size={25}
                    color={"#2191fb"}
                    type="ionicon"
                  />
                }
                onPress={() => {this.setState({isVisible: true}); if(this.state.email !== 'niko'){Mixpanel.track("Learn More Pressed"); firebase.analytics().logEvent('Learn_More_Pressed')} }}
                title=" Learn More"
                />
              <Text></Text>
              {
                  list2.map((item, i) => (
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