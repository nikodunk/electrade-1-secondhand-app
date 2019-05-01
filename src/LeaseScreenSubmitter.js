import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, AsyncStorage, ScrollView, Image, FlatList, TouchableOpacity, Linking, TextInput, ActivityIndicator, KeyboardAvoidingView, Alert} from 'react-native';
import { SafeAreaView } from 'react-navigation';
import Mixpanel from 'react-native-mixpanel'
import styles from './styles'
import firebase from 'react-native-firebase';
import { Button, Icon } from 'react-native-elements';
import * as Animatable from 'react-native-animatable';
// import Icon from 'react-native-vector-icons/Ionicons';

import stripe from 'tipsi-stripe'

import FeedbackComponent from './components/FeedbackComponent'


stripe.setOptions({
  // publishableKey: 'pk_test_w1fHSNJdm3G5cxjBrzEjS6PT' // ********TEST********
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
      const allowed = await stripe.deviceSupportsNativePay()
      const amexAvailable = await stripe.canMakeNativePayPayments({
        networks: ['american_express'],
      })
      const discoverAvailable = await stripe.canMakeNativePayPayments({
        networks: ['discover'],
      })
      const masterCardAvailable = await stripe.canMakeNativePayPayments({
        networks: ['master_card'],
      })
      const visaAvailable = await stripe.canMakeNativePayPayments({
        networks: ['visa'],
      })
      this.setState({
        allowed,
        amexAvailable,
        discoverAvailable,
        masterCardAvailable,
        visaAvailable,
      })
  }

  componentDidMount() {
      // get email, except if developer mode
      AsyncStorage.getItem('email').then((res) => {
        this.setState({email: res})
        if(this.state.email !== 'niko'){Mixpanel.track("GetLease Touched"); firebase.analytics().logEvent('GetLease_Touched') }
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
    console.log(this.state.email)
    if(this.state.email === '' || this.state.email === ' ' || this.state.email === null){
      Alert.alert('Please enter your email');
      this.setState({loading: false})
      return
    }
    else {
      this.setState({loading: true})
      if(this.state.email !== 'niko'){
        // save order to server
        fetch('https://electrade-server.herokuapp.com/api/leases/create/'+this.state.email+'/'+this.state.item["Make and Model"], {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              region: this.state.region
            }),
        })
        .then(() => {
            // Stripe payment
            this._handleCardPayPress(passedAmount)
          })
      }
      else{ this._handleCardPayPress(passedAmount) }
    }
  }

  _handleCardPayPress = async (passedAmount) => {
      this.state.email !== 'niko' ?   Mixpanel.track("Stripe Opened") && firebase.analytics().logEvent('Stripe_Opened')  : null
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
              this.state.email !== 'niko' ?   Mixpanel.track("Lease Request Submitted") && firebase.analytics().logEvent('Lease_Request_Submitted')  : null
              AsyncStorage.setItem('email', this.state.email)
              this.setState({thanks: true})
            })
          .then(() => setTimeout(() => this.props.navigation.navigate('Lease'), 2000 ) )

        this.setState({ loading: false, token })
      } catch (error) {
        this.setState({ loading: false })
      }
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

    const {
          loading,
          allowed,
          complete,
          status,
          token,
          amexAvailable,
          discoverAvailable,
          masterCardAvailable,
          visaAvailable,
        } = this.state

        const cards = {
          americanExpressAvailabilityStatus: { name: 'American Express', isAvailable: amexAvailable },
          discoverAvailabilityStatus: { name: 'Discover', isAvailable: discoverAvailable },
          masterCardAvailabilityStatus: { name: 'Master Card', isAvailable: masterCardAvailable },
          visaAvailabilityStatus: { name: 'Visa', isAvailable: visaAvailable },
        }


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

          {!this.state.thanks && this.state.item ? 
            <ScrollView style={{flex: 1}}>
              <View style={{marginBottom: 80}}>
                <View style={styles.deal}>

                <Text style={[styles.newsTitle, {fontSize: 30}]}>
                  Checkout
                </Text>

                {/*<Text style={{fontWeight: '600'}}>
                  What happens next?
                </Text>*/}
                {/*<Text>
                  Please enter your email below and pay the deposit. If we can't complete the lease as described above within 48 hours you'll be automatically refunded in full.
                </Text>*/}


                <Text style={{fontWeight: '400', fontSize: 20, color: '#2191fb'}}>
                  Car / lease details
                </Text>
                <Text>• {this.state.item["Make and Model"]}</Text>
                <Text>• {this.state.item["$/mo"]}/month + tax</Text>
                <Text>• {this.state.item["months"]} months</Text>
                <Text>• {this.state.item["DriveOffEst"]} guaranted drive-off</Text>
                <Text> </Text>

                <Text style={{fontWeight: '400', fontSize: 20, color: '#2191fb'}}>
                  Deposit conditions
                </Text>
                <Text>✓ Deducted from final lease price</Text>
                <Text>✓ Automatically refunded if your car is unavailable within 48hrs.</Text>
                <Text>✓ Money-back guarantee if you change your mind.</Text>



                <Text></Text>


                {/* EMAIL */}
                  <View>
                    <Text style={[styles.newsTitle]}>
                        Email
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

                  <Text style={[styles.newsTitle]}>
                      Refundable Deposit
                  </Text>

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
                    containerStyle={{padding: 5}}
                    onPress={() => this._onPress(19900)}
                    title={` Hold this lease price ($199)`} 
                    />
                  <Button
                    type="outline"
                    icon={
                        <Icon
                          name="directions-car"
                          size={25}
                          color="#2191fb"
                        />
                      }
                    buttonStyle={{borderRadius: 10, margin: 5}}
                    onPress={() => this._onPress(9900)}
                    title={` Book a test drive ($99)`} 
                    />

                  <Text> </Text>
                  <View style={styles.separator} />
                  <Text> </Text>



                  <FeedbackComponent />


                  {this.state.loading ? <ActivityIndicator /> : null}
                  
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

