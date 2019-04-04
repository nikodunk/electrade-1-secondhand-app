import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, AsyncStorage, ScrollView, Image, FlatList, TouchableOpacity, Linking, TextInput, ActivityIndicator, KeyboardAvoidingView, Alert} from 'react-native';
import { SafeAreaView } from 'react-navigation';
import Mixpanel from 'react-native-mixpanel'
import styles from './styles'
import firebase from 'react-native-firebase';
import { Button } from 'react-native-elements';


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
        if(this.state.email !== 'niko'){Mixpanel.track("GetLease Touched") }
      })

      this.setState({item: this.props.navigation.getParam('item') })
      
      AsyncStorage.getItem('email').then(email => this.setState({email: email}) )
      firebase.analytics().logEvent('GetLease_Touched')

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
    Mixpanel.track("Email Button Pressed");
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
                  Please enter your email below, and we will put you in touch with the dealer via email once we've vetted that they are still offering the exact terms. 
                </Text>
                <Text></Text>
                <Text style={{fontWeight: '600'}}>
                  Why this way? This ensures:
                </Text>
                <Text> ✅ No hassles</Text>
                <Text> ✅ No negotiation</Text>
                <Text> ✅ No spam marketing</Text>
                <Text></Text>
                <Text>
                  We earn commission only if you go through with the lease and everything is to your liking, so let us know if there's anything we can do to help or ask questions when we reach out to you.
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
                    title={`Request ${this.state.item["Make and Model"]}`}
                    />
                : null }

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

