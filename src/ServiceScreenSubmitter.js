import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, AsyncStorage, ScrollView, Image, FlatList, TouchableOpacity, Linking, TextInput, ActivityIndicator, KeyboardAvoidingView, Alert} from 'react-native';
import { SafeAreaView } from 'react-navigation';
import Mixpanel from 'react-native-mixpanel'
import styles from './styles'
import firebase from 'react-native-firebase';
import { Button, Icon } from 'react-native-elements';
import * as Animatable from 'react-native-animatable';


import stripe from 'tipsi-stripe'

import FeedbackComponent from './components/FeedbackComponent'


stripe.setOptions({
  // publishableKey: 'pk_test_w1fHSNJdm3G5cxjBrzEjS6PT', // ********TEST********
  publishableKey: 'pk_live_8yXo9Oom2JQnurwuoUgL4nw9', // ********LIVE********
  // merchantId: 'merchant.com.electrade.deposit',
  androidPayMode: 'production'
})

export default class SubmitScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = { 
      email: '',
      thanks: false,
      feedbackThanks: false,
      loading: '',
      region: null
       };
  }

  async componentWillMount() {
      
  }

  componentDidMount() {
      // get email, except if developer mode
      AsyncStorage.getItem('email').then((res) => {
        this.setState({email: res})
        if(this.state.email !== 'niko'){Mixpanel.track("Club Pay Screen Opened"); firebase.analytics().logEvent('Club_Pay_Screen_Opened') }
      })

      this.setState({item: this.props.navigation.getParam('item') })
      
      AsyncStorage.getItem('email').then(email => this.setState({email: email}) )
      
      this._getRegion()

  }

  _getRegion(){
    AsyncStorage.getItem('region').then((region) => {
            region === null ? (
                                    this.setState({region: 'SF Bay Area', loading: false }),
                                    AsyncStorage.setItem('region', JSON.stringify('SF Bay Area'))
                              ) : 
                                    this.setState({region: JSON.parse(region), loading: false })
                            })
  }

  handleCompleteChange = complete => (
      this.setState({ complete })
    )


  _onPress = async (passedAmount) => {
    this.setState({loading: true})

    if(this.state.email === '' || this.state.email === ' ' || this.state.email === null){
      Alert.alert('Please enter your email');
      this.setState({loading: false})
      return
    }
    else {
      this._handleCardPayPress(passedAmount)
    }
  }

  _handleCardPayPress = async (passedAmount) => {
      this.state.email !== 'niko' ?   Mixpanel.track("Club Stripe Opened") && firebase.analytics().logEvent('Stripe_Opened')  : null
      try {
        console.log('_handleCardPayPress running')
        this.setState({ loading: true, token: null })
        
        const token = await stripe.paymentRequestWithCardForm()

        console.log('this is running with ',token,this.state.email)

        fetch('https://electrade-server.herokuapp.com/api/leases/pay', {
                  method: 'POST',
                  headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    token: token.tokenId,
                    amount: passedAmount,
                    email: this.state.email
                  })
              })
          .then(() => {
              this.state.email !== 'niko' ?   Mixpanel.track("Club Submitted") && firebase.analytics().logEvent('Club_Submitted')  : null
              AsyncStorage.setItem('email', this.state.email)
              this.setState({thanks: true})
            })
          .then(() => setTimeout(() => this.props.navigation.navigate('ServiceScreen'), 2000 ) )

        this.setState({ loading: false, token })
      } catch (error) {
        this.setState({ loading: false })
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

          {!this.state.thanks  ? 
            <ScrollView style={{flex: 1}}>
              <View style={{marginBottom: 80}}>
                <View style={styles.deal}>

                <Text style={[styles.newsTitle, {fontSize: 30}]}>
                  Sign Up
                </Text>

                <Text></Text>
                <Text style={{fontSize: 18}}>$35.00 due today</Text>
                <Text></Text>
                <Text style={{fontSize: 15, color: 'grey'}}>✓ 1-week money-back guarantee</Text>
                <Text style={{fontSize: 15, color: 'grey'}}>✓ Cancel any time</Text>
                <Text style={{fontSize: 15, color: 'grey'}}>✓ You will receive an email confirmation</Text>
                <Text style={{fontSize: 15, color: 'grey'}}>✓ You can schedule an onboarding call.</Text>
                <Text></Text>


                {/* EMAIL */}
                  <View>
                    <Text style={{fontWeight: '400'}}>
                      Your Email (required)
                    </Text>
                    <TextInput 
                      underlineColorAndroid="transparent"
                      style={styles.textInput}
                      placeholder={'Email'}
                      value={this.state.email}
                      autoCapitalize = 'none'
                      keyboardType={'email-address'}
                      onChangeText={ (text) => {  this.setState({email: text}) }}
                      />
                  </View>

                  <Text></Text>

                  <Text style={{fontWeight: '400'}}>
                    First Month Membership Fee (required)
                  </Text>

                  {this.state.loading ? <ActivityIndicator /> : 
                  <Button
                    type="solid"
                    icon={
                        <Icon
                          name="credit-card"
                          size={25}
                          color="white"
                        />
                      }
                    buttonStyle={styles.bigButton}
                    containerStyle={{padding: 10}}
                    onPress={() => this._onPress(3500)}
                    title={` Open Card Reader & Subscribe`} 
                  /> }

                  
                </View>
              </View>
            </ScrollView>:

            <View style={{marginTop: 100, alignItems: 'center'}}>
              <Text style={{color: 'grey', fontSize: 25, fontWeight: '300'}}>Thank you! You've received a confirmation email, and we'll be in touch soon.</Text>
            </View> }
          

        </KeyboardAvoidingView>
      </SafeAreaView>
    );

  }
}

