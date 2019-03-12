import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, AsyncStorage, Button, ScrollView, Image, FlatList, TouchableOpacity, Linking, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import Details from './DetailScreen';
import Mixpanel from 'react-native-mixpanel'
import * as Animatable from 'react-native-animatable';
Mixpanel.sharedInstanceWithToken('99a084449cc885327b81217f3433be3a')
import firebase from 'react-native-firebase';


export default class HomeScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = { 
      data: null,
      email: null,
      loading: null
       };

    this._getData = this._getData.bind(this)
  }


  componentDidMount() {

      
      // get email, except if developer mode
      AsyncStorage.getItem('email').then((res) => {
        this.setState({email: res})
        if(this.state.email){ Mixpanel.identify(this.state.email); Mixpanel.set({"$email": this.state.email}); firebase.analytics().setUserId(this.state.email) }
        if(this.state.email !== 'niko'){Mixpanel.track("NewsScreen Loaded"); firebase.analytics().setCurrentScreen('NewsScreen Loaded') }
        // this seems to be android only but not sure yet 
        // Mixpanel.setPushRegistrationId("GCM/FCM push token")
      })

      
  }


  

  render() {
    return (
      <View style={{flex: 1}}>
        {!this.state.loading ?
           <Animatable.View animation="slideInUp" duration={500} easing="ease-out-back">
             <FlatList
                       data={this.state.data}
                       keyExtractor={(item, index) => index.toString()}
                       renderItem={({item, index}) => 
                            <View style={{marginTop: index === 0 ? 40 : 0, marginBottom: index === this.state.data.length -1 ? 80 : 0}}>
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
      </View>
    );

  }
}