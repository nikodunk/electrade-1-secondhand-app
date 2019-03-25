import React, {Component} from 'react';
import {Platform, Picker, StyleSheet, Text, View, AsyncStorage, Button, ScrollView, Image, FlatList, TouchableOpacity, Linking, ActivityIndicator, Switch, TextInput } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import Details from './DetailScreen';
import Mixpanel from 'react-native-mixpanel'
import * as Animatable from 'react-native-animatable';
Mixpanel.sharedInstanceWithToken('99a084449cc885327b81217f3433be3a')
import firebase from 'react-native-firebase';


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
        if(this.state.email){ Mixpanel.identify(this.state.email); Mixpanel.set({"$email": this.state.email}); firebase.analytics().setUserId(this.state.email) }
        if(this.state.email !== 'niko'){Mixpanel.track("SettingsScreen Loaded"); firebase.analytics().setCurrentScreen('NewsScreen Loaded') }
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
                    Settings
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
                    <Picker.Item label="SF Bay Area" value="SF Bay Area" />
                    <Picker.Item label="Sacramento" value="Sacramento" />
                    <Picker.Item label="Los Angeles" value="Los Angeles" />
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
                    title="Email Feedback to Developers" 
                    onPress={() => Linking.openURL('mailto:n.dunkel@gmail.com')} 
                    />
                <Text></Text>
                <Text>Email the developers with feature requests, ideas, bugs to fix or feedback!</Text>
              </View>


            {/* NOTIFICATIONS */}
              {/*<View style={{ padding: 10}}>
                <View style={{flexDirection:'row' }}> 

                  <Text style={{fontWeight: 'bold', padding: 3}}>Notifications about new local lease deals</Text>
                  <Switch value={this.state.chiefcomplaintvisible} onValueChange={(value) => this._onSwitchChiefComplaintVisible(value)} />

                </View>
              </View>*/}

          </View>
        </ScrollView>
      </View>
    );

  }
}