import React, {Component} from 'react';
import {Platform, Picker, StyleSheet, Text, View, AsyncStorage, ScrollView, Image, FlatList, TouchableOpacity, Linking, ActivityIndicator, Switch, TextInput, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import Mixpanel from 'react-native-mixpanel'
import * as Animatable from 'react-native-animatable';
Mixpanel.sharedInstanceWithToken('99a084449cc885327b81217f3433be3a')
import firebase from 'react-native-firebase';
import { Button, Overlay, Divider, Icon } from 'react-native-elements';

export default class ServiceScreenLearnMore extends React.Component {

  constructor(props) {
    super(props);
    this.state = { 
       };
  }


  componentDidMount() {

      this.setState({loading: false})
      
      // get email, except if developer mode
      AsyncStorage.getItem('email').then((res) => {
        this.setState({email: res})
        if(this.state.email !== 'niko'){Mixpanel.track("Overlay Pressed"); firebase.analytics().logEvent('AccountScreen_Loaded') }
        // this seems to be android only but not sure yet 
        // Mixpanel.setPushRegistrationId("GCM/FCM push token")
      })


      
  }



  

  render() {
    return (


        <Overlay 
          isVisible={this.props.isVisible}
          onBackdropPress={() => this.props.dismiss()} >

          <ScrollView>
              

              <Text style={{fontWeight: '600', textAlign: 'center', fontSize: 18, color: '#2191fb' }}>
                  What is this
              </Text>
              <Text>
                We are a premium benefits club for electric car owners. A membership offers a suite of value-add features that can be accessed any time, anywhere with a tap on the app. We partner to bring you frictionless, free services and discounted rates on convenient, every-day benefits.
              </Text>

              <Text></Text>
              <Divider />
              <Text></Text>

              
              <Text style={{fontWeight: '600', textAlign: 'center', fontSize: 18, color: '#2191fb' }}>
                How it works
              </Text>
              <Text>
                You receive 5 EV points upon signing up as a member, you will receive an additional 5 points every month. EV points can be used towards any of the services provided in the app. 
              </Text>
              <Text></Text>

              <Text></Text>
              <Divider />
              <Text></Text>

              <Text style={{fontWeight: '600', textAlign: 'center', fontSize: 18, color: '#2191fb' }}>
                Services
              </Text>
              <Text></Text>

              <View style={{display: 'flex', alignItems: 'center'}}>
                <Icon
                  style={{flex: 1}}
                  name='map' />
                <Text style={{fontWeight: '600', flex: 2}}>
                  Downtown EV parking and charging:
                </Text>
              </View>
              <Text>
                As an Electrade member, you can enjoy having access to a network of parking/charging spots in participating cities. 
              </Text>
              <Text></Text>



              <View style={{display: 'flex', alignItems: 'center'}}>
                <Icon
                  style={{flex: 1}}
                  name='battery-charging-full' />
                <Text style={{fontWeight: '600', flex: 2}}>
                  Roadside charging assistance: 
                </Text>
              </View>
              <Text>
                We can help eliminate your range anxiety by providing access to a nationwide network of charger equipped roadside assistance providers.
              </Text>
              <Text></Text>

              <View style={{display: 'flex', alignItems: 'center'}}>
                <Icon
                  style={{flex: 1}}
                  name='perm-identity' />
                <Text style={{fontWeight: '600', flex: 2}}>
                  DMV Registration and rebate concierge: 
                </Text>
              </View>
              <Text>
                Nobody likes doing paperwork and DMV lines. Leave your registration renewal and rebate paperworks to our professionals. 
              </Text>
              <Text></Text>


              <View style={{display: 'flex', alignItems: 'center'}}>
                <Icon
                  style={{flex: 1}}
                  name='build' />
                <Text style={{fontWeight: '600', flex: 2}}>
                  EV maintenance network: 
                </Text>
              </View>
              <Text>
                Need some repairs or routine maintenance? Use our network of vetted EV maintenance provides. Pickup and dropoff services are also available. 
              </Text>
              <Text></Text>

              <View style={{display: 'flex', alignItems: 'center'}}>
                <Icon
                  style={{flex: 1}}
                  name='directions-car' />
                <Text style={{fontWeight: '600', flex: 2}}>
                  Request free EV test drives: 
                </Text>
              </View>
              <Text>
                Thinking about getting a new EV or upgrading yours? Test drive all available electric vehicles in your area for free. 
              </Text>
              <Text></Text>
              
              <View style={{display: 'flex', alignItems: 'center'}}>
                <Icon
                  style={{flex: 1}}
                  name='insert-chart' />
                <Text style={{fontWeight: '600', flex: 2}}>
                  Preferred insurance rate:
                </Text>
              </View>
              <Text>
                Insuring your EV can be expensive, we are working with insurance providers that offer low rates and better coverage designed specifically for electric cars. 
              </Text>
              <Text></Text>

              <View style={{display: 'flex', alignItems: 'center'}}>
                <Icon
                  style={{flex: 1}}
                  name='local-car-wash' />
                <Text style={{fontWeight: '600', flex: 2}}>
                  Request car wash: 
                </Text>
              </View>
              <Text>
                Have your car cleaned at your office or home at a discounted rate. 
              </Text>
              <Text></Text>


              <Text></Text>
              <Divider />
              <Text></Text>

              <Button
                type="solid"
                buttonStyle={styles.bigButton}
                onPress={() => this.props.dismiss()} 
                title="Okay" 
                />

            
          </ScrollView>

        </Overlay>
    );

  }
}