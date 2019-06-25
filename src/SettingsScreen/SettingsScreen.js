import React, {Component} from 'react';
import {Platform, Picker, StyleSheet, Text, View, AsyncStorage, ScrollView, Image, FlatList, TouchableOpacity, Linking, ActivityIndicator, Switch, TextInput } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import Mixpanel from 'react-native-mixpanel'
import * as Animatable from 'react-native-animatable';
Mixpanel.sharedInstanceWithToken('99a084449cc885327b81217f3433be3a')
import firebase from 'react-native-firebase';
import { Button } from 'react-native-elements';

import FeedbackComponent from '../components/FeedbackComponent'

export default class SettingsScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = { 
      data: null,
      email: null,
      loading: null,
      region: null,
      thanks: false
       };
  }


  componentDidMount() {

      this.setState({loading: false})
      
      // get email, except if developer mode
      AsyncStorage.getItem('email').then((res) => {
        this.setState({email: res})
        if(this.state.email !== 'niko'){Mixpanel.track("AccountScreen Loaded"); firebase.analytics().logEvent('AccountScreen_Loaded') }
        // this seems to be android only but not sure yet 
        // Mixpanel.setPushRegistrationId("GCM/FCM push token")
      })

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
  


  _onSubmitEmail(){
      AsyncStorage.setItem('email', this.state.email)
  }

  _onChangeRegion(newRegion){
    AsyncStorage.setItem('region', JSON.stringify(newRegion))
    this.setState({region: newRegion})
    if(this.state.email !== 'niko'){ Mixpanel.track("Region changed to "+newRegion); }
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <ScrollView style={{flex: 1}}>
          <View style={{marginBottom: 80, marginTop: 30}}>
                  

              <View style={styles.deal}>
                <Text style={[styles.newsTitle, {fontSize: 20}]}>
                    Your Account
                </Text>

              {/* REGION */}                  
                  {/* <Text style={styles.newsTitle}>
                    Your Region
                  </Text>
                  <Picker
                    selectedValue={this.state.region}
                    itemStyle={{height: 100}}
                    style={{ height: 100, width: '100%', borderColor: 'lightgrey', borderWidth: 1, borderRadius: 10 }}
                    onValueChange={(itemValue, itemIndex) => this._onChangeRegion(itemValue)}>
                    <Picker.Item label="Northern California" value="CA(N)" />
                    <Picker.Item label="Southern California" value="CA(S)" />
                    <Picker.Item label="New York" value="NY"  />
                    <Picker.Item label="Colorado" value="CO" />
                    <Picker.Item label="Florida" value="FL" />
                    <Picker.Item label="Georgia" value="GA" />
                    <Picker.Item label="Illinois" value="IL" />
                    <Picker.Item label="Massachusetts" value="MA" />
                    <Picker.Item label="Maryland" value="MD" />
                    <Picker.Item label="New Jersey" value="NJ"  />
                    <Picker.Item label="Oregon" value="OR" />
                    <Picker.Item label="Virginia" value="VA" />
                    <Picker.Item label="Washington" value="WA" />
                    <Picker.Item label="Rhode Island" value="RI" />
                  </Picker> */}


              {/* <Text> </Text>
              <View style={styles.separator} />
              <Text> </Text>
              <Text> </Text> */}



            {/* FEEDBACK */}
              <FeedbackComponent />

              <Text> </Text>
              <View style={styles.separator} />
              <Text> </Text>
              <Text> </Text>



            {/* EMAIL */}

                <Text style={styles.newsTitle}>
                  Your email:
                </Text>
                <View style={{flexDirection: 'row'}}>
                  <TextInput 
                    underlineColorAndroid="transparent"
                    style={[styles.textInput, {flex: 3, marginTop: 0}]}
                    placeholder={'Your email'}
                    value={this.state.email}
                    autoCapitalize = 'none'
                    onChangeText={ (text) => this.setState({email: text})}
                    />
                  <Button
                    type="solid"
                    buttonStyle={[styles.bigButton, {flex: 1}]}
                    onPress={() => this._onSubmitEmail()} 
                    title="Change Email" 
                    />
                </View>



              <Text> </Text>
              <View style={styles.separator} />
              <Text> </Text>
              <Text> </Text>


            {/* MISSION STATEMENT */}
              <Text style={{fontWeight: '600'}}>
                Why are we doing this?
              </Text>
              <Text>
                Our mission is to make it easier to use EVs, thereby getting more EVs on the road, quickly.
              </Text>
              <Text></Text>

              {/* <Text style={{fontWeight: '600'}}>
                How do we make money?
              </Text>
              <Text>
                With our volume and focus on EVs we can pre-negotiate EV leases far below MSRP, and keep part of the savings (usually around 10%) while passing 90% of the savings on to you. This margin pays for us doing the paperwork for you, and being your buffer from the dealership practices and fees. We're constantly improving this model, so let us know if there is anything we can improve!
              </Text>
              <Text></Text> */}
              



            {/* NOTIFICATIONS */}
              {/*<View style={{ padding: 10}}>
                <View style={{flexDirection:'row' }}> 

                  <Text style={{fontWeight: 'bold', padding: 3}}>Notifications about new local lease deals</Text>
                  <Switch value={this.state.chiefcomplaintvisible} onValueChange={(value) => this._onSwitchChiefComplaintVisible(value)} />

                </View>
              </View>*/}

            {/* CURRENT LEASE? */}
            {/*<View style={{ padding: 10}}>
              <View style={{flexDirection:'row' }}> 

                <Text style={{fontWeight: 'bold', padding: 3}}>Notifications about new local lease deals</Text>
                <Switch value={this.state.chiefcomplaintvisible} onValueChange={(value) => this._onSwitchChiefComplaintVisible(value)} />

              </View>
            </View>*/}

          {/* SUPPLIER? */}
            {/*<View style={{ padding: 10}}>
              <View style={{flexDirection:'row' }}> 

                <Text style={{fontWeight: 'bold', padding: 3}}>Notifications about new local lease deals</Text>
                <Switch value={this.state.chiefcomplaintvisible} onValueChange={(value) => this._onSwitchChiefComplaintVisible(value)} />

              </View>
            </View>*/}


            <Text> </Text>
            <View style={styles.separator} />
            <Text> </Text>
            <Text> </Text>

            {/* INVITE COLLEAGUES */}
              <Button
                type="solid"
                buttonStyle={styles.bigButton}
                onPress={() => Platform.OS === 'ios' ? Linking.openURL('sms: &body=https://itunes.apple.com/us/app/id1445602414') : Linking.openURL('sms:?body=https://play.google.com/store/apps/details?id=com.bigset.electric')}
                title="Tell a friend about this app" 
                />


            </View>

          </View>
        </ScrollView>
      </View>
    );

  }
}