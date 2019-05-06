import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, AsyncStorage, ScrollView, Image, FlatList, TouchableOpacity, Linking, TextInput, ActivityIndicator, KeyboardAvoidingView, Alert} from 'react-native';
import { SafeAreaView } from 'react-navigation';
import Mixpanel from 'react-native-mixpanel'
import styles from './styles'
import firebase from 'react-native-firebase';
import { Button, Icon, PricingCard } from 'react-native-elements';
import * as Animatable from 'react-native-animatable';
// import Icon from 'react-native-vector-icons/Ionicons';
Mixpanel.sharedInstanceWithToken('99a084449cc885327b81217f3433be3a')

import stripe from 'tipsi-stripe'

import FeedbackComponent from './components/FeedbackComponent'
import LearnMoreCompontent from './components/LearnMoreComponent'

stripe.setOptions({
  // publishableKey: 'pk_test_w1fHSNJdm3G5cxjBrzEjS6PT' // ********TEST********
  publishableKey: 'pk_live_8yXo9Oom2JQnurwuoUgL4nw9', // ********LIVE********
  // merchantId: 'merchant.com.electrade.deposit',
  androidPayMode: 'production'
})

export default class ServiceScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = { 
      feedbackThanks: false,
      isVisible: false
       };
  }


  componentDidMount() {
      // get email, except if developer mode
      AsyncStorage.getItem('email').then((res) => {
        this.setState({email: res})
        if(this.state.email !== 'niko'){Mixpanel.track("Club Pricing Loaded");  firebase.analytics().logEvent('Club_Pricing_Loaded') }
      })
  }



  _onSubmitFeedback(){
      
    fetch('https://electrade-server.herokuapp.com/api/comments/create/', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            feedback: this.state.feedback
          }),
      }).then((res) => this.setState({feedbackThanks: true}))
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


                  <PricingCard
                    color="#2191fb"
                    titleStyle={{fontSize: 30}}
                    pricingStyle={{fontSize: 35}}
                    title="Electric Car Benefits Club"
                    price="$35/month"
                    info={[
                      '✓ One-stop hub',
                      '✓ Access to premium EV parking, road-side assistance, EV tire change network, Concierge, Preferred EV maintenance network, Peer-to-peer car-sharing',
                      '✓ Access to all preferred rates',
                      '✓ Cancel any time']}
                    button={{ title:  ' GET STARTED', icon: 'flight-takeoff', buttonStyle: {borderRadius: 10}}}
                    containerStyle={{borderRadius: 10}}
                    onButtonPress={() => this.props.navigation.navigate('ServiceScreenSubmitter')}
                  />
                  <Text> </Text>
                  <Button
                    type="outline"
                    buttonStyle={styles.button}
                    onPress={() => this.setState({isVisible: true})}
                    title="Learn More" 
                    />

                  <Text> </Text>
                  <View style={styles.separator} />
                  <Text> </Text>
                  <Text> </Text>
                  <Text> </Text>
                  
                  <FeedbackComponent />

                  
                </View>
              </View>
            </ScrollView>
          
          <LearnMoreCompontent
              isVisible={this.state.isVisible}
              dismiss={() => this.setState({ isVisible: false })} />

        </KeyboardAvoidingView>
      </SafeAreaView>
    );

  }
}

