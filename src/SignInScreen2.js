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
                  How it works
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
                    <Text style={{fontWeight: '400', fontSize: 20, color: '#2191fb'}}>1 – Discover your lease.</Text> 
                    <Text style={{marginBottom: 3, fontSize: 12}}>
                      Set your location to find the right car for you. Review the terms of your lease and car details. Get in touch – speak with our team to answer any questions.
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
                    <Text style={{fontWeight: '400', fontSize: 20, color: '#2191fb'}}>2 – Select your lease.</Text> 
                    <Text style={{marginBottom: 3, fontSize: 12}}>
                      Hold your car at the set lease price ($199 deposit) or request a test drive first ($99 deposit).
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
                    <Text style={{fontWeight: '400', fontSize: 20, color: '#2191fb'}}>3 – Sign online and go.</Text> 
                    <Text style={{marginBottom: 3, fontSize: 12}}>
                      No rush! We send you all required lease documents to review and sign online via email. Finally, walk in to the dealership to pay the remainder and drive!
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
                    <Text style={{marginBottom: 3, fontSize: 12}}>If we can’t help you find the right electric vehicle within 48 hours, we’ll refund 100% of your deposit.</Text>
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
                    <Text style={{marginBottom: 3, fontSize: 12}}>We build in all fees so the lease price is exactly what you pay. No hidden extras, no stressful negotiations.</Text>
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