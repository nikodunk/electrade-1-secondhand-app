import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, AsyncStorage, Button, ScrollView, Image, FlatList, TouchableOpacity, Linking, geolocation } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import MapView from 'react-native-maps';
import Mixpanel from 'react-native-mixpanel'



export default class OtherScreen extends React.Component {
  static navigationOptions = {
    title: 'Where to charge',
    tabBarIcon: <Icon name="ios-map" size={24} color="#4F8EF7" />
  };

  constructor(props) {
    super(props);
    this.state = { 
      data: null,
      latitude: null,
      longitude: null,
      markers: null
      }

    this._getOpenData = this._getOpenData.bind(this)
    this._getLocation = this._getLocation.bind(this)
  }


  componentDidMount() {

      this._getOpenData()
      Mixpanel.track("MapScreen Loaded")
  }



  async _getOpenData(){ 

    let position = await this._getLocation()

    fetch('https://api.openchargemap.io/v2/poi/?output=json&countrycode=US&maxresults=50&compact=true&verbose=false&latitude='+position.latitude+'&longitude='+position.longitude)
      .then((res) => { return res.json() })
      .then((json) => {
        this.setState({data: json})
        // console.log(json)
        let markers = []
        json.map((locations)=>{
            // console.log(locations)
            let marker = {
                            coordinate: { 
                                          latitude: locations["AddressInfo"]["Latitude"], 
                                          longitude: locations["AddressInfo"]["Longitude"] 
                                        },
                            title: locations["AddressInfo"]["Title"],
                            description: locations["Connections"].length !== 0 && locations["Connections"][0]["PowerKW"] ? "Power: "+locations["Connections"][0]["PowerKW"]+"kW" : null ,
                            key: locations["UUID"]
                          }
            markers.push(marker)
          })
        this.setState({markers: markers})
      })

  }
  

  
  async _getLocation(){

    return new Promise(resolve => {
      navigator.geolocation.getCurrentPosition((position) => {
                            this.setState({
                              latitude: position.coords.latitude,
                              longitude: position.coords.longitude
                            });
                            resolve({latitude: position.coords.latitude, longitude: position.coords.longitude})
                          }, (err) => { 
                            console.log(err)
                            this.setState({
                              latitude: 37.7749,
                              longitude: -122.4194
                            });
                            resolve({latitude: 37.7749, longitude: -122.4194})
                        })
    })

  }


  onRegionChange(region) {
    this.setState({ region });
  }

  render() {
    return (
      <View style={{width: '100%', flex: 1}}>
          {this.state.latitude ? 
            <MapView
                  style={{flex: 1, width: '100%'}}
                  showsUserLocation={true}
                  initialRegion={{
                        latitude: this.state.latitude,
                        longitude: this.state.longitude,
                        latitudeDelta: 0.00922,
                        longitudeDelta: 0.00421,
                      }} > 

          {this.state.markers ? 
            this.state.markers.map(marker => (
            <MapView.Marker
                        key={marker.key}
                        coordinate={marker.coordinate}
                        title={marker.title}
                        description={marker.description}
                     />
            )) : null }
          </MapView>
          : null }

      </View>
      
    );

  }
}