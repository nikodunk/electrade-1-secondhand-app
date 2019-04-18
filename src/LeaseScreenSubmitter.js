import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, AsyncStorage, ScrollView, Image, FlatList, TouchableOpacity, Linking, TextInput, ActivityIndicator, KeyboardAvoidingView, Alert} from 'react-native';
import { SafeAreaView } from 'react-navigation';
import Mixpanel from 'react-native-mixpanel'
import styles from './styles'
import firebase from 'react-native-firebase';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';

import stripe from 'tipsi-stripe'

stripe.setOptions({
  // publishableKey: 'pk_test_w1fHSNJdm3G5cxjBrzEjS6PT', // ********TEST********
  publishableKey: 'pk_live_8yXo9Oom2JQnurwuoUgL4nw9', // ********LIVE********
  merchantId: 'merchant.com.electrade.deposit',
  androidPayMode: 'production'
})

export default class SubmitScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = { 
      email: '',
      thanks: false,
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


  _onPress = async () => {
    console.log('_onPress running')
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
            this._handleCardPayPress()
          })
      }
      else{ this._handleCardPayPress() }
    }
  }

  _handleCardPayPress = async () => {
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
                    amount: 20000,
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

  _handleNativePay = async () => {
    try {
      console.log('_handleNativePay running')
      // Indicates about google pay availability
      const isDeviceSupportsNativePay = await stripe.deviceSupportsNativePay()
      const isUserHasAtLeastOneCardInGooglePay = await stripe.canMakeNativePayPayments()

      console.log(isDeviceSupportsNativePay, isUserHasAtLeastOneCardInGooglePay)

      if (isDeviceSupportsNativePay && isUserHasAtLeastOneCardInGooglePay) {
        
        const options =  Platform.OS === 'ios' ?
                [{
                  label: 'Deposit',
                  amount: '200.00'
                }]
                :
                {
                  total_price: '200.00',
                  currency_code: 'USD',
                  shipping_address_required: false,
                  billing_address_required: false,
                  shipping_countries: ["US", "CA"],
                  line_items: [{
                    currency_code: 'USD',
                    description: 'Deposit',
                    total_price: '200.00',
                    unit_price: '200.00',
                    quantity: '1',
                  }],
                }

        const token = await stripe.paymentRequestWithCardForm()
        // const token = await stripe.paymentRequestWithNativePay(options)
        
        console.log('this is running with ',token,this.state.email)

        fetch('https://electrade-server.herokuapp.com/api/leases/pay', {
                  method: 'POST',
                  headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    token: token.tokenId,
                    amount: 20000,
                    email: this.state.email
                  })
              })
          .then(() => {
              Platform.OS === 'ios' ? stripe.completeApplePayRequest() : null
              this.state.email !== 'niko' ?   Mixpanel.track("Lease Request Submitted") && firebase.analytics().logEvent('Lease_Request_Submitted')  : null
              AsyncStorage.setItem('email', this.state.email)
              this.setState({thanks: true})
            })
          .then(() => setTimeout(() => this.props.navigation.navigate('Lease'), 2000 ) )

      } else if(isDeviceSupportsNativePay && !isUserHasAtLeastOneCardInGooglePay){
        console.log("Please add a card to Google Pay")
        this.setState({isUserHasAtLeastOneCardInGooglePay: true, loading: false })
        setTimeout(() => this.setState({isUserHasAtLeastOneCardInGooglePay: null }), 5000 )
      } else{
        console.log("Your device doesn't support this payment method")
        this.setState({isDeviceSupportsNativePay: true, loading: false })
        setTimeout(() => this.setState({isDeviceSupportsNativePay: null }), 5000 )
      }
    } catch (error) {
      console.log(error) // In debug mode see the error
    }
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

          {!this.state.thanks ? 
            <ScrollView style={{flex: 1}}>
              <View style={{marginBottom: 80}}>
                <View style={styles.deal}>

                <Text style={[styles.newsTitle, {fontSize: 20}]}>
                  Enter Email & Submit
                  {'\n'}
                </Text>

                <Text style={{fontWeight: '600'}}>
                  What happens next?
                </Text>
                <Text>
                  Please enter your email below and pay the deposit. If we can't complete the lease as described above within 48 hours you'll be automatically refunded in full.
                </Text>
                <Text></Text>

                <Text style={{fontWeight: '600'}}>
                  How it works
                </Text>
                <Text style={{marginBottom: 3}}> ✅ We email you all required documents</Text>
                <Text style={{marginBottom: 3}}> ✅ You sign online (after credit check)</Text>
                <Text style={{marginBottom: 3}}> ✅ No negotiation or wasted time</Text>
                <Text style={{marginBottom: 3}}> ✅ You pay remainder at dealership and drive off your new car!</Text>
                <Text></Text>

                <Text style={{fontWeight: '600'}}>
                  Money Back Guarantee
                </Text>
                <Text style={{marginBottom: 3}}> If we can't fulfill your request within 48 hours or you're not satisfied with the experience you get 100% of your deposit back.</Text>
                <Text></Text>

                <Text style={{fontWeight: '600'}}>
                  What do we get from it?
                </Text>
                <Text>
                  We earn commission. Only if you go through with the lease and everything is to your liking, though – we don't pass your email on. So let us know if there's anything we can do to help or ask questions when we reach out to you. 
                </Text>
                <Text></Text>
                <Text style={{fontWeight: '600'}}>
                  Why are we doing this?
                </Text>
                <Text>
                  Our mission is to make it easier to buy EVs, thereby getting more EVs on the road, quickly.
                </Text>
                <Text></Text>


                {/* EMAIL */}
                  <View>
                    <Text style={styles.newsTitle}>Email</Text>
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
                {this.state.item ? 
                  <Button
                    type="solid"
                    title={`🔒 Deposit $200 to lock in price guarantee for ${this.state.item["Make and Model"]}`}
                    buttonStyle={styles.bigButton}
                    onPress={() => this._onPress()}
                    />
                : null }


                  <Text></Text>
                  <Text>Applied to lease deposit. Fully refundable if car can't be delivered as above.</Text>


                  {this.state.loading ? <ActivityIndicator /> : null}
                  {/*{this.state.isDeviceSupportsNativePay ? <Text style={{fontSize: 20, color: 'red'}} >Unfortunately, your device does not support this payment method</Text> : null}
                  title={Platform.OS === 'ios' ? `$200 deposit to lock down\n${this.state.item["Make and Model"]} offer (Pay)` : `$200 deposit to lock down\n${this.state.item["Make and Model"]} offer (Google Pay)`}
                  {this.state.isUserHasAtLeastOneCardInGooglePay ? <Text style={{fontSize: 20, color: 'red'}}>Please add a card to Google Pay and try again.</Text> : null}*/}
                  


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

