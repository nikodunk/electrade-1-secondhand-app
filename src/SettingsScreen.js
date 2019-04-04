import React, {Component} from 'react';
import {Platform, Picker, StyleSheet, Text, View, AsyncStorage, ScrollView, Image, FlatList, TouchableOpacity, Linking, ActivityIndicator, Switch, TextInput } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import Mixpanel from 'react-native-mixpanel'
import * as Animatable from 'react-native-animatable';
Mixpanel.sharedInstanceWithToken('99a084449cc885327b81217f3433be3a')
import firebase from 'react-native-firebase';
import { Button } from 'react-native-elements';

export default class SettingsScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = { 
      data: null,
      email: null,
      loading: null,
      region: null
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
  
  _onChangeEmail(text){
      this.setState({email: text})
      AsyncStorage.setItem('email', text)
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

              {/* REGION */}
              <View style={styles.deal}>
                  <Text style={[styles.newsTitle, {fontSize: 20}]}>
                    Account
                    {'\n'}
                  </Text>

                  <Text style={styles.newsTitle}>
                    Your Region
                  </Text>
                  <Picker
                    selectedValue={this.state.region}
                    itemStyle={{height: 100}}
                    style={{ height: 100, width: '80%', borderColor: 'lightgrey', borderWidth: 1, borderRadius: 10, marginLeft: '10%', marginRight: '10%' }}
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
                  </Picker>

              </View>

              <View style={styles.separator} />



            {/* EMAIL */}
              <View style={styles.deal}>
                <Text style={styles.newsTitle}>
                  Your email:
                </Text>
                <TextInput 
                  underlineColorAndroid="transparent"
                  style={styles.textInput}
                  placeholder={'Your email'}
                  value={this.state.email}
                  autoCapitalize = 'none'
                  onChangeText={ (text) => this._onChangeEmail(text)}
                  />
              </View>


              <View style={styles.separator} />


            {/* FEEDBACK */}
              <View style={{flex: 1, alignItems: 'center', padding: 10}}>
                  <Text style={{fontWeight: 'bold', padding: 3}}>
                    {'\n'}
                    Feature missing? Have feedback?
                  </Text>
                <Button
                  type="solid"
                  buttonStyle={styles.bigButton}
                  onPress={() => Linking.openURL('mailto:n.dunkel@gmail.com')} 
                  title="Email Feedback to Developers" 
                  />
                <Text></Text>
                <Text>Email the developers with feature requests, ideas, bugs to fix or feedback!</Text>
              </View>


              <View style={styles.separator} />


            {/* NOTIFICATIONS */}
              {/*<View style={{ padding: 10}}>
                <View style={{flexDirection:'row' }}> 

                  <Text style={{fontWeight: 'bold', padding: 3}}>Notifications about new local lease deals</Text>
                  <Switch value={this.state.chiefcomplaintvisible} onValueChange={(value) => this._onSwitchChiefComplaintVisible(value)} />

                </View>
              </View>*/}


            {/* INVITE COLLEAGUES */}
            <View style={{flex: 1, alignItems: 'center', padding: 10}}>
              <Button
                type="solid"
                buttonStyle={styles.bigButton}
                onPress={() => Platform.OS === 'ios' ? Linking.openURL('sms: &body=https://itunes.apple.com/us/app/id1445602414') : Linking.openURL('sms:?body=https://play.google.com/store/apps/details?id=com.bigset.electric')}
                title="Invite friends to app" 
                />
            </View>

            <View style={styles.separator} />

          </View>
        </ScrollView>
      </View>
    );

  }
}