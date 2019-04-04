// twitter electrek
// twitter cleantechnica
// https://twitter.com/InsideEVs

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, AsyncStorage, Button, ScrollView, Image, FlatList, TouchableOpacity, Linking, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import Mixpanel from 'react-native-mixpanel'
import * as Animatable from 'react-native-animatable';
Mixpanel.sharedInstanceWithToken('99a084449cc885327b81217f3433be3a')
import firebase from 'react-native-firebase';


export default class HomeScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = { 
      news: null,
      email: null,
      loading: null
       };

    this._getNews = this._getNews.bind(this)
  }


  componentDidMount() {
      this.setState({loading: true})
      this._getNews()
      
      // get email, except if developer mode
      AsyncStorage.getItem('email').then((res) => {
        this.setState({email: res})
        if(this.state.email !== ' ' && this.state.email){ Mixpanel.identify(this.state.email); Mixpanel.set({"$email": this.state.email}); firebase.analytics().setUserId(this.state.email)}
        if(this.state.email !== 'niko'){Mixpanel.track("NewsScreen Loaded"); firebase.analytics().logEvent('NewsScreen_Loaded') }
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

  _onRefresh = () => {
      this.setState({refreshing: true});
      this._getNews()
    }


  _getNews(){
    fetch('https://api.apify.com/v1/rG44NsjnfukCkKecE/crawlers/Z79rSy82LB9BxDyaa/lastExec/results?token=u8HqK39BcB8PKAFsjMtb9Bnnh')
      .then(res => { return res.json()})

      // merge arrays from different sites
      .then(json =>  {   let finalArray = []
                         for (i = 0; i < json.length; i++){
                                if (i === 0) { finalArray = json[0].pageFunctionResult; }
                                else { finalArray = finalArray.concat( json[i].pageFunctionResult ); }
                              } 
                         return finalArray
                      })

      // sort by date
      .then(merged => {  return merged.sort((a,b) => (a.date < b.date) ? 1 : ((b.date < a.date) ? -1 : 0))  })

      // convert date to string
      .then(sorted => { 
                        for (i = 0; i < sorted.length; i++){
                                sorted[i].date = new Date(sorted[i].date * 1000).toLocaleTimeString("en-US")
                                sorted[i].date = sorted[i].date.substring(0, sorted[i].date.length - 6) + ' ' + sorted[i].date.substring(8)
                                // console.log(sorted[i].date)
                              } 
                        return sorted  
                      })

      // set results as state
      .then((sorted) => { 
                      this.setState({news: sorted, loading: false, refreshing: false}); 
                      // console.log(sorted)

                      })
  }

  

  render() {
    return (
      <View style={{flex: 1}}>
        {!this.state.loading ?
           <Animatable.View animation="slideInUp" duration={500} easing="ease-out-back">
             <FlatList
                       data={this.state.news}
                       refreshControl={
                                 <RefreshControl
                                   refreshing={this.state.refreshing}
                                   onRefresh={this._onRefresh}
                                 />
                               }
                       keyExtractor={(item, index) => index.toString()}
                       renderItem={({item, index}) => 
                            <View style={{marginTop: index === 0 ? 40 : 0, marginBottom: index === this.state.news.length -1 ? 80 : 0}}>
                              <TouchableOpacity 
                                  onPress={() => this.props.navigation.navigate('Details', {item: item, type: 'News'} ) } 
                                  style={{flexDirection: 'row', display: 'flex'}} 
                                  delayPressIn={50}> 
                                <View style={{flex: 0.3}}>
                                  <Image
                                          style={styles.image}
                                          source={{uri: item.image}}
                                        />
                                </View>
                                <View style={{flex: 0.7}}>
                                  <Text style={styles.newsTitle}>{item.text.substring(0, item.text.indexOf('http'))}</Text>
                                  <Text style={styles.newsSource}>{item.date} | {item.source}</Text>
                                </View>
                              </TouchableOpacity>
                              <View style={styles.separator} />
                            </View>
                     }
                     />
            </Animatable.View>
            :
            <View style={{marginTop: 100, alignItems: 'center'}}>
              <Text style={{color: 'grey'}}>Getting EV news... </Text>
              <ActivityIndicator />
            </View> }
            
          {/*<Animatable.View animation="bounceIn" duration={500} style={styles.newsItem}>
            <TouchableOpacity 
                    onPress={() => this._getNews()} >
              <Icon name="ios-refresh" size={24}  color="white" />
            </TouchableOpacity>
          </Animatable.View>*/}
      </View>
    );

  }
}