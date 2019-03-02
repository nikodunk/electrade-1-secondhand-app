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
        {this.state.email ? Mixpanel.identify(this.state.email) : null }
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
        .then((json) => { this.setState({data: json, loading: false}); console.log(json) })
  }


  render() {
    return (
       <View>
        <View style={{maxHeight: '100%'}}>
          <View style={{marginTop: 40, backgroundColor: 'white', flexDirection: 'row', justifyContent: 'space-between'}} zIndex={5}>
              <TouchableOpacity style={{alignItems: 'space-between'}}
                                onPress={() => this.props.navigation.navigate('Submit', {listingType: 'gallery'} )} 
                                delayPressIn={50} >
                <View style={{display: 'flex', flexDirection:'row', padding: 10, paddingBottom: 0}}>
                  <Icon name="ios-camera" size={30} color="#4F8EF7" style={{position: 'absolute', top: 6, left: 10}} />
                  <Text style={{color: "#4F8EF7", fontSize: 20, fontWeight: '800', marginLeft: 25}}> Snap an EV </Text>
                </View>
              </TouchableOpacity>
            </View>
          {!this.state.loading ?
            <Animatable.View animation="slideInUp" duration={500} easing="ease-out-back">
                    <FlatList
                       data={this.state.data}
                       keyExtractor={(item, index) => index.toString()}
                       renderItem={({item, index}) => 
                          <View style={{ marginBottom: index === this.state.data.length -1 ? 180 : 0}}>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('Details', {item: item} ) } delayPressIn={50} >
    
                              <View style={{display: 'flex', flexDirection:'row'}}>
                                
                                <View style={{flex: 0.4}}>
                                  <Image  style={styles.imageCar}
                                          source={{uri: item.image}} 
                                          />
                                </View>
    
                                <View style={{flex: 0.6, marginLeft: 5}}>
                                  <Text >{item.name}</Text>
                                </View>
                                
                              </View>
                            </TouchableOpacity>
                            
                            <View style={styles.separator} />
    
                          </View> }
                       />
            </Animatable.View>
          :
            <View style={{marginTop: 100, alignItems: 'center'}}>
              <Text style={{color: 'grey'}}>Fetching EV Gallery... </Text>
              <ActivityIndicator />
            </View>
          }
        </View>
      </View>
    );



  }
}

