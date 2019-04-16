import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, AsyncStorage, ScrollView, Image, FlatList, TouchableOpacity, Linking, TextInput, ActivityIndicator, KeyboardAvoidingView, Alert} from 'react-native';
import { SafeAreaView } from 'react-navigation';
import Mixpanel from 'react-native-mixpanel'
import styles from './styles'
import firebase from 'react-native-firebase';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';

// import { PaymentRequest } from 'react-native-payments';



// const METHOD_DATA = [{
//   supportedMethods: ['apple-pay', 'android-pay'],
//   data: {
//     merchantIdentifier: 'merchant.com.electrade.deposit',
//     supportedNetworks: ['visa', 'mastercard', 'amex'],
//     countryCode: 'US',
//     currencyCode: 'USD',
//     paymentMethodTokenizationParameters: {
//         parameters: {
//           gateway: 'stripe',
//           'stripe:publishableKey': 'your_publishable_key',
//           'stripe:version': '5.0.0' // Only required on Android
//         }
//     }
//   }
// }];

// const DETAILS = {
//   id: 'basic-example',
//   displayItems: [
//     {
//       label: 'Deposit',
//       amount: { currency: 'USD', value: '200.00' }
//     }
//   ],
//   total: {
//     label: 'Electrade',
//     amount: { currency: 'USD', value: '200.00' }
//   }
// };

// const paymentRequest = new PaymentRequest(METHOD_DATA, DETAILS);

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

  _onPress = async () => {
    // paymentRequest.show()
    this.setState({loading: true})
    console.log(this.state.email)
    if(this.state.email === '' || this.state.email === ' ' || this.state.email === null){
      Alert.alert('Please enter your email');
      this.setState({loading: false})
      return
    }
    else {
      this.setState({loading: true})
      // fetch('http://localhost:8080/api/leases/create/'+this.state.email+'/'+this.state.item["Make and Model"], {
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
          if(this.state.email !== 'niko'){ Mixpanel.track("Lease Request Submitted"); firebase.analytics().logEvent('Lease_Request_Submitted'); }
          AsyncStorage.setItem('email', this.state.email)
          this.setState({thanks: true})
        })
      .then(() => setTimeout(() => this.props.navigation.navigate('Lease'), 1000 ) )
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
                  Please enter your email below, and we will put you in touch with the dealer via email once we've vetted that they are still offering the exact terms. Offers are valid for 2 days.
                </Text>
                <Text></Text>
                <Text style={{fontWeight: '600'}}>
                  Why this way?
                </Text>
                <Text>We're doing this to guarantee:</Text>
                <Text style={{marginBottom: 3}}> ✅ No hassles</Text>
                <Text style={{marginBottom: 3}}> ✅ No negotiation</Text>
                <Text style={{marginBottom: 3}}> ✅ No spam marketing</Text>
                <Text></Text>
                <Text style={{fontWeight: '600'}}>
                  What does electrade get from it?
                </Text>
                <Text>
                  We earn commission. Only if you go through with the lease and everything is to your liking, though – we don't pass your email on. So let us know if there's anything we can do to help or ask questions when we reach out to you. Our mission is to make it easier to get EVs, thereby getting more EVs on the road, quickly.
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
                    buttonStyle={styles.bigButton}
                    onPress={() => this._onPress()} 
                    icon={
                        <Icon
                          name="logo-apple"
                          size={30}
                          style={{padding: 10}}
                          color="white"
                        />
                      }
                    title={` Lock this ${this.state.item["Make and Model"]} \nprice with $200 deposit`}
                    />
                : null }
                  <Text></Text>
                  <Text>Applied to lease deposit. Full refundable if car can't be delivered as above.</Text>

                  {this.state.loading ? <ActivityIndicator /> : null}

                </View>
              </View>
            </ScrollView>:

            <View style={{marginTop: 100, alignItems: 'center'}}>
              <Text style={{color: 'grey', fontSize: 25, fontWeight: '300'}}>Thank you! We'll be in touch soon.</Text>
            </View> }
          

        </KeyboardAvoidingView>
      </SafeAreaView>
    );

  }
}

