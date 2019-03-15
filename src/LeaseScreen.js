// https://forum.leasehackr.com/t/bolt-ev-lease-bay-area-10k-36-mo-as-low-as-250-mo-plus-tax-w-3-300-drive-off-net-0-with-cvrp-and-pg-e-chevyphil-415-596-6262/100847/42

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, AsyncStorage, Button, ScrollView, Image, FlatList, TouchableOpacity, Linking, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import Details from './DetailScreen';
import Mixpanel from 'react-native-mixpanel'
import * as Animatable from 'react-native-animatable';
Mixpanel.sharedInstanceWithToken('99a084449cc885327b81217f3433be3a')
import firebase from 'react-native-firebase';

const model3Image = require('./img/model3.jpg')
const boltImage = require('./img/bolt.jpg')
const leafImage = require('./img/leaf.jpg')
const konaImage = require('./img/kona.jpg')
const etronImage = require('./img/etron.jpg')

export default class HomeScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = { 
      leases: null,
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
        if(this.state.email !== 'niko'){Mixpanel.track("NewsScreen Loaded"); firebase.analytics().setCurrentScreen('NewsScreen Loaded') }
        // this seems to be android only but not sure yet 
        // Mixpanel.setPushRegistrationId("GCM/FCM push token")
      })

      this.willFocusSubscription = this.props.navigation.addListener(
        'willFocus',
        () => {
          this.setState({loading: true})
          this._getLeases()
        }
      );
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


  _getLeases(){

    // GET CURRENT LEASES
    // fetch('http://localhost:8080/api/leases/get')
    fetch('https://electrade-server.herokuapp.com/api/leases/get')
      .then((res) => { return res.json()})
      
      // set results as state
      .then((res) => {
            this.setState({leases: res});
            this._getRegion()
      })   
  }


  render() {
    return (
      <SafeAreaView style={{flex: 1}}>
        <ScrollView style={{flex: 1}}>
          <View style={{marginBottom: 80}}>
              
              <View style={styles.deal}>
                <Text style={[styles.newsTitle, {fontSize: 20}]}>
                    New, local, pre-quoted lease deals around {this.state.region}
                </Text>
              </View>
              {!this.state.loading ? 
                <View>
                  <FlatList
                    data={this.state.leases}
                    renderItem={({item, index}) => 
                                <View>
                                  {item.regions.indexOf(this.state.region) !== -1 ?
                                      <TouchableOpacity 
                                        style={{height: 210}} 
                                        delayPressIn={50}
                                        onPress={() => this.props.navigation.navigate('Details', {item: item, type: 'Lease'} ) } >
                                            <View style={[styles.imageVideo, styles.videoContainer]}>
                                              <Image  style={styles.imageVideo}
                                                      source={
                                                              item.teaserImage === 'Bolt' ? boltImage : 
                                                              item.teaserImage === 'Leaf' ? leafImage : 
                                                              item.teaserImage === 'Etron' ? etronImage : 
                                                              item.teaserImage === 'Kona' ? konaImage : 
                                                              model3Image} />
                                              <Text style={styles.videoTitle}>{item.title} for {item.price}</Text>
                                            </View> 
                                      </TouchableOpacity>
                                  : null }
                                  </View>
                                }
                    keyExtractor={(item, index) => index.toString()}
                    /> 
                  <Text style={{margin: 10, color: 'grey'}}>All vehicles $0 down, 36 month leases, 10'000 Miles per year, Transunion Credit Scores over 700 required or for businesses established FICO score</Text>
                  </View>
              : 
              <View style={{marginTop: 100, alignItems: 'center'}}>
                <Text style={{color: 'grey'}}>Getting Newest Lease Deals... </Text>
                <ActivityIndicator />
              </View>
               }

          </View>
        </ScrollView>
      </SafeAreaView>
    );

  }
}