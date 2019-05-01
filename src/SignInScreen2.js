import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, AsyncStorage, KeyboardAvoidingView, ScrollView, TextInput, ActivityIndicator, Alert} from 'react-native';
import { SafeAreaView } from 'react-navigation';
import * as Animatable from 'react-native-animatable';
import Mixpanel from 'react-native-mixpanel'
Mixpanel.sharedInstanceWithToken('99a084449cc885327b81217f3433be3a')
import { Button, Icon } from 'react-native-elements';

export default class SignInScreen extends React.Component {

  static navigationOptions = {
    title: 'Welcome!',
    headerMode: 'none'
  };

  constructor(props) {
    super(props);
    this.state = { 
        loading: false,
        email: '',
        next: false
       };
  }


  componentDidMount() {
      // Mixpanel.track("TutorialScreen Loaded");
  }


  _onNext = async () => {
    Mixpanel.track("Email Button Pressed");
    this.setState({next: true})
  };

  _onFinish = async () => {
    Mixpanel.track("Email Button Pressed");
    this.props.navigation.navigate('App')
  };


  render() {
    return (
      <View style={{flex: 1}}>
        <ScrollView style={{flex: 1}}>
          <View style={{marginBottom: 80, marginTop: 30}}>


              <Animatable.View style={styles.signin} animation="zoomInUp">
                <Text style={{fontWeight: '600', fontSize: 30}}>
                  How this works
                </Text>
                <Text> </Text>

                <View style={{display: 'flex', flexDirection: 'row'}}>
                  <View style={{flex: 1}}>
                    <Icon
                      name='ios-notifications'
                      type='ionicon'
                      color='#2191fb'
                      size={40} />
                  </View>
                  <View style={{flex: 3}}>
                    <Text style={{fontWeight: '400', fontSize: 20, color: '#2191fb'}}>1 – Find a lease</Text> 
                    <Text style={{marginBottom: 3, fontSize: 12}}>
                      Set your region, find a lease you like.
                    </Text>
                  </View>
                </View>

                <Text> </Text>


                <View style={{display: 'flex', flexDirection: 'row'}}>
                  <View style={{flex: 1}}>
                    <Icon
                      name='ios-card'
                      type='ionicon'
                      color='#2191fb'
                      size={40} />
                  </View>
                  <View style={{flex: 3}}>
                    <Text style={{fontWeight: '400', fontSize: 20, color: '#2191fb'}}>2 – Pay Deposit</Text> 
                    <Text style={{marginBottom: 3, fontSize: 12}}>
                      Lock in lease price ($199 deposit) or request a test drive ($99 deposit).
                    </Text>
                  </View>
                </View>


                <Text> </Text>


                <View style={{display: 'flex', flexDirection: 'row'}}>
                  <View style={{flex: 1}}>
                    <Icon
                      name='ios-car'
                      type='ionicon'
                      color='#2191fb'
                      size={40} />
                  </View>
                  <View style={{flex: 3}}>
                    <Text style={{fontWeight: '400', fontSize: 20, color: '#2191fb'}}>3 – Sign online & drive</Text> 
                    <Text style={{marginBottom: 3, fontSize: 12}}>
                      We email you all required documents to sign, you pay remainder minus deposit at the dealership and drive off your new car!
                    </Text>
                  </View>
                </View>

                <Text></Text>
                <View style={styles.separator} />
                <Text></Text>


                <View style={{display: 'flex', flexDirection: 'row'}}>
                  <View style={{flex: 1}}>
                    <Icon
                      name='ios-checkbox'
                      type='ionicon'
                      color='#2191fb'
                      size={40} />
                  </View>
                  <View style={{flex: 3}}>
                    <Text style={{fontWeight: '400', fontSize: 20, color: '#2191fb'}}>
                      Money Back Guarantee
                    </Text>
                    <Text style={{marginBottom: 3, fontSize: 12}}>If we can't fulfill your request within 48 hours or you're not satisfied with the experience you get 100% of your deposit back.</Text>
                  </View>
                </View>


                <View style={{display: 'flex', flexDirection: 'row'}}>
                  <View style={{flex: 1}}>
                    <Icon
                      name='ios-lock'
                      type='ionicon'
                      color='#2191fb'
                      size={40} />
                  </View>
                  <View style={{flex: 3}}>
                    <Text style={{fontWeight: '400', fontSize: 20, color: '#2191fb'}}>
                      Hassle-Free
                    </Text>
                    <Text style={{marginBottom: 3, fontSize: 12}}>We build in all fees so there's no last-minute negotiation.</Text>
                    <Text></Text>
                  </View>
                </View>

                <Button
                  type="solid"
                  buttonStyle={styles.bigButton}
                  onPress={() => {this._onFinish()}}
                  title="Finish" />

              </Animatable.View> 


          </View>
        </ScrollView>
      </View>
    );
  }

  
}