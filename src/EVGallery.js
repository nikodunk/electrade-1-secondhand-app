import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, AsyncStorage, Button, ScrollView, Image, Linking, FlatList, TouchableOpacity, ActivityIndicator, Switch } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import Mixpanel from 'react-native-mixpanel'
import * as Animatable from 'react-native-animatable';

export default class OtherScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = { 
      used: false,
      data: null,
      images: null,
      loading: false,
       };

    this._getSharedCars = this._getSharedCars.bind(this)

  }


  componentDidMount() {
      // get email, except if developer mode
      AsyncStorage.getItem('email').then((res) => {
        this.setState({email: res})
        if(this.state.email !== 'niko'){Mixpanel.track("EV Gallery Loaded") }
        // if(this.state.email === 'niko'){ AsyncStorage.removeItem('remainingtrials') }
      })


      this.willFocusSubscription = this.props.navigation.addListener(
        'willFocus',
        () => {
            this._getSharedCars()     
        }
      );
  }


  _getSharedCars(){
    this.setState({loading: true})

      // GET OWN LISTINGS
      fetch('https://electrade-server.herokuapp.com/api/listings/get/'+'gallery')
      // fetch('http://localhost:8080/api/listings/get/'+'gallery')
        .then((res) => res.json())
        .then((json) => json.reverse())
        .then((res) => { this.setState({data: res, loading: false}); console.log(res) })
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
                          <View style={{ marginBottom: index === this.state.data.length -1 ? 180 : 0}}>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('Details', {item: item, type: 'Gallery'} ) } delayPressIn={50} >
    
                              <View style={{marginTop: index === 0 ? 40 : 0, marginBottom: index === this.state.data.length -1 ? 80 : 0}}>
                                
                                <View style={{flex: 1}}>
                                  <Image  style={styles.imageDetail}
                                          source={{uri: item.image}} 
                                          />
                                </View>
                              </View>
                            </TouchableOpacity>
                            
    
                          </View> }
                       />
            </Animatable.View>
          :
            <View style={{marginTop: 100, alignItems: 'center'}}>
              <Text style={{color: 'grey'}}>Fetching EV Gallery... </Text>
              <ActivityIndicator />
            </View>
          }
          <Animatable.View animation="bounceIn" duration={500} style={styles.newsItem}>
            <TouchableOpacity 
                    onPress={() => this.props.navigation.navigate('Submit', {listingType: 'gallery', type: 'Gallery'} )} >
              <Icon name="ios-camera" size={24}  color="white" />
            </TouchableOpacity>
          </Animatable.View>
      </View>
    );



  }
}

